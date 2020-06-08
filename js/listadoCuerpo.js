function uidialoginit () {
	uidialog = (function() {
		$( "#ui-dialog" ).dialog({
			modal: true,
			width: 370
		});
		var pub = {}
		, $uidialog = $( "#ui-dialog" )
		$uidialog.dialog ( 'close' )
		pub.open = function (txt,tit) {
			if ( typeof txt == 'undefined' ) return false
			if ( typeof tit != 'undefined' ) $uidialog.dialog( "option", "title", tit );
			$uidialog.append(txt)
			$uidialog.dialog ( 'open' )
			this.title = function (t) {
				if ( typeof t != 'undefined' ) {
					$uidialog.dialog( "option", "title", t );
				} else {
					return $uidialog.dialog( "option", "title" );
				}
			}
			this.open = function () {
				$uidialog.dialog ( 'open' )
			}
		}
		pub.close = function (o) {
			$uidialog.dialog ( 'close' )
		}
		pub.modal = function (o) {
			$uidialog.dialog( "option", "modal", o );
		}
		pub.botones = function (objarr) {
			$uidialog.dialog( "option", "buttons", objarr )
			//alert('a')
		}
		pub.confirm = function (txt,tit,fn) {
			$uidialog.dialog( "option", "buttons",
			[
				{
					text: "Si",
					icons: {
						primary: "ui-icon-check"
					},
					click: function() {
						$( this ).dialog( "close" );
						fn()
					}
				},
				{
					text: "Cancelar",
					icons: {
						primary: "ui-icon-close"
					},
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			])
			pub.open (txt,tit)
		}
		return pub
	}());
}
function setforview ( o ) {
	return
	var $botonxls = $('#buttonxls' )
	$botonxls.hide()
	botonaddto.ver(0)
	var usu_perfil = parent.document.getElementById('usu_perfil').value
	if ( usu_perfil.toLowerCase().toString() == "Matriz" ) return false // si es Matriz, nada.
	if ( o == 'clientes' ) {$botonxls.show();botonaddto.ver(1)}
}
function autofiltaralempezar(){
	if (parent.document.getElementById('frame1loaded').value) {
		clearInterval(autofiltraralempezarInterval);
		parent.document.getElementById('iframeFormCuerpo').contentWindow.filterForm();
	}
}
function ajustarAlturaListado(){
	return false //OBSOLETO
	if(!$('#iframeFormCuerpo').length)return false
	var a = parent.document.getElementsByTagName('body')[0].offsetHeight
	var cteexplorer=0
	, alturafiltros = $('div.lwtinfo:visible').outerHeight()
	, alturamenu = $('#menuprincipallistado').outerHeight()
	, alturacabecera = $('.top-padding-div').outerHeight()
//	console.log(alturamenu)
	//, botonesformheight = $('.botonesform:visible').outerHeight()
	, hcorrector = alturamenu + alturacabecera + 37
	, hh = 'calc(100vh - ' + (alturafiltros+hcorrector) + 'px)'
	, hh2 = 'calc(100vh - ' + (hcorrector-14) + 'px)'
	//console.log(alturamenu+"*"+alturafiltros+"*"+hh)
	$('[id="divlist"]:visible').css({'height':hh})  //height(endheight)
	$('#iframeFormCuerpo').css({'height':hh2})  //height(endheight)
}
function cabezar(){
	var obarr =$('#listadoOrderBy').val().split(" ")
	, index=obarr[0]
	, desc = obarr.length == 2 ? 1 : 0
	, orderByDesc=document.getElementById('listadoOrderByDesc').value
	, etiquetasCampos=document.getElementById('etiquetasCampos').value
	//, $cabecera = $('.ui-sortable:visible')
	, $cabecera = $('[id="trCeldasEncabezados"]:visible')
	, primerafila=$cabecera[0]
	//, primerafila=document.getElementById('trCeldasEncabezados')
	, primerafilareflejo=document.getElementById('trCeldasEncabezadosReflejo')
	, neArr=etiquetasCampos.split(",")
	neArr.unshift('Id')
	while(primerafila.getElementsByTagName("td").length>1){
		primerafila.removeChild(primerafila.getElementsByTagName("td")[0])
		//primerafilareflejo.removeChild(primerafilareflejo.getElementsByTagName("td")[0])
	}
	while(primerafilareflejo.getElementsByTagName("td").length>1){
		$(primerafilareflejo.getElementsByTagName("td")[0]).remove()
	}
//	console.log(neArr)
	var primeracelda=primerafila.getElementsByTagName("td")[0]
	var primeraceldareflejo=primerafilareflejo.getElementsByTagName("td")[0]
	for (var k=0;k<neArr.length-1;k++){
		var cloneprimeracelda=primeracelda.cloneNode(true)
		primerafila.appendChild(cloneprimeracelda)
		var cloneprimeraceldareflejo=primeraceldareflejo.cloneNode(true)
		var $c = $(cloneprimeraceldareflejo)
		$(primerafilareflejo).append($c)
	}
	var celdas=primerafila.getElementsByTagName("td")
	var celdasreflejo=primerafilareflejo.getElementsByTagName("td")
	for (var k=0;k<celdas.length;k++){
		var ne = neArr[k]
		, but = '<div class="boton" style="width:100%;margin:0;z-index:-1;padding-left:0px;padding-right:0px;box-sizing:border-box;text-align:center"><span>'+ne+'</span></div>'
		celdas[k].style.color=""
		celdas[k].innerHTML=but
		celdas[k].name=k
		var butr = '<div style="height:0;max-height:;width:100%;overflow:;">' + but + '</div>'
		celdasreflejo[k].innerHTML=butr
		$(celdasreflejo[k]).css({'padding-top':0,'padding-bottom':0})
	}
// 	console.log(index+"**"+celdas.length)
	$(celdas).removeClass("cabecera-orderbythis up down")
	$( celdas[index-1]).addClass("cabecera-orderbythis").addClass(!desc?'up':'down')
	$('#tablaEncabezado #trCeldasEncabezados td').each ( function (i) {
		$(this).attr('orden',i)
		$(this).removeAttr('orderby')
	})
//	console.log(obi)
 	$(celdas[index-1]).attr('orderby',1)
}
function unificar(cb){
	var inputs=document.getElementsByTagName('input')
	var id1=""
	var id2=""
	var contador=0
	for(var i=0;i<inputs.length;i++){
		var inp=inputs[i]
		if(inp.type=="checkbox"&&inp.checked){
			contador+=1
			if(id1==""){id1=inp.id}else{id2=inp.id}
		}
	}
	if(contador>2){cb.checked=0;return false}
	if(contador<2){return false}
	var loc='unificador.asp?cod1='+id1+'&cod2='+id2
	if(confirm('Desea abrir el Unificador de registros para los 2 registros seleccionados?')){window.open(loc)}
}
function actualizarFila(){
}
function eliminarFila(idd){
  var trListado=$('#divlist #trListado'+idd)[0]
  if(trListado)trListado.style.display='none'
}
function ordenar(c){
	var noregistros=document.getElementById("numregs").value
	if ( noregistros != '0' ) DBH.telon.listado.show()//parent.mostrarTelon(1);
	setTimeout("ordenarListado('"+c+"')",10)
}
function ordenarListado(orderBy){
	var listadoView=document.getElementById('listadoView').value
	, orderByOld=document.getElementById('listadoOrderBy').value
	, orderByOldArr = orderByOld.split(" ")
	, orderByOld=orderByOldArr[0]
	, desc = orderByOldArr.length == 2 ? 1 : 0
	, nombresCampos=document.getElementById('nombresCampos').value
	, orderByDesc=document.getElementById('listadoOrderByDesc').value
	if(orderByOld==orderBy){
		if(!desc)orderBy = orderBy + ' desc'
		//if(orderByDesc=="asc"){orderByDesc="desc"}else{orderByDesc="asc"}
	//}else{
		//orderByDesc="asc"
	}
	var a = $('#iframeFormCuerpo').data('topform')
//	console.log(orderBy)
	if ( orderBy == 0 ) {
		document.getElementById("listadoOrderBy").value=$('#pkname').val()
	} else {
		document.getElementById("listadoOrderBy").value=a.campos[orderBy-1]
	}
	document.getElementById("listadoPagina").value="1"
	document.getElementById("listadoOrderByIndex").value=orderBy
	document.getElementById("listadoOrderBy").value=orderBy
	document.getElementById("listadoOrderByDesc").value=orderByDesc
	document.getElementById("scrollTop").value=0
	var tab = document.getElementById('tablaListado')
	var tabbody=tab.getElementsByTagName('tbody')[0]
	while(tab.rows.length>2){
		var nodo=tab.rows[1]
		tabbody.removeChild(nodo)
	}
	cabezar()
	listado.addOnePage(1)
}
var listado = ( function () {
	var pub = {}
	, loc = {}
	pub.pars=[]
	/*
	pub.limittovinculada = function ( eshija, areavinculada_id ) {
		var da_areamadre = $('.formCuerpo:visible').attr('da_areamadre')
		//, da_areahija = $('#listadoCuerpoContainer').find('.select_hijas').val()
		, da_areahija = areavinculada_id
		, $areamadre = $('.formCuerpo[da_id="'+da_areamadre+'"]')
		, $areahija = $('.formCuerpo[da_id="'+da_areahija+'"]')
		, $listado_areamadre = $('.listadoCuerpoContainer[da_id="'+da_areamadre+'"]')
		, $listado_areahija = $('.listadoCuerpoContainer[da_id="'+da_areahija+'"]')
		, vinculada_fkname = trim($('#vinculada_fkname').val())
		, vinculada_fkname_hija = $listado_areahija.find('.vinculada_fkname').val()
		, $listado = eshija ? $listado_areamadre : $listado_areahija
		, $area = eshija ? $areamadre : $areahija
		, vinculada_sql_fuck = $listado.find('.vinculada_sql').val()
		, vinculada_sql = eshija ? vinculada_sql_fuck : "SELECT " + vinculada_fkname_hija + " " + vinculada_sql_fuck.substring ( vinculada_sql_fuck.toLowerCase().indexOf('from') )
		//console.log($listado.find('.lwtinfo').text())
		, vinculada_sql_text = $area.attr('name') + ' <b>[' + $listado.find('.lwtinfo').text() + ']</b>'
		, keyname = eshija ? vinculada_fkname : $('#pkname').val()
		, vinculada_condition = vinculada_sql? keyname + " IN (" + vinculada_sql + ")" : ""
		//if(vinculada_condition != ''){pub.memoryfilter ( vinculada_condition, vinculada_sql_text) }
		//console.log(vinculada_sql_fuck)
		//console.log(vinculada_condition)
		//debugger
		return vinculada_condition
	}
	*/
	pub.get = function ( p,v ) {
		var pkname = $('#pkname').val()
		, listadoView=document.getElementById("listadoView").value
		//, selectinvertida = $('#selectinvertida').val() * 1
		, selectinvertida = $('[id="selectinvertida"]:visible').hasClass('color-tomato')
		//console.log(selectinvertida)
		if ( p == 'listadoWhere' ) {
			var lw = $('#listadoWhere').val()
			, lw2 = '1=1'
			$(loc.memoryfilter).each(function(i){
				lw2 += " AND (" + loc.memoryfilter[i][0] + ")"
			})
			if(selectinvertida) {
				//lw = lw + " AND " + pkname + " NOT IN ( SELECT " + pkname + " from " + listadoView + " where " + lw2 + " ) "
				lw = lw + " AND " + lw2
				lw = pkname + " NOT IN ( SELECT " + pkname + " from " + listadoView + " where " + lw + " ) "
			} else {
				lw = lw + " AND " + lw2
			}
			return lw
		}
		if ( p == 'listadoWhereText' ) {
			var lwt = $('#listadoWhereText').val()
			, lwt2 = ''
			$(loc.memoryfilter).each(function(i){
				lwt2 += loc.memoryfilter[i][1].replace(/<br>/gi," + ") + '<br>'
			})
			lwt = lwt2 + lwt
			return lwt
		}
		if ( p == 'memoryfilter' ) {
//			console.log(v)
			loc.memoryfilter = v
		}
		if ( p == 'checkedids' ) {
//			console.log(v)
			loc.checkedids = v
		}
	}
	pub.updateInfoWhere = function (nofilas,noregistros) {
		$ ( '.dbh-recordsinfo-container:visible' ).text(nofilas+' / '+noregistros )

		/*
		var lwt = $('#listadoWhereText').val()
		, html = ''
		, htmllast = '<div class="" style="white-space:normal">'+lwt.replace(/<br>/gi," + ")+'</div>'
		if ( nofilas || nofilas == 0 ) {
			$(".dbh-listado-etiqueta:visible").html ( '<div class="lwtinfo" style="min-height:11px"></div>' )
			var $botoneslistado = $('.listadoCuerpoContainer:visible')
			//console.log($botoneslistado.length)
			$botoneslistado.find(".recordsinfo").remove()
			$botoneslistado.append ( '<div class="recordsinfo" style=";position:absolute;float:right;margin:0px 0 0 0 ;padding:5px 10px 5px 10px;right:0;background:#ececec;top:65px ">'+nofilas+' / '+noregistros+'&nbsp;</div>' )
		}
		$(loc.memoryfilter).each ( function (i) {
			var lwt = loc.memoryfilter[i][1].replace(/<br>/gi," + ")
			, lworiginal = loc.memoryfilter[i][2]
			//, invertido = lworiginal
			//console.log("*"+lw.substr(0,7)+"*")
			html += '<div class="memoryfilter" style="white-space:normal"><div class="button-notin" style="" title="NOT IN: Invierte esta condición para obtener los registros EXCLUIDOS de la misma." index="' + i + '" onclick="listado.memoryfilter(this,undefined,1)" ><span class="fa fa-random"></span></div><div style="float:left;color:inherit">'+lwt+'</div><div style="float:right">&nbsp;+</div><div style="float:right" class="button-delete" index="' + i + '" onclick="listado.memoryfilter(this)"><span style="margin:-2px 0 0 -3px;font-size:10px;" class="genericon genericon-close" title="Eliminar este filtro memorizado"></span></div></div>'

		})
		var selectinvertida = $('[id="selectinvertida"]:visible').hasClass('color-tomato')
		, lwtinfo = html+htmllast
		, lwtinfo = selectinvertida ? "<div style='float:left;color:blue'>NOT IN&nbsp;</div>" + lwtinfo : lwtinfo
		$(".dbh-listado-etiqueta:visible .lwtinfo").html(lwtinfo)
		*/
		//var topform = DBH.area().topform
	}
	pub.memoryfilter = function (lwOrCheck,lwt,invert)  {
		if ( lwOrCheck == -1 ) {
			loc.memoryfilter = []
		}else{
			if ( lwt || ! lwOrCheck ) { // agregar filtro
				if ( ! lwOrCheck ) {
					var lw = $('#listadoWhere').val()
					, lwt = $('#listadoWhereText').val()
				} else {
					var lw = lwOrCheck
					, lwt = lwt
				}
				if (lw=='1=1') return false
				if ( ! loc.memoryfilter ) loc.memoryfilter = []
				loc.memoryfilter.push ( [lw,lwt,0] )
//				console.log(loc.memoryfilter[loc.memoryfilter.length-1])
			} else { // quitar filtro o invertir
				var i = $(lwOrCheck).attr('index')
				if ( !invert ) { //quitar
					loc.memoryfilter.splice ( i,1 )
				} else { //invertir
					var pkname = $('#pkname').val()
					, listadoView=document.getElementById("listadoView").value
					, lworiginal = loc.memoryfilter[i][2]
					if ( lworiginal ) {
						var lwt = loc.memoryfilter[i][1]
						loc.memoryfilter[i][0] = lworiginal
						loc.memoryfilter[i][1] = lwt.substring(7)
						loc.memoryfilter[i][2] = 0

					} else {
						var lw = loc.memoryfilter[i][0]
						, lwt = loc.memoryfilter[i][1]
						, lwi = pkname + " NOT IN ( SELECT " + pkname + " from " + listadoView + " where " + lw + " ) "
						loc.memoryfilter[i][0] = lwi
						loc.memoryfilter[i][1] = "NOT IN " + lwt
						loc.memoryfilter[i][2] = lw
						//$(lwOrCheck).addClass('checked')
						//console.log($(lwOrCheck).attr('class'))
					}
				}
			}
		}
		pub.updateInfoWhere()
		$('#memoryfilter').val(JSON.stringify(loc.memoryfilter))
	}
	pub.checkid = function (cell,ckd,noalert)  {
		//console.log(DBH.area().checkedids)
		var headercell = $( '.celdaCampoEncabezado:visible:first' )[0]
		if ( cell == 'all' ) {
			var ids= []
			headercell.checked = typeof ckd == 'undefined' ? ! headercell.checked : ckd
			if ( headercell.checked ) {
				$('.listado-rowheader:visible').add($(headercell)).addClass('listado-rowheader-selected').prop('checked',true)
				$('.filaListado:visible').addClass('listado-row-selected')
				var sessionid = DBH.sessionid//sessionStorage["sessionid"]//('')
				, pkname = $('#pkname').val()
				, sql = "SELECT idlistado FROM DBH_LISTADO WHERE sessionid='" + sessionid + "' AND pkname = '" + pkname + "'"
				, records = DBH.ajax.select ( sql )
				//console.log(sql)
				//console.log(records.length)
				$(records).each(function () {
					ids.push ( trim(this.idlistado) )
				})
			} else {
				$('.listado-rowheader:visible').add($(headercell)).removeClass('listado-rowheader-selected').prop('checked',false)
				$('.filaListado:visible').removeClass('listado-row-selected')
			}
			//ids.splice(ids.indexOf(""),1)
			//console.log(ids)
		} else {
			// i uncheck the 'all' selector
			$(headercell).removeClass('listado-rowheader-selected').prop('checked',false)
			//var checked = cell.checked
			var checked = $(cell).closest('tr').hasClass('listado-row-selected')
			, ids = DBH.area().checkedids
			//console.log(typeof ids!='undefined')
			, ids = ids ? ids : []
			//, DBH.area().formContainer.data('checkedids',(DBH.area().formContainer.data('checkedids') ? DBH.area().formContainer.data('checkedids') : []))
			, id = trim($(cell).text().replace(/\./g,"" ))
			if ( checked ) {
				if(ids.indexOf(id)==-1)ids.push ( id )
				//ids.push(id)
			} else {
				var pos = $.inArray ( id, ids )
				if ( pos > -1 ) ids.splice ( pos ,1 )
			}
		}
		if(!noalert){
			if (headercell.checked){
				alerta('Todos los registros marcados.', 1)
			}else{
				alerta(ids.length+ ' registros marcados.', 1)
			}
		}
			//console.log(ids)
			//DBH.area().formContainer.data('checkedids',ids)
		DBH.area().checkedids=ids.length?ids:[]
		DBH.area().setButtons()
	}
	pub.savehiddenpars = function () {
		var pars = []
		//console.log(findframenumber())
		pub.frid = pub.frid ? pub.frid : 10
		$('[type="hidden"]').each(function(){pars.push(this.value)})
		listado.pars[pub.frid] = pars
		return pub.loadhiddenpars()
	}
	pub.loadhiddenpars = function () {
		var j = findframenumber()
		pub.frid = j
		var pars = listado.pars[j]
		console.log(listado.pars[j])
		if ( !pars ) return false
		$('[type="hidden"]').each(function(i){this.value=pars[i]})
		return true
	}

	pub.init = function(levantarTelon){
		loading=0
		allrecordsloaded=0

		cabezar()
		listado.checkid('all',0,1)
		document.getElementById("listadoPagina").value="1"
		listado.addOnePage(1)


		if(levantarTelon){parent.mostrarTelon(0)}
	}
	function initTable(noCols) {
		//console.log('nocols'+noCols)
		//var noCols = root2.childNodes[0].childNodes.length-2
		var primerafila=$('#divlist #trListado')[0]
		var tab = loc.tab
		var root=loc.root
		while(primerafila.getElementsByTagName("td").length>1){
			primerafila.removeChild(primerafila.getElementsByTagName("td")[1])
		}
		for (var k=0;k<noCols;k++){
			var primeracelda=primerafila.getElementsByTagName("td")[0]
			var cloneprimeracelda=primeracelda.cloneNode(true)
			primerafila.appendChild(cloneprimeracelda)
		}
		$(primerafila).hide()
	}
	pub.listado_sql_syntax = {}
	pub.setTablaAuxiliar = function () {
		var pkname = $('#pkname').val()
		, idusuario=sessionStorage["usu_id"]//('usu_id')
		, sessionid=DBH.sessionid//'DBH' + sessionStorage["sessionid"]//('')
		, listadoView=document.getElementById("listadoView").value
		, listadoWhere=pub.get("listadoWhere")
		//console.log(listadoWhere)
		, listadoWhereText=pub.get("listadoWhereText")
		, vinculada_pkname = $('#vinculada_pkname').val()
		, vinculada_fkname = trim($('#vinculada_fkname').val())
		, eshija = vinculada_fkname != ''
		, keyname = eshija ? vinculada_fkname : pkname
		, sqlstr="delete DBH_LISTADO where (sessionid= '"+sessionid+"' AND pkname= '"+pkname+"') or fecha < dateadd(day,-1,getdate())"
		//console.log(sqlstr)
		//, arr=DBH.ajax.sql(sqlstr)
		//console.log('b')
		, vinculada_condition = $('#vinculada_sql').val()? " AND " + keyname + " IN (" + $('#vinculada_sql').val() + ")" : ""
		, vinculada_condition = ""
		, final_condition = "(" + listadoWhere + ")" + vinculada_condition
		, tiene_columna_dbh_perfiles_excluidos = $('.formCuerpo:visible').attr('tiene_columna_dbh_perfiles_excluidos') * 1
		, customview=$('.formCuerpo:visible').attr('customview')
		, usu_perfiles_admitidos=sessionStorage["usu_perfiles_admitidos"]//('')
		//console.log(usu_perfiles_admitidos)
		, dbh_perfiles_excluidos_condicion = ''
		if (tiene_columna_dbh_perfiles_excluidos && usu_perfiles_admitidos != '') {
			var config_usu_perfil_arr = usu_perfiles_admitidos.split(" ")
			$(config_usu_perfil_arr).each(function(){
				dbh_perfiles_excluidos_condicion += "(' '+COALESCE(" + customview + ".dbh_perfiles_admitidos_xreg ,'')+' ') LIKE ('% " + this.replace(".","") + " %') OR "
			})
			dbh_perfiles_excluidos_condicion = " AND (" + dbh_perfiles_excluidos_condicion + " 1=2 )"
		}
		pub.listado_sql_syntax._delete = encodeURIComponent(sqlstr)
		var sql_sel = "Select '"+sessionid+"',"+idusuario+"," + pkname+",'" + pkname + "' from " + listadoView + " where " + listadoWhere + dbh_perfiles_excluidos_condicion
		, sqlstr="set dateformat dmy insert into DBH_LISTADO (sessionid,idusuario,idlistado,pkname) (" + sql_sel + ")"
		, vinculada_sql = "Select " + keyname + " from " + listadoView + " where " + final_condition
		, vinculada_sql = "Select " + pkname + " from " + listadoView + " where " + final_condition
		, areaname = $('#menuPrincipal .menu1OpcionSeleccionada').text()
		, vinculada_sql_text = areaname + " ( " + listadoWhereText + " )"
		//, j = eshija?findframenumber()-1:findframenumber()+1
		, $areavinculada = $('#listadoCuerpoContainer')
		$areavinculada.find('.vinculada_sql').val(vinculada_sql)
		$areavinculada.find('.vinculada_sql_text').val(vinculada_sql_text)
		pub.listado_sql_syntax._insert = encodeURIComponent(sqlstr)
		//var arr=DBH.ajax.sql(sqlstr)
		DBH.consola(sqlstr,{title:'setTablaAuxiliar'})
	}
	pub.loadSql = function (cb) {
//		console.log('Ejecutando consulta...')
		if ( pub.loadSql.loading ) { setTimeout ( function () { pub.loadSql ( cb ) } , 100 ); return false }
		pub.loadSql.loading = true
		var d=new Date()
		, sessionid=DBH.sessionid//'DBH'+sessionStorage["sessionid"]//('')
		, pkname = $('#iframeFormCuerpo').data('topform').pkname
		, listadoView=document.getElementById("listadoView").value
		, noregistros=document.getElementById("numregs").value
		, listadoPagina=document.getElementById("listadoPagina").value
		, listadoWhereText=document.getElementById("listadoWhereText").value
		, listadoOrderBy=document.getElementById("listadoOrderBy").value
		, listadoOrderByIndex=document.getElementById("listadoOrderByIndex").value
		, listadoOrderByDesc=listadoOrderBy<=0 ? 'desc':'asc'
		//, listadoOrderBy = listadoOrderBy ? listadoOrderBy : $('[customview][customview!=""]:visible').attr('customview') + '.fechaUM desc'
		, da_id = DBH.area().id
		, sql_orderby_default = '1 desc'
		//, sql_orderby_default = "(SELECT max(his_fecha) FROM dbh_historico WHERE his_pkvalue=" + pkname + " AND his_da_id=" + da_id + ") desc"
		, listadoOrderBy = listadoOrderBy ? listadoOrderBy : sql_orderby_default
		, nombresCampos=document.getElementById("nombresCampos").value
		, pkname=document.getElementById("pkname").value
		, customview = $('.formCuerpo:visible').attr('customview')
		, customview = $('.formCuerpo:visible').attr('customview')
		if ( ! $('#iframeFormCuerpo').data('topform') ) {
			console.log('No hay topform')
			return false
		}
		loc.esprimeracarga=0
		//console.log('listadoWhere'+listadoWhere)
		if(noregistros == ""){
			loc.esprimeracarga=1
			//pub.setTablaAuxiliar()
		}
		var lob = isNaN(listadoOrderBy) ? customview+"."+listadoOrderBy : listadoOrderBy
		//, joinhistorico = " LEFT JOIN dbh_historico as historico ON historico.his_da_id = " + DBH.area().id + " AND historico.his_pkvalue = " + pkname + " AND historico.his_id IN (select max(his_id) from dbh_historico group by his_da_id,his_pkvalue)"
		, joinhistorico = " INNER JOIN dbh_historico ON his_da_id = " + DBH.area().id + " AND his_pkvalue = " + pkname + " AND his_id IN (select max(his_id) from dbh_historico group by his_da_id,his_pkvalue)"
		, joinhistorico = ""
		if(listadoView=='dbh_historico')joinhistorico=""
		var sql="SELECT " + customview + "." + pkname + "," + nombresCampos + " from " + listadoView + joinhistorico + " where " + customview + "." + pkname + " in (select idlistado from DBH_LISTADO where sessionid='" + sessionid + "' AND pkname='" + pkname + "')"
		if (listadoOrderBy) sql += " ORDER BY "+listadoOrderBy//+" "+listadoOrderByDesc
//		console.log(sql)
		//var res = DBH.ajax.select(sql)
		loc.t2=d.getTime()
		pub.listado_sql_syntax._select = encodeURIComponent(sql)
		pub.listado_sql_syntax._count = encodeURIComponent(" SELECT count ( " + pkname + ") as numregs FROM " + listadoView)
		//var objXMLDoc=ajaxExecuterPaged(pub.listado_sql_syntax,listadoPagina,0)

		const request = function (listado_sql_syntax,pagina){
			let {_select,_insert,_delete,_count} = listado_sql_syntax
			var sqlll = "pagina="+pagina+"&regXPag="+sessionStorage['regXPag']+"&sqlCount="+_count+"&sqlDelete="+_delete+"&sqlInsert="+_insert+"&sqlSelect="+_select
				console.log(sqlll)
				$.ajax({ type: "POST",
					url: 'selectXMLpaged.asp',
					async: true,
					dataType: 'xml',
					data: sqlll,
					success : function ( objXMLDoc ) {
						//console.log(objXMLDoc)
						if ( ! objXMLDoc.getElementsByTagName ) { return false}
						var root2=objXMLDoc.getElementsByTagName("xml")[0];
						loc.root2 = root2;
						//console.log(root2)
						if(typeof root2 == "undefined" || typeof root2.childNodes == "undefined" || typeof root2.childNodes[1] == "undefined"){
							//document.getElementById('divencabezados').style.display='none';
				//			console.log('nauj')
							noregistros = 0;
							resumenQuery(0,0,0);
							listado.updateInfoWhere(0,0);
							//parent.mostrarTelon(0);
						} else {
							if ( listadoPagina == '1' ) {
								noregistros = root2.childNodes[root2.childNodes.length-1].childNodes[0].textContent
							} else {
								noregistros = document.getElementById("numregs").value
							}
						}
						document.getElementById("numregs").value=noregistros
						loadingState(0)
						var d=new Date()
						cb()
						pub.loadSql.loading = false
					},
					error: function ( jqXHR, textStatus, errorThrown)
					{
						console.log('jode marrana')
						alerta ( 'Error en sentencia SQL.' )
						DBH.telon.listado.hide()
						pub.loadSql.loading = false
						console.log(errorThrown)
					}
				});
		}(pub.listado_sql_syntax,listadoPagina)
/*

		return
		loc.t3=d.getTime()
		if ( ! objXMLDoc.getElementsByTagName ) { return false}
		var root2=objXMLDoc.getElementsByTagName("xml")[0];
		loc.root2 = root2;
		//console.log(root2)
		if(typeof root2 == "undefined" || typeof root2.childNodes == "undefined" || typeof root2.childNodes[1] == "undefined"){
			//document.getElementById('divencabezados').style.display='none';
//			console.log('nauj')
			noregistros = 0;
			resumenQuery(0,0,0);
			listado.updateInfoWhere(0,0);
			//parent.mostrarTelon(0);
		} else {
			if ( listadoPagina == '1' ) {
				noregistros = root2.childNodes[root2.childNodes.length-1].childNodes[0].textContent
			} else {
				noregistros = document.getElementById("numregs").value
			}
		}
		document.getElementById("numregs").value=noregistros
		loadingState(0)
		var d=new Date()
		cb()
		//pub.addOnePage()
		*/
	}
	pub.addOnePage = function (reload) {
		loadingState(0)
		if ( $('#fullLoaded').val()*1 ) {
			if ( !reload ) return false
			$('#fullLoaded').val('0')
			document.getElementById("listadoPagina").value = '1'
		}
		DBH.telon.listado.show()

		const render = function () {
			var root2 = loc.root2
			var noregistros=document.getElementById("numregs").value
//			console.log("noregistros"+noregistros)
			var regXPag=document.getElementById("regXPag").value
			var listadoWhereText=document.getElementById("listadoWhereText").value
			var listadoPagina = document.getElementById("listadoPagina").value
			var imin = regXPag*(listadoPagina-1)
			var imax = regXPag*listadoPagina
			imin = 0
			imax = regXPag*1
			//console.log('listadoPagina'+listadoPagina)
			//console.log ( noregistros + '---' + imin + '-----' + imax )
			if ( listadoPagina == '1' ) {
				//console.log('initTable')
				var noCols = root2.childNodes[0].childNodes.length-1
				initTable(noCols)
			}
			if( typeof root2 == 'undefined' || noregistros == 0 ) {
				$('#fullLoaded').val('1')
				DBH.telon.listado.hide()
				return false
			}
			//ES UNA SOLA PÁGINA
			if ( noregistros*1 < regXPag*1 ) {
				imax = noregistros
				$('#fullLoaded').val('1')
			}
			var regsExcedentes = noregistros - regXPag*(listadoPagina-1)
			//ES LA ÚLTIMA PÁGINA
			//console.log(regsExcedentes+' '+imax)
			if ( ( regsExcedentes >= 0 && regsExcedentes <= imax ) ) {
				imax = regsExcedentes
				$('#fullLoaded').val('1')
			}

			//HA SUPERADO LAS CONDICIONES Y EMPIEZA EL RENDERIZADO

	//		console.log('Renderizando los resultados en pantalla...')
			document.getElementById('divencabezados').style.display="block"
			var idlistado=document.getElementById('idlistado').value
			var tab = document.getElementById('tablaListado')
			loc.tab = tab
			var root = tab.rows[0].parentNode;//the TBODY
			loc.root = root
			var $fields = $(root2.childNodes[0]).children()
			, tipos = []
			, area = DBH.area()
			, etiquetaslistadovars = area.topform.etiquetaslistadovars()
			, checkedids = area.checkedids
			, recid = area.recid
			, $formcontainer = area.topform.$container
			//console.log($fields)
			$fields.each(function(){
				var $f = $(this)
				, tipo = $f.attr('tipo')
				, id = $f.prop('tagName')
				, selector = '.dbh_fecha_color[id*="'+id+'"]'
				, $ff = $formcontainer.find(selector)
				tipos.push($ff.length)
			})
			for(var i=imin;i<imax;i++){
				var reg = root2.childNodes[i]
				var idListado=reg.childNodes[0].textContent
				var clone=tab.rows[0].cloneNode(true);//the clone of the first row
				clone.setAttribute("id","trListado"+idListado)
				clone.style.display='table-row'
				if(idListado==idlistado){parent.menu1Seleccionar(clone,$('#listadoCuerpoContainer')[0].getElementsByTagName('tr'))}
				var celdas=clone.getElementsByTagName('td')
				var celdasencabezados=document.getElementById('trCeldasEncabezados').getElementsByTagName("td")
	//if (1==2){
	//----------------- LOOP X CELDAS
				for(var j=0;j<celdas.length;j++){
					var celda = celdas[j]
					, $celda = $(celda)
					, nodocampo=reg.childNodes[j]
					if(typeof nodocampo=="undefined")alert("fila:"+i+" columna:"+j+" ultimo valor util: "+(reg.childNodes[j]?reg.childNodes[j].textContent:'inaccesible'))
					var valorcampo=nodocampo.textContent//.replace(new RegExp("<","g"),"&#60;")
					var tipo=nodocampo.getAttribute("tipo")
					//console.log(j+' '+celdasencabezados.length)
					if(tipo<10||tipo==135){
						$celda.css("text-align","right")
	//					console.log(j)
						celdasencabezados[j].style.textAlign='right'
						valorcampo=valorcampo.replace(",",".")
						valorcampo=parent.separarMiles(valorcampo,".")
					}
					if(tipo==135&&valorcampo!=""){
						var v=valorcampo.split("/")
						valorcampo=v[0]+"/"+v[1]+"/"+v[2]
						if(valorcampo.length > 16)valorcampo=valorcampo.substring(0,16)
						$celda.css("text-align","center")
					}
					if(tipo>200){celda.style.whiteSpace='normal'}

					if(j==0){
						var $vv=$('<button class="boton listado-rowheader" style="" >'+valorcampo+'</button>')
						$celda.addClass('boton listado-rowheader')
						$celda.click(function(event){
							var $this = $(this)
							, checked = $this.hasClass('listado-rowheader-selected')
							if(!checked){
								$this.closest('tr').addClass('listado-row-selected')
								$this.addClass('listado-rowheader-selected')
							}else{
								$this.closest('tr').removeClass('listado-row-selected')
								$this.removeClass('listado-rowheader-selected')
							}
							pub.checkid(this)
							event.stopPropagation()
						})
						$celda.append ( valorcampo );
					} else {
						var valor = $('<div/>').text(valorcampo).html()
						, linesArray = valorcampo.split(new RegExp(" \\*\\* ","g"))
						, endVal = ""
						linesArray.forEach ( line => {endVal += line + '<br>'})
						$celda.append ( endVal );
						//console.log()
					}
					if($celda.css('text-align')=='')$celda.css('text-align',($(celda).text().length<3)?'center':'left')
					if(tipos[j])$celda.addClass('dbh_fecha_color')
					var grupo = etiquetaslistadovars.grupos[j-1]
					if( grupo && grupo != '' ){
	//				console.log( grupo )
						$celda.addClass('dbh_valores_color').attr('grupo', grupo )
					}
				}
	//----------------- /LOOP X CELDAS
	//}
				var lastrow=tab.rows[tab.rows.length-1]
				root.insertBefore(clone,lastrow)
				var esseleccionado = idListado == recid ? 1: 0
				, eschecked = checkedids.indexOf(idListado) > -1 ? 1 : 0
				, $tr = $(clone)
				, $tdid = $tr.find('.listado-rowheader')
				if(esseleccionado) {
					$tr.addClass ('menu1OpcionSeleccionada')
				}
				if (eschecked) {
					$tr.addClass ('listado-row-selected')
					$tdid.addClass ( 'listado-rowheader-selected' )
				}
			}
			document.getElementById("listadoPagina").value=listadoPagina*1+1*1
			var nofilas=tab.getElementsByTagName('tr').length
			nofilas-=2
			listado.updateInfoWhere(nofilas,noregistros)
			var tb=(loc.t3-loc.t2)/1000
			if(loc.esprimeracarga)resumenQuery(0,tb,0)
			ajustarAnchoEncabezados()
			DBH.date().setcolor($('td.celdaCampoAncho:visible.dbh_fecha_color'))
			DBH.valueLists().setColor()
			DBH.telon.listado.hide()
		}

		pub.loadSql(render)
	}
	return pub;
} () );
/*
function load1record(idListado){
//	console.log('a')
	$('.formCuerpo:visible').data('topform').load(idListado)
	//menu1Seleccionar($("#divlist #trListado"+idListado)[0],$('#listadoCuerpoContainer')[0].getElementsByTagName('tr'))
	return
  var campos=parent.document.getElementById('iframeFormCuerpo').contentWindow.campos
  //var idListado=document.getElementById('idlistado').value
  if(typeof campos=="undefined")return false
  clearInterval(load1recordinterval)
  if(parent.document.getElementById('iframeFormCuerpo').contentWindow.loadForm(idListado)){
  	parent.menu1Seleccionar($("#divlist #trListado"+idListado)[0],$('#listadoCuerpoContainer')[0].getElementsByTagName('tr'))
  };
}
*/
function resumenQuery(ta,tb,tc){
  var listadoWhere=document.getElementById("listadoWhere").value
  var listadoWhereText=document.getElementById("listadoWhereText").value
  var area=document.getElementById("listadoView").value
  if(area=="naujViewListadoClientes")area="Clientes"
  if(area=="naujViewListadoPolizas")area="Polizas"
  if(area=="naujViewListadoRecibos")area="Recibos"
  if(area=="naujViewListadoSiniestros")area="Siniestros"
  var numregs=document.getElementById("numregs").value
  var t="<b>Condiciones</b><br>" + listadoWhereText + "<br><br><b>Estad&iacute;stica</b><br>N&uacute;mero de resultados: " + numregs + ".<br>Tiempo empleado: " + parent.redondear(tb,2) + " seg.<br><br><b>Sintaxis t&eacute;cnica</b><br>" + listadoWhere + "."
  var divcajaloading=document.getElementById('divcajaloadingtext')
  divcajaloading.innerHTML=t
}
function monthtext(m){
	if(m==1)return "Jan"
	if(m==2)return "Feb"
	if(m==3)return "Mar"
	if(m==4)return "Apr"
	if(m==5)return "May"
	if(m==6)return "Jun"
	if(m==7)return "Jul"
	if(m==8)return "Aug"
	if(m==9)return "Sep"
	if(m==10)return "Oct"
	if(m==11)return "Nov"
	if(m==12)return "Dic"
}
function estadoImagenes(cell,imagen1Listado,imagen2Listado,idListado){
	var imgs=cell.getElementsByTagName('img')
	imgs[0].setAttribute("id","img1"+idListado)
	imgs[1].setAttribute("id","img2"+idListado)
	imgs[0].style.visibility=imagen1Listado==1?'visible':'hidden'
	imgs[1].style.visibility=imagen2Listado==1?'visible':'hidden'
  var check=cell.getElementsByTagName('input')[0]
  check.setAttribute("id",idListado)
}
function scrollHeader(d){
	//var p=parent.document.getElementById('iframeListadoCabecera').contentWindow.document
	var p = document.getElementById('divencabezados')
	//p.style.marginLeft=-1*d.scrollLeft
	$('#divencabezados').css ( 'left' , (-1*d.scrollLeft) )
	//$('#divencabezados').scrollLeft ( d.scrollLeft )
//	console.log(d.scrollLeft)
}
function loadingState(o){
	//var filaLoading=document.getElementById('divLoading')

	if(o=="1"){
		loading=true
		//filaLoading.style.display='block'
		return true
	}else{
		loading=false
		//filaLoading.style.display='none'
	}
	return false

}
function scrollEventHandler(d){

	scrollHeader(d);
	//return false //obsoleto
	var tab = document.getElementById('tablaListado')
	var nofilas = tab.getElementsByTagName('tr').length
	nofilas-=2
	var noregistros=document.getElementById("numregs").value
	//console.log(!($('#fullLoaded').val()*1))
	//console.log(d.scrollTop*1+d.clientHeight*1>d.scrollHeight/2)
	//console.log((d.scrollTop*1+d.clientHeight*1>d.scrollHeight/2 && !($('#fullLoaded').val()*1) ))
	if(d.scrollTop*1+d.clientHeight*1>(3*d.scrollHeight/4) && !($('#fullLoaded').val()*1) ){
		if(typeof loading != 'undefined' && loading)return false;
		//if(loadingState(1))setTimeout('avanzarListado()',10)
		//listado.addOnePage()
		//console.log(loadingState(1))
		if(loadingState(1))setTimeout('listado.addOnePage()',10)
		var scrollTopNow=document.getElementById("divlist").scrollTop
		var scrollTopOld=document.getElementById("scrollTop").value
		if(scrollTopNow<scrollTopOld){document.getElementById("scrollTop").value=scrollTopNow;loadingState(0);return false}
		document.getElementById("scrollTop").value=scrollTopNow
	}
}
function ajustarAnchoEncabezados(){
//	console.log('ajustarAnchoEncabezados')
  var tab=document.getElementById('tablaListado')
  //console.log($(tab).length)
  var root=tab.rows[0].parentNode;//the TBODY
  var tab2=document.getElementById('tablaEncabezado')
  var root2=tab2.rows[0].parentNode;//the TBODY
  var j = tab.rows[1].cells.length
  $('#tablaEncabezado').width($('#tablaListado').width())
  for(var i=0;i<j;i++){
  	var a = tab.rows[1].cells[i].offsetWidth
  		$(tab2.rows[0].cells[i]).width ( a )
  		//$(tab.rows[1].cells[i]).width ( a )

  }
}
function cerrarDrops(){
	var d=document.getElementById('divcajaloading');
	var bot=document.getElementById('botonMore');
	var o=event.target? event.target : event.srcElement;
	var ocultar=false;
	if(o.id==bot.id){
		if(d.style.display=='none'){
			d.style.display='block'
		  o.className='boton botondropopened'
		}else{
			ocultar=true
		}
	}else{
	  if(o.id!='divcajaloadingtext')ocultar=true
	}
	if(ocultar){
		d.style.display='none'
		bot.className='boton'
	}
}
function findframenumber () {
		var j = -1
	$('#celdaforms>div').each(function(i){if($(this).is(":visible"))j=i}) //
	return j
}
function reFilter(listadoWhere,listadoWhereText,levantarTelon){
//	console.log(listadoWhere)

	//if(listadoWhere){
		document.getElementById('listadoWhere').value=listadoWhere
		document.getElementById('listadoWhereText').value=listadoWhereText
		document.getElementById('idlistado').value=""
		if(DBH.recordsearch && listadoWhere != "1=1" )
			vars.crearInforme(1)
	//}
	DBH.recordsearch = 0
	document.getElementById('listadoPagina').value="1"
	document.getElementById('scrollTop').value="0"
	document.getElementById('numregs').value=""

	var tab = document.getElementById('tablaListado')
	while(tab.rows.length>2){
		tab.deleteRow(1)
	}
	var topform = DBH.area().topform
	, etiquetasListado = topform.etiquetas().get()
//	console.log(etiquetasListado)
	, etiquetasHasInlineformParam = 0
	$(etiquetasListado).each(function(i){
		var eti = this
		, id = eti[0]
		, label = eti[1]
		, grupo = eti[2]
		, sqlParams = eti[3]
		if ( sqlParams ) {
			var groupedColumnSql = topform.queryEditor.groupedColumnSql(sqlParams)
			//, columnSql = "(SELECT distinct cast(" + sqlParams.fields + " as varchar(max)) + ', ' FROM " + sqlParams.table + " WHERE (" + groupedColumnSql + ") AND " + sqlParams.where + " FOR XML PATH(''))"
			//, columnSql = "(SELECT distinct convert(varchar(max)," + sqlParams.fields + ",103) + ' ** ' FROM " + sqlParams.table + " WHERE (" + groupedColumnSql + ") AND " + sqlParams.where + " FOR XML PATH(''))"
			, columnSql = "(SELECT distinct convert(varchar(max)," + sqlParams.fields + ",103) + ' ** ' FROM " + sqlParams.table + " WHERE " + sqlParams.where + " FOR XML PATH(''))"
			etiquetasListado[i][0] = columnSql
			etiquetasHasInlineformParam = 1
			console.log(columnSql)
		}
	})
	if( etiquetasHasInlineformParam ){
		topform.etiquetas().set (etiquetasListado)
	}
		//console.log('aaaaaa')
	if(levantarTelon!=0)levantarTelon=1
	listado.setTablaAuxiliar()
	listado.init(levantarTelon)
}
function updateFilter(idlistado){
	//document.getElementById('idlistado').value=idlistado
	//reFilter()
}
function addto(param) {
	if ( !confirm ( 'Si continua alterará de forma permanente información en todos los registros del listado.\n\n¿Desaa continuar?' ) ) return false
	var $select = $(event.target).closest ( 'div[id^="tabs"]' ).find('select')
		,selectid = $select.attr ( 'id' )
		,selectvalue = $select.val()
		,selecttext = $select.find('option:selected').text()
		,sessionid=DBH.sessionid//'DBH'+sessionStorage["sessionid"]//('')
	if ( selectid == 'usu_id' ) {
		var sql = "UPDATE personas SET iddepartamento = " + selectvalue + " WHERE codpersona IN ( SELECT idlistado FROM DBH_LISTADO WHERE sessionId = '" + sessionid + "')"
		parent.sqlExec ( sql, 0 )
		console.log(sql)
		alert('Se han asignado todas las personas del listado al usuario asesor "' + selecttext + '"')
	} else if ( param == 'quitar' ) {
		var sql = "DELETE personas_sectores WHERE idsector = " + selectvalue + " AND idpersona IN ( SELECT idlistado FROM DBH_LISTADO WHERE sessionId = '" + sessionid + "' )"
		parent.sqlExec ( sql, 0 )
		console.log(sql)
		alert('Se han eliminado del grupo de clientes "' + selecttext + '" todas las personas del listado.')
	} else {
		var sql = "INSERT INTO personas_sectores ( idsector, idpersona ) ( SELECT " + selectvalue + ", idlistado FROM DBH_LISTADO WHERE sessionId = '" + sessionid + "' AND idlistado NOT IN ( SELECT idpersona FROM personas_sectores WHERE idsector = " + selectvalue + " ) )"
		parent.sqlExec ( sql, 0 )
		console.log(sql)
		alert('Se han añadido todas las personas del listado al grupo de clientes "' + selecttext + '"')
	}
}
