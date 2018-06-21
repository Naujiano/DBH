<!DOCTYPE html>
<style>
	* { margin: 0; box-sizing: border-box;font-family:arial; font-size:12px}
	body { padding:10px; }
</style>
<%
response.charset = "utf-8"
session.codepage = 65001
interno = request("interno")
i_estado = request("i_estado")
toprecs = request("toprecs")
set dbConn = server.createobject ( "adodb.connection" )
servidor = Request.ServerVariables("SERVER_NAME")
conStr = "driver={SQL Server};Server=srv2\MPM;Database=DBH_Coteyser;Uid=SuperUser;Pwd=Oinst;"
dbConn.open conStr
server.scripttimeout=36000 '10 horas
set rs = server.createobject ( "adodb.recordset" )
set rs2 = server.createobject ( "adodb.recordset" )
set rs3 = server.createobject ( "adodb.recordset" )
set Mail = Server.CreateObject("Chilkat.MailMan2")
set email = Server.CreateObject("Chilkat.Email2")
Mail.UnlockComponent ("JUANMIMAILQ_mmCEdGHQ9Q89")
Mail.SmtpHost = "smtp.qscoteyser.com"
if toprecs <> "" and isnumeric (toprecs) then
	toprecs = " top " & toprecs & " "
else 
	toprecs = ""
end if
sql = "SELECT " & toprecs & " * FROM informes_avisos_log inner join informes ON ial_i_id = i_id INNER JOIN docs ON doc_pkvalue = i_id AND doc_nombreoriginal like 'email%.eml' AND doc_da_id = 11 WHERE ial_enviado <> 1 AND i_estado = " & i_estado & " ORDER BY ial_i_id,ial_emails_destinatarios"
rs.open sql , dbConn,3
i_aviso_emails_old = ""
ial_i_id_old = ""
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
	ial_texto_loop_interno = rs ( "ial_texto_loop_interno")
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
				response.write "[" & i_aviso_emails_old & "] no es una dirección de email válida. Reg ["&ial_id_old&"]<br>"
			else
				enviar_email onlyprint,texto_grupo_old,texto_loop_old, texto_loop_interno_old,ial_id_old,filename_old, i_nombre_old, i_aviso_emails_old, i_aviso_emails_nombres_old,i_docs_old,i_aviso_from_old
				response.write texto_loop_old&"*"& texto_loop_interno_old&"*"&ial_id_old&"*"&filename_old&"<br>----------------------------------------------<br>"
			end if
		end if
		filename_old = filename
		ial_id_old = ial_id
		i_aviso_emails_old = i_aviso_emails
		i_aviso_emails_nombres_old = i_aviso_emails_nombres
		i_nombre_old = i_nombre
		if ( texto_loop = "" ) then
			texto_loop_old = i_aviso_texto
			texto_loop_interno_old = ial_texto_loop_interno
		else
			texto_loop_old = texto_loop
			texto_loop_interno_old = texto_loop_interno
		end if
		texto_grupo_old = texto_grupo
		ial_i_id_old = ial_i_id
		i_aviso_from_old = i_aviso_from
		nsgrupo = nsgrupo + 1 
		texto_grupo = ""
		texto_loop = ""
		texto_loop_interno = ""
		if NOT isnull(i_aviso_texto_grupo) then texto_grupo = i_aviso_texto_grupo
	end if
	texto_loop = texto_loop & "<br>" & i_aviso_texto
	texto_loop_interno = texto_loop_interno & "<br>" & ial_texto_loop_interno
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
			texto_loop_old = texto_loop
			texto_loop_interno_old = texto_loop_interno
			enviar_email onlyprint,texto_grupo_old,texto_loop_old, texto_loop_interno_old, ial_id_old,filename_old, i_nombre_old, i_aviso_emails_old, i_aviso_emails_nombres_old,i_docs_old,i_aviso_from_old
		end if
	end if
	'ial_id_enviados = left ( ial_id_enviados , len ( ial_id_enviados ) - 1 )
end if
response.write "<div style='float:none'>" & noemailsreal & " emails. "&nemails&" registros.</div>"
function enviar_email ( onlyprint, tg,tl, tli, id, templatefile, t, e, n, d, f )
	Mail.SmtpUsername  = i_aviso_emailacc_user '"info@coteyser.com"
	Mail.SmtpPassword  = i_aviso_emailacc_password '"C0teyserqs"
	emlpath = server.mappath("/dbh/templates/coteyser/documentos/"&templatefile)
	emlpath = "C:\NAUJ\Coteyser\DBH\TEMPLATES\Coteyser\documentos\"&templatefile
	success = email.LoadEml(emlpath)
	replacepatterns = Array ( Array ( "{texto_grupo}", tg ), Array ( "{texto_loop}", tl ), Array ( "{texto_loop_interno}", tli ), Array ( "{no_email}", id ) )
	for each x in replacepatterns
		success = email.SetReplacePattern(x(0),x(1))
	next
	'for each x in split(adjuntos,",")
	'	success = email.AddFileAttachment(server.mappath("/dbh/templates/coteyser/documentos/"&x))
	'next
	email.From = f & ""
	email.Subject = t & "" '"t"
	arr = split ( clean(e), ";" )
	arr2 = split ( n, ";" )
	for i = 0 to ubound(arr)
		if i > ubound(arr2) then
			nam = arr2(ubound(arr2))
		else
			nam = arr2(i)
		end if
		if interno <> "1" then email.AddTo nam,arr(i)
	next
  'email.AddTo "Javier de la Quintana", "enviadoshunter@coteyser.com"
  email.AddBcc "Juan Martín", "juan.martin.m@gmail.com"
  'email.AddBcc "Javier de la Quintana", "enviadoshunter@coteyser.com"
'if 1=2 then
	success = Mail.SendEmail(email)
	If (success <> 1) Then
		'Response.Write "<pre>" & Server.HTMLEncode( Mail.LastErrorText) & "</pre>"
		erro = Mail.LastErrorText
		Response.Write "<pre>" & right ( erro , len(erro) - instr(erro,"recipients:") - 11 ) & "</pre>"
	else
		noemailsreal = noemailsreal + 1
		sql = "update informes_avisos_log SET ial_enviado = 1 WHERE ial_id =  " & id
		if interno <> "1" then rs2.open sql , dbConn
	End If
	pp=server.mappath("/dbh/templates/coteyser/documentos/emails/")
	pp = "C:\NAUJ\Coteyser\DBH\TEMPLATES\Coteyser\documentos\emails"
	dname = uniqueid()&"email .eml"
	sql = "delete docs where doc_da_id = 8 and doc_pkvalue = " & id & " insert into docs (doc_da_id,doc_pkvalue,doc_nombrearchivo,doc_nombreoriginal,doc_path) VaLueS (8,'"&id&"','"&dname&"','"&dname&"','"&pp&"')"
	rs3.open sql , dbConn
	'response.write sql&"<br>"
	success = email.SaveEml(pp&"/"&dname)
	If (success <> 1) Then
		response.write "<pre>Error al guardar copia del documento EML.</pre>"
		Response.Write "<pre>" & Server.HTMLEncode( Mail.LastErrorText) & "</pre>"
	End If
	success = Mail.CloseSmtpConnection()
	If (success <> 1) Then
		'Response.Write "<pre>" & Server.HTMLEncode("Connection to SMTP server not closed cleanly.") & "</pre>"
		response.write "<pre>Error al cerrar la conexión con el servidor.</pre>"
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