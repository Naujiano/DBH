<!--#include file = "dbConnOpen.asp"-->
<%
	codpersona = request("codpersona")
	dbConnZavala.CommandTimeout = 300
	session.codepage = 65001
	response.charset = "utf-8"
	set rs=server.createobject("adodb.recordset")
	sql="SELECT distinct tipoRiesgo, matricula, dni, direccion,matriz, actividad_id Actividad, subfamilia_id Subfamilia,tipo,des Cobertura FROM fn_cliente_riesgos_coberturas_faltantes (" & codpersona & ") a INNER JOIN DBH_Listas ON a.li1_id = DBH_Listas.li1_id ORDER BY matricula, dni, direccion,matriz, actividad_id, subfamilia_id, des"
	'res = "<table><tr><td>li1_id</td><td>des</td><td>tipo</td><td>matriz</td><td>ramo</td><td>tipoRiesgo</td><td>id Riesgo</td></tr>"
	rs.open sql,dbConnZavala
	json = "["
	do while not rs.eof
		'res = res & "<tr><td>" & rs ( "li1_id" ) & "</td><td>" & rs ("des") & "</td><td>" & rs ("tipo") & "</td><td>" & rs ("matriz") & "</td><td>" & rs ("ramo") & "</td><td>" & rs ("tipoRiesgo") & "</td><td>" & rs ("prr_id") & "</td></tr>"
		json = json & "{"
		For each fld in rs.fields
			json = json & "'" & fld.name & "':'" & rs(fld.name) & "',"
		Next
		json = json & "},"
		rs.movenext
	loop
	json = json & "]"
	rs.close
	sql = "SELECT nombre, apellido1, apellido2 FROM personas WHERE codpersona = " & codpersona
	rs.open sql,dbConnZavala
	cliente = "{"
		For each fld in rs.fields
			cliente = cliente & "'" & fld.name & "':'" & rs(fld.name) & "',"
		Next
	cliente = cliente & "}"
	rs.close
	sql = "SELECT distinct tipo_riesgo, matricula, dni, direccion, coberturas_ok, actividades_ok FROM fn_cliente_riesgos_estados ( " & codpersona & " )"
	rs.open sql,dbConnZavala
	riesgos = "["
	do while not rs.eof
		riesgos = riesgos & "{"
		For each fld in rs.fields
			riesgos = riesgos & "'" & fld.name & "':'" & rs(fld.name) & "',"
		Next
		riesgos = riesgos & "},"
		rs.movenext
	loop
	riesgos = riesgos & "]"
	rs.close
	sql = "SELECT distinct tipo_riesgo, matricula, dni, direccion,des Cobertura,anidamiento, cubierta FROM fn_cliente_riesgos_coberturas ( " & codpersona & " )"
	'sql = sql & " WHERE li1_id IN ( SELECT prg_gar_id FROM prr_garantias WHERE prg_prr_id = prr_id )"
	sql = sql & " ORDER BY matricula, dni, direccion, des, cubierta"
	rs.open sql,dbConnZavala
	riesgosCoberturas = "["
	do while not rs.eof
		riesgosCoberturas = riesgosCoberturas & "{"
		For each fld in rs.fields
			riesgosCoberturas = riesgosCoberturas & "'" & fld.name & "':'" & rs(fld.name) & "',"
		Next
		riesgosCoberturas = riesgosCoberturas & "},"
		rs.movenext
	loop
	riesgosCoberturas = riesgosCoberturas & "]"
	rs.close
	sql = "SELECT distinct tipo_riesgo, matricula, dni, direccion, matriz, actividad, subfamilia, pra_cubierta as Cubierta FROM fn_cliente_riesgos_actividades ( " & codpersona & " ) "
	rs.open sql,dbConnZavala
	riesgosActividades = "["
	do while not rs.eof
		riesgosActividades = riesgosActividades & "{"
		For each fld in rs.fields
			riesgosActividades = riesgosActividades & "'" & fld.name & "':'" & rs(fld.name) & "',"
		Next
		riesgosActividades = riesgosActividades & "},"
		rs.movenext
	loop
	riesgosActividades = riesgosActividades & "]"
	'response.write riesgosActividadesFaltantes
%>
<!--#include file = "dbConnClose.asp"-->
<script src="https://unpkg.com/vue"></script>

