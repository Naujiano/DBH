<!DOCTYPE html>
<style>
	* { margin: 0; box-sizing: border-box;font-family:arial; font-size:12px}
	body { padding:10px; }
</style>
<%
response.charset = "utf-8"
session.codepage = 65001
enviaremails = request("enviaremails")
i_estado = request("i_estado")
i_id = "" 'request("i_id")
onlyprint = 0
set dbConn = server.createobject ( "adodb.connection" )
servidor = Request.ServerVariables("SERVER_NAME")
conStr = "driver={SQL Server};Server=srv2\MPM;Database=DBH_Coteyser;Uid=SuperUser;Pwd=Oinst;"
dbConn.open conStr
server.scripttimeout=36000 '10 horas
set rs = server.createobject ( "adodb.recordset" )
set rs2 = server.createobject ( "adodb.recordset" )
set rs3 = server.createobject ( "adodb.recordset" )
set rsInformes = server.createobject ( "adodb.recordset" )
set Mail = Server.CreateObject("Chilkat.MailMan2")
set email = Server.CreateObject("Chilkat.Email2")
Mail.UnlockComponent ("JUANMIMAILQ_mmCEdGHQ9Q89")
Mail.SmtpHost = "smtp.qscoteyser.com"
sql = "exec dbo.sp_avisos_send " & i_estado
rs.open sql , dbConn
sql = "SELECT i_id,i_sql,(select right(da_pkfield,len(da_pkfield)-charindex('.',da_pkfield)) from data_areas where da_id =i_da_id) as i_pkfield,i_aviso_titulo,i_aviso_texto,i_aviso_emails_nombres,i_aviso_emails,i_aviso_from,i_aviso_emailacc_user,i_aviso_emailacc_password FROM informes WHERE i_estado = " & i_estado & " ORDER BY i_id"
rsInformes.open sql , dbConn, 3
nemails = 0
nsgrupo = 0
sqlUpdates = ""
do while not rsInformes.eof
	i_id = rsInformes ( "i_id" )
	i_aviso_titulo = rsInformes ( "i_aviso_titulo" )
	i_aviso_texto = rsInformes ( "i_aviso_texto" )
	i_aviso_emails_nombres = rsInformes ( "i_aviso_emails_nombres" )
	i_aviso_emails = rsInformes ( "i_aviso_emails" )
	i_aviso_from = rsInformes ( "i_aviso_from")
	i_aviso_emailacc_user = rsInformes ( "i_aviso_emailacc_user")
	i_aviso_emailacc_password = rsInformes ( "i_aviso_emailacc_password")
	i_sql = rsInformes ( "i_sql" )
	if ( isnull(i_aviso_emails_nombres) OR isnull(i_aviso_emails) OR isnull(i_sql) OR isnull(i_aviso_from) ) then
		response.write "Email del informe " & i_id & " mal configurado."
		exit do
	end if
	'------------Ajuntos--------------
	'sql = "SELECT doc_nombrearchivo FROM docs WHERE doc_nombreoriginal like 'adjunto%' AND doc_da_id = 11 AND doc_pkvalue = " & i_id
	'rs.open sql , dbConn, 3
	'adjuntos = ""
	'do while not rs.eof
