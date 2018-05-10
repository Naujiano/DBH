<!DOCTYPE html>
<%
session.codepage=65001
response.charset = "UTF-8"
codfactura = request("codfactura")
set dbcon = server.createobject ( "adodb.connection")
'str = "DRIVER={MySQL ODBC 5.2 ANSI Driver}; SERVER=localhost; DATABASE=nauj_facturacion; UID=root;PASSWORD=; OPTION=3;" //Charset=utf8
'str = "DRIVER={MySQL ODBC 5.2 ANSI Driver}; SERVER=localhost; DATABASE=nauj_facturacion; UID=root;PASSWORD=Sqlserver0; OPTION=3;" //Charset=utf8
str = "driver={SQL Server};server=localhost\SQLEXPRESS; uid=sa;pwd=Sqlserver0;database=DBH_demo"
dbcon.open str
set rs = server.createobject ( "adodb.recordset")
sql = "SELECT codcliente,fecha,iva,irpf,importetotal,baseimponible FROM 	viewfacturas where codfactura = " & codfactura

rs.open sql, dbcon
codcliente=rs("codcliente")
fecha=left(rs("fecha"),10)
iva=rs("iva")
irpf=rs("irpf")
baseimponible=rs("baseimponible")
importetotal=rs("importetotal")
rs.close
sql = "SELECT codcliente,nombre,domicilio,cp,localidad,provincia,pais,cif FROM clientes WHERE codcliente = " & codcliente
rs.open sql, dbcon
IdCli=rs("codcliente")
nombre = rs("nombre")
domicilio=rs("domicilio")
cp=rs("cp")
localidad=rs("localidad")
provincia=rs("provincia")
pais=rs("pais")
cif=rs("cif")
rs.close
%>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Naüj - Factura</title>
	<meta charset="UTF-8">
