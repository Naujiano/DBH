<%
Response.ContentType = "application/x-unknown" 
Response.AddHeader "Content-Disposition","attachment; filename=email.eml"

'iaa_id = request("iaa_id")
'set dbConn = server.createobject ( "adodb.connection" )
'conStr = "driver={SQL Server};Server=srv2\MPM;Database=DBH_Coteyser;Uid=SuperUser;Pwd=Oinst;"
'dbConn.open conStr
'set rs = server.createobject ( "adodb.recordset" )
'sql = "SELECT iaa_email_mime FROM informes_avisos_agrupados WHERE iaa_id = " & iaa_id
'rs.open sql , dbConn
'iaa_email_mime = rs ( "iaa_email_mime")
'rs.close
iaa_email_mime = request ( "email_mime" )
set Mail = Server.CreateObject("Chilkat.MailMan2")
'set email = Server.CreateObject("Chilkat.Email2")
Mail.UnlockComponent ("JUANMIMAILQ_mmCEdGHQ9Q89")
set email = Mail.LoadMime ( iaa_email_mime )
pp = "C:\NAUJ\Coteyser\DBH\TEMPLATES\Coteyser\documentos\emails\email.eml"
pp = "C:\NAUJ\iis\DBH\TEMPLATES\Coteyser\documentos\emails\email.eml"
success = email.SaveEml(pp)
Set adoStream = CreateObject("ADODB.Stream") 
adoStream.Open() 
adoStream.Type = 1
adoStream.LoadFromFile(pp) 
Response.binaryWrite(adoStream.Read)
%>
