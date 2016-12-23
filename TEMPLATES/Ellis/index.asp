<!DOCTYPE html>
<style>body{display:none}</style>
<%
	DBHversion = request ( "v" )
	if DBHversion = "" then DBHversion = "0"
	DBHpath = "http://192.168.1.128/dbh/v" & DBHversion & "/"
	DBHroot = "http://192.168.1.128/dbh/"
	session.codepage=65001
	response.Charset="utf-8"
	server.scripttimeout=6000
	session.timeout=60
	Set getPage = Server.CreateObject("Microsoft.XMLHTTP" )
	getPage.Open "GET", DBHpath & "main.html", false
	getPage.Send
	response.write getPage.responseText
	Set getPage = Nothing
%>
<!---->
<script
  src="https://code.jquery.com/jquery-1.12.4.min.js"
  integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="
  crossorigin="anonymous"></script>
  <!---->
<script type="text/javascript" src="<%=DBHpath%>js/DBH.js"></script> 
<script type="text/javascript" src="customCode/customCode.js"></script> 
<input type="hidden" id="DBConnectionString" value="driver={SQL Server};server=localhost\SQLEXPRESS; uid=sa;pwd=DigitalB/N;database=Ellis_db">
<input type="hidden" id="apppath" value="<%=left(request.servervariables("PATH_INFO"), len(request.servervariables("PATH_INFO")) - 9 ) %>">
<input type="hidden" id="regXPag" value="200">
<input type="hidden" id="DBHpath" value="<%=DBHpath%>">
<input type="hidden" id="DBHroot" value="<%=DBHroot%>">
<input type="hidden" id="template_title" value="Ellis (Local)">
<input type="hidden" id="dbh_version" value="<%=DBHversion%>">
<input type="hidden" id="sessionid" value="<%=Session.SessionID%>">
<input type="hidden" id="docpath" value="C:\\data\\iis\\DBH\\TEMPLATES\\Ellis\\documentos">

<div id="herramientas_container" style="" class="divMenuContextual">
<ul>
<li onclick="vars.dbBackup();">Realizar copia de seguridad de la BD</li>
</ul>
</div>
