<!--#include file="dbConnOpen.asp"-->
<%
Response.Buffer=true
server.scriptTimeout=6000
set rs = server.createobject ( "adodb.recordset" )
sql = request ( "sql" )
controlDeErrores = request ( "controlDeErrores" )
if controlDeErrores <> "0" then
	response.write sql&"<br><br>"
end if
if controlDeErrores = "2" then
	response.end
end if
dbConnZavala.CommandTimeout = 6000
'response.write sql
'response.end
On Error Resume Next
rs.open sql , dbConnZavala
errNumber = Err.Number
errDescription = Err.Description
on error goto 0
If errNumber <> 0 Then
	response.write "SQL:" & sql & "  --  " & errDescription
	response.end
   Call Err.Raise(errNumber, "Error de Sql:" & sql, errDescription)
End If
if rs.state=0 then response.end
hayregistros = false
if not rs.eof then
	'xml = xml & "<xml>"
	output ( "<xml>" )
	hayregistros = true
end if
do while not rs.eof
	'xml = xml & "<registro>"
	output ( "<registro>" )
	for each campo in rs.fields
		valorCampo=campo
		if valorCampo = "" or isnull(valorCampo) then valorCampo = ""
		if campo.type <> 135 then valorCampo=server.htmlencode(replace(valorCampo,chr(1),"*"))
		if campo.type = 11 then
			if valorCampo = "True" or  valorCampo = "Verdadero" then
				valorCampo = "1"
			else
				valorCampo = "0"
			end if
		end if
		'xml = xml & "<" & lcase(campo.name) & " size='" & campo.definedsize & "' tipo='" & campo.type & "'>" & valorCampo & "</" & lcase(campo.name) & ">"
		'nombreCampo = replace ( replace ( replace ( lcase(campo.name), ".", "" ), " ", "_" ), "1", "_1" )
		if nombreCampo = "" then nombreCampo = "blank"
		output ( "<" & nombreCampo & " size='" & campo.definedsize & "' tipo='" & campo.type & "'>" & valorCampo & "</" & nombreCampo & ">" )
	next
	rs.movenext
	'xml = xml & "</registro>"
	output ( "</registro>" )
loop
rs.close
set rs = nothing
if hayregistros then
	'xml = xml & "</xml>"
	output ( "</xml>" )
	'xml = replace(xml,"+"," " )
end if
'response.write ( xml )
sub output ( t )
	response.write ( t )
end sub
%>
<!--#include file="dbConnClose.asp"-->
