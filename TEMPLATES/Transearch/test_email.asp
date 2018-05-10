<%
  enviar_email2  "nombre" , "apellidos", "juan.martin.m@gmail.com" , "asociado" , "titulo" , "cuerpo" 
  function enviar_email2 ( nombre , apellidos, email , asociado , titulo , cuerpo )
  'exit function
  set Mail = Server.CreateObject("Chilkat.MailMan2")
  Mail.UnlockComponent ("JUANMIMAILQ_mmCEdGHQ9Q89")
  Mail.SmtpHost = "smtp.office365.com"
  Mail.SmtpUsername  = "spain@transearch.com"
  Mail.SmtpPassword  = "Transearch2018"
  Mail.SmtpPort = 587
  Mail.StartTLS = 1
  set emailobj = Server.CreateObject("Chilkat.Email2")
  emailobj.From = "Transearch <spain@transearch.com>"
  emailobj.Subject = titulo
  emailobj.SetHtmlBody cuerpo
 ' emailobj.AddTo "juan","juan.martin.m@gmail.com"
 'response.write email
  emailobj.AddTo nombre & " " & apellidos,email
  success = Mail.SendEmail(emailobj)
If (success <> 1) Then
    Response.Write "<pre>" & Server.HTMLEncode( Mail.LastErrorText) & "</pre>"

End If

'  Some SMTP servers do not actually send the email until
'  the connection is closed.  In these cases, it is necessary to
'  call CloseSmtpConnection for the mail to be  sent.
'  Most SMTP servers send the email immediately, and it is
'  not required to close the connection.  We'll close it here
'  for the example:
success = Mail.CloseSmtpConnection()
If (success <> 1) Then
    Response.Write "<pre>" & Server.HTMLEncode("Connection to SMTP server not closed cleanly.") & "</pre>"
End If

'Response.Write "<pre>" & Server.HTMLEncode("Mail Sent!") & "</pre>"
end function
%>