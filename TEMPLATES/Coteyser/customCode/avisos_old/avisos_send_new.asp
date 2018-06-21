<!--#include file="dbConnOpen.asp"-->
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
servidor = Request.ServerVariables("SERVER_NAME")
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
sql = "SELECT * FROM dbh_view_avisos_agrupados WHERE i_estado = " & i_estado & " and ial_ids is not null ORDER BY ial_i_id"
rs.open sql , dbConnZavala,3
nemails = 0
ial_id_enviados = ""
do while not rs.eof
	ial_i_id = rs ( "ial_i_id")
	com_id = rs ( "com_id")
	ial_ids = rs ( "ial_ids")
	i_aviso_emails = rs ( "ial_emails_destinatarios")
	i_aviso_emails_nombres = rs ( "ial_nombres_destinatarios")
	i_nombre = rs ( "ial_titulo_email")
	i_aviso_max_envios_xciclo = rs ( "i_aviso_max_envios_xciclo")
	texto_grupo = rs ( "texto_grupo")
	texto_loop = rs ( "texto_loop")
	texto_loop_interno = rs ( "texto_loop_interno")
	i_aviso_from = rs ( "i_aviso_from")
	i_aviso_emailacc_user = rs ( "i_aviso_emailacc_user")
	i_aviso_emailacc_password = rs ( "i_aviso_emailacc_password")
	'filename = rs("filename")
	i_email_mime = rs("i_email_mime")
	if not isnumeric ( i_aviso_max_envios_xciclo ) then i_aviso_max_envios_xciclo = 2000
	if isnull(i_aviso_emails) then
		'response.write server.htmlencode("[" & i_aviso_emails & "] no es una dirección de email válida. Reg ["&ial_ids&"]") & "<br>"
		response.write "[" & i_aviso_emails & "] no es una dirección de email válida. Reg ["&ial_ids&"]<br>"
	else
		i_aviso_emails_nombres = replace ( i_aviso_emails_nombres, "''", "'" )
		i_aviso_emails_nombres = replace ( i_aviso_emails_nombres, "'", "''" )
		texto_loop_interno = replace ( texto_loop_interno, "''", "'" )
		texto_loop_interno = replace ( texto_loop_interno, "'", "''" )
		if trim(i_email_mime) = "" or TypeName(i_email_mime) = "Null" then 
			response.write "Aviso " + ial_ids + " descartados porque la Búsqueda tiene vacía la plantilla MIME para el e-mail.<br>"
		else
			enviar_email texto_grupo,texto_loop, texto_loop_interno,ial_ids,filename, i_nombre, i_aviso_emails, i_aviso_emails_nombres,i_aviso_from
		end if
		'response.write texto_loop&"*"& texto_loop_interno&"*"&ial_ids&"*"&filename&"<br>----------------------------------------------<br>"
	end if
	nemails = nemails + 1 
	if nemails > i_aviso_max_envios_xciclo then exit do
	rs.movenext
loop
response.write "<div style='float:none'>" & nemails & " emails.</div>"
function enviar_email ( tg,tl, tli, ial_ids, templatefile, t, e, n, f )
	'emlpath = server.mappath("/dbh/templates/coteyser/documentos/"&templatefile)
	emlpath = "C:\NAUJ\Coteyser\DBH\TEMPLATES\Coteyser\documentos\"&templatefile
	success = email.LoadEml(emlpath)
	set email = Mail.LoadMime ( i_email_mime )
	if ( isnull(tg) ) then tg = ""
	if ( isnull(tl) ) then tl = ""
	if ( isnull(tli) ) then tli = ""
	replacepatterns = Array ( Array ( "{texto_grupo}", tg ), Array ( "{texto_loop}", tl ), Array ( "{texto_loop_interno}", tli ), Array ( "{no_email}", ial_ids ) )
	for each x in replacepatterns
		success = email.SetReplacePattern(x(0),x(1))
	next
	'for each x in split(adjuntos,",")
	'	success = email.AddFileAttachment(server.mappath("/dbh/templates/coteyser/documentos/"&x))
	'next
	email_mime = Mail.RenderToMime(email)
	'response.write email_mime
	sql = "INSERT INTO dbm_comunicacionesagrupadas ( iaa_com_id,iaa_i_id, iaa_enviado, iaa_archivado, iaa_tipo, iaa_titulo, iaa_texto, iaa_texto_interno, iaa_texto_grupo, iaa_emails_destinatarios, iaa_nombres_destinatarios, iaa_email_mime , iaa_aviso_from , iaa_aviso_emailacc_user , iaa_aviso_emailacc_password , iaa_aviso_max_envios_xciclo ) VALUES ( " & com_id & "," & ial_i_id & ",0,0,null,'" & t & "','" & tl & "','" & tli & "',' " & tg & "','" & clean(e) & "','" & n & "','" & replace(email_mime,"'","''") & "','" & i_aviso_from & "','" & i_aviso_emailacc_user & "','" & i_aviso_emailacc_password & "','" & i_aviso_max_envios_xciclo & "')"
	'response.write sql
	if 1=2 then
		pp=server.mappath("/dbh/templates/coteyser/documentos/emails/")
		pp = "C:\NAUJ\Coteyser\DBH\TEMPLATES\Coteyser\documentos\emails"
		dname = uniqueid()&"email.eml"
		success = email.SaveEml(pp&"/"&dname)
		If (success <> 1) Then
			response.write "<pre>Error al guardar copia del documento EML.</pre>"
			Response.Write "<pre>" & Server.HTMLEncode( Mail.LastErrorText) & "</pre>"
		End If
		sql = "delete dbh_documentos where doc_da_id = 36 and doc_pkvalue = (SELECT max (iaa_id) FROM dbm_comunicacionesagrupadas) insert into dbh_documentos (doc_da_id,doc_pkvalue,doc_nombrearchivo,doc_nombreoriginal,doc_path) (select 36,max (iaa_id),'"&dname&"','"&dname&"','"&pp&"' FROM dbm_comunicacionesagrupadas)"
		rs3.open sql , dbConnZavala
	end if
	if interno <> "1" then sql = sql & " update dbm_comunicaciones SET ial_enviado = 1 WHERE ial_id IN (  " & ial_ids & ")"
	rs2.open sql , dbConnZavala
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
		return emailadd.replace(/[^\;\w\@\-\.]/g,"")
	}
</script>