'		adjuntos = adjuntos & rs("doc_nombrearchivo")  & ","
'		rs.movenext
'	loop
'	if (adjuntos <> "" ) then 
'		adjuntos = left(adjuntos,len(adjuntos)-1)
'	end if
'	rs.close
	'------------/Ajuntos--------------
	i_sql = replace(i_sql,"'","''")
	i_pkfield = rsInformes ( "i_pkfield" )
	i_sql = replace ( i_sql, "select","select " & i_pkfield & ",", 1,1,1)
	sql = "exec dbo.sp_sqlViewGenerator '" & i_sql & "','zview_avisos_sendmail_sqlinforme'"
	On Error Resume Next
	rs.open sql , dbConn
	errNumber = Err.Number
	errDescription = Err.Description
	on error goto 0
	If errNumber <> 0 Then
		Call Err.Raise(errNumber, "Hay un error en la configuración del informe:" & i_id , errDescription)
	else
		sql = "SELECT * FROM zview_avisosViewGenerator INNER JOIN zview_avisos_sendmail_sqlinforme ON " & i_pkfield & " = ial_pkvalue AND ial_pkfield = '" & i_pkfield & "' WHERE i_id = " & i_id & " ORDER BY iac_id,i_aviso_emails"
		rs.open sql , dbConn,3
		do while not rs.eof
			i_nombre = rs ( "i_aviso_titulo")
			i_aviso_texto_grupo = rs ( "i_aviso_texto_grupo")
			i_aviso_texto = rs ( "i_aviso_texto")
			i_aviso_emails_nombres = rs ( "i_aviso_emails_nombres")
			i_aviso_from = rs ( "i_aviso_from")
			i_aviso_emails = rs ( "i_aviso_emails")
			i_docs = rs ( "i_docs")
			iac_texto = rs ( "iac_texto")
			iac_emails_nombres = rs ( "iac_emails_nombres")
			iac_emails = rs ( "iac_emails")
			iac_docs = rs ( "iac_docs")
			iac_id = rs ( "iac_id")
			ial_id = rs ( "ial_id")
			
			
			if not isnull ( iac_texto ) then
				i_aviso_texto = iac_texto
				i_aviso_texto_grupo = ""
			end if
			
			if not isnull ( iac_emails_nombres ) then i_aviso_emails_nombres = iac_emails_nombres
			if not isnull ( iac_emails ) then i_aviso_emails = iac_emails
			if iac_docs<>"" then i_docs = iac_docs
			for each campo in rs.fields
				v = campo
				cn = lcase(campo.name)
				if isnull(v) then v = ""
				if isNumeric(v) then 
					isint = v - round(v)
					if isint = 0 then
						roundat = 0
					else
						roundat = 2
					end if
					v = formatnumber ( v , roundat )
					v = replace ( v , ".", ";" )
					v = replace ( v , ",", "." )
					v = replace ( v , ";", "," )
				end if
				if ( campo.type = 135 and 1=2 ) then
					sss = "set dateformat dmy select dbo.DBH_fecha(dateadd(day,cast(dbo.DBH_fecha('"&v&"','diasvto') as int),getdate()),'dmy')"
					response.write sss & "<br> 	"
					rs2.open sss,dbConn
					v = rs2(0)
					rs2.close
				end if
				if not isnull ( i_aviso_texto_grupo ) then i_aviso_texto_grupo = replace ( i_aviso_texto_grupo, "{" & cn & "}", v )
				if not isnull ( i_aviso_texto ) then i_aviso_texto = replace ( i_aviso_texto, "{" & cn & "}", v )
				if not isnull ( i_aviso_emails ) then i_aviso_emails = replace ( i_aviso_emails, "{" & cn & "}", v )
				if not isnull ( i_aviso_emails_nombres ) then i_aviso_emails_nombres = replace ( i_aviso_emails_nombres, "{" & cn & "}", replace ( v, ",", "" ) )
			next
			sqlUpdates = sqlUpdates & " update informes_avisos_log SET ial_titulo_email = '" & i_nombre & "', ial_texto_loop = '" & i_aviso_texto & "', ial_texto_grupo = '" & i_aviso_texto_grupo & "',  ial_emails_destinatarios = '" & i_aviso_emails & "', ial_nombres_destinatarios = '" & i_aviso_emails_nombres & "' WHERE ial_id = " & ial_id
			'rs2.open sql , dbConn
			rs.movenext
		loop
	End If
	rsInformes.movenext
	rs.close