<div id="app">
	<h1>Cliente: <span>{{cliente.nombre}}</span> <span>{{cliente.apellido1}}</span> <span>{{cliente.apellido2}}</span></h1>
	<h4>Riesgos</h4>
	<table>
		<tr>
			<td v-for="header in headersRiesgos">
				<input style="width:100%" @keyup="filtrar(header,$event.target.value,'riesgos')">
			</td>
		</tr>
		<tr>
			<td v-for="header in headersRiesgos">{{header}}</td>
		</tr>
		<tr v-for="linea in tablaRiesgos">
			<td v-for="header in headersRiesgos">{{linea[header]}}</td>
		</tr>
	</table>
	<h4>Coberturas de los riesgos</h4>
	<table>
		<tr>
			<td v-for="header in headersRiesgosCoberturas">
				<input style="width:100%" @keyup="filtrar(header,$event.target.value,'coberturas')">
			</td>
		</tr>
		<tr>
			<td v-for="header in headersRiesgosCoberturas">{{header}}</td>
		</tr>
		<tr v-for="linea in tablaRiesgosCoberturas">
			<td v-for="header in headersRiesgosCoberturas">{{linea[header]}}</td>
		</tr>
	</table>
	
	<h4>Actividades</h4>
	<table>
		<tr>
			<td v-for="header in headersActividades">
				<input style="width:100%" @keyup="filtrar(header,$event.target.value,'actividadesFaltantes')">
			</td>
		</tr>
		<tr>
			<td v-for="header in headersActividades">{{header}}</td>
		</tr>
		<tr v-for="linea in tablaRiesgosActividades">
			<td v-for="header in headersActividades">{{linea[header]}}</td>
		</tr>
	</table>

	<h4>Coberturas faltantes</h4>
	<table>
		<tr>
			<td v-for="header in headers">
				<input style="width:100%" @keyup="filtrar(header,$event.target.value,'faltantes')">
			</td>
		</tr>
		<tr>
			<td v-for="header in headers">{{header}}</td>
		</tr>
		<tr v-for="linea in tabla">
			<td v-for="header in headers">{{linea[header]}}</td>
		</tr>
	</table>

</div>

<script>
new Vue({
  el: '#app',
  data: function () {
    return {
		filtros: {faltantes:{},riesgos:{},coberturas:{},actividadesFaltantes:{}}
		, tabla: this.getTabla('faltantes')
		, tablaRiesgos: this.getTabla('riesgos')
		, tablaRiesgosCoberturas: this.getTabla('coberturas')
		, tablaRiesgosActividades: this.getTabla('actividades')
		, cliente: this.getTabla('cliente')
		, headers: this.getHeaders('faltantes')
		, headersRiesgos: this.getHeaders('riesgos')
		, headersRiesgosCoberturas: this.getHeaders('coberturas')
		, headersActividades: this.getHeaders('actividades')
	}
  },
  methods: {
	getTabla(ele) {
		if ( ele == 'faltantes' )
			return <%=json%>
		if ( ele == 'riesgos' )
			return <%=riesgos%>
		if ( ele == 'cliente' )
			return <%=cliente%>
		if ( ele == 'coberturas' )
			return <%=riesgosCoberturas%>
		if ( ele == 'actividades' ) return <%=riesgosActividades%>
	},
	getHeaders(ele) {
		const tabla = this.getTabla(ele)
		if ( tabla.length == 0 ) return false
		const firstLine = tabla[0]
		, headers = []
		return Object.keys(firstLine)
	},
	filtrar(headerName,val,ele){
		this.filtros[ele][headerName] = val
		this.filtrar_execute ( ele )
	},
	filtrar_execute(ele){
		const tabla = this.getTabla(ele)
		var tab
		if ( ele == 'faltantes' )
			tab = 'tabla'
		if ( ele == 'riesgos' )
			tab = 'tablaRiesgos'
		if ( ele == 'cliente' )
			tab = 'clientes'
		if ( ele == 'coberturas' )
			tab = 'tablaRiesgosCoberturas'
		if ( ele == 'actividades' ) tab = 'tablaRiesgosActividades'
		this[tab] = []
		tabla.forEach ( line => {
			var aceptada = 1
			Object.keys(this.filtros[ele]).forEach ( headerName => {
				var val = this.filtros[ele][headerName]
				, valCampo = line[headerName]
				, searchVal = val.toLowerCase()
				, regexp = eval ( "/"+searchVal+"/g" )
				, result = valCampo.toLowerCase().match(regexp);
				//console.log(result)
				//if ( valCampo.toLowerCase().indexOf ( val.toLowerCase() ) == -1 ) aceptada = 0
				if ( ! result ) aceptada = 0
			})
			if ( aceptada ) this[tab].push ( line )
		} )
	},
	falta ( concepto, linea ) {
		const coberturasFaltantes = this.getTabla("faltantes")
		, actividades = this.getTabla("actividades")
		, actividadesFaltantes = []
		actividades.forEach ( row => {
			//if ( row['prr_id'] == linea['prr_id'] )
			//	if ( row["Cubierta"] != "Verdadero" ) actividadesFaltantes.push(row)
		})
		if ( concepto == "coberturas" ) return coberturasFaltantes.length
		if ( concepto == "actividades" ) return actividadesFaltantes.length
	}
  }
})
</script>

<style>
	h1 {
		text-transform: uppercase;
	}
	* {
		font-family: arial;
		font-size: 12px;
	}
	table {
		border-collapse: collapse;
	}
	td {
		border:1px solid gray;
		padding: 5px;
	}
	tr:nth-child(1)>td,tr:nth-child(2)>td {
		background: #ddd;
	}
	tr:nth-child(2)>td {
		font-weight: bold;
	}
</style>