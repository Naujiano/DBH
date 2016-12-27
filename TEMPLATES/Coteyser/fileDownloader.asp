<%
'Response.Buffer = false
response.charset="UTF-8"
filename=request("filename")'"fondoyoutube.jpg"
strFilePath = request("fileabsolutepath")&"\"&filename
'response.write strFilePath
Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
If objFSO.FileExists(strFilePath) Then
  Set objFile = objFSO.GetFile(strFilePath)
  intFileSize = objFile.Size
  Set objFile = Nothing
  
  strFileName = replace(replace(filename," ","-"), ",", "")
  Response.AddHeader "Content-Disposition","attachment; filename=" & strFileName 
  Response.ContentType = "application/octet-stream"
  Response.AddHeader "Content-Length", intFileSize
  
  Set objStream = Server.CreateObject("ADODB.Stream")
  objStream.Open
  objStream.Type = 1 'adTypeBinary
  objStream.LoadFromFile strFilePath
  'Response.BinaryWrite (objStream.Read)
  
Do While Not objStream.EOS And Response.IsClientConnected 
Response.BinaryWrite objStream.Read(1024) 
Response.Flush() 
Loop  
  
'Const clChunkSize = 1048576 ' 1MB
'For i = 1 To objStream.Size \ clChunkSize
'Response.BinaryWrite objStream.Read(clChunkSize)
'Next
'If (objStream.Size Mod clChunkSize) <0 Then
'Response.BinaryWrite objStream.Read(objStream.Size Mod clChunkSize)
'End If 
  
  'Response.Flush()
  objStream.Close
  Set objStream = Nothing
Else
  Response.write "Error finding file."
End if
	'release memory
	Set objFSO = Nothing
%>