loop
if sqlUpdates <> "" then rs2.open sqlUpdates , dbConn
sql = "SELECT * FROM informes_avisos_log inner join informes ON ial_i_id = i_id INNER JOIN docs ON doc_pkvalue = i_id AND doc_nombreoriginal like 'email%.eml' AND doc_da_id = 11 WHERE ial_enviado <> 1 AND i_estado = " & i_estado & " ORDER BY ial_i_id,ial_emails_destinatarios"
rs.open sql , dbConn,3
i_aviso_emails_old = ""
nsgrupo = 0
nemails = 0
noemailsreal = 0
ial_id_enviados = ""
do while not rs.eof
	ial_id = rs ( "ial_id")
	ial_i_id = rs ( "ial_i_id")
	i_nombre = rs ( "ial_titulo_email")
	i_aviso_max_envios_xciclo = rs ( "i_aviso_max_envios_xciclo")
	i_aviso_texto_grupo = rs ( "ial_texto_grupo")
	i_aviso_texto = rs ( "ial_texto_loop")
	i_aviso_emails_nombres = rs ( "ial_nombres_destinatarios")
	i_aviso_emails = rs ( "ial_emails_destinatarios")
	i_aviso_from = rs ( "i_aviso_from")
	i_aviso_emailacc_user = rs ( "i_aviso_emailacc_user")
	i_aviso_emailacc_password = rs ( "i_aviso_emailacc_password")
	filename = rs("doc_nombrearchivo")
	if not isnumeric ( i_aviso_max_envios_xciclo ) then i_aviso_max_envios_xciclo = 2000
	'i_docs = rs ( "i_docs")
	if ( i_aviso_emails_old <> i_aviso_emails ) or ( ial_i_id_old <> ial_i_id ) then
	'if ( i_aviso_emails_old <> i_aviso_emails ) then
		if ( i_aviso_emails_old <> "" ) then 
			if isnull(i_aviso_emails_old) then
				response.write "[" & i_aviso_emails_old & "] no es una dirección de email válida. Reg ["&ial_id&"]<br>"
			else
				enviar_email onlyprint,texto_grupo,texto_loop, i_nombre_old, i_aviso_emails_old, i_aviso_emails_nombres_old,i_docs_old,i_aviso_from_old
			end if
		end if
		i_aviso_emails_old = i_aviso_emails
		i_aviso_emails_nombres_old = i_aviso_emails_nombres
		i_nombre_old = i_nombre
		'i_docs_old = i_docs
		texto_grupo_old = texto_grupo
		texto_loop_old = texto_loop
		ial_i_id_old = ial_i_id
		i_aviso_from_old = i_aviso_from
		nsgrupo = nsgrupo + 1 
		texto_grupo = ""
		texto_loop = ""
		if NOT isnull(i_aviso_texto_grupo) then texto_grupo = i_aviso_texto_grupo
	end if
	texto_loop = texto_loop & "<br>" & i_aviso_texto
	'ial_id_enviados = ial_id & "," & ial_id_enviados
	nemails = nemails + 1 
	if nemails > i_aviso_max_envios_xciclo then exit do
	rs.movenext
loop
if ( nemails <> 0 ) then 
	if ( i_aviso_emails_old <> "" ) then 
		if isnull(i_aviso_emails_old) then
			response.write "[" & i_aviso_emails_old & "] no es una dirección de email válida. Reg ["&ial_id&"]<br>"
		else
			enviar_email onlyprint,texto_grupo,texto_loop, i_nombre_old, i_aviso_emails_old, i_aviso_emails_nombres_old,i_docs_old,i_aviso_from_old
		end if
	end if
	'ial_id_enviados = left ( ial_id_enviados , len ( ial_id_enviados ) - 1 )
end if
response.write "<div style='float:none'>" & noemailsreal & " emails. "&nemails&" registros.</div>"
function enviar_email ( onlyprint, texto_grupo,texto_loop, t, e, n, d, f )
	if enviaremails <> 1 then exit function