<style>
  TD { font-family: Arial, Verdana, Sans; font-size:13px; color:#0072c6 }
  td.importe { text-align: right; padding: 0 15 0 0;vertical-align:bottom;}
  INPUT {
	BORDER-RIGHT: black 0px solid; BORDER-TOP: black 0px solid; BORDER-LEFT: black 0px solid; WIDTH: 40px; COLOR: #0072c6; BORDER-BOTTOM: black 0px solid
}
</style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
<TABLE cellSpacing=0 cellPadding=0 width=600 align=center border=0>
  <TBODY>
  <TR>
    <TD align=right colSpan=2 rowSpan=4>
      <DIV align=right>
      <TABLE cellSpacing=0 cellPadding=0 width=600 border=0>
        <TBODY>
        <TR>
          <TD align=right width=576 style="border:0px solid red"><B><FONT face="Arial, Helvetica, sans-serif" size=1>
		    <img src="logonaujcloud.png" style="zoom:0.5;float:left">
            Juan Martín Migliorini<BR>
            Calle Seco 5<br>
            28007 Madrid, España<br>
            N.I.F.: X-2297206-N
            </FONT></B></TD>
          <TD width=5>&nbsp;</TD>
          <TD width=15 
  bgColor=#0072c6>&nbsp;</TD></TR></TBODY></TABLE></DIV></TD></TR></TBODY></TABLE><BR><BR>
<TABLE cellSpacing=0 cellPadding=0 width=600 align=center border=0>
  <TBODY>
  <TR>
    <TD colSpan=3>
      <TABLE cellSpacing=0 cellPadding=0 width=580 align=center bgColor=#ffffff 
      border=0>
        <TBODY>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height=20>&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height=20><FONT 
            face="Arial, Verdana, Sans" color=#666666 
            size=2><B>Cliente</B></FONT></TD>
          <TD width=5 height=20>&nbsp;</TD>
          <TD width=280 height="20"><FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2>
              <%=Nombre%></FONT></TD>
          <TD vAlign=top rowSpan=4 height="20">
            <TABLE cellSpacing=0 borderColorDark=#dfdfdf cellPadding=0 width=225 
            align=left borderColorLight=#ffffff>
              <TBODY>
              <TR>
                <TD align=middle width=100 bgColor=#f3f3f3 colSpan=2>
                  <DIV align=left><FONT face="Arial, Verdana, Sans" 
                  color=#666666 size=2><B>&nbsp;Id Cliente</B></FONT></DIV></TD>
                <TD width=150 height=23><FONT face="Arial, Verdana, Sans" 
                  color=#0072c6 size=2>&nbsp;<%=IdCli%></FONT></TD></TR>
              <TR>
                <TD align=middle width=100 bgColor=#f3f3f3 colSpan=2 td>
                  <DIV align=left><FONT face="Arial, Verdana, Sans" 
                  color=#666666 size=2><B>&nbsp;Factura Nº</B></FONT></DIV></TD>
                <TD width=150 height=23><FONT face="Arial, Verdana, Sans" 
                  color=#0072c6 size=2>&nbsp;<%=codFactura%></FONT></TD></TR>
              <TR>
                <TD align=middle width=100 bgColor=#f3f3f3 colSpan=2 td>
                  <DIV align=left><FONT face="Arial, Verdana, Sans" 
                  size=2><B><FONT 
                  color=#666666>&nbsp;Fecha</FONT></B></FONT></DIV></TD>
                <TD width=150 height=23><FONT face="Arial, Verdana, Sans" 
                  color=#0072c6 size=2>&nbsp;<%=Fecha%></FONT> 
            </TD></TR></TBODY></TABLE></TD></TR>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height="20">&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height="20"><FONT face="Arial, Verdana, Sans" 
            color=#666666 size=2><B>Domicilio</B></FONT></TD>
          <TD width=5 height="20">&nbsp;</TD>
          <TD height="20"><FONT face="Arial, Verdana, Sans" color=#0072c6 size=2>
              <%=Domicilio%></FONT> </TD></TR>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height="20">&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height="20"><FONT face="Arial, Verdana, Sans" 
            color=#666666 size=2><B>Código Postal</B></FONT></TD>
          <TD width=5 height="20"><FONT face="Arial, Verdana, Sans">&nbsp;</FONT></TD>
          <TD height="20"><FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2>
              <%=CP%></FONT></TD></TR>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height="20">&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height="20"><FONT face="Arial, Verdana, Sans" 
            color=#666666 size=2><B>Localidad</B></FONT></TD>
          <TD width=5 height="20">&nbsp;</TD>
          <TD height="20">
              <%=Localidad%>
          </TD></TR>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height="20">&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height="20"><FONT face="Arial, Verdana, Sans" 
            color=#666666 size=2><B>Provincia</B></FONT></TD>
          <TD width=5 height="20">&nbsp;</TD>
          <TD height="20"><FONT face="Arial, Verdana, Sans" color=#0072c6 
size=2>
              <%=Provincia%></FONT></TD>
          <TD height="20">&nbsp;</TD></TR>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height="20">&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height="20"><FONT face="Arial, Verdana, Sans" 
            color=#666666 size=2><B>País</B></FONT></TD>
          <TD width=5 height="20">&nbsp;</TD>
          <TD height="20">
              <%=Pais%>
          </TD>
          <TD height="20">&nbsp;</TD></TR>
        <TR>
          <TD width=9 bgColor=#f4f4f4 height="20">&nbsp;</TD>
          <TD width=95 bgColor=#f3f3f3 height="20"><FONT face="Arial, Verdana, Sans" 
            color=#666666 size=2><B>N.I.F/C.I.F.</B></FONT></TD>
          <TD width=5 height="20">&nbsp;</TD>
          <TD height="20"><FONT face="Arial, Verdana, Sans" color=#0072c6 
size=2>
              <%=CIF%></FONT></TD>
          <TD height="20">&nbsp;</TD></TR></TBODY></TABLE></TD>
    <TD width=15 bgColor=#0072c6 rowSpan=5>&nbsp;</TD></TR>
  <TR>
    <TD colSpan=3><BR><BR><BR>
      <TABLE cellSpacing=0 borderColorDark=#dfdfdf cellPadding=3 width=100% 
      align=center bgColor=#ffffff borderColorLight=#ffffff border=0>
        <TBODY>
        <TR bgColor=#f4f4f4>
          <TD align=left bgColor=#f4f4f4 colSpan=2>
            <FONT face="Arial, Verdana, Sans" size=2><B><FONT 
            color=#666666>Concepto</FONT></B></FONT></TD>
          <TD align=left width=67>
            <FONT face="Arial, Verdana, Sans" size=2><B><FONT 
            color=#666666>Importe&nbsp;&nbsp;&nbsp;&nbsp; 
            </FONT></B></FONT></TD>
          <td width=5 bgcolor=white></td>
            </TR></TBODY></TABLE>
                <TABLE cellSpacing=0 borderColorDark=#dfdfdf cellPadding=3 width="94%" 
align=left borderColorLight=#ffffff border=0>
                    <TBODY>
<%					
sql = "SELECT codPresupuesto, DesPresupuesto, importe, fecha FROM viewFacturasPresupuestos WHERE codFactura = " & codfactura & " ORDER BY codPresupuesto"
rs.open sql, dbcon
do while not rs.eof
codpresupuesto = rs ( "codpresupuesto" )
despresupuesto = rs ( "despresupuesto" )
importe = rs ( "importe" )
fecha = rs ( "fecha" )
%>
                        <TR>
                            <TD style="width:485px">(<%=CodPresupuesto%>)&nbsp;<%=left(fecha,10) %>. <%=desPresupuesto%></TD>
                            <TD class="importe" style=""><%=importe%></TD>
                        </TR>
<%
rs.movenext
loop
%>
                    
					</TBODY>
                </TABLE>
        &nbsp;
       <BR><BR><BR>
       </TD>
    </TR>
  <TR>
    <TD colspan=3>
       <BR><BR><BR>
      <TABLE cellSpacing=0 borderColorDark=#dfdfdf cellPadding=3 width=100% 
      align=center borderColorLight=#ffffff>
        <TBODY>
        <TR align=left bgColor=#f4f4f4>
          <TD><FONT face="Arial, Verdana, Sans" size=2><B><FONT 
            color=#666666>Base Imponible</FONT></B></FONT></TD>
          <TD><FONT face="Arial, Verdana, Sans" size=2><B><FONT 
            color=#666666>IRPF 15%</FONT></B></FONT></TD>
          <TD width=150><FONT face="Arial, Verdana, Sans"><B><FONT 
            color=#666666 size=2>IVA 21%</FONT></B></FONT></TD>
          <TD width=67><FONT face="Arial, Verdana, Sans"><B><FONT 
            color=#666666 size=2>Total</FONT></B></FONT></TD>
          <td width=5 bgcolor=white></td>
       </TR>
        <TR align=left bgColor=white>
          <TD>
            <FONT face="Arial, Verdana, Sans" color=#0072c6 size=2>
                <%=BaseImponible%></FONT></TD>
          <TD>
            <FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2>
                <%=Irpf%></FONT><FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2></FONT></TD>
          <TD>
            <FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2>
                <%=IVA%></FONT><FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2></FONT></TD>
          <TD>
            <FONT face="Arial, Verdana, Sans" color=#0072c6 
            size=2>
                <%=ImporteTotal%></FONT></TD>
          <td width=5 bgcolor=white></td>
        </TR>
        </tbody>
      </table>
    </td>
  </tr>
  <TR>
    <TD width=226 height=8>&nbsp;</TD>
    <TD width=128 height=8>&nbsp; </TD>
    <TD width=227 height=8>&nbsp;</TD></TR>
  <TR>
    <td colspan=3>
    <table cellpadding=3 cellspacing=0 border=0 width=100%>
    <tr>
    <TD align=left bgColor=#f3f3f3 width=0><B><FONT face="Arial, Verdana, Sans" color=#666666 
      size=-1><nobr>Modalidad de pago</nobr></FONT></B></TD>
    <TD>&nbsp;<FONT face="Arial, Verdana, Sans" color=#0072c6 
      size=-1>
      Transferencia Openbank 0073 0100 51 0418131239<br>
	  &nbsp;&nbsp;IBAN ES7500730100510418131239
      </FONT></TD>
          <td width=5 bgcolor=white></td>
    </TR>
    </table>
    </td>
  </tr>
</TBODY></TABLE>    </div>
    </form>
</body>
</html>
