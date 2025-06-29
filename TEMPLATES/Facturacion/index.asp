<!DOCTYPE html>
<style>body{display:none}</style>
<%
	DBHversion = request("v")
	if DBHversion = "0" then
		DBHpath = "http://192.168.1.128/dbh/"
		DBHpath = "http://localhost/dbh/"
	else
		if DBHversion = "" then
			DBHversion = "456c2e54331092cc81476034303ee0ff66726dc3"
		end if
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
	Set getPage = Nothing
%>
<input type="hidden" id="apppath" value="<%=left(request.servervariables("PATH_INFO"), len(request.servervariables("PATH_INFO")) - 9 ) %>">
<input type="hidden" id="DBHpath" value="<%=DBHpath%>">
<input type="hidden" id="regXPag" value="200">
<input type="hidden" id="dbh_version" value="<%=DBHversion%>">
<input type="hidden" id="sessionid" value="<%=Session.SessionID%>">
<!--#include file = "template-info.html"-->

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tagsinput/0.8.0/bootstrap-tagsinput.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/genericons/3.1/genericons.css">
<link rel="stylesheet" href="http://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css">
<link rel="stylesheet" href="./jquery-simple-datetimepicker-master/jquery.simple-dtpicker.css">
<link rel="shortcut icon" href="<%=DBHpath%>favicon.ico">
<link rel="stylesheet" href="<%=DBHpath%>css/main.css">
<link rel="stylesheet" href="<%=DBHpath%>css/dbh-nauj-tempstyles.css">
<link rel="stylesheet" href="<%=DBHpath%>css/typeahead.css">
<link rel="stylesheet" href="<%=DBHpath%>css/tagsinput.css">

<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
<script type='text/javascript' src='http://code.jquery.com/ui/1.12.1/jquery-ui.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.bundle.min.js"></script>
<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.3/jstree.min.js'></script>
<script type="text/javascript" src="customCode/customCode.js"></script>
<script async type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.0/mousetrap.min.js'></script>
<script async type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js'></script>
<script async type="text/javascript" src="./jquery-simple-datetimepicker-master/jquery.simple-dtpicker.js"></script>
<script async src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script async src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tagsinput/0.8.0/bootstrap-tagsinput.min.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/DBH.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/DBH.herramientas.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/DBH.ajax.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/DBH.tree.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/DBH-cache.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/DBH-query.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/blockButton.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/index.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/general.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/myAjax.js"></script>
<script type="text/javascript" src="<%=DBHpath%>js/listadoCuerpo.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/DBH.area.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/init-caches.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/DBH-query-editor.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/inlineform.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/toplevelform.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/multistatebutton.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/docs.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/alimentador.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/DBH-inline-search.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/DBH-filter-parameters.js"></script>
<script async type="text/javascript" src="<%=DBHpath%>js/DBH-field.js"></script>
