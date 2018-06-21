<!--#include file="dbConnOpen.asp"-->
<!DOCTYPE html>
<style>
	* { margin: 0; box-sizing: border-box;font-family:arial; font-size:12px}
	body { padding:10px; }
	table { border-collapse: collapse }
	tr:hover { background: #eee }
	td { border: 1px solid #eee; padding:4px; margin: 0; }
	tr:first-child td { font-weight: bold }
	td:last-child { text-align: right }
</style>
<%
response.charset = "utf-8"
session.codepage = 65001
i_estado = request("i_estado")
i_id = "" 'request("i_id")
onlyprint = 0
servidor = Request.ServerVariables("SERVER_NAME")
server.scripttimeout=36000 '10 horas
set rs = server.createobject ( "adodb.recordset" )
set rs2 = server.createobject ( "adodb.recordset" )
set rs3 = server.createobject ( "adodb.recordset" )
set rsInformes = server.createobject ( "adodb.recordset" )
sql = "exec dbo.sp_avisos_send " & i_estado
'response.write sql
rs.open sql , dbConnZavala
sql = "SELECT i_id,i_sql,(select right(da_pkfield,len(da_pkfield)-charindex('.',da_pkfield)) from data_areas where da_id =i_da_id) as i_pkfield,i_da_id,i_aviso_titulo,i_aviso_texto,i_aviso_emails_nombres,i_aviso_emails,i_aviso_from,i_aviso_emailacc_user,i_aviso_emailacc_password FROM dbh_busquedas WHERE i_estado = " & i_estado & " ORDER BY i_id"
sql = "SELECT com_id,i_sql,i_pkfield,i_id,i_nombre,com_nombre FROM DBM_temptable ORDER BY com_id"
rsInformes.open sql , dbConnZavala, 3
'response.end
navisos = 0
updates = array()
sqlUpdates = ""
response.write "<table><tr><td>Comunicación</td><td>Vista</td><td>Avisos</td></tr>"
do while not rsInformes.eof
	com_id = rsInformes ( "com_id" )
	i_sql = rsInformes ( "i_sql" )
	i_sql = replace(i_sql,"'","''")
	i_pkfield = rsInformes ( "i_pkfield" )
	i_sql = replace ( i_sql, "select","select " & i_pkfield & ",", 1,1,1)
	i_id = rsInformes ( "i_id")
	nombreVista = rsInformes ( "i_nombre")	
	com_nombre = rsInformes ( "com_nombre")
	sql = "exec dbo.sp_sqlViewGenerator '" & i_sql & "','zview_avisos_sendmail_sqlinforme'"
	'response.write sql
	On Error Resume Next
	rs.open sql , dbConnZavala
	errNumber = Err.Number
	errDescription = Err.Description
	on error goto 0
	If errNumber <> 0 Then
	'response.write "i_id: " & i_id
		Call Err.Raise(errNumber, "Hay un error en la configuración del informe:" & i_id , errDescription)
	else
		sql = "SELECT * FROM zview_avisosViewGenerator INNER JOIN zview_avisos_sendmail_sqlinforme ON " & i_pkfield & " = ial_pkvalue AND i_id = " & i_id & " WHERE com_id = " & com_id & " ORDER BY iac_id,i_aviso_emails"
		rs.open sql , dbConnZavala,3
		noAvisosVuelta = 0
		do while not rs.eof
			i_nombre = rs ( "i_aviso_titulo")
			i_aviso_texto_grupo = rs ( "i_aviso_texto_grupo")
			i_aviso_texto = rs ( "i_aviso_texto")
			i_aviso_texto_loop_interno = rs ( "i_aviso_texto_loop_interno")
			i_aviso_emails_nombres = rs ( "i_aviso_emails_nombres")
			i_aviso_from = rs ( "i_aviso_from")
			i_aviso_emails = rs ( "i_aviso_emails")
			i_docs = rs ( "i_docs")
			iac_texto = rs ( "iac_texto")
			iac_emails_nombres = rs ( "iac_emails_nombres")
			iac_emails = rs ( "iac_emails")
			iac_from = rs ( "iac_from")
			iac_texto_loop_interno = rs ( "iac_texto_loop_interno")
			iac_nombre = rs ( "iac_nombre")
			iac_docs = rs ( "iac_docs")
			iac_activo = rs ( "iac_activo")
			iac_id = rs ( "iac_id")
			ial_id = rs ( "ial_id")
			com_nombre = rs ( "com_nombre")
			if(iac_activo) then
				response.write "<tr><td>(" & com_id & ") " & com_nombre & "</td><td>(" & i_id & ") " & nombreVista & "</td><td>Aviso custom</td></tr>"
				'response.write "Aviso Custom para Comunicación (" & ial_id & ") " & com_nombre & "<br>"
				if not isnull ( iac_nombre ) then i_nombre = iac_nombre
				if not isnull ( iac_texto ) then i_aviso_texto = iac_texto
				if not isnull ( iac_from ) then i_aviso_from = iac_from
				if not isnull ( iac_texto_loop_interno ) then i_aviso_texto_loop_interno = iac_texto_loop_interno
				if not isnull ( iac_emails_nombres ) then i_aviso_emails_nombres = iac_emails_nombres
				if not isnull ( iac_emails ) then i_aviso_emails = iac_emails
				if iac_docs<>"" then i_docs = iac_docs
			end if
			for each campo in rs.fields
				v = campo
				cn = lcase(campo.name)
				if isnull(v) then v = ""
				if isNumeric(v) then 
					isint = v - round(v)
					if isint = 0 then
						roundat = 0
					else
						roundat = 2
					end if
					v = formatnumber ( v , roundat )
					v = replace ( v , ".", ";" )
					v = replace ( v , ",", "." )
					v = replace ( v , ";", "," )
				end if
				if ( campo.type = 135 and 1=2 ) then
					sss = "set dateformat dmy select dbo.DBH_fecha(dateadd(day,cast(dbo.DBH_fecha('"&v&"','diasvto') as int),getdate()),'dmy')"
					response.write sss & "<br> 	"
					rs2.open sss,dbConnZavala
					v = rs2(0)
					rs2.close
				end if
				if not isnull ( i_aviso_texto_grupo ) then i_aviso_texto_grupo = replace ( i_aviso_texto_grupo, "{" & cn & "}", v )
				if not isnull ( i_aviso_texto ) then 
					i_aviso_texto = replace ( i_aviso_texto, "{" & cn & "}", v )
					i_aviso_texto = replace ( i_aviso_texto, "'", "''" )
				end if
				if not isnull ( i_aviso_texto_loop_interno ) then 
					i_aviso_texto_loop_interno = replace ( i_aviso_texto_loop_interno, "{" & cn & "}", v )
					i_aviso_texto_loop_interno = replace ( i_aviso_texto_loop_interno, "''", "'" )
					i_aviso_texto_loop_interno = replace ( i_aviso_texto_loop_interno, "'", "''" )
				end if
				if not isnull ( i_aviso_emails ) then i_aviso_emails = replace ( i_aviso_emails, "{" & cn & "}", v )
				if not isnull ( i_aviso_emails_nombres ) then 
					i_aviso_emails_nombres = replace ( i_aviso_emails_nombres, "{" & cn & "}", replace ( v, ",", "" ) )
					i_aviso_emails_nombres = replace ( i_aviso_emails_nombres, "''", "'" )
					i_aviso_emails_nombres = replace ( i_aviso_emails_nombres, "'", "''" )
				end if
			next
			'response.write "<tr><td>" & ial_id & "</td><td>" & com_nombre & "</td><td>" & i_nombre & "</td><td>" & i_aviso_emails & "</td><td>" & i_aviso_emails_nombres & "</td></tr>"
			sqlUpdate = " update dbm_comunicaciones SET ial_titulo_email = '" & i_nombre & "', ial_texto_loop = '" & i_aviso_texto & "', ial_texto_loop_interno = '" & i_aviso_texto_loop_interno & "', ial_texto_grupo = '" & i_aviso_texto_grupo & "',  ial_emails_destinatarios = '" & i_aviso_emails & "', ial_nombres_destinatarios = '" & i_aviso_emails_nombres & "' WHERE ial_id = " & ial_id
			'response.write sqlUpdate
			'rs2.open sqlUpdate , dbConnZavala
			'sqlUpdates = sqlUpdates & sqlUpdate
			navisos = navisos + 1
			noAvisosVuelta = noAvisosVuelta + 1
			'if navisos > 1 then 
			ReDim Preserve updates(UBound(updates) + 1)
			updates(UBound(updates)) = sqlUpdate
			rs.movenext
		loop
		response.write "<tr><td>(" & com_id & ") " & com_nombre & "</td><td>(" & i_id & ") " & nombreVista & "</td><td>" & noAvisosVuelta & "</td></tr>"
		'response.write "</table>"
		'sqlUpdates = ""
	End If
	rsInformes.movenext
	rs.close
loop
updatesOnBlock = 0
sqlUpdates = ""
for i = 0 to ubound ( updates )
	updatesOnBlock = updatesOnBlock + 1
	sqlUpdates = sqlUpdates & updates(i)
	if ( updatesOnBlock > 400 ) then
		rs2.open sqlUpdates , dbConnZavala
		navisosUpdateBlock  = 0
		sqlUpdates = ""
	end if
next
if sqlUpdates <> "" then rs2.open sqlUpdates , dbConnZavala
'response.write sqlUpdates
response.write "</table>"
%>
Proceso terminado. <%=navisos%> Avisos barridos.
<!--#include file="dbConnClose.asp"-->
