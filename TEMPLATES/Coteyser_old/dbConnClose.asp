<%
  If TypeName(rs) = "Recordset" Then 
      If rs.State <> 0 Then
           rs.Close
     End If
     set rs = nothing
  End If
  If TypeName(rs1) = "Recordset" Then 
      If rs1.State <> 0 Then
           rs1.Close
     End If
     set rs1 = nothing
  End If
  If TypeName(rs2) = "Recordset" Then 
      If rs2.State <> 0 Then
           rs2.Close
     End If
     set rs2 = nothing
  End If
  If TypeName(rs3) = "Recordset" Then 
      If rs3.State <> 0 Then
           rs3.Close
     End If
     set rs3 = nothing
  End If
  dbConnZavala.close
  set dbConnZavala=nothing
%>