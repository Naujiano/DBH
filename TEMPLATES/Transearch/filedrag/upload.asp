<% 
'response.charset = "UTF-8"
fn = request.ServerVariables ( "HTTP_XFILENAME" )
XDIR = request.ServerVariables ( "HTTP_XDIR" )
if fn <> "" then
'response.write fn & "<br>"
'response.write XDIR & "<br>"

end if
set receiver = Server.CreateObject("Chilkat.UploadRcv")

'  Stream uploads to a directory:
receiver.SaveToUploadDir = 0

'dir = server.mappath ("uploads" )
'dir = "c:\data\documentos\usersUploads" 
dir = XDIR
receiver.UploadDir = dir

'  Don't allow anything over 100MB
receiver.SizeLimitKB = 102400

'  Set a timeout just in case something hangs
'  This is a 20-second timeout:
receiver.IdleTimeoutMs = 20000

success = receiver.Consume()

'response.write receiver.LastErrorText

'response.write "receiver.consume(): " & success
if not success="1" then
	response.write receiver.LastErrorText
	response.end
end if

success = receiver.SetFilename (0,fn)
success = receiver.SaveNthToUploadDir(0)

'response.write "**"' & receiver.NumFilesReceived & "**<br>"

'  Consume the upload.  Files are streamed to the UploadDir
'success = receiver.Consume()
response.write "1"
response.end
%>
