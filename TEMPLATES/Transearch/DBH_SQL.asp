<!--#include file="dbConnOpen.asp"-->
<%
	session.codepage = 65001
	response.charset = "utf-8"
	set rs=server.createobject("adodb.recordset")
	operacion = request("DBH_operacion")
	tabla=request("DBH_tabla")
	pk=request("DBH_pk")
	sql=request("DBH_sql")
	DBH_da_id=request("DBH_da_id")
	if operacion = "insert" then
		for each ele in request.form
			valor = "'"&request(ele)&"'"
			if valor="''" then valor="null"
			if(campoValido(ele) and ele <> pk) then 
				ids=ids&ele&","
				vals=vals&valor&","
			end if
		next
		for each ele in request.querystring
			valor = "'"&request(ele)&"'"
			if valor="''" then 
				valor="null"
			end if
			if(campoValido(ele)) then 
				ids=ids&ele&","
				vals=vals&valor&","		
			end if
		next
		if len(ids)>0 then 
			ids=left(ids,len(ids)-1)
			vals=left(vals,len(vals)-1)
			'//ids=pk&","&ids&"idUC,idUM"
		'	ids=ids&"idUC,idUM"
		'	vals=vals&session("idUsuario")&","&session("idUsuario")
		end if
		sql="INSERT INTO " & tabla & "(" & ids & ") VALUES ( " & vals & " )"
		sqlpc="INSERT INTO " & tabla & "_PRECONDICIONES_TEMP_TABLE(" & ids & ") VALUES ( " & vals & " )"
		sqlpc = replace ( sqlpc, "'", "''")
		sqlsppc = "exec sp_dbh_precondiciones_validate " & DBH_da_id & ", '" & sqlpc & "'"
	elseif operacion = "update" then
		for each ele in request.form
			valor = "'"&request(ele)&"'"
			if valor="''" then valor="null"
			if(campoValido(ele) and ele <> pk) then asignaciones=asignaciones&ele&"="&valor&","
		next
		for each ele in request.querystring
			valor = "'"&request(ele)&"'"
			if valor="''" then valor="null"
			if(campoValido(ele) and ele <> pk) then asignaciones=asignaciones&ele&"="&valor&","
		next
		'if len(asignaciones)>0 then asignaciones=asignaciones&"idUM='"&session("idUsuario")&"',fechaUM=getdate()"
		if len(asignaciones)>0 then asignaciones=left(asignaciones,len(asignaciones)-1)
		sql="UPDATE " & tabla & " SET " & asignaciones & " WHERE " & pk & " = " & request(pk)
		sqlpc="UPDATE " & tabla & "_PRECONDICIONES_TEMP_TABLE SET " & asignaciones & " WHERE " & pk & " = " & request(pk)
		sqlpc = replace ( sqlpc, "'", "''")
		sqlsppc = "exec sp_dbh_precondiciones_validate " & DBH_da_id & ", '" & sqlpc & "'," & request(pk)
	end if
	'response.write sqlsppc
	if ( DBH_da_id <> "" ) then
		rs.open sqlsppc,dbConnZavala
		pcalertas = ""
		do while not rs.eof
			pcalertas = pcalertas + "<pc_id>" & rs("pc_id") & "</pc_id><pc_nombre>" & rs("pc_nombre") & "</pc_nombre><pc_descripcion>" & rs("pc_desc") & "</pc_descripcion>"'
			rs.movenext
		loop
		if pcalertas <> "" then
			response.write "<precondiciones><precondicion>"&pcalertas&"</precondicion></precondiciones>"
			response.end
		end if
		rs.close
	end if
	'response.write sql
	On Error Resume Next
	rs.open "set dateformat dmy "&sql,dbConnZavala
	errNumber = Err.Number
	errDescription = Err.Description
	on error goto 0
	if operacion="insert" then 
		sql="SELECT MAX (" & pk & ") as id FROM " & tabla
		rs.open sql,dbConnZavala
		res = rs(0)
		rs.close
	end if
	'if (not rs.eof) then res = rs(0)
	'if rs.State=1 then res = rs(0)
	response.write "<xml><errnum>" & errNumber & "</errnum><errdesc>" & escape(errDescription) & "</errdesc><requeststr>" & escape(request.form) & "</requeststr><sql>" & escape(sql) & "</sql><respuesta>" & escape(res) & "</respuesta></xml>"

	function campoValido(c)
		c=lcase(c)
		campoValido = true
		if c="nocache" then campoValido = false
		if c="controldeerrores" then campoValido = false
		if c="dbh_pk" then campoValido=false
		if c="dbh_tabla" then campoValido=false
		if c="dbh_sql" then campoValido=false
		if c="dbh_operacion" then campoValido=false
		if c="dbh_da_id" then campoValido=false
	end function
%>
<!--#include file="dbConnClose.asp"-->

