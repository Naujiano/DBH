<!--#include file="dbConnOpen.asp"-->
  <style>
	*{font-family:arial;font-size:14px}
	small {font-size:12px;color:gray}
	</style>
<%
	session.codepage=65001
	response.charset = "UTF-8"
	server.scriptTimeout=6000
	Session.LCID = 2057
	
	vista = request ( "vista" )
	where = request ( "where" )
	orderBy= request("orderBy")
	orderByDesc= request("orderByDesc")
    nombreArea = request("titulo")
	tituloExcel = request("tituloexcel")
	excelLimit = request("excelLimit")
	if tituloExcel = "" then tituloExcel = nombreArea
	if where = "" then where = "1=1"
	set rs = server.createobject ( "adodb.recordset" )
	if ( excelLimit <> "" and excelLimit <> "-1" ) then toplimitArgument = "TOP " & excelLimit
	sql = "set dateformat dmy SELECT " & toplimitArgument & " * FROM [" & vista & "] WHERE " & where
	if orderBy <> "" then sql = sql & " ORDER BY " & orderBy & " " & orderByDesc
	'response.write sql
	'response.end
	sqlExec rs, dbConnZavala, sql 
	'rs.open sql,dbConnZavala
	if rs.state=0 then response.end
	if rs.eof then response.end
	nocol=rs.fields.count-1
  	txt=""
	
    Set filesys = CreateObject("Scripting.FileSystemObject")
  	set t=filesys.OpenTextFile(server.mappath("longlistexcelheader.xml"),1,false)
    txt=t.ReadAll
    t.close
    txt=txt&"<Worksheet ss:Name='Hoja1'><Table ss:DefaultColumnWidth='90'><Row><Cell><Data ss:Type='String'>" & htmlenc(tituloExcel) & "</Data></Cell></Row><Row><Cell><Data ss:Type='String'>" & now() & "</Data></Cell></Row><Row ss:Index='4'>"
    for i=0 to nocol
      campo=rs.fields(i).name
      txt=txt&"<Cell ss:StyleID='s25'><Data ss:Type='String'>"&htmlenc(campo)&"</Data></Cell>"
    next
    txt=txt&"</Row>"
    Const ForReading = 1, ForWriting = 2, ForAppending = 8 
    Set filesys = CreateObject("Scripting.FileSystemObject")
	nombreArea = replace ( nombreArea, "<br>", "-")
    xlsfilename = "Informe_"&nombreArea&".xls"
	response.write xlsfilename
    Set filetxt = filesys.CreateTextFile(server.mappath("documentos/"&xlsfilename), True)
    filetxt.WriteLine(txt)
  	do while not rs.eof
      txt="<Row>"
      filetxt.WriteLine(txt)
      'cont=0
      for each campo in rs.fields
        contenidoCampo = rs(campo.name)
       	tipo = "String"
       	estilo = "s24"
        if not isnull(contenidoCampo) and trim(contenidoCampo) <> "" then
          if campo.type = 129 or campo.type = 135 then
          	tipo = "DateTime"
          	estilo = "s22"
			contenidoCampo = split(contenidoCampo," ")(0)
			arr = split(contenidoCampo,"/")
			if ubound(arr)=2 then 
				contenidoCampo = arr(2) & "-" & arr(1) & "-" & arr(0)
			end if
          elseif campo.type < 10 then
          	tipo = "Number"
          	estilo = "s23"
          	contenidoCampo = replace ( contenidoCampo , "," , "." )
          end if
        end if
        'if(cont>0) then 
        	txt="<Cell ss:StyleID='" & estilo & "'><Data ss:Type='" & tipo & "'>"&htmlenc(contenidoCampo)&"</Data></Cell>"
        	filetxt.WriteLine(txt)
        'end if
        cont=cont+1
      next
      txt="</Row>"
      filetxt.WriteLine(txt)
  	  rs.movenext
  	loop
  	txt="</Table>"
  	filetxt.WriteLine(txt)
  rs.close
  set rs=nothing
  set rs2=nothing
  set rs3=nothing
  txt="<AutoFilter x:Range='R4C1:R4C" & nocol+1 & "' xmlns='urn:schemas-microsoft-com:office:excel'></AutoFilter></Worksheet></Workbook>"
  filetxt.WriteLine(txt)
  filetxt.Close
  response.redirect("documentos/"&xlsfilename)
  function mostrarEsteCampo(campo)
    mostrarEsteCampo=1
    if(request(campo.name)<>"" or (campo.name="nacimientoano" and request("edad")<>"") or ( ( campo.name="telparticular" or campo.name="telmovil" or campo.name="teloficina" ) and request("telefonos")<>"" ) )then
    	mostrarEsteCampo=1
    end if
  end function
  function nombreCampo(n)
    nombreCampo=n
    if(n="nacimientoano") then nombreCampo="A. nacimiento"
    if(n="empresadescripcion") then nombreCampo="Empresa"
    if(n="puestodescripcion") then nombreCampo="Puesto"    
  end function
  function htmlenc(txt)
    if(not isnull(txt) and txt<>"") then htmlenc=server.htmlencode(txt)
  end function
  function sqlExec ( recordSet, conn, sql )
	On Error Resume Next
	recordSet.open sql , conn
	errNumber = Err.Number
	errDescription = Err.Description
	on error goto 0
	If errNumber = -2147217865 then 
		response.write "No se ha podido generar la vista.<br><br>Causas posibles: campos con el mismo nombre.<br><br><small>" & sql & "<br>" & errDescription & "</small>"
		response.end
	elseif errNumber <> 0 Then
		Call Err.Raise(errNumber, "Error de Sql:" & sql, errDescription)
		response.end
	End If
  end function
%>
  <script runat=server LANGUAGE=JavaScript>
	function esc (txt){
		var txt = txt.replace ( /\</g,'&lt;').replace ( /\>/g,'&gt;').replace ( /\&/g,'&amp;')
		return txt
	}
  </script>
<!--#include file="dbConnClose.asp"-->
