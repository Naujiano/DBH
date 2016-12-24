<!DOCTYPE html>
<style>body{display:none}</style>
<%
	DBHversion = "Alpha"
	if DBHversion = "Alpha" then
		DBHpath = "http://192.168.1.128/dbh/"
	else
		DBHversion = "0e53b9ec2d5b21c5eb5b5bb4ec866fa6692ecd21"
		DBHpath = "https://rawgit.com/Naujiano/DBH/" & DBHversion & "/"
		DBHversion = left(DBHversion,7)
	end if
	session.codepage=65001
	response.Charset="utf-8"
	server.scripttimeout=6000
	session.timeout=60
	Set getPage = Server.CreateObject("Microsoft.XMLHTTP" )
	getPage.Open "GET", DBHpath & "main.html", false
	getPage.Send
	response.write getPage.responseText
%>
<title>Ellis (Local)</title>

<input type="hidden" id="apppath" value="<%=left(request.servervariables("PATH_INFO"), len(request.servervariables("PATH_INFO")) - 9 ) %>">
<input type="hidden" id="DBHpath" value="<%=DBHpath%>">
<input type="hidden" id="regXPag" value="200">
<input type="hidden" id="dbh_version" value="<%=DBHversion%>">
<input type="hidden" id="sessionid" value="<%=Session.SessionID%>">
<input type="hidden" id="docpath" value="D:\\data\\iis\\DBH\\TEMPLATES\\Ellis\\documentos">

<div id="herramientas_container" style="" class="divMenuContextual">
<ul>
<li onclick="vars.dbBackup();">Realizar copia de seguridad de la BD</li>
</ul>
</div>
<%
	getPage.Open "GET", DBHpath & "cdn.html", false
	getPage.Send
	response.write getPage.responseText
	Set getPage = Nothing
%>