<!--#include file="dbConnOpen.asp"-->
<%
	Response.Buffer=true
	server.scriptTimeout=6000
	Session.LCID = 2057
	regXPag = request("regXPag")
	set rs = server.createobject ( "adodb.recordset" )
	sql = request ( "sql" )
	pagina = request ( "pagina" )
	controlDeErrores = request ( "controlDeErrores" )
	if controlDeErrores <> "0" then
		response.write sql
	end if
	if controlDeErrores = "2" then
		response.end
	end if
	'set cmd=server.createobject("adodb.command")
	'cmd.CommandTimeout=6000
	'sql="set dateformat dmy "&sql
	'cmd.commandtext=sql
	'cmd.activeconnection= dbConnZavala
	dbConnZavala.CommandTimeout = 6000
	
	'Set rs = dbConnZavala.Execute(cmd)  
	'rs.source = cmd
	'rs.CursorType = 3
	'rs.open "set dateformat dmy",dbConnZavala
	noreg=0
	if pagina = 1 then
		On Error Resume Next
		rs.open sql,dbConnZavala,3
		errNumber = Err.Number
		errDescription = Err.Description
		on error goto 0
		If errNumber <> 0 Then
			response.write "SQL:" & sql & "  --  " & errDescription
			response.end
		Call Err.Raise(errNumber, "Error de Sql:" & sql, errDescription)
		End If
		if not rs.eof then
		  rs.movelast
		  rs.movefirst
		  noreg=rs.recordcount
		end if
	else
		On Error Resume Next
		rs.open sql,dbConnZavala,3
		errNumber = Err.Number
		errDescription = Err.Description
		on error goto 0
		If errNumber <> 0 Then
			response.write "SQL:" & sql & "  --  " & errDescription
			response.end
		Call Err.Raise(errNumber, "Error de Sql:" & sql, errDescription)
		End If
	end if
	'if rs.state=0 then response.end
	'if rs.eof then response.end
	'noreg="... "
	'xml = xml & "<xml>"
	output ( "<xml>" )
	if not rs.eof then
		'rs.pagesize=regXPag
		'rs.absolutepage=pagina
		registrosavanzador=(pagina-1)*regXPag
		rs.move(registrosavanzador)
		cont=0
		do while ( (not rs.eof) and (cont*1<regXPag*1) )
			cont=cont+1
			'xml = xml & "<registro>"
			output ( "<registro>" )
			for each campo in rs.fields
				if not campo = "" and not isnull(campo ) then
					valorCampo = campo
				else
					valorCampo = ""
				end if
				'xml = xml & "<" & lcase(campo.name) & ">" & server.htmlencode(valorCampo) & "</" & lcase(campo.name) & ">"
				if campo.type <> 135 then valorCampo=server.htmlencode(replace(replace(valorCampo,chr(1),"*"),chr(2),"*"))
				'xml = xml & "<" & tagname(campo.name) & " tipo='" & campo.type & "'>" & valorCampo & "</" & tagname(campo.name) & ">"
				output ( "<" & tagname(campo.name) & " tipo='" & campo.type & "'>" & valorCampo & "</" & tagname(campo.name) & ">" )
				'Response.Flush
			next
			rs.movenext
			'xml = xml & "</registro>"
			output ( "</registro>" )
		loop
		if rs.eof then noreg=registrosavanzador+cont
		rs.close
	end if
	'xml = xml & "<registro>"
	'xml = xml & "<noreg>"&noreg&"</noreg>"
	'xml = xml & "</registro>"
	'xml = xml & "</xml>"
	output ( "<registro>" & "<noreg>"&noreg&"</noreg>" & "</registro>" & "</xml>" )
	'xml = replace(xml,"+"," " )
	'response.ContentType="text/xml"  
	'response.CacheControl="no-cache, must-revalidate"  
	'response.Expires=0  
	'if xml="<xml><registro><></></registro></xml>" then xml = ""
	'response.write ( xml )
	function tagname(cn)
		if cn<>"" then
			tagname=lcase(cn)
		else
			tagname="camposinnombre"
		end if
	end function
	sub output ( t )
		response.write ( t )
	end sub
%>
<!--#include file="dbConnClose.asp"-->
