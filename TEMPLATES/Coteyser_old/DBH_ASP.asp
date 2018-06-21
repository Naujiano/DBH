<%
	func = trim(request("func"))
	sess = request("id")
	val = request("val")
	'response.write func & " " & sess & " " & val
	if func = "session" then
		if val = "" then
			response.write session(sess)
		else
			session(sess) = val
		end if
	end if
	if func = "application" then
		if val = "" then
			response.write application(sess)
		else
			application(sess) = val
		end if
	end if
%>