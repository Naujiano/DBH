<%
response.charset="UTF-8"
fileabsolutepath = request ( "fileabsolutepath" )
response.write fileabsolutepath
Set fs=Server.CreateObject("Scripting.FileSystemObject")
if fs.FileExists(fileabsolutepath) then
  fs.DeleteFile(fileabsolutepath)
end if
set fs=nothing
%>