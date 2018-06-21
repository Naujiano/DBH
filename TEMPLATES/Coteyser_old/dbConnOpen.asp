<%
set dbConnZavala=server.createobject("adodb.connection")
dbConnZavala.open "driver={SQL Server};server=localhost\SQLEXPRESS; uid=sa;pwd=Sqlserver0;database=DBH_Coteyser"
'response.write request("DBConnectionString")
'dbConnZavala.open request("DBConnectionString")
%>