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
'set Mail = Server.CreateObject("Chilkat.MailMan2")
set Mail = Server.CreateObject("Chilkat_9_5_0.MailMan")
'set email = Server.CreateObject("Chilkat.Email2")
Mail.UnlockComponent ("JUANMIMAILQ_mmCEdGHQ9Q89")
Mail.SmtpHost = "smtp.qscoteyser.com"
'Tasks = Array()
iaa_ids = ""
if toprecs <> "" and isnumeric (toprecs) then
	toprecs = " top " & toprecs & " "
else 
	toprecs = ""
end if
sql = "SELECT " & toprecs & " * FROM DBM_COMUNICACIONESAGRUPADAS WHERE iaa_enviado <> 1 ORDER BY iaa_com_id"
'response.write sql
rs.open sql , dbConnZavala,3
nemails = 0
ial_id_enviados = ""
do while not rs.eof
	iaa_id = rs ( "iaa_id")
	iaa_i_id = rs ( "iaa_i_id")
	iaa_titulo = rs ( "iaa_titulo")
	iaa_texto = rs ( "iaa_texto")
	iaa_texto_interno = rs ( "iaa_texto_interno")
	iaa_emails_destinatarios = rs ( "iaa_emails_destinatarios")
	iaa_nombres_destinatarios = rs ( "iaa_nombres_destinatarios")
	iaa_texto_grupo = rs ( "iaa_texto_grupo")
	iaa_email_mime = rs ( "iaa_email_mime")
	i_aviso_from = rs ( "iaa_aviso_from")
	i_aviso_emailacc_user = rs ( "iaa_aviso_emailacc_user")
	i_aviso_emailacc_password = rs ( "iaa_aviso_emailacc_password")
	i_aviso_max_envios_xciclo = rs ( "iaa_aviso_max_envios_xciclo")
	if not isnumeric ( i_aviso_max_envios_xciclo ) then i_aviso_max_envios_xciclo = 2000
	if isnull(iaa_emails_destinatarios) then
		response.write "[" & iaa_emails_destinatarios & "] no es una dirección de email válida. Reg ["&iaa_id&"]<br>"
	else
		enviar_email 
		'enviar_email iaa_texto_grupo,iaa_texto, iaa_texto_interno,filename, i_nombre, iaa_emails_destinatarios, iaa_nombres_destinatarios,i_aviso_from
		'response.write texto_loop&"*"& texto_loop_interno&"*"&ial_ids&"*"&filename&"<br>----------------------------------------------<br>"
	end if
	nemails = nemails + 1 
	if nemails > i_aviso_max_envios_xciclo then exit do
	rs.movenext
loop
if iaa_ids <> "" AND interno <> "1" then
	iaa_ids = left ( iaa_ids , len ( iaa_ids ) - 1 )
	sql = "update DBM_COMUNICACIONESAGRUPADAS SET iaa_enviado = 1 WHERE iaa_id IN (" & iaa_ids & ")"
	rs2.open sql , dbConnZavala
end if
response.write "<div style='float:none'>" & nemails & " emails.</div>"
'function enviar_email ( tg,tl, tli, ial_ids, templatefile, t, e, n, f )
function enviar_email ()
	Mail.SmtpUsername  = i_aviso_emailacc_user '"info@coteyser.com"
	Mail.SmtpPassword  = i_aviso_emailacc_password '"C0teyserqs"
	set email = Mail.LoadMime ( iaa_email_mime )
	email.From = i_aviso_from & ""
	email.Subject = iaa_titulo & "" '"t"
	arr = split ( iaa_emails_destinatarios, ";" )
	'arr2 = split ( clean(iaa_nombres_destinatarios), ";" )
	for i = 0 to ubound(arr)
		'if i > ubound(arr2) then
		'	nam = arr2(ubound(arr2))
		'else
		'	nam = arr2(i)
		'end if
		if interno <> "1" then email.AddTo nam,arr(i)
	next
	if interno then 
		email.AddTo "Javier de la Quintana", "enviadoshunter@coteyser.com"
		email.AddTo "Juan Martin Migliorini", "juan.martin.m@gmail.com"
		response.write "interno"
	else
		email.AddBcc "Javier de la Quintana", "enviadoshunter@coteyser.com"
		'email.AddBcc "Juan Martín", "juan.martin.m@gmail.com"
	end if
	'success = Mail.SendEmail(email)
	Set task = Mail.SendEmailAsync(email)
	If (task Is Nothing ) Then
		outFile.WriteLine(Mail.LastErrorText)
		WScript.Quit
	End If
	success = task.Run()
	If (success <> 1) Then
		outFile.WriteLine(task.LastErrorText)
		WScript.Quit
	End If
	'redim Tasks (UBound(Tasks) + 1)
	'Tasks(UBound(Tasks)) = Array ( task, -1 )
	
	'If (success <> 1) Then
	'	erro = Mail.LastErrorText
	'	Response.Write "<pre>" & right ( erro , len(erro) - instr(erro,"recipients:") - 11 ) & "</pre>"
	'else
		iaa_ids = iaa_ids & iaa_id & ","
		'sql = "update DBM_COMUNICACIONESAGRUPADAS SET iaa_enviado = 1 WHERE iaa_id = " & iaa_id
		'if interno <> "1" then rs2.open sql , dbConnZavala
	'End If
	
	success = Mail.CloseSmtpConnection()
	If (success <> 1) Then
		response.write "<pre>Error al cerrar la conexión con el servidor.</pre>"
	End If
end function

%>
<script runat="server" language="javascript">
	function clean(emailadd) {
		if (!emailadd) return emailadd
		return emailadd.replace(/[^\;\w\-\@\.]/g,"")
	}
</script>