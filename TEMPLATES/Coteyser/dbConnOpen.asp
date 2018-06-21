<%
set dbConnZavala=server.createobject("adodb.connection")
dbConnZavala.open "driver={SQL Server};server=localhost\SQLEXPRESS; uid=sa;pwd=Sqlserver0;database=DBH_Coteyser"
'dbConnZavala.open "driver={SQL Server};server=89.129.194.180,55857; uid=sa;pwd=Sqlserver0;database=DBH_Coteyser"
%>