function loadTopForms(da_id){
	var sqltxt = "SELECT case when (COL_LENGTH(da_pktabla,'dbh_perfiles_admitidos_xreg') is null ) then '0' else '1' end as tiene_columna_dbh_perfiles_excluidos, (select a.da_id from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_id_madre,(select a.da_tabla from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_pktabla_madre,(select a.da_pkfield from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_pkfield_madre,(select a.da_descripcion from DBH_AREAS as a where a.da_id = b.da_areamadre ) as namemadre,(select cast(da_id as char) + ',' from DBH_AREAS as a where b.da_id = a.da_areamadre AND a.da_nivel = 1 AND a.da_activa=1 FOR XML PATH ('') ) as da_ids_hijas, (select cast(da_id as char) + ',' from DBH_AREAS as a where (b.da_id = a.da_areamadre OR b.da_id = a.da_areamadrastra) AND a.da_nivel = 2 AND a.da_areamadrastra is not null FOR XML PATH ('') ) as da_ids_relacionantes, (select cast(da_descripcion as char) + ',' from DBH_AREAS as a where (b.da_id = a.da_areamadre OR b.da_id = a.da_areamadrastra) AND a.da_nivel = 2 AND a.da_areamadrastra is not null FOR XML PATH ('') ) as da_nombres_relacionantes,(select cast(da_descripcion as char) + ',' from DBH_AREAS as a where b.da_id = a.da_areamadre AND a.da_nivel = 1 AND a.da_activa=1 FOR XML PATH ('') ) as da_nombre_hijas,* FROM DBH_AREAS as b WHERE ( da_areamadre is null or da_nivel = 1 ) and da_activa = 1 AND da_id = "+da_id+" order by da_orderindex"
	//, r = parent.sqlExec ( sqltxt )
	//, r = dbhQuery ( 'loadform-data' ).filter(da_id)
	, r = dbhQuery ( 'areas' ).filter(da_id)
	var config_usu_perfil = sessionStorage["usu_perfil"]//$(document).data('')
	//, topform
		var t0 = performance.now();

	$(r).each ( function () {
		var da_pktabla = $(this).find('[fieldname="da_pktabla"]').text().toLowerCase()
		, da_id = $(this).find('[fieldname="da_id"]').text().toLowerCase()
		, da_perfiles_excluidos = $(this).find('[fieldname="da_perfiles_excluidos"]').text()
		, tiene_columna_dbh_perfiles_excluidos = $(this).find('[fieldname="tiene_columna_dbh_perfiles_excluidos"]').text()
		, da_perfiles = $(this).find('[fieldname="da_perfiles"]').text()
		, da_orderindexListado = $(this).find('[fieldname="da_orderindexlistado"]').text().toLowerCase()
		, ascdesc = ( da_orderindexListado < 0 || ! da_orderindexListado ) ? 'desc' : 'asc'
		, orderindexListado = da_orderindexListado
		, da_tabla = $(this).find('[fieldname="da_tabla"]').text().toLowerCase()
		, da_pkfield = $(this).find('[fieldname="da_pkfield"]').text().toLowerCase()
		, da_fkfield = $(this).find('[fieldname="da_fkfield"]').text().toLowerCase()
		, da_areamadre = $(this).find('[fieldname="da_areamadre"]').text().toLowerCase()
		, da_pktabla_madre = $(this).find('[fieldname="da_pktabla_madre"]').text().toLowerCase()
		, da_pkfield_madre = $(this).find('[fieldname="da_pkfield_madre"]').text().toLowerCase()
		, da_nivel = $(this).find('[fieldname="da_nivel"]').text()
		, vinculada_madre_name = $(this).find('[fieldname="namemadre"]').text()
		, da_ids_hijas = $(this).find('[fieldname="da_ids_hijas"]').text()
		, da_ids_hijas = da_ids_hijas ? da_ids_hijas.substring(0,da_ids_hijas.length-1).replace(/ /gi,'').split(',') : da_ids_hijas
		, da_ids_relacionantes = $(this).find('[fieldname="da_ids_relacionantes"]').text()
		, da_ids_relacionantes = da_ids_relacionantes ? da_ids_relacionantes.substring(0,da_ids_relacionantes.length-1).replace(/ /gi,'').split(',') : da_ids_relacionantes
		, da_nombre_hijas = $(this).find('[fieldname="da_nombre_hijas"]').text()
		, da_nombre_hijas = da_nombre_hijas ? da_nombre_hijas.substring(0,da_nombre_hijas.length-1).replace(/ /gi,'').split(',') : da_nombre_hijas
		, da_nombres_relacionantes = $(this).find('[fieldname="da_nombres_relacionantes"]').text()
		, da_nombres_relacionantes = da_nombres_relacionantes ? da_nombres_relacionantes.substring(0,da_nombres_relacionantes.length-1).replace(/ /gi,'').split(',') : da_nombres_relacionantes
		, da_id_madre = $(this).find('[fieldname="da_id_madre"]').text().toLowerCase()
		, da_descripcion = $(this).find('[fieldname="da_descripcion"]').text().toLowerCase()
		, da_custom_buttons = $(this).find('[fieldname="da_custom_buttons"]').text()
		, da_callback_save = $(this).find('[fieldname="da_callback_save"]').text()
		, da_callback_load = $(this).find('[fieldname="da_callback_load"]').text()
		, $tempfield = $('<div class="'+da_perfiles+'"/>')
		, vinculada_fkname = da_fkfield.substring(da_fkfield.indexOf('.')+1)
		if ( ! $tempfield.is ( config_usu_perfil ) ) {

			//var rr = requestAnimationFrame ( vars.loading )
//			console.log(da_descripcion)
			topform = new parent.toplevelform ({
				pkname: da_pkfield
				, pktabla: da_pktabla
				, tabla: da_tabla
				,fromDB: da_descripcion
				,custom_buttons_code: da_custom_buttons
				,vinculada_pkname: da_id_madre
				,vinculada_fkname: vinculada_fkname
				,vinculada: da_ids_hijas
				,da_ids_relacionantes: da_ids_relacionantes
				,da_nombres_relacionantes: da_nombres_relacionantes
				,da_nombre_hijas: da_nombre_hijas
				,da_id: da_id
				,vinculada_name: vinculada_madre_name
				,da_areamadre: da_areamadre
				,da_nivel: da_nivel
				,orderindexListado: orderindexListado
				,da_pktabla_madre: da_pktabla_madre
				,da_pkfield_madre: da_pkfield_madre
				,callback_save: da_callback_save
				,callback_load: da_callback_load
				, css : da_perfiles
			})

			topform.$container.addClass(da_perfiles).attr('da_orderindexListado',da_orderindexListado).attr('da_perfiles_excluidos',da_perfiles_excluidos).attr('tiene_columna_dbh_perfiles_excluidos',tiene_columna_dbh_perfiles_excluidos)
			//$('.listadoCuerpoContainer[da_id="'+da_id+'"] #listadoOrderByDesc').val(ascdesc)
//			console.log( da_id )
//			console.log( ascdesc )
		}
	})
		var t1 = performance.now();

  DBH.consola( "topform " + da_id + " Time: " + (t1 - t0) + " milliseconds.")


	//var sqlll = "SELECT case when (COL_LENGTH(da_pktabla,'dbh_perfiles_admitidos_xreg') is null ) then '0' else '1' end as tiene_columna_dbh_perfiles_excluidos,(select a.da_pkfield from DBH_AREAS as a where a.da_id = b.da_areamadre ) as pkmadre,(select a.da_perfiles from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_perfiles_madre,* FROM DBH_AREAS as b WHERE da_nivel = 2 and da_activa = 1 and (select da_activa from DBH_AREAS where da_id=b.da_areamadre ) = '1' AND da_areamadre = "+da_id+" order by da_orderindex"
	//r = parent.sqlExec ( sqlll )
	let da_ids_hijas = dbhQuery ('areas').search({da_areamadre:da_id,da_nivel:'2'})
	, idsHijas = []
	da_ids_hijas.forEach ( hijaObj => {
		idsHijas.push (hijaObj.da_id)
		//console.log(hijaObj)
	})
	//console.log(da_ids_hijas.toString())
	r = dbhQuery ( 'areas' ).filter(idsHijas.toString())
	//console.log(r)
	//r = dbhQuery ( 'inlineform-data' ).filter(da_id)
//console.log(r)
	$(r).each ( function () {
		var da_tabla = $(this).find('[fieldname="da_tabla"]').text().toLowerCase()
		, da_pktabla = $(this).find('[fieldname="da_pktabla"]').text().toLowerCase()
		, da_id = $(this).find('[fieldname="da_id"]').text().toLowerCase()
		, da_pkfield = $(this).find('[fieldname="da_pkfield"]').text().toLowerCase()
		, da_fkfield = $(this).find('[fieldname="da_fkfield"]').text().toLowerCase()
		, da_orderindexListado = $(this).find('[fieldname="da_orderindexlistado"]').text().toLowerCase()
		, ascdesc = ( da_orderindexListado < 0 || ! da_orderindexListado ) ? 'desc' : 'asc'
		, orderindexListado = da_orderindexListado
		, da_descripcion = $(this).find('[fieldname="da_descripcion"]').text().toLowerCase()
		, da_areamadre = $(this).find('[fieldname="da_areamadre"]').text().toLowerCase()
		, da_areamadrastra = $(this).find('[fieldname="da_areamadrastra"]').text().toLowerCase()
		, da_perfiles = $(this).find('[fieldname="da_perfiles"]').text()
		, da_perfiles_excluidos = $(this).find('[fieldname="da_perfiles_excluidos"]').text()
		, tiene_columna_dbh_perfiles_excluidos = $(this).find('[fieldname="tiene_columna_dbh_perfiles_excluidos"]').text()
		, da_perfiles_madre = $(this).find('[fieldname="da_perfiles_madre"]').text()
		, da_fkfield_areamadre = $(this).find('[fieldname="da_fkfield_areamadre"]').text()
		, pkmadre = $(this).find('[fieldname="pkmadre"]').text().toLowerCase()
		, pkmadre = pkmadre.substring(pkmadre.indexOf('.')+1)
		, $topcontainer = $('.formCuerpo[pkname="'+pkmadre+'"]')
		, topformxx = $topcontainer.data('topform')
		, $tempfieldhija = $('<div class="'+da_perfiles+'"/>')
		, $tempfieldmadre = $('<div class="'+da_perfiles_madre+'"/>')
		, files = $tempfieldhija.hasClass('data-files')
		if ( ! $tempfieldhija.is ( config_usu_perfil ) && ! $tempfieldmadre.is ( config_usu_perfil ) ) {
//			console.log(da_descripcion)
			//function loadInlineform () {
				var seguimientoinlineform = parent.inlineform2_objpar( {
					'tablapkfkArr':[da_pktabla, da_pkfield, da_fkfield],
					'$fkformfield':topformxx.$fkformfield,
					'customview':da_tabla,
					'files':1,
					'blockButton': da_descripcion,
					'$topcontainer': $topcontainer
					,orderBy: orderindexListado
					,da_id: da_id
					,da_areamadre: da_areamadre
					,da_areamadrastra: da_areamadrastra
					,fkname: da_fkfield
					,da_fkfield_areamadre: da_fkfield_areamadre
				} )
				var $camposinlineform = seguimientoinlineform.$divinsertform.find('.inputText.listado-show')
				//console.log($camposinlineform.length)
				$camposinlineform.each( function (i) {
					var $campo = $(this)
					//console.log(i+'**'+$campo[0].id)
					var $lab = $campo.closest('.divCampoForm').find('label')
					seguimientoinlineform.addcolumn ( $lab[0],topform )
				})
			//}
			//var seguimientoinlineform = undefined

		}
	})
	//function end() {
		var t0 = performance.now();
		topform.toptabs()
		if(!this.alreadyinit){
			init()
			this.alreadyinit = true
		}
		var t1 = performance.now();DBH.consola( "topformtabs and init() " + da_id + " Time: " + (t1 - t0) + " milliseconds.")
		return topform.$container
	//}
	//setTimeout (end,0)
	//end()
}
function init(){
	parent.ajustarAnchoForm()
	vars.init()
}
function showtip(n){
	var tt=document.getElementById('tiptext')
	var ttl=document.getElementById('tiptitle')
	var arrtips=new Array()
	arrtips[0]='Se pueden utilizar operadores l&oacute;gicos (AND, OR, NOT) en combinaci&oacute;n con el delimitador de cadenas de texto (") para buscar por cualquier campo del WDH (Web Database Hunter).<br><br>Por ejemplo puedes buscar en el campo Producto por:<br><b>( ( "r.c." OR "rc" ) AND ( "mercancia" ) ) NOT "rco"</b><br>para encontrar p&oacute;lizas que sean del producto R.C. mercancia pero no Rco.'
	arrtips[1]='El caracter % es un comod&iacute;n que significa "cualquier grupo de caracteres".<br><br>Por lo tanto,<br><b>r.c.%peligrosa</b><br>buscar&aacute;<br>[cualquier texto]+"r.c."+[cualquier texto]+"peligrosa"+[cualquier texto]'
	arrtips[2]='Los campos num&eacute;ricos y de fecha admiten los operadores<br>= (igual), > (mayor), < (menor), >= (mayor o igual), <= (menor o igual) y <> (distinto).<br><br>En un campo num&eacute;rico puedes buscar:<br><b>">=400" AND "<=600"</b><br>para localizar registros que tengan ese campo comprendido entre los valores 400 y 600.<br><br>As&iacute; mismo, en un campo de fecha, puedes buscar:<br><b>">31/12/2010" AND "<1/1/2011"</b><br>para localizar los registros del a&ntilde;o 2011.'
	arrtips[3]='Puede tener varias instancias de WDH (Web Database Hunter) abiertas a la vez en distintas pesta&ntilde;as del navegador.'
	arrtips[4]='Presione F5 para recargar toda la aplicaci&oacute;n.'
	arrtips[5]='Puede buscar por cualquiera de los campos del formulario.'
	arrtips[6]='Puede hacer click en los t&iacute;tulos de las columnas del listado (a la derecha) para ordenarlo por ese campo. Otro click lo ordenar&aacute; en sentido descendente.'
	arrtips[7]='Arrastre la divisi&oacute;n entre el listado y el formulario para redimensionar el espacio de trabajo.'
	arrtips[8]='Con <a href="https://www.google.com/intl/es/chrome/browser/?hl=es" target="_blank">Google Chrome&reg;</a> trabajar&aacute;s m&aacute;s r&aacute;pido y con mejor visualizaci&oacute;n.'
	arrtips[9]='Lista de abreviaturas del mes para filtrado:<br><br>jan<br>feb<br>mar<br>apr<br>may<br>jun<br>jul<br>aug<br>sep<br>oct<br>nov<br>dic'
	arrtips[10]='Haga doble click sobre una palabra para seleccionarla.'
	arrtips[11]='Haga triple click en un campo para seleccionar todo su contenido.'
	arrtips[12]='<img src="customcode/DBH Cap2 Diagram.png">'
	arrtips[14]="<b>FUNCIONES SQL</b><br>dbo.DBH_fecha (5/11/2010,'diaymes') devolverá el texto '5 de noviembre'<br>dbo.DBH_fecha (5/11/2010,'diasvto') devolverá el número '10' si la fecha de hoy fuera 15/11/aaaa<br>day (5/11/2010) devolverá el número '5'<br>month (5/11/2010) devolverá el número '11'<br>year (5/11/2010) devolverá el número '2010'<br>getdate() devuelve la fecha actual del sistema."
	arrtips[15]='<b>TUTORIALES EN VIDEO</b><br><a target="_blank" href="https://www.youtube.com/watch?v=q93BYMnk4yU&list=PLv_o1iWt6zdMtvBO6nVcpYV94-2nyDe_s">Capítulo 1. Introducción y funcionalidades más generales.</a><br><a target="_blank" href="https://www.youtube.com/watch?v=JS6shNrVrns&list=PLv_o1iWt6zdMtvBO6nVcpYV94-2nyDe_s&index=2">Capítulo 2. Expresiones de filtrado.</a><br><a target="_blank" href="https://www.youtube.com/watch?v=zxIM6Zi7kNk&list=PLv_o1iWt6zdMtvBO6nVcpYV94-2nyDe_s&index=3">Capítulo 3. Relación Padres - Hijos.</a><br><a target="_blank" href="https://www.youtube.com/watch?v=MUDt6Runzg0&list=PLv_o1iWt6zdMtvBO6nVcpYV94-2nyDe_s&index=4">Capítulo 4. Áreas vinculadas y filtros memorizados.</a>'
	var $html = $('<div><div style="width:50%;float:left"><ul></ul></div><div style="width:50%;float:left"><ul></ul></div></div>')
	, $lista1 = $html.find('ul').eq(0)
	, $lista2 = $html.find('ul').eq(1)
	$html.prepend('<div style="float:none;clear:both;width:100%;text-transform:uppercase"><b>Operadores y Comodines para expresiones lógicas de filtrado</b></div>')
	$html.find('ul').css({'list-style-type': 'none','margin':0,'padding':0})
	$lista1.append('<li><b>Comparación</b></li>')
	$lista1.append('<li>=&nbsp;|igual</li>')
	$lista1.append('<li><&nbsp;|menor</li>')
	$lista1.append('<li>>&nbsp;|mayor</li>')
	$lista1.append('<li><=&nbsp;|menor o igual</li>')
	$lista1.append('<li>>=&nbsp;|mayor o igual</li>')
	$lista1.append('<li><>&nbsp;|distinto</li>')
	$lista1.append('<li>&nbsp;</li>')
	$lista1.append('<li><b>Lógicos</b></li>')
	$lista1.append('<li>AND |y</li>')
	$lista1.append('<li>&nbsp;OR |o</li>')
	$lista1.append('<li>NOT |no</li>')
	$lista2.append('<li><b>Comodines</b></li>')
	$lista2.append('<li>_ |guión bajo. Un caracter cualquiera.</li>')
	$lista2.append('<li>% |porcentaje. Cualquier conjunto de caracteres.</li>')
	$lista2.append('<li>_% |guión bajo + porcentaje. Uno o más caracteres.</li>')
	$lista2.append('<li>"" |comillas dobles. Que esté vacío.</li>')
	$lista2.append('<li>&nbsp;</li>')
	$lista2.append('<li><b>Agrupación</b></li>')
	$lista2.append('<li>"" |comillas dobles. Indica operando de expresión lógica.</li>')
	$lista2.append('<li>() |paréntesis. Agrupa expresiones lógicas para determinar el orden de evaluación.</li>')
	$html.find('li').css({'list-style-type': 'none','margin':0,'padding':0,'border':'0px solid black'})
	var txt = $html[0].innerHTML.toString()
	arrtips[13]=txt
	var ntips=arrtips.length-1
	//if(n=="rnd")tipelegida=redondear(ntips*Math.random(),0)
	if(n=="rnd")tipelegida=15
	if(n=="+1")tipelegida=(tipelegida+1)>ntips?0:(tipelegida+1)
	if(n=="-1")tipelegida=(tipelegida-1)<0?ntips:(tipelegida-1)
	tt.innerHTML=formathtml(arrtips[tipelegida])
	ttl.innerHTML="Tip " + (tipelegida+1) + " de " + (ntips+1)
	//setTipTop()
}
function setTipTop(){
	var td=document.getElementById('tipdiv')
	var h=(document.getElementsByTagName('body')[0].offsetHeight*1-td.offsetHeight)
	td.style.top=h+'px'
}
function onresizef(){
	ajustarAnchoEncabezados()
	//ajustarAlturaListado()
	//DBH.tree.setWidth()
	//setTimeout(function(){ajustarAnchoEncabezados()},100)
	//setTimeout(function(){DBH.tree.setWidth()},100)
  //ajustarAnchoForm();
}
function navegarArea(da_id){
	switchiframes( $('#treemenu li[da_id="'+da_id+'"]') )
}
function switchiframes(areanumber,listadoWhere,listadoWhereText,$container){
	//DBH.process.switcharea = true
	if( !$('.formCuerpo[da_id="'+$(areanumber).attr('da_id')+'"]').length ){
		//$('#divteloninit').show()
		DBH.telon.show()
		DBH.telon.texto.append('Generando el Área...')
	}else{
		mostrarTelon(1)
	}
	setTimeout(function(){switchiframes_real(areanumber,listadoWhere,listadoWhereText,$container)},200)
}
function switchiframes_real (areanumber,listadoWhere,listadoWhereText,$container) {
	var t0 = performance.now();
	var da_id = $(areanumber).attr('da_id')
	, $container = $('.formCuerpo[da_id="'+da_id+'"]')
	, alreadyLoaded = $container.length
	//debugger
	var iframe = alreadyLoaded ? $container : loadTopForms(da_id)
	, $mp = $('#menuPrincipal .menu1Opcion')
	, areanumber = isNaN ( areanumber) ? $mp.index($(areanumber)) : areanumber
	var t1 = performance.now();DBH.consola( "loadform: " + (t1 - t0) + " milliseconds.")
		var t0 = performance.now();
	$mp.removeClass('menu1OpcionSeleccionada')
	$mp.eq(areanumber).addClass('menu1OpcionSeleccionada')
	$('.divCabeceraEtiqueta')
		.hide()
		.attr('id','')
		.filter('[da_id="'+da_id+'"]').attr('id','divCabeceraEtiqueta').show()
	$('.botones_principales,.dbh-listado-etiqueta,.form-toolbar,.list-toolbar')
		.hide()
		.filter('[da_id="'+da_id+'"]').show()
	var iframes = $('#celdaforms>div')
	, $listados = $('.listadoCuerpoContainer')
	, da_id = iframe.attr('da_id')
	, areaname = iframe.attr('name')
	, $listado = $listados.filter('[da_id="'+da_id+'"]')
	$('title').html(areaname)
	var t3 = performance.now();
	if ( !iframe.attr ( 'alreadyopened') ) {var firstopen = 1;programarSelectGrupo(iframe)}
	var t4 = performance.now();DBH.consola( "programarSelectGrupo: " + (t4 - t3) + " milliseconds.")
	iframes
		.hide()
		.attr ( 'id' , '' )
	iframe
		.show()
		.attr ( 'id', 'iframeFormCuerpo' )
		.attr ( 'alreadyopened', 1 )
		.data('topform').show()
	$listados
		.hide()
		.attr('id','')
		.find('*').each(function(){var id = this.id; if  (id ) this.id = 'aaaa'+id})
	$listado
		.show()
		.attr('id','listadoCuerpoContainer')
		.find('*').each(function(){var id = this.id; if  (id ) this.id = id.replace(/aaaa/gi,'');})
	var checkedids = $('#checkedids').val()
	listado.get  ( 'checkedids' ) // borro el array checkedids
	if ( checkedids != '' ) {
		listado.get  ( 'checkedids', checkedids )
	}
	$('#iframeFormCabecera').show()
	var haywhere = ( typeof listadoWhere == 'string' )
	, callback = typeof listadoWhere == 'function' ? listadoWhere : 0
	, listadoWhere = callback ? '' : listadoWhere
	if ( ! switchiframes_real.stopReset && ( $('#numregs').val() == '' || haywhere ) ) {
		//console.log(listadoWhere)
		//console.log('resetea liatado')
		iframe.data('topform').resetListado(listadoWhere,listadoWhereText)
	}
	switchiframes_real.stopReset = 0
	$('#alimentador').trigger('vistas:list:changed')
	ajustarAnchoForm(1)
	if ( ! iframe.find('.multicolumn-column').length ) iframe.data('topform').multicolumns(1)
	$('#tableCuerpos').css('visibility','visible')
	iframe.data('topform').sortableColumns()
	$(document).trigger('area:on:navigate')
	var t1 = performance.now();DBH.consola( "switchIframes: " + (t1 - t0) + " milliseconds.")

}
function invalidarCampo(campo){
	//campo.oldbgcolor=campo.style.backgroundColor
	//campo.style.backgroundColor='tomato'
	//$(campo).addClass('validation-notvalid')
	$(campo).closest('.divCampoForm').addClass('validation-notvalid')
	$(campo).on ( 'keydown', function(){$(this).closest('.divCampoForm').removeClass('validation-notvalid')} )
	$(campo).on ( 'change', function(){$(this).closest('.divCampoForm').removeClass('validation-notvalid')} )
}
function menu1Resaltar(opcion,estado){
	if(opcion.className=="menu1OpcionSeleccionada")return false
	if(estado==1){
		$(opcion).addClass("menu1OpcionResaltada")
	}else{
		$(opcion).removeClass("menu1OpcionResaltada")
	}
}
function menu1Seleccionar(opcion,opciones){
	menu1Limpiar(opciones)
	//opcion.className="menu1OpcionSeleccionada"
	$(opcion).addClass('menu1OpcionSeleccionada')
}
function menu2Seleccionar(opcion){
  document.getElementById('iframeFormCabecera').contentWindow.menu2Seleccionar(opcion)
}
function menu1Limpiar(opciones){
		$(opciones).removeClass('menu1OpcionSeleccionada')
    //opciones[i].seleccionada=0

}
function menu2Resaltar(opcion,estado){
	if(opcion.seleccionada==1)return false
	if(estado==1){
		opcion.resaltada=1
		opcion.className="menu1OpcionResaltada"
	}else{
		opcion.resaltada=0
		opcion.className="menu1Opcion"
	}
}
function menu2Limpiar(opciones){
	for(var i=0;i<opciones.length;i++){
	  opciones[i].className="menu1Opcion"
    opciones[i].seleccionada=0
	}
}
function camposValidos(c,campos){
  for(var i=0;i<campos.length;i++){
  	if(c.toLowerCase()==campos[i])return true
  }
  return false
}
function setFieldsMaxlength(doc,sql,campos){
  var respuesta=ajaxExecuter('selectXML.asp',"sql="+escape(sql),0)
  var xmlDoc=loadXMLString(unescape(respuesta))
  if(!xmlDoc.getElementsByTagName("registro")[0])return false
  var hijos=xmlDoc.getElementsByTagName("registro")[0].childNodes;
	for ( var i = 0; i < hijos.length ; i++ ) {
		var nombreCampo = hijos[i].tagName
		if ( camposValidos ( nombreCampo,campos ) ) {
		  var valorCampo = unescape( (document.all)?hijos[i].text:hijos[i].textContent )
		  var campo = eval ( "doc.getElementById('" + nombreCampo + "')" )
		  if ( nombreCampo != "" && campo ) {
		  	var size=hijos[i].getAttribute("size")
		    campo.maxLength=size
		  }
		}
	}
}
function loadForm(doc,sql,campos,db){
//console.log(doc+sql+campos+db)
  if(typeof db == "undefined" ) var db = ""
  var xmlDoc=ajaxExecuter('selectXML_new.asp',"sql="+escape(sql)+"&db="+db ,0)
  if(!xmlDoc.getElementsByTagName("registro")[0])return false
  var hijos=xmlDoc.getElementsByTagName("registro")[0].childNodes;
	for ( var i = 0; i < hijos.length ; i++ ) {
		//var nombreCampo = hijos[i].tagName
		var nombreCampo = $(hijos[i]).attr('fieldname')
		if ( camposValidos ( nombreCampo,campos ) ) {
		  var valorCampo = unescape( hijos[i].textContent )
		  var tipoCampo = hijos[i].getAttribute("tipo")
		  if (tipoCampo<10&&tipoCampo>3) valorCampo=separarMiles(valorCampo,".")//Si el campo es númerico pero no entero (3) para que no formatee los ids.
		  var campo = eval ( "doc.getElementById('" + nombreCampo + "')" )
		  if ( nombreCampo != "" && campo ) {
		    campo.value = valorCampo
			//alert(campo+valorCampo)
		    //campo.title = valorCampo
		    campo.oldValue = valorCampo
		    if(campo.tagName=="TEXTAREA")setTextareaHeight(campo)
		  }
		}
	}
	$(multistatebuttons_elements).each(function(){this.setcss()})

}
function loadForm2(doc,sql,campos){
  var respuesta=ajaxExecuter('selectXML.asp',"sql="+escape(sql),1)
  //alert(unescape(respuesta))
  var xmlDoc=loadXMLString(unescape(respuesta))
  var hijos=xmlDoc.getElementsByTagName("registro")[0].childNodes;
	for ( var i = 0; i < hijos.length ; i++ ) {
		//var nombreCampo = hijos[i].tagName
		var nombreCampo = $(hijos[i]).attr('fieldname')
		if ( camposValidos ( nombreCampo,campos ) ) {
		  var valorCampo = unescape( (document.all)?hijos[i].text:hijos[i].textContent )
		  var campo = eval ( "doc.getElementById('" + nombreCampo + "')" )
		  if ( nombreCampo != "" && campo ) {
		    campo.value = valorCampo
		    campo.oldValue = valorCampo
		  }
		}
	}
}
function saveForm(doc,campos,tabla,pk){
	var parametros=""
	var valor=""
	for(var i=0;i<campos.length;i++){
		campo=doc.getElementById(campos[i])
		valor = campo.value
		//campo.title=campo.value
		campo.oldValue=campo.value
		if(valor!=""){valor=valor.replace(/''/g,"'");valor=valor.replace(/'/g,"''")}
		valor=encodeURIComponent(valor)
		parametros=parametros + campos[i] + "=" + valor + "&"
	}
	parametros=parametros+"tabla="+tabla+"&pk="+pk
	var resul=ajaxExecuter('formUpdate.asp',(parametros),0)
	if (resul!=null) {
		alert("La operacion 'Guardar' ha fallado para la tabla '" + tabla + "'" )
	}
	return resul
	//loadForm(doc,'SELECT * FROM clientes WHERE idCliente='+idd,campos)
}
function load$listas($listas,sql){
	var $lista = $listas.eq(0)
	, lista = $lista[0]
	, value = $lista.val()
	loadLista(lista,sql)
	$lista.val(value)
	//$listas.remove($lista)
	$listas.not($lista).each(function(){
		var $listatwin = $(this)
		, value = $listatwin.val()
		$listatwin.html($lista.html())
		if(value){
			$listatwin.val(value)
		} else {
			this.selectedIndex = -1
		}
	})
}
function loadLista(lista,sql,valueFieldName,textFieldName,db,dataFieldName){
	if ( lista.tagName != 'SELECT' ) return
	//console.log(typeof sql)
	if(sql.indexOf('{')!=-1){
		var json = $.parseJSON(sql)
		, customview = json.tabla
		, sql = json.sql
	} else {
		var customview=sql.toLowerCase().split("from")[1]
		, customview=trim(customview).split(" ")[0]
	}
	var tiene_columna_dbh_perfiles_excluidos = $('.formCuerpo:visible').attr('tiene_columna_dbh_perfiles_excluidos') * 1
	, usu_perfiles_admitidos=sessionStorage["usu_perfiles_admitidos"]//('')
	, sql = sql.toLowerCase()
	, dbh_perfiles_excluidos_condicion = ''
	, sqlarr = sql.split("order")
	, order_condition = sqlarr[1] ? ' order ' + sqlarr[1] : ''

	/* LIMITA CONTENIDO DE LAS LISTAS DESPLEGABLES SEGÚN PERFIL */
	/*
	if (tiene_columna_dbh_perfiles_excluidos && usu_perfiles_admitidos != '') {
		var config_usu_perfil_arr = usu_perfiles_admitidos.split(" ")
		$(config_usu_perfil_arr).each(function(){
			dbh_perfiles_excluidos_condicion += "(' '+COALESCE(" + customview + ".dbh_perfiles_admitidos_xreg ,'')+' ') LIKE ('% " + this.replace(".","") + " %') OR "
		})
		if(sql.indexOf('where')==-1){
			dbh_perfiles_excluidos_condicion = " WHERE (" + dbh_perfiles_excluidos_condicion + " 1=2 )"
		} else {
			dbh_perfiles_excluidos_condicion = " AND (" + dbh_perfiles_excluidos_condicion + " 1=2 )"
		}

	}
	*/

	sql = sqlarr[0] + dbh_perfiles_excluidos_condicion + order_condition
	var regs=sqlExec(sql,0,db)
	if ( regs == null ) return false
	var hijos=regs;
	if(lista==null||!lista.options){
		console.log( 'ERROR EN loadLista() llamda por ' + arguments.callee.caller.name );
		console.log('Lista: ' + lista.id + '. Error in index.js. Sql: '+sql+'\n'+valueFieldName)
	}
	lista.options.length = 0
	lista.options[0]=new Option("", "", true, false)
	var valor,texto,hijo
	for ( var i = 0; i < hijos.length ; i++ ) {
		hijo = hijos[i]
		if ( valueFieldName ) {
			valor = $(hijo).find('[fieldname="' + valueFieldName + '"]').text()
			texto = $(hijo).find('[fieldname="' + textFieldName + '"]').text()
		}else{
			valor = $(hijo).children()[0].textContent
			texto = $(hijo).children()[1].textContent
		}
		valor = unescape(valor)
		texto = unescape(texto)
		lista.options[i+1]=new Option(texto, valor, true, false)
		if ( $(hijo).children()[2] ) {
			data = unescape($(hijo).children()[2].textContent)
			$(lista.options[i+1]).attr('data_loadLista',data)
		}
	}
	lista.selectedIndex = -1
}
function arrayFromXml(xml,controlDeErrores){
  if(xml==""||xml=="<xml></xml>")return ""
  if(xml.substr(0,4)!="<xml"){alert('Se ha producido un error en al sentencia:\n\n'+xml);return "error"}
  var xmlDoc=loadXMLString(unescape(xml))
  var registros=xmlDoc.getElementsByTagName("xml")[0].childNodes;
  var noRegistros=registros.length
  var noCampos=registros[0].childNodes.length
  var tableArray = new Array(noRegistros)
  for (var i = 0; i < tableArray.length; i++){tableArray [i] = new Array(noCampos)}
	var valorCampo,registro,campos,campo
	for ( var i = 0; i < registros.length ; i++ ) {
		registro = registros[i]
		campos  = registro.childNodes
		for ( var j = 0 ; j < campos.length ; j++ ) {
			campo = campos[j]
			valorCampo = (document.all)?campo.text:campo.textContent
		  tableArray[i][j]=(valorCampo.length)>0?valorCampo:""
		  //alert("["+j+","+i+"]"+tableArray[j,i])
		}
	}
	//alert(tableArray.length)
	return tableArray
}
function xmlArray(xml,controlDeErrores,o){
  if(xml==""||xml=="<xml></xml>")return ""
  if(xml.substr(0,4)!="<xml"){if(!o)showError(xml);return "error"}
  var xmlDoc=loadXMLString(unescape(xml))
  var registros=xmlDoc.getElementsByTagName("xml")[0].childNodes;
  return registros
}
function loadSqlTable(sql,controlDeErrores,o,db){
  var param = "sql="+encodeURIComponent(sql)
  if ( typeof db != "undefined" ) param += "&db=vs"
  var xmlDoc=ajaxExecuter("selectXML.asp",param,controlDeErrores)
  if ( xmlDoc == null ) return ''
  var registros=xmlDoc.getElementsByTagName("xml")[0].childNodes;
  return registros
}
function showError(err,sql){
	var diverror=document.getElementById('diverror')
	var diverrortexto=document.getElementById('diverrortexto')
	var diverrorparametros=document.getElementById('diverrorparametros')
	diverrortexto.innerHTML=err
	diverrorparametros.innerHTML=sql
	diverror.style.display="block"
}
function arrastrar ( a, capa ) {
	if ( a ) {
	  capa.style.width = "600"
	  capa.style.left = event.clientX - 300
	  capa.onmousemove = function(){grabCursorPosition(this)}
	} else {
	  capa.onmousemove = ""
	  capa.style.left = event.clientX - 2
	  capa.style.width = "4"
	}
}
function grabCursorPosition (capa) {
	x = event.clientX
	y = event.clientY
	document.getElementById ("tableleft").style.width = x+10
	capa.style.left = x-300
	//divIframeAlertasValidaciones.style.left = x
}
function reemplazarVocales(txt){
	return txt
}
function verficha(idCliente){
	irA('viewListadoClientes','clientesForm.asp?idcliente='+idCliente,'Nombre','Tel&eacute;fono','Empresa','Puesto','','',document.getElementById('div_opcionClientes'))
  //irA('viewListadoClientes','clientesForm.asp?idcliente='+idCliente,'Nombre','Tel&eacute;fono','C.P.','Poblaci&oacute;n','','',parent.document.getElementById('div_opcionClientes'))
	var cb=document.getElementById('verFormulario');
	cb.checked=0;verFormulario(1);
	document.getElementById('tablelistado').style.display='block'
}
function eliminarAcentos(txt){
	txt=txt.replace(/a/gi,"[a,\u00e1]")
	txt=txt.replace(/e/gi,"[e,\u00e9]")
	txt=txt.replace(/i/gi,"[i,\u00ed]")
	txt=txt.replace(/o/gi,"[o,\u00f3]")
	txt=txt.replace(/u/gi,"[u,\u00fa]")
	txt=txt.replace(/n/gi,"[n,\u00f1]")
	return txt
}
function mostrarTelon(p){
	$('.msggenerandoarea').remove()
	//$('#divteloninit').hide()
	var $telon = $('#divtelon')
	if(p==0){
		$telon.fadeOut(100)
	}else{
		$telon.show()
	}
}
function setInputHeight(inp){
	inp.style.height=0
	var hcv=inp.scrollHeight*1+5
	inp.style.height=hcv
}
function scrollDivision(x,event){
	//ajustarAnchoEncabezados()
	return false //OBSOLETO
	if(typeof scrollingDivision=="undefined"||(!scrollingDivision&&isNaN(x)))return false
//	console.log('a')
	var tableleft = document.getElementById('tableleft')
	var tableright = document.getElementById('tableright')
	var ifr = document.getElementById('iframeFormCuerpo') == null ? $('#celdaforms>div')[0] : document.getElementById('iframeFormCuerpo')
	var ifr2 = document.getElementById('iframeFormCabecera')
	var ifrListado = document.getElementById('iframeListadoCuerpo')
	var div = document.getElementById('divScrollDivision')
	if(typeof x!="undefined"){
		var divcte=-3+$('#treeresizable').outerWidth()
	  var esUserScroll=0
  }else{
  	//x=(window.event) ? window.event.x : event.clientX
	var x = event.pageX-$('#treeresizable').outerWidth()
  	var divcte=-303+$('#treeresizable').outerWidth()
	  var esUserScroll=1
  }
  if ( x > 400 ) {
	ifr.style.width=x
	ifr2.style.width=x
	ifrListado.style.width=document.getElementsByTagName("body")[0].offsetWidth-x-0
	tableleft.style.width=(x-0)+'px'
	tableleft.style.maxWidth=(x-0)+'px'
	div.style.left=(x+divcte)+'px'
  }
  setTimeout(function(){ajustarAnchoEncabezados()},100)
	if(esUserScroll)ajustarAnchoForm()
}
function ajustarProporcionFormListado(){
}
function ajustarAnchoForm(o){
	return false //OBSOLETO
	var $ifrListado = $('div[id="iframeListadoCuerpo"]:visible')
	var d=document.getElementById('divaux')
	var t=""
	var anchototaldisponible=document.getElementsByTagName("body")[0].offsetWidth //- $('#treemenu').outerWidth()
	var anchototaldisponible=$("body").outerWidth()- $('#treeresizable').outerWidth()
//	console.log(anchototaldisponible)
	var tableleftwidth=document.getElementById('tableleft').style.maxWidth
	tableleftwidth=tableleftwidth.substr(0,tableleftwidth.length-2)
	//tableleftwidth=tableleftwidth
	var tableleftwidth = $('#tableleft').outerWidth()
	//console.log(tableleftwidth)
	var anchodisponiblederecha=anchototaldisponible-( $('#tableleft').is(':visible') ? tableleftwidth : 0 )
	t+=new Date().toString()+"<br><br>"
	t+="body.offsetWidth = " + document.getElementsByTagName("body")[0].offsetWidth + "<br><br>"
	t+="tableleft.style.maxWidth = " + tableleftwidth + "<br><br>"
	t+="anchodisponiblederecha = " + anchodisponiblederecha  + "<br><br>"
	d.innerHTML=t
	$('.celdaaffectedby_ajustarAnchoForm').width(tableleftwidth)
	$('#celdaforms').width(tableleftwidth)
	$ifrListado.width(anchodisponiblederecha)
	$('#divlist').add('#divInfoWhere').width(anchodisponiblederecha)
	ajustarAlturaListado()
	ajustarAnchoEncabezados()
	if (!o) mostrarTelon(0)
}
function clearDocumentAlerts(d){
	var area = DBH.area()
	, $container = area.topform.$container
	$container.find('.validation-notvalid').removeClass('validation-notvalid')
	  $('[id="buttonsave"]:visible').removeClass('unsaved')
	  area.unsaved = 0
	  $(vars.dialog).removeAttr('pkvalue')
	  $container.find('label').attr('title','').removeClass('filter-locked')
}
function esAreaClientes(){
	var loc=document.getElementById('iframeFormCuerpo').contentWindow.location.toString().split("/")
	if(loc[loc.length-1]=="clientesForm.asp")return true
	return false
}
function saveScreenProportions(){
	return false
	var esUserScroll=typeof x!="undefined"?0:1
  if(esUserScroll&&document.getElementById('iframeFormCuerpo').contentWindow.multiframe)document.getElementById('iframeFormCuerpo').contentWindow.multiframe()
	var ifr = document.getElementById('iframeFormCuerpo')
	var idusuario=sessionStorage["usu_id"]//('usu_id')
	if(esAreaClientes()){
	  var sql="update usuarios set divisionOffsetLeft="+(ifr.offsetWidth)+" WHERE idusuario="+idusuario
	}else{
	  var sql="update usuarios set divisionOffsetLeft2="+(ifr.offsetWidth)+" WHERE idusuario="+idusuario
	}
  loadSqlTable(sql,0)
}
function divtoolsonmouseout(){
	var div=document.getElementById("divtools")
	var body=document.getElementsByTagName("body")[0]
	if(window.event.target!=div)return false
	var rt=window.event.relatedTarget
	do{
		rt=rt.parentNode
		if(rt==div)return false
		if(rt==body)break
	}while(1==1);
	div.style.display='none'
}
function contextHelp_unused(obj,txt){
	$(obj).attr ( 'title' , txt )
	return
	var div=document.getElementById('contextHelper')
	if(txt==""){div.style.display="none";return false}
	div.innerHTML=txt
	div.style.left=(obj.offsetLeft+0)+'px'
	div.style.top=(obj.offsetTop+120)+'px'
	//$(div).offset({top:$(obj).offset().top-150,left:$(obj).offset().left-180})
	div.style.display='block'
	//$(div).css ('position','relative')
	$(obj).append ($(div))
}
function helpText(tipo){
	var t=""
	, textfilter = '\n\nComercio\n\n"comercio" OR "transporte"\n\n"transporte" AND NOT "mercancias"'
	if(tipo=="fecha")t='Ejemplos de filtrado sobre campos de fecha:\n\n2010\n\nnov\n\nnov%2010\n\n"=15/3/2011"\n\n(">=1/1/2010" AND "<1/4/2011") OR (">=1/7/2010" AND "<1/10/2011")'
	if(tipo=="numero")t='Ejemplos de filtrado sobre campos numéricos:\n\n"=400.81"\n\n">=400" AND "<=600"' + textfilter
	if(tipo=="texto")t='Ejemplos de filtrado sobre campos de texto:' + textfilter
	if(tipo=="select")t='Ejemplos de filtrado sobre campos de lista desplegable:\n\nSeleccione un valor de la lista.\n\nHaciendo doble click puede utilizar:' + textfilter
	if(tipo=="bit")t='Ejemplos de filtrado sobre campos Si/No:\n\nSeleccione un valor de la lista.\n\nHaciendo doble click puede utilizar:' + textfilter
	t+='\n\n"" (para nulos)\n\n_% (para no nulos)\n\nA%Y (para buscar cualquier contenido que empiece por A y acabe por Y)'
	return t
}
function loadInfoCreacion(idlistado,pkname){
}
function setTextareaHeight(ta){
	//console.log("ta:"+ta.id)
	//return
	if ( ta.tagName != 'TEXTAREA' || $(ta).hasClass('dbh-resizable') ) return
	var cv=document.getElementById('cv')
	ta.style.height=0
	var hcv=ta.scrollHeight*1
	//if(hcv<
	//alert(hcv)
	var corr = 2.8;
	var hh = hcv+corr
	hh = Math.round(hh)
	if ( hh < 18 ) hh = 18
	//corr = 0;
	ta.style.height=(hh)+'px'
}
function filterOnEnter(cp,event){
	tecla=(document.all)?event.keyCode:event.which;
	if(tecla==13 && !$('#iframeFormCuerpo').hasClass('topform-mode-edit')){
		DBH.recordsearch=1
		$('#iframeFormCuerpo').data('topform').filter();
		event.stopPropagation();
		event.preventDefault();
		return false
	}
}
function programarSelectGrupo ($doc) {
		var t3 = performance.now();
	programarSelects($doc)
	var t4 = performance.now();DBH.consola( "programarSelects: " + (t4 - t3) + " milliseconds.")
	//Programo los auto-blockButton
	$doc.find('.blockbutton-autocreate').each(function(){
		var $div = $(this)
		, tit = $div.attr('title')
		, isredactor = $div.hasClass('redactor')
		, $bb = $('<h4 class="boton blockbutton-div blockbutton-autocreate-button" title="' + tit + '"><span>' + tit + '</span></h4>')
		// , $container = $div.removeAttr('title').css('width','100%').addClass('takefields').wrap ( '<div class="ascendentes" style="width:100%;margin:0;padding:0;border:0px solid red"/>' ).parent()
		, $container = $div.removeAttr('title').css('width','100%').addClass('takefields').wrap('<div class="ascendentes"/>').parent()
		if(isredactor)$container.hide()
		$container.prepend($bb)
		//console.log('a')
		var bb = new parent.blockButton($bb[0],$div[0])
		//console.log(bb)
		$div.data('blockbutton',bb)
	})
	//Programa los Multistate buttons
	var $mb = $doc.find('.multistatebutton').not('.divinlineform *')
	$mb.each(function(){ var mb = new multistatebutton(this)})
	//if(!$('#switch-redactor').hasClass('boton-switch-checked'))$('[title="Redactor de consultas"]').parent().hide()
}
function programarSelects($container,sonlistas){
	if ( !sonlistas ) {
		var $listas = $container.find('[grupo!=""][grupo]')//.not('.inlineform *')
		,$listas_loadlista = $container.find('[data-sql-loadlista][data-sql-loadlista!=""]')//.not('.inlineform *')
	} else {
		var $listas = $container.filter('[grupo!=""][grupo]')
		,$listas_loadlista = $container.filter('[data-sql-loadlista][data-sql-loadlista!=""]')
	}
	/*
	var selects_listas_grupo = ''
	, selects_listas_loadlista = ''
	, grupos_cargados = []
	$listas.each(function(){
		var $lista = $(this)
		, grupo = $lista.attr('grupo')
		, sql = "SELECT li1_id,des,li1_color from DBH_LISTAS b WHERE b.grupo = '" + grupo + "'"
		, sql = sql.substring(sql.indexOf(' '))
		if(grupos_cargados.indexOf(grupo)==-1)selects_listas_grupo+="SELECT '" + grupo + "' as idlista,"+sql + " UNION ALL "
		grupos_cargados.push ( grupo )
	})
	*/

//	console.log($listas_loadlista.length)
	$listas_loadlista.each(function(){
		var $lista = $(this)
		, sql = $lista.attr('data-sql-loadlista').toLowerCase()
		, $twinlists = sonlistas ? $container.filter('[id="'+$lista.attr('id')+'"]') : $container.find('[id="'+$lista.attr('id')+'"]')
		if(($lista.find('option').length<1||sonlistas) && !$lista.hasClass('inline-search') ) {load$listas($twinlists,sql);}
	})
	//console.log(selects_listas_loadlista)
	/*
	if (selects_listas_grupo!='' ){
		selects_listas = selects_listas_grupo
		selects_listas = selects_listas.substr(0,selects_listas.length-11) + " ORDER BY 3"
		console.log(selects_listas)
		var r = ajaxExecuter('selectSelectOptions.asp','sql='+encodeURIComponent(selects_listas))
		//console.log(r)
		*/

	if ( ! DBH.$grupListsOptions ) DBH.$grupListsOptions = $()
	$listas.each(function(){
		var $lista = $(this)
		//, selectid = $lista.attr('id')
		, grupo = $lista.attr('grupo')
		, $options = DBH.$grupListsOptions.filter('[grupo="'+grupo+'"]')
		, processed = $options.length
		//, processed = 0
		//console.log(grupo+'++'+processed)
		if ( ! processed ) {
			var id = $lista.attr('id')
			, $optionLines = DBH.$valoresXml.find('[fieldname="grupo"][fieldvalue="'+grupo+'"]').parent()
			, $option = $( "<option value='' selectid='" + id + "' grupo='" + grupo + "'></option>" )
			DBH.$grupListsOptions = DBH.$grupListsOptions.add($option)
			$optionLines.each ( function () {
				var $optionLine = $(this)
				, value = $optionLine.attr('id')
				, texto = $optionLine.find('[fieldname="des"]').attr('fieldvalue')
				, color = $optionLine.find('[fieldname="li1_color"]').attr('fieldvalue')
				, $option = $( "<option value='" + value + "' selectid='" + id + "' grupo='" + grupo + "' style='background-color:" + color + "' dbh-background-color='" + color + "'>" + texto + "</option>" )
				DBH.$grupListsOptions = DBH.$grupListsOptions.add($option)
			})
			$options = DBH.$grupListsOptions.filter('[grupo="'+grupo+'"]')
		}
		//, $options = $(r).find('option[selectid="'+grupo+'"]')
		//console.log($lista.attr('id') + $options.length)
		$lista
			.html('')
			//.css({background:'red'})
			//.append('<option></option>')
			.append($options.clone())
		if ( $lista.is('.dbh_valores_color') ) DBH.valueLists($options).setColor()
	})
	//}
	programarSelectsVinculadas($container)
	var $selects_custom_onchange = $container.find('select[data_select_onchange!=""]')
	$selects_custom_onchange.each(function(){
		var $sel=$(this)
		, data_select_onchange = $sel.attr('data_select_onchange')
		$sel.on('change',function(){eval(data_select_onchange)})
	})
}
function programarSelectsVinculadas($container){
	var $listas_vinculadas_hija = $container.find('[data-select-vinculada-madre][data-select-vinculada-madre!=""]')
	, $hijasinlinerows = $container.find('.lineamodelo').not('.divinsertform').find('[data-select-vinculada-madre][data-select-vinculada-madre!=""]')
	, $hijastopyfilter = $listas_vinculadas_hija.not($hijasinlinerows)
	//$hijasinlinerows.css({'background':'red'})
	$hijasinlinerows.each(function(){
		var $hija = $(this)
		, madreid = $hija.attr('data-select-vinculada-madre')
		, $madre = $hija.closest('.divCampoForm').parent().find('[id="' + madreid + '"]' ) //for inilineform rows
		//console.log($madre.length)
		if ( ! $madre.length ) return
		//$hija.data('$madre',$madre)
		$madre.on ( 'change', function () { vars.filterSelectsHijas ( $hija ); } )
		$hija.on ( 'change', function () { if ( this.selectedIndex > 0 ) {$madre.addClass('noblank-select-vinculada') } else { $madre.removeClass('noblank-select-vinculada') } } )
		var $oldclip = $hija.parent().find('.clip')
		if ( ! $oldclip.length ) {
			var $clip = $('<div class="genericon genericon-link clip" title="Vinculada con '+$madre.attr('name')+'">&nbsp;</div>')
			$hija.before($clip)
			$hija.data('clip',$clip)
			$hija.css('width','calc(100% - 9px)' )
			$hija.parent().find('label').css('margin-left',' 9px' )
		}
	})
	$hijastopyfilter.each(function(){
		var $hija = $(this)
		, madreid = $hija.attr('data-select-vinculada-madre')
		, $madres = $container.find('[id="' + madreid + '"]' ) //for topform and inline filter form fields.
		if ( ! $madres.length )return
		$madres.on ( 'change', function () { vars.filterSelectsHijas ( $hija );$hija.prop('selectedIndex','0') } )
		$hija.on ( 'change', function () { if ( this.selectedIndex > 0 ) {$madres.addClass('noblank-select-vinculada') } else { $madres.removeClass('noblank-select-vinculada') } } )
		var $oldclip = $hija.parent().find('.clip')
		if ( ! $oldclip.length ) {
			var $clip = $('<div class="genericon genericon-link clip" title="Vinculada con '+$madres.attr('name')+'">&nbsp;</div>')
			$hija.before($clip)
			$hija.data('clip',$clip)
			//$hija.css('width','calc(100% - 10px)' )
			$hija.parent().find('label').css('margin-left',' 9px' )
		}
	})
}
function programarCampos_old(campos,container,tabla,param){
	//return
	if (campos.length == 0)return
	var doc=document
	, listadoView=tabla
	//, sql = "SELECT top 1 " + campos + " FROM "+listadoView
	//, registros=sqlExec(sql,0)
	//if(registros==null)return
	console.log(campos)
	dbhQuery ({
		fields: 'top 1' + campos
		, table: listadoView

	}).request(function(xml){
		const reg = $(xml).find('registro')[0]
		if ( !reg ) return false;
		const camposArr = reg.childNodes
		, $container = $(container)
		//, $labels = $()
		for(var i=0;i<campos.length;i++){
			var campo = $container.find('[id="'+ campos[i] + '"]')[0]
			, $campo = $(campo)
			if ( ! campo || campo == null ) { alerta ( "Error programarCampos" ); console.log ( 'campo: ' + campos[i] ) }
			if ( !param ) {
			}
			var tipo=camposArr[i].getAttribute("tipo")
			, size=camposArr[i].getAttribute("size")
			$campo.data('tipo',tipo)
			$campo.attr('data-size',size)
	//	console.log($campo)
			if ( tipo < 10 ) {
				var data_type = "number"
				$campo.attr('placeholder','0.00')
			} else if ( tipo == 135 ) {
				var data_type = "date"
				$campo.attr('placeholder','dd/mm/aaaa')
			} else {
				var data_type = "text"
			}
			$campo.addClass('data-type-' + data_type )
			$campo.addClass('data-dbtype-' + tipo )
			$container.find( 'label[for="'+ campos[i] + '"]' ).data('tipo',tipo)
		}
		console.log('Configurado form.')
	})
}
function programarCampos(campos,container,tabla,param){
	if (campos.length == 0)return
	const listadoView = tabla
	, camposRecs = window.camposJSON
	, $container = $(container)
	//console.log(campos)
	//console.log(camposRecs)
	//return
	campos.forEach ( ( campoId ) => {
		const campoArr = campoId.split('.')
		if ( campoArr.length == 2 ) {
			const tablaName = campoArr[0].toLowerCase()
			, campoName = campoArr[1].toLowerCase()
			, campoRec = camposRecs.filter  ( (campoRec) => {
				//console.log('*'+campoRec.column_name+'*')
				//console.log('*'+campoRec.table_name+'*')
				return ( campoRec.table_name.toLowerCase() == tablaName && campoRec.column_name.toLowerCase() == campoName )
			} )
			, tipo = campoRec[0].data_type
			let size = campoRec[0].character_maximum_length
			switch ( size ) {
				case '-1':
					size = 1073741823;
					break;
				case '':
					size = 2;
					break;
			}
			//console.log(campoRec)
			//console.log(tipo)
			const $campo = $container.find('[id="'+ campoId + '"]')
			if ( ! $campo.length ) { alerta ( "Error programarCampos" ); console.log ( 'campo: ' + campoId ) }
			$campo.attr('data-size',size)
	//	console.log($campo)
			if ( tipo == 'int' || tipo == 'float' ) {
				var data_type = "number"
				$campo.attr('placeholder','0.00')
			} else if ( tipo == 'datetime' || tipo == 'date' ) {
				var data_type = "date"
				$campo.attr('placeholder','dd/mm/aaaa')
			} else {
				var data_type = "text"
			}
			$campo.addClass('data-type-' + data_type )
			$campo.addClass('data-dbtype-' + tipo )
			$container.find( 'label[for="'+ campoId + '"]' ).data('tipo',tipo)
		}
	})
	console.log('Configurado formulario de ' + tabla)

	/*
	dbhQuery ({
		fields: 'top 1' + campos
		, table: listadoView

	}).request(function(xml){
		const reg = $(xml).find('registro')[0]
		if ( !reg ) return false;
		const camposArr = reg.childNodes
		, $container = $(container)
		//, $labels = $()
		for(var i=0;i<campos.length;i++){
			var campo = $container.find('[id="'+ campos[i] + '"]')[0]
			, $campo = $(campo)
			if ( ! campo || campo == null ) { alerta ( "Error programarCampos" ); console.log ( 'campo: ' + campos[i] ) }
			if ( !param ) {
			}
			var tipo=camposArr[i].getAttribute("tipo")
			, size=camposArr[i].getAttribute("size")
			$campo.data('tipo',tipo)
			$campo.attr('data-size',size)
	//	console.log($campo)
			if ( tipo < 10 ) {
				var data_type = "number"
				$campo.attr('placeholder','0.00')
			} else if ( tipo == 135 ) {
				var data_type = "date"
				$campo.attr('placeholder','dd/mm/aaaa')
			} else {
				var data_type = "text"
			}
			$campo.addClass('data-type-' + data_type )
			$campo.addClass('data-dbtype-' + tipo )
			$container.find( 'label[for="'+ campos[i] + '"]' ).data('tipo',tipo)
		}
		console.log('Configurado form.')
	})
	*/
}
function programarLabels($labels){
	//console.log($labels.length)
	$labels.each ( function ( i, ele ) {
		var label=this
		var inp=document.getElementById(label.getAttribute("for"))
		, $lbl = $(label)
		if ( inp != null ) {
			var tipo=$('[id="' + $lbl.attr('for') + '"]').data('tipo')
			var tipo=$lbl.data('tipo') * 1
			if(tipo<10&&(inp.tagName=="INPUT"||inp.tagName=="TEXTAREA")){
				$(this).attr('title',helpText('numero'))
			}
			if(tipo==135){
				$(this).attr('title',helpText('fecha'))
				$(this).attr('name','juan')
//			console.log(inp.id + '--' + tipo)
			}
			if(tipo>199){
				$(this).attr('title',helpText('texto'))
			}
			if(inp.tagName=="SELECT"){
				$(this).attr('title',helpText('select'))
			}
		}
	});

}
function desactivarCampos(campos,doc){
	for(var i=0;i<campos.length;i++){
		var campo=doc.getElementById(campos[i])
		//campo.disabled=1
		campo.readOnly=1
		//campo.onfocus=function(){this.blur()}
	}
}
var dropDownMenuPro = (function (){
	var pub = {};
	var local = {};
	function cerrar(){
		var boton = local.boton
		var capa = local.capa
		capa.style.display='none'
		boton.className=boton.oldClass
		ponerBackground('img/flechaArribaNegrapaddingright.png')
//    boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaarribanegra.gif')"
	}
	function abrir(boton,capa){
		var boton = local.boton
		var capa = local.capa
		capa.style.display='block'
		boton.className=boton.className+" "+boton.clasedowned
		ponerBackground('img/flechaAbajoNegrapaddingright.png')
		if(capa.oldLeft==""&&capa.oldRight==""){
			var w = boton.offsetLeft
			capa.style.left=(w+0)+'px'
		}
		if(capa.oldTop==""){
			var h = boton.offsetTop+boton.offsetHeight
			capa.style.top=(h+0)+'px'
		}
//	  boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaabajonegra.gif')"
	}
	function ponerBackground(urlbackgroundimage) {
		var boton = local.boton
		if(boton.oldBackgroundImage != ""){
			boton.style.backgroundImage=boton.oldBackgroundImage+",url('"+urlbackgroundimage+"')"
			boton.style.backgroundPosition=boton.style.oldBackgroundPosition+","+(boton.offsetWidth-20)+"px 11px"
		}else{
			boton.style.backgroundImage="url('"+urlbackgroundimage+"')"
			boton.style.backgroundPosition='right center'//(boton.offsetWidth-20)+"px 11px"
		}
	}
	pub.init = function (boton,capa){
		$(boton).data('obj',dropDownMenuPro)
		$(boton).data('capa',capa)
		boton.oldDisplay=boton.style.display
		boton.style.display="block"
		//capa.style.position="absolute"
		capa.oldLeft=boton.style.left
		capa.oldRight=capa.style.right
		capa.oldTop=capa.style.top
		boton.clasedowned='botondowned'
		boton.oldClass=boton.className
		boton.oldBackgroundImage=boton.style.backgroundImage
		boton.oldBackgroundPosition=boton.style.backgroundPosition
		if(boton.oldBackgroundImage != ""){
			boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaArribaNegrapaddingright.png')"
			boton.style.backgroundPosition=boton.style.oldBackgroundPosition+","+(boton.offsetWidth-20)+"px 11px"
		}else{
			boton.style.backgroundImage="url('img/flechaArribaNegrapaddingright.png')"
			boton.style.backgroundPosition='right center'//(boton.offsetWidth-20)+"px 11px"
		}
		$(boton).click(function(){$(this).data('obj').alternar(this)});
	}
	pub.alternar = function (boton) {
		local.boton = boton
		local.capa = $(boton).data('capa')
		if(local.capa.style.display=='none'){abrir()}else{cerrar()}
		//boton.style.width=(boton.offsetWidth+20)+'px'
		//boton.style.paddingRight='20px'
		//boton.objeto=this
		//boton.onclick=function(){boton.objeto.alternar()}
		//boton.style.display=boton.oldDisplay
	};
	return pub;
}());

function dropDownMenu(boton,capa){
	boton.oldDisplay=boton.style.display
	boton.style.display="block"
	if ( typeof capa == 'undefined' || capa == null ) {
		console.log ( 'Error DropDownMenu. Boton: ' + boton.id )
	}
	//capa.style.position="absolute"
	capa.oldLeft=boton.style.left
	capa.oldRight=capa.style.right
	capa.oldTop=capa.style.top
	boton.clasedowned='botondowned'
	boton.oldClass=boton.className
	boton.oldBackgroundImage=boton.style.backgroundImage
	boton.oldBackgroundPosition=boton.style.backgroundPosition
	if(boton.oldBackgroundImage != ""){
    boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaArribaNegrapaddingright.png')"
	  boton.style.backgroundPosition=boton.style.oldBackgroundPosition+","+(boton.offsetWidth-20)+"px 11px"
	}else{
    boton.style.backgroundImage="url('img/flechaArribaNegrapaddingright.png')"
	  boton.style.backgroundPosition='right center'//(boton.offsetWidth-20)+"px 11px"
	}
	//boton.style.width=(boton.offsetWidth+20)+'px'
	//boton.style.paddingRight='20px'
	boton.objeto=this
	boton.onclick=function(){boton.objeto.alternar()}
	boton.style.display=boton.oldDisplay
	this.limpiar=function(){
		this.cerrar()
    capa.innerHTML=""
	}
	this.cerrar=function(){
		capa.style.display='none'
		boton.className=boton.oldClass
		boton.objeto.ponerBackground('img/flechaArribaNegrapaddingright.png')
//    boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaarribanegra.gif')"
	}
	this.abrir=function(){
		capa.style.display='block'
		boton.className=boton.className+" "+boton.clasedowned
		this.ponerBackground('img/flechaAbajoNegrapaddingright.png')
	  if(capa.oldLeft==""&&capa.oldRight==""){
      var w = boton.offsetLeft
	    capa.style.left=(w+0)+'px'
	  }
	  if(capa.oldTop==""){
      var h = boton.offsetTop+boton.offsetHeight
	    capa.style.top=(h+0)+'px'
	  }
//	  boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaabajonegra.gif')"
	}
	this.alternar=function(){
		if(capa.style.display=='none'){this.abrir()}else{this.cerrar()}
	}
	this.ponerBackground=function (urlbackgroundimage) {
  	if(boton.oldBackgroundImage != ""){
      boton.style.backgroundImage=boton.oldBackgroundImage+",url('"+urlbackgroundimage+"')"
  	  boton.style.backgroundPosition=boton.style.oldBackgroundPosition+","+(boton.offsetWidth-20)+"px 11px"
  	}else{
      boton.style.backgroundImage="url('"+urlbackgroundimage+"')"
  	  boton.style.backgroundPosition='right center'//(boton.offsetWidth-20)+"px 11px"
  	}
	}
}

function parseFieldsString(txt){
 	var parentesisabierto=0
	var comasArr=new Array()
	var lastcomaposition=0
	for(var i=0;i<txt.length;i++){
		var c=txt.substr(i,1)
		if(c=="(")parentesisabierto++
		if(c==")")parentesisabierto--
		if(c==","&&!parentesisabierto){
			comasArr[comasArr.length]=trim(txt.substring(lastcomaposition,i))
//			console.log(comasArr[comasArr.length-1])
			//console.log(txt+lastcomaposition)
			i++
			lastcomaposition=i
		}
	}
	comasArr[comasArr.length]=txt.substring(lastcomaposition,txt.length)
//console.log(comasArr[comasArr.length-1])
	console.log(comasArr.length)
	return comasArr
}
function ocultarCamposPerfiles(doc,usu_perfil){
//alert(usu_perfil.toLowerCase())
	if (usu_perfil.toLowerCase().toString() == "matriz") { // 5 = Matriz
	  $('.botonopenform',doc).hide()
	  $('.botoneliminar',doc).hide()
	  var divscampos=doc.getElementsByTagName('*')
	  for(var i=0;i<divscampos.length;i++){
	  	var perfiles=divscampos[i].getAttribute("perfiles")
	  	if ( perfiles != null ) {
	  		if ( usu_perfil.toLowerCase().toString() == "matriz" ) divscampos[i].style.display='none'
	  	}
	  }
	}
}
function quitarDeArray(arr,delvalsarr){
	var arraux=arr.slice()
	for ( var j = 0; j < delvalsarr.length; j++ ) {
		var val = delvalsarr[j]
	  for(var i=0;i<arraux.length;i++){
	  	if(arraux[i]==val){
	  		arraux.splice(i,1)
	  	}
	  }
	}
	return arraux
}
function randomPassword(length)
{
   chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
   pass = "";

   for(x=0;x<length;x++)
   {
      i = Math.floor(Math.random() * 62);
      pass += chars.charAt(i);
   }

   return pass;
}
var contextMenu = (function(){
	var pub = {},
	//Private property
	top = 0;
	//Public methods
	pub.show=function(menucontainer,callerobj){
		var ifrol = 0;
		var ifrot = 0;
		/*
		var ifr1 = findIframeOfWindow(callerobj.ownerDocument.defaultView )
		ifrol += $(ifr1).offset().left;
		ifrot += $(ifr1).offset().top;
		var ifr2 = findIframeOfWindow(ifr1.ownerDocument.defaultView )
		if ( typeof ifr2 != "undefined" ) {
			ifrol += $(ifr2).offset().left;
			ifrot += $(ifr2).offset().top;
		}
		*/
		var ol=callerobj.offsetLeft;
		var ot=$(callerobj).offset().top;
		var leftpos = ol+ifrol
		if(leftpos<0)leftpos=0
		//menucontainer.style.left=leftpos+'px';
		//menucontainer.style.top=(ot+ifrot+$(callerobj).height()+10)+'px';
//		console.log(menucontainer.style.left)
//		console.log(menucontainer.style.top)
		this.$container=$(menucontainer)
		$(menucontainer).show();
	},
	pub.hide=function(){
		//this.$container.fadeOut('fast');
		this.$container.hide();
	}
	//Return just the public parts
	return pub;
}());
function findIframeOfWindow(win){
	if (win.parent && win.parent.frames && win.parent.document && win.parent.document.getElementsByTagName) {
//alert(win.parent+":"+win.parent.frames+":"+win.parent.document+":"+win.parent.document.getElementsByTagName+":")
		var iframes = win.parent.document.getElementsByTagName("IFRAME");
		for (var i = 0; i < iframes.length; i++) {
			//var id = iframes[i].id || iframes[i].name || i;
			var id = i
			if (win.parent.frames[id] == win) {
				return iframes[i]
				//iframes[i] is your iframe in your parent.
			}
		}
	}
}
function showCalendar(callerobj,callBackFn){
	return false
	//inputTargetCalendar = callerobj; // Esto es para q el calendar sepa donde volcar la info.
	var divcalendar=document.getElementById('divcalendar');
	var $win = $("#iframeCalendar")
	var windowjQuery = $win[0].contentWindow.$;
	windowjQuery.data($win.contents()[0],"callerobj",callerobj);
	windowjQuery.data($win.contents()[0],"callBackFn",callBackFn);
	windowjQuery.data($win.contents()[0],"container",divcalendar);
	contextMenu.show(divcalendar,callerobj);
}
var vars = ( function () {
	var pub = {},
		loc = {};
	pub.dbBackup = function () {
		if ( ! confirm ( '¿Hacer un Backup de la BD?' ) ) return false
		//mostrarTelon(1)
		function go() {
			var sql = "exec dbo.sp_backupDatabase"
			//, res = DBH.ajax.sql(sql)
			DBH.sql ( sql , {
				verbose: {
					begin: 'Efectuando Backup...'
					, success: 'Backup realizado correctamente.'
					, error: 'No se ha podido completar el Backup.'
				}
			} )
			mostrarTelon(0)
		}
		setTimeout(function(){go()},100)
	}
	pub.init = function () {
		$(document).on ( 'blockbutton:toggle' , 'h4.blockbutton', function () { $('#iframeFormCuerpo').data('topform').setbuttonbar() } )
		$(document).on ( 'keydown' , '.inputText', function (event) { filterOnEnter(this,event) } )
		$(document).on ( 'keyup' , '.inputText', function () { setTextareaHeight(this) } )
		$('#alimentador').draggable({ handle: ".bandatitulo" })
		var $alertaaviso = $('#alertaaviso')
		, $input = $alertaaviso.find('input')
		$input.appendDtpicker({
			'locale': 'es'
			,'firstDayOfWeek':1
			,"onSelect" : function(handler, targetDate){
				DBH.date().setcolor($input);
				$('.datepicker').hide()
				//console.log(targetDate);
			}
		});
		$('#divdocument').show()
		$('.multistatebutton').on('multistatebutton:click',function(){
			//console.log($(this).is('.inlineform *'))
			//console.log(this.tagName)
			if( ! $(this).is('.inlineform *')  )formCabecera.formModificado(1)
		})
		Mousetrap.bind('ctrl+s', function(event) {
			$('.formCuerpo:visible').data('topform').save()
			return false
		});
		Mousetrap.bind('ctrl+d', function(event) {
			$('.formCuerpo:visible').data('topform').clear()
			return false
		});
		Mousetrap.bind('ctrl+a', function(event) {
			$('.formCuerpo:visible').data('topform').filter()
			return false
		});
		Mousetrap.bind('ctrl+f', function(event) {
			$('#checkfiltro').data('click')()
			return false
		});
		$('body').append('<div id="dialog-confirm" title="Guardar los cambios?"><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Guardar los cambios?</p></div>')


		var dialog = $( "#dialog-confirm" ).dialog({
		resizable: false,
		height:140,
		modal: true,
		buttons: {
			"Guardar": function() {
				var pkvalue = $(this).attr('pkvalue')
				, callback = $(this).data('callback')
				, topform = DBH.area().topform
				, save = topform.save()
				if (save) {
					//topform.clear(1)
					if(pkvalue)topform.load(pkvalue)
					if(callback)callback()
				}
				$( this ).dialog( "close" );
			},
			"Descartar": function() {
				var pkvalue = $(this).attr('pkvalue')
				, callback = $(this).data('callback')
				, topform = DBH.area().topform
				//, clear = topform.clear(1)
				DBH.area().unsaved = 0
				if(pkvalue)topform.load(pkvalue)
				if(callback)callback()
				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		}
		});
		pub.confirm = function (t,txt,pkvalue) {
			var $dialog = dialog.dialog("widget")
			dialog.dialog({"title":t})
			dialog.dialog("open")
			$dialog.find('p').parent().width('100%')
			$dialog.find('p').width('100%').text(txt)
			$dialogContainer = $(dialog)
			$dialogContainer.removeAttr('pkvalue')
			$dialogContainer.removeData('callback')
			//console.log( typeof pkvalue )
			if ( typeof pkvalue == 'string' )
				$dialogContainer.attr('pkvalue', pkvalue)
			if ( typeof pkvalue == 'function' )
				$dialogContainer.data('callback', pkvalue)

			//if(callback)callback()
		}
		dialog.dialog("close")
		pub.dialog = dialog
	}
	pub.filterSelectLists = function ( $selects, sql ) {
		var r = sqlExec ( sql )
		, availableIds = []
//		console.log(sql)
//		console.log(r)
		$selects.find('option').addClass('hide')
		$selects.find('option:first').removeClass('hide')
		$(r).children('a1').each ( function () {
			var valor = $(this).text()
			, $opt = $selects.find('option[value="' + valor + '"]')
			$opt.removeClass('hide')
			availableIds.push(valor)
		})
//		console.log($selects.html())
		//$selects.find('option.hide').remove()
//		$selects.find('option').prop('checked',false)
		$selects.find('option').css('display','')
		$selects.find('option.hide').css('display','none')
		$selects.attr('data-available-ids',availableIds)
		/*
		$selects.prop('selectedIndex','0')
		$selects.each ( function (i) {
			this.selectedIndex = 0
			//var $this = $(this)
			//if(vals[i]!='')$this.val( vals[i] )
		})
	*/
	}
	pub.filterSelectsHijas = function ( $hijas, hijasiscointainer ) {
		$hijas = hijasiscointainer ? $hijas.find('[data-select-vinculada-madre][data-select-vinculada-madre!=""]') : $hijas
		//console.log($hijas)
		$hijas.each ( function () {
			var $hija = $(this)
			, madreid = $hija.attr('data-select-vinculada-madre')
			//console.log($hija.data('$madre'))
			//, $madre = $hija.data('$madre')?$hija.data('$madre'):$hija.closest('.formCuerpo').find('[id="' + madreid + '"]' )
			, $madre = $hija.closest('.lineamodelo').length?$hija.closest('.lineamodelo').find('[id="' + madreid + '"]' ):$hija.closest('.formCuerpo').find('[id="' + madreid + '"]' )
			, hijacampo = $hija.attr('data-select-vinculada-campo')
			, sqlhija = $hija.attr('data-sql-loadlista')
			, grupohija = $hija.attr('grupo')
			, v = $madre.val()
			, v=v==''?-1:v
			, ff = sqlhija.toLowerCase().indexOf ( "where" ) > -1 ? ' AND ' : ' WHERE '
			, sqlfilter = sqlhija.substring ( 0, sqlhija.toLowerCase().indexOf ( "order by" ) ) + ff + hijacampo + "='" + v + "'"
			if ( !sqlhija ) sqlfilter = "SELECT li1_id FROM DBH_LISTAS WHERE grupo ='" + grupohija + "' AND li1_padre_li1_id = " + v
			//console.log(sqlfilter)
			pub.filterSelectLists ( $hija, sqlfilter )
			if($madre[0].selectedIndex<1){
				$hija.find('option').css('display','')
				$hija.prop('selectedIndex','-1');
			};
			return true
		} )
	}
	pub.isdef = function (obj) {
		return ( typeof obj != 'undefined' && obj != '' )
	}
	pub.idusuario = function () {
		var idusuario=sessionStorage["usu_id"]//('usu_id')
		return idusuario
	}
	pub.setAlertasRecordatorios = function (){
		var idusuario = vars.idusuario()
		sql="SELECT count(a.fechaRecordatorio) FROM seguimientoGeneral as a INNER JOIN personas as b ON a.sg_codpersona=b.codpersona AND a.fechaRecordatorio<getdate() WHERE (a.iduc=" + idusuario + " or a.iduc is null) AND avisar=1"
		var noAlertasRecordatorios = ajaxExecuterValor ( encodeURIComponent ( sql ) , 0 )
		var $boton = $('#iframeListadoCuerpo').contents().find('#buttonalertas')
		if ( noAlertasRecordatorios == 0 ) {
 			$boton.removeClass ( 'blinking' )
		}else{
			$boton.addClass ( 'blinking' )
		}
		$boton.find('.divAlertaAvisosContent').html( noAlertasRecordatorios + ' Avisos' )
	}
	pub.verPolizasVisual = function () {
		//console.log()
		clientesForm.verPolizasVisual()
	}
	pub.alerta = ( function () {
		var pub = {};
		pub.open = function (t,defcon) {
			var $container = $('.layout-alertas-container')
			, $ol = $container.find('ol')
			, clase = 'alerta-warning'
			, date = new Date()
			, horas = date.getHours()
			, minutos = date.getMinutes()
			, segundos = date.getSeconds()
			, hora = horas + ':' + minutos + ':' + segundos
			//, t = t + '<br>yo bien y'
			, $alerta = $('<li><code>' + hora + ' ' + t + '</code></li>' )
			$alerta.attr('title',$('<div/>').html(t).text())
			if(defcon=='1' || defcon == 'green' ){ clase = 'alerta-successful' }
			if(defcon=='2' || defcon == 'red'){ clase = 'alerta-error' }
			//clase = 'alerta-error'
			//if ( clase == 'alerta-warning' ) $alerta.find('code').append('hola que tal yo bien y vos<br>todo bien lindo día')
			$ol.prepend($alerta.addClass(clase).addClass('blink_me'))
			$container.scrollTop(0)
			$container.height ( $alerta.outerHeight() + 2 )
			let that = this
			if ( that.blankTimer ) clearTimeout ( that.blankTimer )
			this.blankTimer = setInterval ( function () {
				let $alertaBlank = $alerta.clone()
				$alertaBlank.find('code').html('&nbsp;')
				$ol.prepend ( $alertaBlank )
				$container.scrollTop(0)
				$container.height ( $alertaBlank.outerHeight() + 2 )
				clearTimeout ( that.blankTimer )
			} , 10000 )
		}
		return pub;
	} () );
	pub.colorFecha = function ( f, a, b, istext ) {
		var val = f
			,rojo = 'rgba(255,50,0,0.3)'
			,amarillo = 'rgba(255, 165, 0 ,0.3)'
			,verde = 'rgba(0,255,0,0.3)'
			,msinday = 24 * 60 * 60 * 1000
			,rango = b - a
			,desfase = ( b + a ) / 2;
		if ( pub.isdef ( istext ) ) { rojo = 'red'; amarillo = 'orange'; verde = 'green'; }
		var color = amarillo
		if ( val != '' && !val.length<10 ) {
			var valArr = val.substr(0,10).split ( '/' )
			var f = new Date ( valArr[2], valArr[1]-1, valArr[0] )
			var fn = new Date ( new Date().getTime() + ( msinday * desfase ) )
			//new Date().getTime() + 86400000
			//fn.setDate( fn.getDate() + desfase )
			//console.log(val + '**' + f + '**' + fn)
			var daysdif = ( fn - f ) / msinday
			//var l2 = rango +  desfase
			if ( daysdif > ( ( rango / 2 ) ) ) color = rojo
			if ( daysdif < ( ( rango / -2 ) ) ) color = verde
		} else {
			color = ''
		}
		return color
	}
	pub.ping = function () {
		//console.log('ping')
		if ( loc.intervalpinger != 'undefined' ) clearTimeout ( loc.intervalpinger )
		//if ( document.getElementById('divpinger') != null ) document.getElementById('divpinger').innerHTML = 'Last ping: ' + new Date().toString().slice(16,24)
		loc.intervalpinger = setTimeout(function(){pub.pinger ()},60000)
	}
	pub.pinger = function () {
		/*
		var sqls = "select top 1 CONVERT(VARCHAR(5),GETDATE(),108) as a from DBH_USUARIOS"
		, time = sqlExec(sqls,0)
		, islogged = $(time).children().length
		*/
		//var DBHC_checkuser = DBH.ajax.request('http://www.naujcloud.com/DBH/DBHC_checkuser.php','usu_id=1&template_name=test')
		//var DBHC_checkuser = $.get('DBHC_checkuser.html')
		//console.log(DBHC_checkuser)
		var islogged = 1
		if ( !DBH.islogged ) { DBH.logout(); return false }
			dbhQuery ({
				fields: 'dbh_sessionid'
				, table: 'DBH_USUARIOS'
				, where: "usu_id="+sessionStorage["usu_id"]
			}).getJSONdef((json)=>{
				const dbh_sessionid = json[0].dbh_sessionid
				if ( dbh_sessionid != sessionStorage["sessionid"] ) { DBH.logout(); return false }

				dbhQuery ({
					fields: 'avi_id,avi_etiqueta,avi_texto,avi_fecha,avi_da_id,avi_pkvalue'
					, table: 'dbh_avisos'
					, where: "avi_fecha is not null and avi_fecha < getdate() and avi_accion = 1 and ( avi_alertado is null or avi_alertado = 0 ) and dbh_avisos.iduc=" + sessionStorage["usu_id"]
					, orderby: 'avi_fecha'
				}).getJSONdef((recs)=>{
					for ( i = 0 ; i < recs.length ; i ++ ) {
						var rec = recs[i]
						DBH.aviso(rec.avi_id).alertar(rec)
					}
					pub.ping()
				})

			})

			return

			var ssql = "SELECT dbh_sessionid FROM DBH_USUARIOS WHERE usu_id="+sessionStorage["usu_id"]
			//console.log(ssql)
			var dbh_sessionid = DBH.ajax.select (ssql)[0].dbh_sessionid
			if ( dbh_sessionid != sessionStorage["sessionid"] ) { DBH.logout(); return false }

		var sqls = "select avi_id,dbh_sessionid from dbh_avisos inner join DBH_USUARIOS on dbh_avisos.iduc = usu_id where avi_fecha is not null and avi_fecha < getdate() and avi_accion = 1 and ( avi_alertado is null or avi_alertado = 0 ) and dbh_avisos.iduc=" + sessionStorage["usu_id"] + " order by avi_fecha"
		//console.log(sqls)
		//var $container = $('#alertaaviso')
		var recs = DBH.ajax.select (sqls)
		for ( i = 0 ; i < recs.length ; i ++ ) {
			var rec = recs[i]
			//if ( rec && !$container.is(':visible') ) {
				DBH.aviso(rec.avi_id).alertar()
			//}

		}

	}
	pub.pinger.checkuser_response = function (res) {
		//console.log(res)
		if( !(res*1) ) { DBH.logout(); return false }
		//DBH.islogged = res
		//alert(res)

	}
	pub.filterCombo = function ($select,sql) {
		var arr=loadSqlTable(sql,0)
		, $options = $select.find('option')
		$options.hide()
		$(arr).each(function(){
			var ad_id = $(this).first().first().text()
			, $option = $select.find('option[value="' + ad_id + '"]')
			$option.show()
		})
	}
	pub.setFlexFieldTypes = function ($f_padre,f_id,inlineform) {
	//console.log('a'+$f.val())
		if ( typeof pub_setFlexFieldTypes == 'undefined' ) pub_setFlexFieldTypes = pub.setFlexFieldTypes
		var $fs = $f_padre.closest('.lineamodelo').find( '[id="' + f_id + '"]' )
		,$f_orig =  $fs.eq(0)
		, $f_clone = $fs.eq(1)
		$f_orig.hide()
		$f_clone.hide()
		$f_orig.addClass('hidden-flexfield')
		$f_clone.addClass('hidden-flexfield')
		//$f_clone.val($f_orig.val())
		//if ( $f_padre.val() == '' ) return
		var escampobit = $f_padre.find('option:selected').attr('data_loadLista') == 'bit'
		//$f_clone.css('background','red')
		//console.log('len:'+$f_padre.find('option:selected').attr('data_loadLista'))
		if ( escampobit ) {
			$f_clone.show()
			$f_clone.removeClass('hidden-flexfield')
		} else {
			$f_orig.show()
			$f_orig.removeClass('hidden-flexfield')
		}
		//console.log(pub_setFlexFieldTypes)

		/*
		$f_padre.on ( 'change', function() {
			pub_setFlexFieldTypes( $f_padre, f_id )
		} )
		$f_clone.on ( 'change', function() {
			var $f = $(this).closest('.lineamodelo').find('#'+f_id).eq(0);
			$f.val(this.value);
			inlineform.guardar($f[0])
		} )
		*/
	}
	pub.goArea = function (da_id
		, view_da_id = $('[id="dbh_busquedas.i_da_id"]').val()
		, view_i_id = $('[id="i_id"]').val()
		, i_stringifyparams = $('[id="dbh_busquedas.i_stringifyparams"]').val()
		, i_queryeditor_params = $('[id="dbh_busquedas.i_queryeditor_params"]').val()
	) {
//		Default values

		var firstLoad = 0
		if (!da_id) {
			var da_id = view_da_id
			, firstLoad = 1
		}
		var area = DBH.area(da_id)
//		console.log(area.loaded)
		, $pestana = $('#treemenu li[da_id="'+da_id+'"]')
		//debugger
		if ( ! area.loaded ) {
			if ( firstLoad ) {
				function loadArea() {
					//DBH.area(da_id).go()
					switchiframes_real.stopReset = 1
					switchiframes_real($pestana)
					DBH.telon.hide()
					pub.goArea(da_id, view_da_id, view_i_id,i_stringifyparams,i_queryeditor_params)
				}
				DBH.telon.areaLoad()
				setTimeout ( loadArea, 0 )
			} else {
				setTimeout ( function(){pub.goArea(da_id, view_da_id, view_i_id,i_stringifyparams,i_queryeditor_params)}, 100 )
			}
			return false;
		}
		if ( firstLoad ) {
			switchiframes_real($pestana)
		}
			//switchiframes_real($pestana)
		var $diviframe = $('.formCuerpo[da_id="'+da_id+'"]')
		var i_id = view_i_id
		, topform = $diviframe.data('topform')
		//, sql = "SELECT i_stringifyparams,i_queryeditor_params FROM DBH_BUSQUEDAS WHERE i_id = " + i_id
		//, rec = DBH.ajax.select ( sql )[0]
		//, i_stringifyparams = rec.i_stringifyparams
		//, i_queryeditor_params = rec.i_queryeditor_params
		, data = $.parseJSON( i_stringifyparams )
		, i_queryeditor_params = i_queryeditor_params ? $.parseJSON( i_queryeditor_params ) : i_queryeditor_params
		topform.setandfilter ($pestana,data,i_queryeditor_params,data)
		$('#treemenu').jstree('deselect_all').jstree('select_node', da_id)
		$('#nombrearea').text($pestana.attr('name'))
	}
	pub.sqlfromparams = function (stringifyparams) {
		var i_stringifyparams = stringifyparams ? stringifyparams : $('[id="dbh_busquedas.i_stringifyparams"]').val()
		, pars = JSON.parse(i_stringifyparams)
		, tabla = pars.tabla
		, etiquetasListado = pars.etiquetasListado
		, listadoWhere = pars.listadoWhere
		, listadoWhereText = pars.listadoWhereText
		, listadoOrderByIndex = pars.listadoOrderByIndex
		, listadoOrderByIndexDesc = pars.listadoOrderByIndexDesc ? pars.listadoOrderByIndexDesc : ""
		, i_pkfield = $('.formCuerpo[da_id="'+$('[id="dbh_busquedas.i_da_id"]').val()+'"]').attr('pkname')
		, campos = []
		$(etiquetasListado).each ( function (i) {
			var campo = etiquetasListado[i][0] + " AS [" + etiquetasListado[i][1] + "]"
			campos.push ( campo )
		} )
		var sql = "SELECT " + campos + " FROM " + tabla + " WHERE " + listadoWhere
		if(!stringifyparams){
			var $i_sql = $('[id="dbh_busquedas.i_sql"]')
			$i_sql.val(sql)
			setTextareaHeight($i_sql[0])
			$i_sql.val(sql)
		} else {
			return sql
		}
	}
	pub.crearInforme = function (silent) {
		var stringifyparams = $('#iframeFormCuerpo').data('topform').stringifyparams()
		, penstana_filtros = $('#menuPrincipal .menu1Opcion[name="filtros"]')[0]
		, areaname = $('#menuPrincipal .menu1OpcionSeleccionada').text()
		, pkfield = $('#pkname').val()
		, topform = DBH.area().topform
		, lwt = topform.queryEditor.returnQT().replace ( /'/g, "''" )
		, idusu = sessionStorage["usu_id"]//('usu_id')
		, da_id = $('#iframeFormCuerpo').attr('da_id')
		, i_queryeditor_params = JSON.stringify(topform.queryEditor.returnQP()).replace ( /'/g, "''" )
		if ( silent == 2 ) {
			var nombre = prompt ( "Introduzca un nombre para la vista" )
			if ( typeof nombre == "undefined" || nombre == null ) return false
			if ( nombre == "" ) {
				alerta ( "Nombre vacío" )
				return false
			}
			nombre = "'" + nombre.replace ( /'/g, "''" ) + "'"
		} else {
			nombre = "null"
		}
		var sql = "INSERT INTO DBH_BUSQUEDAS ( i_da_id, i_pkfield,i_usu_id,i_nombre,i_descripcion, i_listadoWhere, i_tabla, i_queryeditor_params, i_stringifyparams, i_sql, dbh_perfiles_admitidos_xreg ) VALUES (" + da_id + ",'" + pkfield + "'," + idusu + "," + nombre + ",'" + lwt + "','" + topform.queryEditor.listadoWhere().replace(/\'/g,"''") + "','" + topform.tabla + "','" + i_queryeditor_params + "','" + stringifyparams + "','" + vars.sqlfromparams(stringifyparams) + "','" + sessionStorage['usu_perfiles_admitidos'] + "')"
		//console.log(sql)
		sqlExec(sql)
		alerta("Vista almacenada",1)
		if ( nombre != "null" ) $('#alimentador').trigger('vistas:list:changed')
		if ( silent ) return true
		var xml = sqlExecVal ( "SELECT max ( i_id ) as a from DBH_BUSQUEDAS",0 )
		var pars = [['dbh_redactor_consultas','i_id='+xml]]
		DBH.area('dbh-búsquedas').go().setvalues (pars).filter()
	}
	pub.createFormFields = function (customview,$container,caller,da_id) {
		var t0 = performance.now();
		/*
		var sql = "SELECT " +
			"case when ((select da_tabla from DBH_AREAS where da_id = data_da_id) = left(data_field_id,charindex('.',data_field_id)-1)) then '0' else '1' end as noinsert" +
			",(select da_descripcion from DBH_AREAS where da_id = (select da_areamadre from DBH_AREAS where da_id = data_da_id)) as areamadre_name" +
			",IS_NULLABLE as is_nullable" +
			",(select cast(das_da_id as varchar) + ','  from DBH_CAMPOS_AREASAFECTANTES WHERE das_data_id = data_id FOR XML PATH ('') ) as da_ids_areasafectantes" +
			", * " +
			"FROM DBH_CAMPOS inner join INFORMATION_SCHEMA.COLUMNS " +
			"on TABLE_NAME = left(data_field_id,charindex('.',data_field_id)-1) " +
			"and COLUMN_NAME = replace(data_field_id,left(data_field_id,charindex('.',data_field_id)),'') " +
			"WHERE data_da_id = '" + da_id + "' and data_activo = 1 " +
			"ORDER BY 1 desc,data_orderindex" ;
		var r = parent.sqlExec ( sql )
		*/
		var $camposXml = DBH.$camposXml.filter('[da_id="'+da_id+'"]')
		$camposXml.each ( function () {
			var $this = $(this)
			, data_id = $this.find('[fieldname="data_id"]').text()
			, data_customfield_custom_code = $this.find('[fieldname="data_customfield_custom_code"]').text()
			, data_field_classes = $this.find('[fieldname="data_field_classes"]').html()
			//console.log('sqltxt')
			, clases = 'inputText ' + ( data_field_classes ? data_field_classes : '' )
			, areamadre_name = $this.find('[fieldname="areamadre_name"]').text().toLowerCase()
			, data_field_id = $this.find('[fieldname="data_field_id"]').text().toLowerCase()
			, data_field_name = $this.find('[fieldname="data_field_name"]').text().toLowerCase()
			, data_field_width = $this.find('[fieldname="data_field_width"]').text().toLowerCase()
			, is_nullable = $this.find('[fieldname="is_nullable"]').text().toLowerCase()
			, noinsert = $this.find('[fieldname="noinsert"]').text().toLowerCase()
			, data_field_grupo = $this.find('[fieldname="data_field_grupo"]').text().toLowerCase()
			, data_label_title = $this.find('[fieldname="data_label_title"]').text().toLowerCase()
			//deferred.info = data_field_name
			//console.log(data_field_name)
			//setTimeout(function(data_field_name){deferred.info = 'fhjfghjdata_field_name'},1)
			//setTimeout(function(data_field_name){deferred.notify('bababa' )},1)
			//deferred.notify( data_field_name )
			, data_default_value = $this.find('[fieldname="data_default_value"]').text().toLowerCase()
			, data_default_value_sql = $this.find('[fieldname="data_default_value_sql"]').text().toLowerCase()
			, data_sql_loadlista = $this.find('[fieldname="data_sql_loadlista"]').text().toLowerCase()
			, data_sql_listado = $this.find('[fieldname="data_sql_listado"]').text().toLowerCase()
			, data_sql_inline_search = $this.find('[fieldname="data_sql_inline_search"]').text().toLowerCase()
			, data_select_vinculada_madre = $this.find('[fieldname="data_select_vinculada_madre"]').text().toLowerCase()
			, data_select_vinculada_campo = $this.find('[fieldname="data_select_vinculada_campo"]').text().toLowerCase()
			, data_select_groupname = $this.find('[fieldname="data_select_groupname"]').text().toLowerCase()
			, data_select_options = $this.find('[fieldname="data_select_options"]').text()//.toLowerCase()
			, data_select_onchange = $this.find('[fieldname="data_select_onchange"]').text()//.toLowerCase()
			, data_select_da_id = $this.find('[fieldname="data_select_da_id"]').text()//.toLowerCase()
			, data_blockbutton_name = $this.find('[fieldname="data_blockbutton_name"]').text().toLowerCase()
			, data_blockbutton_name = noinsert*1 ? 'Ascendentes (no editable)' : data_blockbutton_name
			, data_customfield_sql_select = $this.find('[fieldname="data_customfield_sql_select"]').text().toLowerCase()
			, da_ids_areasafectantes = $this.find('[fieldname="da_ids_areasafectantes"]').text().toLowerCase()
			, da_ids_areasafectantes = da_ids_areasafectantes ? da_ids_areasafectantes.substring(0,da_ids_areasafectantes.length-1).replace(/ /gi,'').split(',') : da_ids_areasafectantes
			, eslista = data_sql_loadlista || ( data_field_grupo && ! $('<fake/>').addClass(clases).hasClass('tags-cloud') ) || data_select_options
			, estopform = caller.sqlSelectListado ? 1:0
			, $fieldfromdb = eslista ? $('<select/>') : $('<textarea/>')
			$fieldfromdb.addClass(clases)
			//if($fieldfromdb.hasClass('inline-search') && eslista ) {$fieldfromdb = $('<textarea/>').addClass(clases).addClass('inline-search-select')}
			$fieldfromdb.attr({
				'name': data_field_name
				,'id': data_field_id
				,'data-sql-loadlista': data_sql_loadlista
				,'data-sql-inline-search': data_sql_inline_search
				,'grupo': data_field_grupo
				,'data-select-vinculada-madre': data_select_vinculada_madre
				,'data-select-vinculada-campo': data_select_vinculada_campo
				,'data-select-options': data_select_options
				,'data-width': data_field_width
				,'data-customfield-sql-select': data_customfield_sql_select
				,'data-sql-listado': data_sql_listado
				,'da_ids_areasafectantes': da_ids_areasafectantes
				,'title': data_label_title
				,'data_default_value': data_default_value
				,'data_default_value_sql': data_default_value_sql
				,'data_select_onchange': data_select_onchange
				,'data_select_da_id': data_select_da_id
				,'data_id':data_id
			})
//			console.log('/asignar atributos')
			if ( !data_sql_listado && ( ( data_sql_loadlista && data_sql_loadlista != '' ) || ( data_sql_inline_search && data_sql_inline_search != '' ) ) ) {
				var sql = data_sql_loadlista ? data_sql_loadlista : data_sql_inline_search
				, sql = sql.toLowerCase().replace(/\[enteredtext\]/gi,'')
				, orderbypos = sql.toLowerCase().indexOf ( "order" )
				, cc = orderbypos > -1 ? sql.substring ( 0, orderbypos ) : sql
				, comapos = cc.indexOf ( "," )
				, cc = cc.substring ( comapos+1 )
				, dd = sql.substring ( 0,comapos )
				, sppos = dd.lastIndexOf ( " " )
				, dd = dd.substring ( sppos )
				, tienewhere = sql.indexOf ( "where" ) > -1
				, ff = tienewhere ? ' AND ' : ' WHERE '
				, ee = "SELECT DISTINCT " + cc + ff + dd + " = " + data_field_id
				, textfield = cc.substring ( 0, cc.indexOf ( 'from' ) )
				, table = cc.substr ( cc.indexOf ( 'from' ) + 4 )
				, table = tienewhere ? table.substring(0,table.indexOf('where')) : table
//				console.log(table)
				//, data_sql_inline_search = "SELECT " + dd + "," + cc + ff + textfield + " like '%[enteredText]%' order by " + textfield
				, data_sql_inline_search = sql.substring ( 0, orderbypos ) + ff + textfield + " like '%[enteredText]%' " + sql.substring ( orderbypos )
				let orderby = ''
				if ( orderbypos > -1 ){
					orderby = sql.substring ( orderbypos )
					orderby = orderby.substring ( orderby.indexOf('by') + 2 )
				}
				$fieldfromdb.attr('data-sql-listado',ee).attr('select-id-field',dd).attr('select-text-field',textfield).attr('select-table',table).attr('select-orderby',orderby)
			}
			var data_blockbutton_name = trim ( data_blockbutton_name )
			, llevabb = data_blockbutton_name && ( $('.formCuerpo[da_id="'+da_id+'"]').attr('da_nivel') == 1 )
			if ( llevabb && ! $container.find ('.blockbutton-autocreate[title="'+data_blockbutton_name+'"]').length ) {
				var $bbp = $('<div class="blockbutton-autocreate takefields" title="'+data_blockbutton_name+'"/>')
				if(noinsert*1){$container.prepend($bbp)}else{$container.append($bbp)}
			}
			if ( llevabb ) {
				var $container2 = $container.find ('.blockbutton-autocreate[title="'+data_blockbutton_name+'"]')
			} else {
				var $container2 = $container.find ('.general-container')//.addClass('blockbutton-autoopen')
			}
			var w = data_field_width ? data_field_width : '50%'
			, $wrapper = $('<div></div>').addClass('divCampoForm').width(w)
			, config_usu_perfil=sessionStorage["usu_perfil"]//('')
			if ( data_select_options ) { //ES FIXED
				var options = data_select_options
				if ($fieldfromdb.hasClass('multistatebutton')) {
					$fieldfromdb.html(options)
				} else {
					$fieldfromdb.html('<option></option>' + options)
				}
			}
			if(noinsert*1 || data_customfield_sql_select)$fieldfromdb.addClass('no-insert')
			if( $fieldfromdb.hasClass('no-insert') && !$fieldfromdb.is(sessionStorage['usu_perfiles_caninsert'])){
				$fieldfromdb.data('noinsert','1')
			}else{
				$fieldfromdb.data('noinsert','0')
				$fieldfromdb.removeClass('no-insert')
			}
			if( $fieldfromdb.hasClass('no-spellcheck') ) {
				$fieldfromdb.attr('spellcheck','false')
			}
			if(is_nullable=='nono')$fieldfromdb.addClass('noblank')
			if (!$fieldfromdb.is(config_usu_perfil)) {
				if ( !data_customfield_custom_code ) {
					$container2.append($fieldfromdb.wrap($wrapper).parent())
					//if ( data_sql_inline_search ) {
					if ( $fieldfromdb.hasClass('inline-search') ) {
						//if ( $fieldfromdb.hasClass('inline-search-select') ) {
						if ( $fieldfromdb[0].tagName == "SELECT" ) {
							//new menuContextual(window,$fieldfromdb[0],data_sql_inline_search,"Cliente")
							//$fieldfromdb.removeClass()
							$fieldfromdb.on('focus',function(){
								var $field = $(this)
								, $tempfield = $field.parent().find('.inlinesearch-tempfield')
								, $tempfield = $tempfield.length ? $tempfield : $('<textarea/>').data('$originalfield',$field).attr('class',$field.attr('class')).removeClass('inputText').addClass('inlinesearch-tempfield').hide()
								if($field.closest('.inlineform').length) $tempfield.addClass('no-filter no-insert')
								$field.hide()
								$field.after($tempfield)
								inlineSearch($tempfield,{$field: $field,field: $field.attr('select-text-field'), idfield:$field.attr('select-id-field'),table: $field.attr('select-table'),orderby:$field.attr('select-orderby')})
								let tempval = $field.find('option:selected').text()//?$field.text():''
								console.log("tttttemppppval:"+tempval)
								$tempfield.val(tempval).show().select().addClass('inputText')
								//$tempfield.focus()
								$tempfield.on('blur',function(){
									var $field = $(this)
									, $originalfield = $field.data('$originalfield')
									$originalfield.show()
									$field.hide().removeClass('inputText')
								})
								$tempfield.on('inlinelist:user:select',function(event){
									var $field = $(this)
									, idvalue = $field.attr('idvalue')
									, txtvalue = $field.val()
									, $originalfield = $field.data('$originalfield')
									, opt = '<option value="'+idvalue+'" selected>'+txtvalue+'</option>'
//									console.log(opt)
									$originalfield.find('option').remove()
									$originalfield.append('<option/>').append(opt)//.val(idvalue)
									$originalfield.trigger('blur')
									//$originalfield.trigger('focus')
									$originalfield.trigger('input')
								})
							})
						} else {
							new inlineSearch($fieldfromdb,{field:$fieldfromdb.attr('id'),table:$fieldfromdb.attr('id').split(".")[0]})
						}
					}
					//var $label = $('<div style="width:100%;clear:both;height:12px;float:none"><label style="" title="'+data_label_title+'" for="' + data_field_id + '">' + data_field_name + '</label></div>')
					var $label = $('<label style="" title="'+data_label_title+'" for="' + data_field_id + '">' + data_field_name + '</label>')
					//if ( data_label_title ) $label.append('<p class="genericons label-info fa fa-question" style="" title="'+data_label_title + '"></p>')
					if ( data_label_title ) $label.addClass('label-widthhelp').attr('title',data_label_title)
					$fieldfromdb.parent().prepend($label)
				} else {
					$fieldfromdb.removeClass('inputText').hide()
					$fieldfromdb.addClass('no-insert no-filter')
					$wrapper.html (data_customfield_custom_code)
					$wrapper.append( $fieldfromdb )
					$container2.append( $wrapper )
				}
			}
			DBH.field($fieldfromdb);
		})

					//$container2.append( $containervirtual )
		var t1 = performance.now();

  DBH.consola( da_id + " Time: " + (t1 - t0) + " milliseconds.")
	}
	pub.filterSelectCampos = function (madre) {
		var $madre = $(madre)
		, selected_da_id = $madre.val()
		, sql = "SELECT * FROM DBH_AREAS WHERE da_id="+selected_da_id
		, r = parent.sqlExec ( sql )
		, $record = $(r).eq(0)
		, da_nivel = $record.find('[fieldname="da_nivel"]').text()//.toLowerCase()
		, da_areamadre = $record.find('[fieldname="da_areamadre"]').text()//.toLowerCase()
		if ( da_nivel == '2' || !da_areamadre || isNaN(selected_da_id) ) return false
		var $hija = $('.system-select-campos')
		, hijacampo = $hija.attr('data-select-vinculada-campo')
		, sqlhija = $hija.attr('data-sql-loadlista')
		, ff = sqlhija.toLowerCase().indexOf ( "where" ) > -1 ? ' AND ' : ' WHERE '
		, sqlfilter = sqlhija.substring ( 0, sqlhija.toLowerCase().indexOf ( "order by" ) ) + ff + "(" + hijacampo + "='" + selected_da_id + "' OR " + hijacampo + "='" + da_areamadre + "')"
		, da_id_madres = [selected_da_id]
		do {
			var da_id_madre = DBH.ajax.valor("SELECT da_areamadre FROM DBH_AREAS WHERE da_id = " + selected_da_id)
			if(da_id_madre)da_id_madres.push (da_id_madre)
			selected_da_id = da_id_madre
		}while(da_id_madre)
		var condition = "(" + hijacampo + " IN (" + da_id_madres + "))"
		, sqlfilter = sqlhija.substring ( 0, sqlhija.toLowerCase().indexOf ( "order by" ) ) + ff + condition
		//console.log(sqlfilter)
		pub.filterSelectLists ( $hija, sqlfilter )
	}
	pub.loading = function (o) {

		if ( !o ) {if ( typeof loadingmsg_interval!='undefined') clearTimeout (loadingmsg_interval);return}

		var t = inlineform2_elements.length
		$msg = $('<div style="font-size:20px;color:red;"/>').text(t)
		$('#divtelon').append($msg)
		//console.log($msg.text())
		if ( typeof loadingmsg_interval=='undefined') loadingmsg_interval = setInterval(function () {vars.loading(1)},10)
	}
	pub.update_selects_afectadas = function (da_id) {
		var $sels = $('select[da_ids_areasafectantes][da_ids_areasafectantes!=""]')
		, $selssinrepetir = $()
		$sels.each(function(){
			var $sel = $(this)
			, da_ids_afectantes = $sel.attr('da_ids_areasafectantes').split(',')
			, esafectada = da_ids_afectantes.indexOf(da_id) > -1
			, id = $sel.attr('id')
			if ( esafectada ) { $selssinrepetir=$selssinrepetir.add($sel) }
		})
		//console.log($selssinrepetir.length)
		programarSelects($selssinrepetir,1)
		//pub.filterSelectsHijas($selssinrepetir)
	}
	pub.isValidFormFieldContent = function ($campo) {
		var error = 0
		if ( $campo.hasClass('no-insert hidden-flexfield') || $campo[0].type=="HIDDEN" ) return 0
		if ( $campo.val() != null && ! $campo.is('.data-type-date') && !$campo.is( '.data-type-number' ) && $campo.val().length > $campo.attr('data-size') ) {
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			$('label[for="'+$campo.attr('id')+'"]').attr('title','Excede el número de caracteres admitidos por el campo ('+$campo.attr('data-size')+')')
			invalidarCampo($campo)
			error = 1
		}
		if ( $campo.is ('.noblank' ) ) {
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			if ( $campo.val() == '' || $campo.val() == null ) {
				$('label[for="'+$campo.attr('id')+'"]').attr('title','No puede quedar vacío')
				invalidarCampo($campo)//.addClass('validation-notvalid')
				error = 1
			};
		}
		if ($campo.is('.data-type-date') ) {
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			if ( $campo.val() != '' && !parent.esFechaYHoraValida ( $campo.val() ) ) {
				$('label[for="'+$campo.attr('id')+'"]').attr('title','No es una fecha válida')
				invalidarCampo($campo)
				error = 1
			};
		}
		if ( $campo.is( '.data-type-number' ) ) {
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			if ( $campo.val() != '' && isNaN ( $campo.val() ) ) {
				$('label[for="'+$campo.attr('id')+'"]').attr('title','No es un número válido')
				invalidarCampo($campo)
				error = 1
			};
		}
		return !error;
	}
	pub.reloadArea = function () {
		var da_id = $('.formCuerpo:visible').attr('da_id')
		if (!da_id)return
		DBH.load().loadXmlCampos()
		//add('.listadoCuerpoContainer[da_id="'+da_id+'"]').
		$('.formCuerpo[da_id="'+da_id+'"]').add('.botones_principales[da_id="'+da_id+'"]').add('.divCabeceraEtiqueta[da_id="'+da_id+'"]').remove()
		//$('#divteloninit').show()
		var $container = loadTopForms(da_id)
		$container.attr('id','iframeFormCuerpo')//.attr('alreadyopened',1)
		navegarArea(da_id)
	}
	pub.createViewForExcel = function (sql,areaname,filterconditions) {
		if (typeof areaname=='undefined') {
			var areaname = trim($('#menuPrincipal .menu1OpcionSeleccionada').text())
			, areaname = areaname.replace(/\[/g,"").replace(/\]/g,"")
			, filterconditions = $('.recordsinfo:visible').text() + " " + $('.dbh-listado-etiqueta:visible .lwtinfo').text()
		}
		areaname = areaname.replace(/\ /g,"_").replace(/\-/g,"_")
		var excelviewname = 'excelview_' + areaname
		, sql = "dbo.sp_sqlViewGenerator '" + sql + "','" + excelviewname + "'"
//		console.log(sql)
		, r = parent.sqlExec ( sql )
		//, tit = areaname + " - " + listadoWhere.value//.replace(/=/g,"%3D")
		, tit = areaname + " - " + filterconditions
		, filename = "Listado_" + areaname //+ "_" + that.listadoWhereText.replace(" ","_").replace(/\[/g,"").replace(/\]/g,"")
		, filename = filename.replace ( /<b>/gi, "" )
		, filename = filename.replace ( /<\/b>/gi, "" )
		return {view:excelviewname,title:tit,filename:filename}
	}
	pub.rejilla = ( function (){
		var pub = {}
		pub.init = function () {
			//var dir = $('#DBHroot').val()+'/js/handsontable.full.js'
			var dir = "https://cdnjs.cloudflare.com/ajax/libs/handsontable/0.29.2/handsontable.full.min.js"
			$('head').append( '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/handsontable/0.29.2/handsontable.full.min.css">' )
			console.log( dir )
			if( typeof Handsontable == 'undefined' ) {
				if ( ! pub.scriptLoading ) {$.getScript(dir);pub.scriptLoading = 1}

				setTimeout(pub.init,50)
				return false
			}
			var container = document.getElementById("example")
			,$container = $(container)
			,da_id=$('[id="dbh_areas.da_id"]:visible').val()
			if ( da_id=='') {alerta('Seleccione un Área');return false}
//			,$da_container = $('.formCuerpo[da_id="'+da_id+'"]')
			var sql = "select column_name+',' from information_schema.columns where table_name = (select da_pktabla from DBH_AREAS where da_id="+da_id+") order by information_schema.columns.table_name,information_schema.columns.column_name FOR XML PATH ('')"
			,campos = sqlExecVal ( sql ).split(',')
			campos.unshift('')
			//$container.find('button').remove()
			if(typeof hot != 'undefined') hot.destroy()
			hot = new Handsontable(
				container,
				{
					colWidths: 75,
					startCols: 2,
					startRows: 2,
					rowHeaders: true,
					colHeaders: true ,
					manualColumnResize: false,
					manualRowResize: false,
					cells: function (row, col, prop) {
						var cellProperties = {};

						if (row === 0 ) {
							//cellProperties.readOnly = true;
							cellProperties.editor = 'select';
							cellProperties.selectOptions = campos
						}

						return cellProperties;
					}
				}
			);
			function resize() {
				console.log('resize')
				var height = $container.find('.wtHider').height() + 30
				, width = $container.closest('.divCampoForm').width() - 20
				, ww = '100%'
				$container
					.css({'width':'100%','max-height':'500px','overflow-x':'auto','overflow-y':'auto'})
					//.height(height)
					.find('.wtHolder').height(height)
					//.width(ww)
			}
			function callback_afterChange() {
				resize()
			}
			Handsontable.hooks.add('afterChange', callback_afterChange)
			resize()
			/*
			$('body').on('mousemove',function(){
				if(scrollingDivision) resize()
			})
		*/

		}
		pub.importar = function () {
			if(!confirm('Si continua insertará la información introducida en la rejilla a la tabla correspondiente al área seleccionada.'))return false
			var data = hot.getData()
			, fields = []
			, cols = data[0]
			, validcols = cols
			, txtsql = ''
			,da_id=$('[id="dbh_areas.da_id"]:visible').val()
			, sql = "select da_pktabla from DBH_AREAS where da_id="+da_id
			, da_pktabla = sqlExecVal(sql)
			, usu_id = sessionStorage["usu_id"]//$(document).data('usu_id')
			, contador = 1
			data.splice ( 0, 1 )
			console.log(data)
			while ( validcols.indexOf(null)!=-1 && validcols.length>0 ) {
				validcols.splice ( validcols.indexOf(null), 1 )
			}
			//console.log(validcols)
			$(data).each(function (i){
				var fila = this
				, valores = []
				$(fila).each(function(j){
					var val = this
					, col = cols[j]
					if ( col!=null&&col!=''){
						valores.push("'"+val.replace(/\'/g,"''")+"'")
					}
				})
				txtsql += "INSERT INTO " + da_pktabla + " (" + validcols + ",dbh_perfiles_admitidos_xreg) VALUES (" + valores + ",'user" + usu_id + "') "
				contador++
				if ( contador > 400 ) {
					contador = 0;
					var res = DBH.ajax.sql(txtsql)
					if ( !res ) {
						alerta('Se ha producido un error: ' + res , 'red')
						return false
					}
					txtsql = ''
				}
			})
			if(validcols.length==0){
				alerta('No ha seleccionado ningún campo en la primera fila de la rejilla.')
				return false;
			}
			if(data.length==0){
				alerta('No ha introducido datos en la rejilla.')
				return false;
			}
			if ( txtsql != '' ) {
				var res = DBH.ajax.sql(txtsql)
				if ( !res ) {
					alerta('Se ha producido un error: ' + res , 'red')
					return false
				}
			}
			/*
				console.log(res)
			if ( res != '' ) {
				alert(res+'\n\nPosibles causas del error pueden ser:\n- Formato incorrecto de los datos (letras en campos numéricos o fechas mal formateadas).\n- Violación de clave única: Está intentando insertar en un campo que no admite duplicidades un valor ya existente en otro registro.\n\nRevise los datos y vuelva a intentarlo.')
				return false
			}
			*/
			alerta('Registros importados correctamente',1)
			//console.log(txtsql)
		}
		return pub
	}())
	return pub;
} () );
var alerta = vars.alerta.open
//vars.loading(1)
function limpiarLocation(l){
	var lArr=l.toString().split("?")
	if(lArr.length>1){return lArr[0]}else{return l}
}
var formCabecera = ( function () {
	var pub = {},
		$ = parent.jQuery,
		that = this;
	pub.formModificado = function(op){
//		console.log(op)
		if(op&&$('.formCuerpo:visible').hasClass ( 'topform-mode-edit' )){
		//console.log(op)
			DBH.area().unsaved = 1
			//$('.botones_principales [id="buttonsave"]:visible')[0].disabled=0
		}
		//if($('.botones_principales [id="buttonsave"]:visible').css('backgroundColor')=='rgb(255, 255, 0)')return true
		//if($('[id="buttonsave"]:visible').hasClass('unsaved'))return true
		if(DBH.area().unsaved)return true
	}
	pub.formCabeceraEtiquetaUpdate = function (txt){
		var area = DBH.area()
		, da_id = area.id
		//console.log("id:"+da_id)
		//, $container = DBH.area().container
		, $botones = $('.formCuerpo .botonesoperaciones .req-register')
		if(txt=="Ning&uacute;n registro seleccionado."){
			$('button.req-blank:visible,.form-toolbar[da_id="' + da_id + '"] button.req-blank,.list-toolbar[da_id="' + da_id + '"] button.req-blank').prop('disabled',false)
			$('button.req-register:visible,.form-toolbar[da_id="' + da_id + '"] button.req-register,.list-toolbar[da_id="' + da_id + '"] button.req-register').add($botones).prop('disabled',true)
			//$('.botones_principales:visible').removeClass('on')
			//$('#divCabeceraEtiqueta').removeClass('on')
		}else{
			$('button.req-blank:visible,.form-toolbar[da_id="' + da_id + '"] button.req-blank,.list-toolbar[da_id="' + da_id + '"] button.req-blank').prop('disabled',true)
			$('button.req-register:visible,.form-toolbar[da_id="' + da_id + '"] button.req-register,.list-toolbar[da_id="' + da_id + '"] button.req-register').add($botones).prop('disabled',false)
			//$('.botones_principales:visible').addClass('on')
			//$('#divCabeceraEtiqueta').addClass('on')
		}
		$('#divCabeceraEtiqueta').html(txt)
	}
	return pub;
} () );
var formCabeceraEtiquetaUpdate = formCabecera.formCabeceraEtiquetaUpdate
//$(loadTopPestanas)