'exit function
	if onlyprint = 1 then
		response.write "<div style='background:#f5f5f5;width:100%;padding:10px;margin-bottom:10px;border:0px solid gray'>Fecha:" & now() & "<br>Destinatarios: " & n & " " & e & "<br>Título: " & t & "<br>Docs: " & d & "<br><hr><br>" & replace(b,chr(10),"<br>") & "</div>"
		exit function
	end if
	Mail.SmtpUsername  = i_aviso_emailacc_user '"info@coteyser.com"
	Mail.SmtpPassword  = i_aviso_emailacc_password '"C0teyserqs"
	emlpath = server.mappath("/dbh/templates/coteyser/documentos/"&filename)
	success = email.LoadEml(emlpath)
	replacepatterns = Array ( Array ( "{texto_grupo}", texto_grupo ), Array ( "{texto_loop}", texto_loop ), Array ( "{no_email}", ial_id ) )
	for each x in replacepatterns
		success = email.SetReplacePattern(x(0),x(1))
	next
	'for each x in split(adjuntos,",")
	'	success = email.AddFileAttachment(server.mappath("/dbh/templates/coteyser/documentos/"&x))
	'next
	email.From = f & ""
	email.Subject = t & "" '"t"
	'e = i_aviso_emails_old & ""
	'email.SetHtmlBody b
	'response.write b&"<br>"
	'response.write emlpath
	'response.end
	'email.SetFromMimeText(b)
'  To add file attachments to an email, call AddFileAttachment
'  once for each file to be attached.  The method returns
'  the content-type of the attachment if successful, otherwise
'  returns cknull
	arr = split ( clean(i_aviso_emails_old), ";" )
	arr2 = split ( n, ";" )
	for i = 0 to ubound(arr)
		if i > ubound(arr2) then
			nam = arr2(ubound(arr2))
		else
			nam = arr2(i)
		end if
		'email.AddTo nam,arr(i)
	next
  'email.AddTo "Javier de la Quintana", "enviadoshunter@coteyser.com"
  email.AddTo "Juan Martín", "juan.martin.m@gmail.com"
  'email.AddBcc "Javier de la Quintana", "enviadoshunter@coteyser.com"
'if 1=2 then
	success = Mail.SendEmail(email)
	If (success <> 1) Then
		'Response.Write "<pre>" & Server.HTMLEncode( Mail.LastErrorText) & "</pre>"
		erro = Mail.LastErrorText
		Response.Write "<pre>" & right ( erro , len(erro) - instr(erro,"recipients:") - 11 ) & "</pre>"
	else
		noemailsreal = noemailsreal + 1
		sql = "update informes_avisos_log SET ial_enviado = 1 WHERE ial_id =  " & ial_id
		rs2.open sql , dbConn
	End If
	pp=server.mappath("/dbh/templates/coteyser/documentos/emails/")
	dname = uniqueid()&"email .eml"
	sql = "insert into docs (doc_da_id,doc_pkvalue,doc_nombrearchivo,doc_nombreoriginal,doc_path) VaLueS (8,'"&ial_id&"','"&dname&"','"&dname&"','"&pp&"')"
	rs3.open sql , dbConn
	'response.write sql&"<br>"
	success = email.SaveEml(pp&"/"&dname)
	If (success <> 1) Then
		Response.Write "<pre>" & Server.HTMLEncode( Mail.LastErrorText) & "</pre>"
	
	End If
	success = Mail.CloseSmtpConnection()
	If (success <> 1) Then
		Response.Write "<pre>" & Server.HTMLEncode("Connection to SMTP server not closed cleanly.") & "</pre>"
	End If
'end if
	'Response.Write "<pre>" & Server.HTMLEncode("Mail Sent!") & "</pre>"
	
end function

%>
<script runat="server" language="javascript">
	function uniqueid() {
		var hoy = new Date()
		, ms = hoy.getTime()
		return ms
	}
	function clean(emailadd) {
		if (!emailadd) return emailadd
		return emailadd.replace(/[^\w\.\@]/g,"")
	}
</script>