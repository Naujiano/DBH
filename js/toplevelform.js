var toplevelform_elements = []
var toplevelform = function (objpar) {
	this.sqlSelectListado = function ($i) {
		var	id = $i.attr('id')
		, name = $i.attr('name')
		, sql = $i.attr('data-sql-listado')
		, grupo = $i.attr('grupo')
		if ( sql ) {
			sql = "(" + sql + ")"
		} else if ( grupo ) {
			sql = "(SELECT des FROM DBH_LISTAS b WHERE grupo = '" + grupo + "' AND b.li1_id = " + id + ")"// AS [" + id + "]"
		} else if ( $i[0].tagName == 'SELECT' ) {
			var $options = $i.find('option[value]')
			, sql = '(CASE '
			$options.each ( function (i) {
				sql += ' WHEN ' + id + " = '" + $(this).val() + "' THEN '" + $(this).text() + "'"
			})
			sql += ' END)'
		} else {
			sql = id
		}
			//console.log(sql)
		return sql
	}
	this.multicolumns = function (nocols) {
		if (!nocols) nocols = 1
		if ( !that.$container.find('.multicolumn-column').length ) {
			var $divs = that.$container.children().filter('div').detach()
		} else {
			var $divs = that.$container.find('.multicolumn-column').children().detach()
			that.$container.find('.multicolumn-column').remove()
		}
		for(var i = 0; i < nocols; i++ ) {
			that.$container.append('<div class="multicolumn-column" column-index="'+i+'"/>');
			that.$container.find('.multicolumn-column').on('scroll',function(){ $(document).trigger('scrolled') });
		}
		var $cols = that.$container.find('div.multicolumn-column').css({'width':'calc(100% / '+nocols+')','height':'100%' })
		, colactual = 0
		, tieneorden = $divs.filter('[order-index]').length
		$divs.each ( function (i) {
			if (tieneorden) {
		//console.log(tieneorden)
				var $div = $divs.filter('[order-index="'+i+'"]')//$(this)
			} else {
				var $div = $(this)
				$div.attr('order-index',i)
			}
			var $col = $cols.filter('[column-index="'+colactual+'"]')
			$col.append($div)
			if(i>0)colactual++;
			colactual = colactual > ( nocols - 1 ) ? 0 : colactual;

		})
		if ( nocols > 2 ) {
			$cols.addClass('fields-width-controlled')
		} else {
			$cols.removeClass('fields-width-controlled')
		}
		DBH.area().topform.$container.find('textarea.inputText').each(function(){setTextareaHeight(this)})
		$cols.droppable({
			/*
			drop: function( event, ui ) {
				var $col = $(this)
				, colindex = $col.attr('column-index')
				console.log(colindex)
			}
			*/
		}).sortable({
			handle : 'h4',
			stop: function (event,ui) {
				$(ui.item).css({'width':'','position':'relative','height':'auto'})
			}
		});
		$divs.draggable({
			revertDuration : 0,
			connectToSortable : '.multicolumn-column',
			handle : 'h4',
			revert: function( $col ) {
				//console.log(is_valid_drop)
				var $this = $(this)
				if ( !$col || $col.is ( $this.closest ('.multicolumn-column' ) ) || ! $col.is ( '.multicolumn-column' ) ) {
					return true;
				} else {
					//var $div = $this.detach()
					//$col.prepend ( $div )
					//return true;

				}
			}

		});
		//that.$container.find('div').css({'width':'50%'}).append($divs);
	}
	this.toptabs = function () {
		// TOP FORM BUTTON BAR
		var $buttonbar = $('<div class="topform-buttonbar topform-buttonbar-'+tabla+'" style="width:100%;"></div>')
		, $container_botones = $buttonbar.append('<div style="width:calc(100% - 40px);" class="topform-buttonbar-container-tabs"></div>' ).find('.topform-buttonbar-container-tabs')
		, $barras = $container.find('.divinlineform').add($container.find('.blockbutton-autocreate'))
		, nobotones = $barras.length
		, anchoboton = 100 / nobotones
//		console.log(nobotones)
		$buttonbar.$buttons = []
		$barras.each ( function (i) {
			var $inlineform = $(this)
			var name = i
			, tit = $inlineform.attr('title')
			, $button = $('<button class="boton botonancho botongenericicons pestanas" style="width:' + anchoboton + '%;text-transform:capitalize;max-width:none;" title="' + tit + '">' + tit + '</button>')
			//$button.
			$button.on ( 'click', function () {
				var blockbutton = $inlineform.parent().find('.blockbutton').data('blockbutton')
				, locked = $('.locked:visible').length
				, ilf = $inlineform.data('inlineform')
				, state = this.checked?0:1
				this.checked = state
				if ( ! locked ) that.closeAll()
				if ( state ) {
					blockbutton.abrir(1)
					if ( ilf ) ilf.show()
				} else {
					blockbutton.cerrar()
				}
				//that.setbuttonbar()
			})
			$buttonbar.$buttons.push( $button)
			$container_botones.append ( $button )
		})
		var $button = $('<button class="boton botonancho botongenericicons lock pestanas" style="width:40px;"><div class="genericon genericon-lock" style="position:relative;left:23px;top:-3px;font-size:7px">&nbsp;</div></button>')
		$button.click(function(){var t = $(this);if(t.is('.locked')){t.removeClass('locked');t.css('background','')}else{t.addClass('locked');t.css('background','yellow')}})
		$buttonbar.append($button)
		$buttonbar.$barras = $barras
		that.$buttonbar = $buttonbar
		var btb = $('#divnavegacionpestanas')
		btb.append(that.$buttonbar)

	}
	this.sortableColumns = function () {
		var  $s = $( '[id="tablaEncabezado"] [id="trCeldasEncabezados"]' )
		if ( $s.is(".ui-sortable") ) return false
		$s.sortable({
			placeholder: "ui-state-highlight"
			//, zIndex: 999999999
			, containment: $s
			, scroll : false
			, start: function ( event, ui ) {
				$('.ui-state-highlight').width(1)
				$('.ui-state-highlight').height($('#tablaListado').height()+20)
				var $helper = ui.helper
				$helper.show().css({'min-height':$s.outerHeight()})
			}
			, beforeStop: function( event, ui ) {
				var $item = ui.item
				, $helper = ui.helper
				, $idcell = $s.find('td:visible').first()
				, itemtext = $item.text().toLowerCase()
				, isidcell = itemtext == 'id'
				, dif = $helper.offset().left-$idcell.offset().left
				//console.log(dif)
				if(dif==0||isidcell){
					alerta('No se puede mover la columna ID');
					//$s.sortable("cancel");
					return false
				}
			}
			, stop: function ( event, ui ) {
				$('#iframeFormCuerpo').data('topform').sortcolumns()
			}
		});
	}
	toplevelform_elements.push(this)
	var that = this
	,da_id = objpar.da_id
	,da_nivel = objpar.da_nivel
	,sql_main = objpar.sql
	,pkname = objpar.pkname
	,pkname = pkname.substring(pkname.indexOf('.')+1)
	,tabla = objpar.tabla
	,pktabla = objpar.pktabla
	,customview = tabla?tabla:pktabla
	,vinculada_pkname = objpar.vinculada_pkname
	,vinculada_fkname = objpar.vinculada_fkname
	,da_areamadre = objpar.da_areamadre
	,da_pktabla_madre = objpar.da_pktabla_madre
	,da_pkfield_madre = objpar.da_pkfield_madre
	,da_pkfield_madre = da_pkfield_madre.substring(da_pkfield_madre.indexOf("."))
	,da_pkfield_madre = da_pktabla_madre + da_pkfield_madre
	,tabla = da_areamadre ? "(" + customview + " INNER JOIN " + da_pktabla_madre + " ON " + customview + "." + vinculada_fkname + "=" + da_pkfield_madre + ")" : tabla
	//,tabla = tabla + " LEFT JOIN dbh_historico ON his_da_id = " + da_id + " AND his_pkvalue = " + customview + "." + pkname + " AND his_id IN (select max(his_id) from dbh_historico group by his_da_id,his_pkvalue)"
	,selectListado = objpar.selectListado
	,etiquetasListado = objpar.etiquetasListado
	,orderindexListado = objpar.orderindexListado
	,container = objpar.container
	,da_nombre_hijas = objpar.da_nombre_hijas
	,pkhija = objpar.vinculada
	,da_ids_relacionantes = objpar.da_ids_relacionantes
	,da_nombres_relacionantes = objpar.da_nombres_relacionantes
	,vinculada = pkhija
	,vinculada_name = objpar.vinculada_name
	,fromDB = objpar.fromDB // NOMBRE DEL AREA
	,custom_buttons_code = objpar.custom_buttons_code
	,doc = document
	,callback_load = objpar.callback_load
	,callback_save = objpar.callback_save
	,callback_delete = objpar.callback_delete
	,callback_clear = objpar.callback_clear
	,callback_customfilter = objpar.callback_customfilter
	,areacss = objpar.css
	,campos = []
	,camposfilter = []
	,camposnoinsert = []
	,camposcustomsql = []
	,camposcustomsqlids = []
	//, etiquetasview = []
	, $container = $(	)
	, notopform = toplevelform_elements.length
	, da_id_actual = da_id
	, vista = customview
	do  {
		//var datoshija = DBH.ajax.select("SELECT da_tabla,da_pktabla,da_pkfield,da_fkfield,da_areamadre FROM DBH_AREAS WHERE da_id = " + da_id_actual)[0]
		var datoshija = DBH.areasSqlArr.filter(function( obj ) {
			return ( obj.da_id == da_id_actual )
		})[0]
		, dh_tabla = datoshija.da_tabla
		, dh_pktabla = datoshija.da_pktabla
		, dh_pkfield = datoshija.da_pkfield
		, dh_fkfield = datoshija.da_fkfield
		, dh_da_areamadre = datoshija.da_areamadre
		, dh_fkfield = dh_tabla + dh_fkfield.substring(dh_fkfield.indexOf("."))
		if ( dh_da_areamadre ) {
			//var sqls = "SELECT da_tabla,da_pktabla,da_pkfield,da_fkfield FROM DBH_AREAS WHERE da_id = " + dh_da_areamadre
			//console.log(sqls)
			//, datosmadre = DBH.ajax.select(sqls)[0]
			var datosmadre = DBH.areasSqlArr.filter(function( obj ) {
				return ( obj.da_id == dh_da_areamadre )
			})[0]
			, dm_tabla = datosmadre.da_tabla
			, dm_pktabla = datosmadre.da_pktabla
			, dm_pkfield = datosmadre.da_pkfield
			, dm_fkfield = datosmadre.da_fkfield
			, da_id_actual = dh_da_areamadre
			//vista += " INNER JOIN " + dm_pktabla + " ON " + dh_tabla + "." + dh_fkfield + "=" + dm_pktabla + "." + dm_pkfield
			vista += " INNER JOIN " + dm_tabla + " ON " + dh_tabla + "." + dh_fkfield.split(".")[1] + "=" + dm_tabla + "." + dm_pkfield.split(".")[1]
		}
	} while ( dh_da_areamadre )
	if ( vista != customview ) vista = "(" + vista + ")"
	tabla = vista
//	console.log(vista)
	if (typeof container == 'undefined' ) {
		//console.log (typeof container)
		var $container = $('<div class="formCuerpo" da_areamadre="'+da_areamadre+'" pktabla="'+pktabla+'" customview="'+customview+'" da_nivel="'+da_nivel+'" da_id="'+da_id+'" pkname="'+pkname+'" fkname="'+vinculada_fkname+'" fkhija="'+pkhija+'" name="'+fromDB+'">')
		, $bbg = $('<div class="blockbutton-autocreate general-container takefields" title="General"/>')
		, $celdaforms = $('#celdaforms')
		$celdaforms.append ( $container )
		$container.append($bbg)
		container = $container[0]
		vars.createFormFields (customview,$container,that,da_id)
		//console.log($container.outerWidth())
		//$container.width($container.outerWidth())
	}
	that.$container = $container
	var esv3 = !$container.find('#'+pkname).length
	if ( esv3 ) {
//	if(fromDB.toLowerCase()=='riesgos')console.log(pkname)
		var $fkformfield = $('<input type="hidden" class="inputText no-filter" id="' + pkname + '">')
		, etiquetasListado = []
		$container.prepend ( $fkformfield )
		that.$fkformfield = $fkformfield
	}
	var $msb = that.$container.find('.multistatebutton')
	$msb.each(function(){ new multistatebutton(this)})
	//$container.on ( 'click', '.multistatebutton-write', function() {formCabecera.formModificado(1)} )
	Mousetrap.bind('ctrl+'+notopform, function(event) {
		switchiframes (notopform-1,'','',$container)
		return false
	});

	var $camposform = $container.find('.inputText').not($('.divinlineform *'))
//if(fromDB.toLowerCase()=='riesgos')console.log($camposform)
	if (!$camposform) { alerta ( "El Main Form no tienen ningún campo asignado" ) ; return false }
	$camposform.each( function () {
		var $campo = $(this)
		, data_customfield_sql_select = $campo.attr('data-customfield-sql-select')
//		console.log($campo.not(DBH.readonly).length)
		//if ( $campo.not(DBH.readonly) ) {
		if ( !DBH.readonly($campo) ) {
			campos.push ( this.id )
		} else {
			if ( data_customfield_sql_select ) {
				camposcustomsql.push ( '(' + data_customfield_sql_select + ') AS [' + this.id +']' )
				camposcustomsqlids.push ( this.id )
			} else {
				camposnoinsert.push ( this.id )
			}
		}
		if ( ! $campo.hasClass('no-filter') ) {
			camposfilter.push ( this.id )
		}
		if(esv3 && $campo.attr('type') != 'hidden' ) {
			var showenlistado = $campo.hasClass('listado-show')
			if(showenlistado){
				var dsl = $campo.attr('data-sql-listado')
				, a = dsl ? '(' + dsl + ')' : this.id
				, b = $campo.attr('name')
				if ( $campo.prop ('tagName') == 'SELECT' && !dsl ) a = that.sqlSelectListado($campo)
				etiquetasListado.push([a,b,$campo.attr('grupo')])
			}
		}
	})
	that.$camposform = $camposform
	if(etiquetasListado.length==0)alert("Debe tener activada la opción 'listado-show' para al menos un campo de este área antes de poder utilizarla")
	var $listadotemplate = $('.listadoCuerpoContainer-template')
	, $listadoetiquetatemplate = $('.dbh-listado-etiqueta-template')
	, $listadocontainer = $listadotemplate.clone(true,true).attr('data-pkname',pkname).attr('da_id',da_id).attr('id','').removeClass('listadoCuerpoContainer-template')
	, $listadoetiqueta = $listadoetiquetatemplate.clone(true,true).attr('data-pkname',pkname).attr('da_id',da_id).attr('id','').removeClass('dbh-listado-etiqueta-template').addClass('dbh-listado-etiqueta')
	, $formToolbarTemplate = $('.form-toolbar-template')
	, $hook_formToolbar = $('.layout-form-toolbar-container')

	$hook_formToolbar.find('.form-toolbar[da_id="'+da_id+'"]').remove()
	$hook_formToolbar.append( $formToolbarTemplate.clone().show().attr('da_id',da_id).removeClass('form-toolbar-template').addClass('form-toolbar') )
	, $listToolbarTemplate = $('.list-toolbar-template')
	, $hook_listToolbar = $('.layout-list-toolbar-container')
	$hook_listToolbar.find('.list-toolbar[da_id="'+da_id+'"]').remove()
	$hook_listToolbar.append( $listToolbarTemplate.clone().show().attr('da_id',da_id).removeClass('list-toolbar-template').addClass('list-toolbar') )

	$listadotemplate.after($listadocontainer)
	if(!$('.dbh-listado-etiqueta[da_id="'+da_id+'"]').length) {
		$listadoetiquetatemplate.after($listadoetiqueta)
		$queryeditorhook = $listadoetiqueta.find('.dbh-query-editor-main-container')
	} else {
		$queryeditorhook = $('.dbh-listado-etiqueta[da_id="'+da_id+'"]').find('.dbh-query-editor-main-container').html('')
	}

	that.queryEditor = new dbhQueryEditor({
		$container: $queryeditorhook,
		$template: $('.dbh-query-editor-template')
	})


	/**** TOOLBAR ****/


    var $botones_principales = $('<div style="" class="botones_principales" da_id="'+da_id+'"></div>')
	,$botones_principales_custom = $container.find('.botones_principales').html()
	,$selecthijas = $()
	, $botonvincularahija = $('.listadoCuerpoContainer[da_id="'+da_id+'"] .vinculada_padre_lock')
	$container.find('.botones_principales').remove()
	$('.botonesform').find('.toolbar-template-container').prepend($botones_principales)
	var $botonesbasicos = $('<div style="border:0 solid #dddddd;border-width:0 1px 0 0"></div>')
	var toolbarTemplate = $('.toolbar-template').html()
	$botones_principales.html(toolbarTemplate)
	$botones_principales.find('.archivo-ir-registro').hide()
	$botones_principales.find('.busquedas-ejecutar').hide()
	if ( fromDB == 'dbh-comentarios' ) $botones_principales.find('.archivo-ir-registro').show().click(function(){DBH.comentarios.gorecord()})
	if ( fromDB == 'dbh-histórico' ) $botones_principales.find('.archivo-ir-registro').show().click(function(){DBH.historico.gorecord()})
	if ( fromDB == 'dbh-acciones' ) $botones_principales.find('.archivo-ir-registro').show().click(function(){DBH.avisos.gorecord()})
	if ( fromDB == 'dbh-documentos' ) $botones_principales.find('.archivo-ir-registro').show().click(function(){DBH.documentos.gorecord()})
	if ( fromDB == 'dbh-vistas' ) $botones_principales.find('.busquedas-ejecutar').show()//.click(function(){vars.goArea()})
	if ( !$('<div class="'+areacss+'"/>').hasClass ( 'archivo-ir-registro' ) ) $botones_principales.find('.req-historico').hide()
	if ( !vinculada_fkname ) {$botones_principales.find('.req-madre').hide()}
	if ( !pkhija ) {$botones_principales.find('.req-hija').hide()} else {
		$selecthijas = $('<select class="inputTextTransparent select_hijas" title="Área hija"></select>')
		$(pkhija).each(function(i){
			var $option = $('<option value="'+this+'" class="fa fa-database">'+da_nombre_hijas[i]+'</option>')
			$selecthijas.append($option)
		})
		//var $selecthijasvinculadas = $selecthijas.clone()
	}
	var selectmenu = function ($selectmenu) {
		this.openmenu = function () {
			var $menuWidget = $selectmenu.selectmenu( "menuWidget" );
			$selectmenu.find('option').each(function(i){
				$menuWidget.find('li').eq(i).addClass ( $(this).attr('class') )
			})
			$menuWidget.width('auto').find('ul').width('auto')
		}
		this.change = function (event,ui) {
			var clase = $(this).find('option:selected')[0].className
			console.log(clase)
			var $widget = $selectmenu.selectmenu( "widget" );
			$widget.find('i').remove()
			$widget.find('.ui-selectmenu-text').before('<i class="'+clase+'"></i>')
		}
		this.create = function (event,ui) {
			var clase = $(this).find('option:selected')[0].className
//			console.log(clase)
			var $widget = $selectmenu.selectmenu( "widget" );
			$widget.find('i').remove()
			$widget.find('.ui-selectmenu-text').before('<i class="'+clase+'"></i>')
		}
		this.width = function () {
			//return false;
			//$select.css({'font-size':'16.9px'})
			//return null;
			return 'auto';
			//return $select.outerWidth()*1
		}
		return this
	}



	var $selectseries = $botones_principales.find('.toolbar-select-multirec-edicion')
		//window.open('bbbb')
	$selectseries.selectmenu({
		width : selectmenu($selectseries).width()
		, open : selectmenu($selectseries).openmenu
		, change : selectmenu($selectseries).change
		, create : selectmenu($selectseries).create
	})
		//var a  = selectmenu($selectseries)
		//window.open('aaa')
	//$selectseries.selectmenu.trigger('change')
	var $selectnavegacion = $botones_principales.find('.toolbar-select-multirec-navegacion')
	if ( da_ids_relacionantes ) {
		$(da_ids_relacionantes).each(function(i){
			var optval = "$('#iframeFormCuerpo').data('topform').DBH(" + this + ")"
			, sqlll = "SELECT ( SELECT " + da_id + "-da_id from dbh_areas a WHERE a.da_id = b.da_areamadre) as noesmadre,( SELECT da_descripcion from dbh_areas a WHERE a.da_id = b.da_areamadrastra) as nombremadrastra,( SELECT da_descripcion from dbh_areas a WHERE a.da_id = b.da_areamadre) as nombrerelacionadamadre FROM dbh_areas b  WHERE da_id = (" + this + ")"
//			console.log(sqlll)
			, datosrelacionada = DBH.ajax.select ( sqlll )
			, noesmadre = datosrelacionada[0].noesmadre
			, nombremadrastra = datosrelacionada[0].nombremadrastra
			, nombrerelacionadamadre = datosrelacionada[0].nombrerelacionadamadre
			, nombre = noesmadre == 0 ? nombremadrastra : nombrerelacionadamadre
			, $option = $('<option class="fa fa-database">'+nombre+'</option>')
			$option.attr ( 'value', optval )
			$selectnavegacion.prepend($option)
		})
		$selectnavegacion[0].selectedIndex=0
	}
	$selectnavegacion.selectmenu({
		width : selectmenu($selectnavegacion).width()
		, open : selectmenu($selectnavegacion).openmenu
		, change : selectmenu($selectnavegacion).change
		, create : selectmenu($selectnavegacion).create
		/*
		,open : function  () {
			var $menuWidget = $selectnavegacion.selectmenu( "menuWidget" );
			$selectnavegacion.find('option').each(function(i){
				$menuWidget.find('li').eq(i).addClass ( $(this).attr('class') )
			})
		}
		*/
	})
	if(custom_buttons_code)$botones_principales.append('<div class="toolbar-column toolbar-custom-buttons"/>').find('.toolbar-custom-buttons').append ( $('<div class="label">Custom</div>') ).append($(custom_buttons_code).width('auto').addClass('boton boton-toolbar') )
	$botones_principales.find('#navegarvinculadahija').after($selecthijas)
	$botones_principales.find(sessionStorage["usu_perfil"]).hide() //OCULTO BOTONES SEGÚN PERFIL
	var $selectseries = $botones_principales.find('.toolbar-select-multirec-edicion')
	, width = selectmenu($selecthijas).width()
	$selecthijas.selectmenu({
		width : width
		, open : selectmenu($selecthijas).openmenu
		, change : selectmenu($selecthijas).change
		, create : selectmenu($selecthijas).create
	})
	/**** /TOOLBAR ****/

	that.tabla = tabla
	that.pkname = pkname
	//that.listadoWhere=listadoWhere
	//that.listadoWhereText=listadoWhereText
	//console.log(tabla)
	$container.data('topform',this)
//	console.log(camposcustomsqlids)
	if ( tabla ) { programarCampos(campos, container ,tabla);  programarCampos(camposnoinsert, container ,tabla,'noinsert');  programarCampos(camposcustomsqlids, container ,tabla,'noinsert');  }
	$container.on ( 'topform:modechange', function (event,mode) {
		//console.log(mode)
		if ( mode == 'edit' ) {
			$container.addClass ( 'topform-mode-edit' )
		} else {
			$container.removeClass ( 'topform-mode-edit' )
		}
		DBH.area().setButtons()
	})
	var $divCabeceraEtiqueta = $('<div class="menu1Etiqueta divCabeceraEtiqueta" da_id="'+da_id+'" id="divCabeceraEtiqueta" >Ning&uacute;n registro seleccionado.</div>')
	$('#divCabeceraEtiquetas').append($divCabeceraEtiqueta)
	$container.attr('data-pkfield',pkname)
	var $redactor = $('<div class="blockbutton-autocreate redactor" title="Redactor de consultas"><div class="divCampoForm" style="width:100%;float:left;background:white;max-height:px;margin-bottom:;padding-bottom:"><div style="width:100%;clear:both;height:6px;float:none"></div><textarea class="inputText no-insert dbh_redactor_consultas" id="dbh_redactor_consultas" style="margin-bottom:10px" data-width="100%"></textarea></diV></div>')
	$redactor.find('textarea').attr('placeholder',"Aqui puede redactar consultas utilizando los nombres de los campos y toda la sintaxis SQL.\n\nEj.: nombre = 'juan' AND apellido LIKE 'gonza%'")
	$container.prepend($redactor)
	var $docs = $('<div class="" style="width:100%;float:left;background:transparent;height:;padding:0 0px 0 5px;box-sizing:border-box;margin:0;border:0px solid red"><label for="" style=";float:left;margin-left:5px">documentos</label><button class="boton miniboton miniboton-inlineform botonfiles genericon genericon-attachment req-register" title="Añadir archivos"></button><div class="divdocumentslisttop" style="width:100%;margin:0;padding:0;height:auto;border:0px solid red;clear:both;float:;border:0px solid red"></div></diV>')
	//, docs = new parent.docs.doc_manager ( pkname )
	, docs = new parent.docs.doc_manager ( da_id )
	, $boton = $docs.find('.genericon-attachment')
	$boton.on('click',function(){
		docs.uploadDocsS($container.find('[id="' + pkname + '"]').val());
	})
	$bbg.append($docs)
	var $c =$container.find('.dbh_calendar')
//	console.log ($c.length)
	$c.appendDtpicker({
		'locale': 'es'
		,'firstDayOfWeek':1
		,"onSelect" : function(handler, targetDate){
			DBH.date().setcolor($c);
			$('.datepicker').hide()
			//console.log(targetDate);
		}
	});
	$c.val('')
	//DBH.valueLists().setColor()
	//that.multicolumns(1)

	this.stringifyparams = function () {
		//console.log(listado.get('listadoWhere'))
		//console.log(listado.get('listadoWhereText'))
		var lw = listado.get('listadoWhere')
		, lwt = listado.get('listadoWhereText')
		//console.log(lw)
		//console.log(lwt)
		var obj = { etiquetasListado:etiquetasListado, listadoWhere:lw, listadoWhereText:lwt, listadoOrderByIndex:$('#listadoOrderBy').val(), listadoOrderByIndexDesc:$('#listadoOrderByIndexDesc').val(), tabla:that.tabla }
		, r = JSON.stringify(obj).replace(/'/g,"''")
//		console.log(r)
		return r
	}
	this.setbuttonbar = function () {
		that.$buttonbar.$barras.each ( function (i) {
			//console.log(i)
			var $b = $(this)
			,$button = that.$buttonbar.$buttons[i]

			if ( $b.is(':visible') ) {
				$button.addClass('active');
				$button[0].checked=true
			} else {
				$button.removeClass('active');
				$button[0].checked=false
			}
		})
	}
	this.closeAll = function () {
		var blockbuttons = $('.blockbutton:visible')
		blockbuttons.each(function (){$(this).data('blockbutton').cerrar()})
	}
	this.createViewForExcel = function () {
		var sql = that.getPresentSelect(1)
		, createViewForExcel = vars.createViewForExcel(sql)
		return {view:createViewForExcel.view,title:createViewForExcel.title,filename:createViewForExcel.filename}
	}
	this.createExcel = function () {
		var e = that.createViewForExcel()
		, view = e.view, tit = e.title
		, filename = e.filename
		, $tempfield = $('<div class="dbh-excel-limit-400"/>')
		, excelLimit = -1
		, checkedids = DBH.area().checkedids
		, where = checkedids.length ? "id in (" + checkedids + ")" : ""
		if ( $tempfield.is ( sessionStorage["usu_perfil"] ) ) {
			excelLimit = 400
			alerta ( 'EXCEL limitado a 400 registros.' )
		}
		window.open ( 'excelMaker.asp?titulo=' + filename + '&tituloexcel=' + tit + '&vista=' + view + '&where=' + where + '&excelLimit=' + excelLimit )
	}
	this.numerarcols = function () {
		$(parent.document.getElementById('iframeListadoCuerpo').contentWindow.document).find('#tablaEncabezado #trCeldasEncabezados td').each ( function (i) {
			$(this).attr('orden',i)
		})
	}
	this.etiquetaslistadovars = function () {
		//var nombreCamposListado = ['idlistado']
		var nombreCamposListado = []
		, nombreEtiquetasListado = []
		, grupos = []
		$(etiquetasListado).each ( function (i) {
			var etiqueta = etiquetasListado[i]
			,etiquetacampo
			,etiquetaliteral
			,grupo = ''
//			console.log (typeof etiqueta )
			if ( typeof etiqueta == 'string' ) {
				etiquetacampo = etiqueta; etiquetaliteral = etiqueta
			} else {
				etiquetacampo = etiqueta[0]; etiquetaliteral = etiqueta[1]
				grupo = etiqueta[2]
			}
			nombreCamposListado.push ( etiquetacampo ) //.toLowerCase() )
			nombreEtiquetasListado.push ( etiquetaliteral )
			grupos.push ( grupo )
		})
		return { campos: nombreCamposListado, literales: nombreEtiquetasListado, grupos : grupos }
	}
	this.etiquetas = function () {
		this.get = function () {
			return etiquetasListado
		}
		this.set = function (etis) {
			//console.log(etis)
			etiquetasListado = etis
			document.getElementById("nombresCampos").value = that.etiquetaslistadovars().campos
		}
		return this
	}
	this.resetListado = function (listadoWhere,listadoWhereText) {
//			console.log($container)
//			console.log(that.tabla)
		var etiquetaslistadovars = that.etiquetaslistadovars()
		/*
		, r = parent.sqlExec ( "SELECT TOP 1 * FROM " + that.tabla )
		$(r).children().each ( function () {
			etiquetasview.push ( $(this).prop('tagName').toLowerCase() )
		})
		*/
		that.campos = etiquetaslistadovars.campos
		
		if ( ( typeof that.listadoWhere != 'string' || listadoWhere == 0 || !listadoWhere ) && !that.queryEditor.queryparameters ) {
			console.log('carga los 30')
			var sql_recientes = "(SELECT top 120 his_pkvalue FROM dbh_historico where his_da_id = " + da_id + " group by his_da_id,his_pkvalue order by max(his_fecha) desc)"
			var sql_recientes = "(SELECT top 30 " + pkname + " FROM " + that.tabla + " ORDER BY " + pkname + " desc)"
			that.listadoWhere  = pkname + " in " + sql_recientes
			that.listadoWhereText  = "registros modificados recientemente."
			that.listadoWhereText  = "Autofiltrados un máximo de 30 registros."
			that.queryEditor.queryparameters = [{
				id : ''
				, name : 'Interno'
				, sql : that.listadoWhere
				, value : "Autofiltrados un máximo de 30 registros."
				, parameters : 'active'
			}]
			//console.log(typeof [])
			that.queryEditor.load()
		}

//if ( that.queryEditor.queryparameters ) {that.queryEditor.queryparameters = [];that.queryEditor.load()}
		if ( orderindexListado > ( etiquetasListado.length + 1 )  ) orderindexListado = etiquetasListado.length + 1
		var j = findframenumber()
		document.getElementById('vinculada_pkname').value=vinculada_pkname?vinculada_pkname:''
		document.getElementById('vinculada_fkname').value=vinculada_fkname?vinculada_fkname:''
		document.getElementById('pkname').value=pkname
		document.getElementById('nombresCampos').value=etiquetaslistadovars.campos
		document.getElementById('etiquetasCampos').value=etiquetaslistadovars.literales
		document.getElementById('listadoView').value=tabla
		document.getElementById("listadoOrderByIndex").value=orderindexListado*1-1
		document.getElementById("listadoOrderBy").value=listadoWhere == 0?'':orderindexListado
		var k = vinculada_fkname ? j-1 : j+1
		if ( listadoWhere && listadoWhere != null ) {
			console.assert ( typeof listadoWhere == 'string', 'listadoWhere no es string' )
			that.listadoWhere  = listadoWhere
			that.listadoWhereText  = listadoWhereText
			document.getElementById('listadoWhere').value=listadoWhere
			document.getElementById('listadoWhereText').value=listadoWhereText
		}
		that.filter(1)
	}
	this.load = function (pkvalue) {
		if(formCabecera.formModificado("")){
			vars.confirm('Guardar los cambios?','Guardar los cambios?',pkvalue)
			return false
		}
		setTimeout(function(){that.loadform_values(pkvalue)},10)
		return true
	}
	this.loadform_values = function (pkvalue) {
		var db = ''
		, cc = campos.slice()
		, cc = cc.pushUnique(camposfilter).pushUnique(camposnoinsert)//.addArray(camposcustomsql)
		, camposcustom = camposcustomsql.length ?  camposcustomsql + ',' : ''
		, avisoscondition = ( tabla == 'dbh_avisos'? (tabla + '.') : '' )
		, avisossql = "from dbh_avisos where " + avisoscondition + pkname + " = avi_pkvalue and avi_da_id = " + da_id + " AND avi_accion= 1"
		, avisocampos = "(select min(avi_fecha) " + avisossql + ") as avisosfechamin,(select max(avi_fecha) " + avisossql + ") as avisosfechamax,case when ( max(dbha.avi_id) <> '' ) then count(*) else 0 end as avisoscount"
		, sqlstr = 'SELECT ' + avisoscondition + cc + ',' + camposcustom + avisocampos + ' FROM ' + tabla + ' LEFT JOIN DBH_avisos dbha ON ' + avisoscondition + pkname + ' = dbha.avi_pkvalue and dbha.avi_da_id = ' + da_id + ' WHERE ' + avisoscondition + pkname + ' = ' + pkvalue + ' GROUP BY ' + avisoscondition + cc
		, camposSeleccionados = cc + ',' + camposcustom
		, camposSeleccionados = camposSeleccionados.substring(0,camposSeleccionados.length-1)
		, sqlstr = 'SELECT ' + camposSeleccionados + ' FROM ' + tabla + ' WHERE ' + pkname + ' = ' + pkvalue
//		console.log(sqlstr)
		, xml=ajaxExecuter('selectXML_new.asp',"sql="+escape(sqlstr)+"&db="+db,0)
		, $xml = $(xml)
		, hayregistros = $xml.find('registro').length
		if ( ! hayregistros ) {
			console.log( "Sin registros. Respuesta: " + xml )
			return false
		}
		var $campos  = $xml.find('registro').children()
		, cmpsidscargados = []
		, txt = ''
		$container.find('.remove-on-clear').remove()
	//console.log($campos)
		$campos.each ( function () {
			var $campo = $(this)
			, campo = $campo.attr('fieldname')
			, tipo = $campo.data ( 'tipo' )
			, numerico = (tipo<10&&tipo>3)//Si el campo es númerico pero no entero (3) para que no formatee los ids.
			, valor = numerico?separarMiles($campo.text(),"."):$campo.text()
			, $campoform = $container.find ( '[id="' + campo + '"]' ).add($container.find ( '[id$=".' + campo + '"]' )).not('.inlineform *')
			//if(campo=='pr_pol_fechavencimiento')console.log(valor)
			, valor = ( $campoform.hasClass('data-type-date') && valor.length > 16 ) ? valor.substring(0,16) : valor //Si es fecha larga elimino los segundos
			//var $campoform = $campoform.length == 0 ? $container.find ( '[id$=".' + campo + '"]' ).not('.inlineform *') : $campoform
			if ( cmpsidscargados.indexOf (campo) == -1 ) {
				//valor = valor.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
				$campoform.valor ( valor )
				//$campoform.dbhField().val ( valor )
				$campoform.prop ( 'oldValue', valor )
				$campoform.data ( 'valor',valor )
				cmpsidscargados.push ( campo )
				//if ( $campoform.hasClass('inlinelist') )  $campoform[0].objeto.loadLista(1)
					/*
				if ( $campoform.hasClass('inline-search') && $campoform.prop('tagName')=="SELECT" )  {
					var idfield = $campoform.attr('select-id-field')
					, textfield = $campoform.attr('select-text-field')
					, table = $campoform.attr('select-table')
					, sqlll = "SELECT " + textfield + " FROM " + table + " WHERE " + idfield + " = " + valor
					, txtopt = valor ? DBH.ajax.valor ( sqlll ) : ''
					, opt = '<option value="'+valor+'" selected>'+txtopt+'</option>'
//					console.log(opt)
					$campoform.find('option').remove()
					$campoform.append('<option/>').append(opt)
				}
				*/
				if($campoform.prop('tagName')=="TEXTAREA"){
					setTextareaHeight($campoform[0])
				}
				if($campoform.prop('tagName')=="SELECT"){
					//$campoform.find ( 'option').removeAttr('selected').filter('[value="'+valor+'"]').attr ( 'selected',true )
					//$campoform.trigger ( 'change' )
					$campoform.trigger ( 'change' )

				}
				if($campoform.prop('tagName')=="SELECT" && !$campoform.hasClass('multistatebutton')){
					$campoform.attr ( 'title', $campoform.find('option:selected').text() )
				}
				if($campoform.hasClass('etiqueta-show')){
					if($campoform.prop('tagName')=="SELECT"){
						var campoetiqueta = $campoform.find('option:selected').text()
					} else {
						if ( $campoform.hasClass('inlinelist') ) {
							var id = $campoform.attr('id')
							, id_textfield = id + "_textfield"
							, $textfield = $('[id="'+id_textfield+'"]')
							, campoetiqueta = $textfield.val()
						} else {
							var campoetiqueta = $campoform.val()
						}
					}
					//var campoetiqueta = $campoform.prop('tagName')=="TEXTAREA" ? valor : $campoform.find('option:selected').text()
					txt+= campoetiqueta + ' · '
				}
				if($campoform.hasClass('ishtml') && valor != '' ){
					$campoform.closest('.divCampoForm').find('.inputText').before('<div style="width:100%;overflow:auto" class="remove-on-clear">'+$campoform.val()+'</div>')
				}
				//seteo el calendario
				if($campoform.hasClass('dbh_calendar')&&valor != ''){$campoform.handleDtpicker('setDate', DBH.date(valor).date);}
			}
			//if ( $campoform.hasClass('inlinelist') )  $campoform[0].objeto.loadLista(1)
		})
	//console.log(DBH.area().formContainer.data('checkedids'))
	//return
		if ( txt != '' ) txt = txt.substring(0,txt.length-3)
		$(inlineform2_elements).each ( function () { this.show() })
	/*
		$container.find('[data-select-vinculada-madre][data-select-vinculada-madre!=""]').each ( function () {
			var $hija = $(this)
			, madreid = $hija.attr('data-select-vinculada-madre')
			, $madre = $hija.closest('.divCampoForm').parent().find('[id="' + madreid + '"]' )
			vars.filterSelectsHijas( $hija )
		} )
		*/
		$(multistatebuttons_elements).each(function(){this.setcss();})
		//$container.find('select').not('[id="data.data_field_id"]').css({'background':'red'}).trigger ( 'change' )
		parent.clearDocumentAlerts(doc)
		//that.loadInfoCreacion(pkvalue)
		txt ="(" + pkvalue + ") " + txt
		formCabecera.formCabeceraEtiquetaUpdate(txt)
		var tr = $('[id="trListado' + pkvalue + '"]')[0]
		menu1Seleccionar(tr,$('#listadoCuerpoContainer')[0].getElementsByTagName('tr'))
		document.getElementById('idlistado').value=pkvalue
		$container.find( '.divCampoForm .no-insert' ).not('.inlinesearch-tempfield').prop('disabled',true)
		$container.find( '.lineamodelo.divinsertform .inputText' ).prop('disabled',false)
		//console.log($campos)
		var avisoscount = $campos.filter('[fieldname="avisoscount"]').text()
		, avisosfechamax = $campos.filter('[fieldname="avisosfechamax"]').text()
		, avisosfechamin = $campos.filter('[fieldname="avisosfechamin"]').text()
		, avisostitle = avisoscount + ' avisos.\n' + avisosfechamin + ' - ' + avisosfechamax
		, $botonavisos = $('#botonavisos:visible')
		$botonavisos.text(avisosfechamin).attr('title',avisostitle)
		DBH.date().setcolor($camposform.add($botonavisos))
		$botonavisos.text(avisoscount)
		docs.loadDocsListS ( pkvalue, $container.find('.divdocumentslisttop')[0] , 1 )
		// if ( callback_load ) callback_load(pkvalue)
		if ( callback_load ) eval(callback_load)
			//alert(callback_load)
		$container.trigger ( 'topform:modechange' , 'edit' )
		$container.trigger ( 'form:load' )
		parent.mostrarTelon(0)
		alerta('Registro cargado',1)
	}
	this.save = function (esNuevo) {
		var error=0
		, pkvalue = $container.find('[id="'+pkname+'"]').val()
		//, esNuevo = pkvalue == '' ? true : false
		, $camps = $camposform.not('.no-insert').add($camposform.filter('.noblank-select-vinculada'))
		$camps.each ( function () {
			var $ff = $(this)
			if(!vars.isValidFormFieldContent($ff)){invalidarCampo(this);error=1}
		})
		if(error){alerta("Corrija los campos indicados.");return false}

		if(esNuevo){
			if(confirm('Crear una ficha nueva con estas datos?')){
				var parametros = that.saveform_values(1)
				, parametros = parametros+"DBH_tabla="+pktabla+"&DBH_pk="+pkname
				, pkvalue=DBH.ajax.insert(parametros)
				if (!pkvalue) return false
				var sqlsentence = "insert into DBH_historico ( his_da_id, his_pkvalue, his_usu_id, his_fieldname, his_valor, dbh_perfiles_admitidos_xreg ) VALUES ( "+da_id+", "+pkvalue+", "+sessionStorage['usu_id']+", '[NUEVO REGISTRO]', '[NUEVO REGISTRO]', '"+sessionStorage['usu_perfiles_admitidos']+"' )"
				DBH.ajax.sql ( sqlsentence )
				$camposform.filter('[id="'+pkname+'"]').val(pkvalue)
				esNuevo=1
				DBH.area().filter(1)
			}else{
				return false
			}
		} else {
			var res = that.saveform_values()
			//alert(res)
			if (!res) return false
		}

		if(esNuevo){
			that.clear(1)
			that.load(pkvalue)
			alerta ('Registro creado',1)
		}else{
			that.loadInfoCreacion(pkvalue)
			//Actualizo fila en el listado de la derecha
			/***** DESCONECTADA REFRESCO DE LA FILA EN EL LISTADO PQ ES UNA CONSULTA A BD QUE RALENTIZA **********
			var idlistado=document.getElementById('idlistado').value
			, trListado=$('#divlist #trListado'+idlistado)[0]
			if ( trListado == null ) { console.log('No existe la linea (' + idlistado + ') en el listado, por lo que no se ha actualizado');
			} else {
				var listadoView=tabla
				, nombresCampos=document.getElementById("nombresCampos").value
				//console.log(nombresCampos)
				, sql="SELECT " + nombresCampos + " from " + listadoView + " where " + pkname + " = " + idlistado
				, registroArr=parent.loadSqlTable(sql,0)
				, tdsListado=trListado.getElementsByTagName('td')
				for(var i=0;i<registroArr[0].childNodes.length;i++){
					tdsListado[i+1].innerHTML = $('<div/>').text(registroArr[0].childNodes[i].textContent).html()
				}
				ajustarAnchoEncabezados()
			}
			**************************************************************************************************/
			alerta ('Registro guardado',1)
		}
		parent.clearDocumentAlerts(doc)
		vars.update_selects_afectadas(da_id)
		DBH.date().setcolor($('.tablaListado:visible .filaListado.menu1OpcionSeleccionada .dbh_fecha_color:visible'))
		DBH.valueLists().setColor()
		DBH.avisos.setbutton()
		if ( callback_save ) eval(callback_save)
		return true
	}
	this.saveform_values = function (serie){
		var parametros=""
		, valor=""
		, sqlhistorico = ""
		, usu_id = sessionStorage['usu_id']
		, pkvalue = $container.find('[id="'+pkname+'"]').val()
		for(var i=0;i<campos.length;i++){
			var $campo=$container.find('[id="'+campos[i]+'"]')
			, campo = $campo[0]
			if ( ! DBH.readonly(campo) ) {
				var valor = campo.value
				, oldValue = campo.oldValue
				, nombre = campos[i]
				//console.log(oldValue)
				if (valor!=oldValue || nombre == pkname || serie ) {
					if(nombre!=pkname && !serie)sqlhistorico += "INSERT INTO DBH_historico (his_da_id,his_pkvalue,his_fieldname,his_valor,his_usu_id,dbh_perfiles_admitidos_xreg) VALUES ("+da_id+","+pkvalue+",'"+nombre+"','"+oldValue+"',"+usu_id+",'"+sessionStorage['usu_perfiles_admitidos']+"') "
					var nombre = nombre.substring ( nombre.indexOf('.')+1 )
					//campo.oldValue=campo.value
					if(valor!=""){valor=valor.replace(/'/g,"''")}
					valor=encodeURIComponent(valor)
					if(valor!=''||!serie)parametros=parametros + nombre + "=" + valor + "&"
				}
			}
		}

		/* AÑADO dbh_perfiles_admitidos_xreg SI LA TABLA TIENE LA COLUMNA */

		var tiene_columna_dbh_perfiles_excluidos = $('.formCuerpo:visible').attr('tiene_columna_dbh_perfiles_excluidos') * 1
		, usu_perfiles_admitidos=sessionStorage["usu_perfiles_admitidos"]
		if (tiene_columna_dbh_perfiles_excluidos && usu_perfiles_admitidos != '') {
			parametros=parametros + "dbh_perfiles_admitidos_xreg=" + usu_perfiles_admitidos + "&"
		}
		if ( serie ) return parametros
		if(sqlhistorico == ""){
			return false
		}
		parametros=parametros+"DBH_tabla="+pktabla+"&DBH_pk="+pkname
		//console.log(parametros)
		var res = DBH.ajax.update(parametros)
		//return
		//console.log(sqlhistorico)
		if (!res) return false
		//DBH.ajax.sql(sqlhistorico)
		dbhQuery ({sqlquery: sqlhistorico}).request()
		$container.trigger('form:save')
		return res
		/*
		var resul=ajaxExecuter('formUpdate.asp',(parametros),0)
		if (resul!=null) {
			alerta("La operacion 'Guardar' ha fallado para la tabla '" + tabla + "'" )
		}
		return resul
		*/
	}
	this.saveform_serie = function (add) {
		var checkedids = DBH.area().checkedids
		//console.log(checkedids)
		, pknameval = $container.find('#'+pkname).val()
		, noregs = checkedids == '' ? 0 : checkedids.length
		, sql = ''
		if(!checkedids.length) {alerta('No hay registros seleccionados');return false}
		if ( add == 1 ) {
			var operacion = "AÑADIR AL FINAL"
		}
		if ( !add ) {
			var operacion = "RETIRAR EL TEXTO INTRODUCIDO"
		}
		if ( add == 3 ) {
			var operacion = "SUSTITUIR LA TOTALIDAD"
		}
		if ( add == 4 ) {
			var operacion = "SUSTITUIR SELECTIVAMENTE"
		}
		if ( add == 5 ) {
			var operacion = "RECORTAR ESPACIOS EN BLANCO"
		}
		if ( add != 2 ) {
			if ( pknameval != '' && !isNaN(pknameval) ) {alerta('Debe limpiar el formulario antes de utilizar esta función.');return false} // NO PERMITO SERIE SI SE ESTÁ EN UNA FICHA PARA EVITAR ACCIDENTES EN MASA.
			if ( !confirm(operacion + '\n\nSi continua alterará el contenido de los campos completados en los registros seleccionados en el listado (' + noregs + ').' ) ) return false
			var asignaciones = []
			, usu_id = sessionStorage['usu_id']
			, sqlhistorico = ''
			for(var i=0;i<campos.length;i++){
				var campo=$container.find('[id="'+campos[i]+'"]')[0]
				, nombre = campos[i]
				, valor = campo.value
				, valor_buscado = $(campo).data('data-filter-conditions')
				if ( ! DBH.readonly(campo) && nombre != pkname && valor != "" ) {
					var nombre = nombre.substring ( nombre.indexOf('.')+1 )
					,valor=valor.replace(/'/g,"''")
					if ( add == 1 ) {
						newval = nombre + "=COALESCE(" + nombre + " ,'') + '" + valor + "'"
					} else if ( add==3 ) {
						if ( valor == '""' ) {
							valor = "null"
						} else {
							valor = "'" + valor + "'"
						}
						newval = nombre + "=" + valor
					} else if ( add==4 ) {
						if ( valor == '""' ) {
							valor = "''"
						} else {
							valor = "'" + valor + "'"
						}
						newval = nombre + "=replace(" + nombre + ",'" + valor_buscado + "'," + valor + ")"
					} else if ( add==5 ) { // TRIM
						newval = nombre + "=rtrim(ltrim(" + nombre + "))"
					} else {
						newval = nombre + "=replace(" + nombre + ",'" + valor + "','')"
					}
					sqlhistorico += "INSERT INTO DBH_historico (his_da_id,his_pkvalue,his_fieldname,his_valor,his_usu_id,dbh_perfiles_admitidos_xreg) SELECT "+da_id+","+pkname+",'"+nombre+"',"+valor+","+usu_id+",'"+sessionStorage['usu_perfiles_admitidos']+"' FROM " + pktabla + " WHERE "+pkname+" IN ("+checkedids+") "
					asignaciones.push(newval)
				}
			}
			sql = " UPDATE "+pktabla+" SET "+asignaciones+" WHERE "+pkname+" IN ("+checkedids+")"
			console.log(sql)
			var res = DBH.ajax.sql ( sql )
			if(!res)return false
			//var res = DBH.ajax.sql ( sqlhistorico )
			//if(!res)return false
			alerta ( 'Serie de registros actualizada',1 )
		} else {
			var respuesta = window.prompt ( "Escriba la ELIMINAR (en mayúsculas) para completar la operación.")
			if ( respuesta != "ELIMINAR" ) {
				var respuesta = window.prompt ( "Escriba la ELIMINAR (en mayúsculas) para terminar la operación.", respuesta)
				if ( respuesta != "ELIMINAR" ) {
					alerta ( 'Operación cancelada' ) ;
					return false
				}
			}
			if ( !confirm('ELIMINAR LOS REGISTROS\n\nSi continua eliminará los registros seleccionados en el listado (' + noregs + ').' ) ) { alerta ( 'Operación cancelada' ) ; return false}
			var sql = "DELETE " + pktabla + " WHERE " + pkname + " IN (" + checkedids + ")"
			, res = DBH.ajax.sql(sql,'custom','Existen registros vinculados.')
			if(!res)return false
			$('.listado-row-selected:visible').hide()
			listado.checkid('all',0,1)
			alerta ( 'Serie de registros eliminada',1 )
		}
		//console.log(sql)
		$container.find('#'+pkname).val(pknameval)
		vars.update_selects_afectadas(da_id)
	}
	this.erase = function (){
		var pkvalue = $container.find('[id="'+pkname+'"]').val()
		if(pkvalue==""){parent.alerta('No se puede completar la operación.\n\nNo hay ninguna ficha seleccionada.');return false}
		if(!confirm('Borrar este registro?'))return false
		var res = DBH.ajax.sql("DELETE " + pktabla + " WHERE " + pkname + "="+pkvalue,'custom','Existen registros vinculados.')
		if(!res)return false
		eliminarFila(pkvalue)
		that.clear()
		vars.update_selects_afectadas(da_id)
		parent.alerta('Registro eliminado.',1)
		if ( callback_delete )  callback_delete (pkvalue)
	}
    this.PrintElem = function (){
		function Popup(data)
		{
			var mywindow = window.open('', 'my div', 'height=400,width=600');
			mywindow.document.write('<html><head><title>my div</title>');
			/*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
			mywindow.document.write('</head><body >');
			mywindow.document.write(data);
			mywindow.document.write('</body></html>');

			mywindow.document.close(); // necessary for IE >= 10
			mywindow.focus(); // necessary for IE >= 10

			mywindow.print();
			mywindow.close();

			return true;
		}
        //Popup($container.html());

		var $eles = $('body').children().add($('#tablegeneral')).add($('#tableright')).add($container)//.add($('.celdaaffectedby_ajustarAnchoForm'))//
		, $botoncerrar = $('<button class="boton botoncerrarprint" style="position:absolute;z-index:1000000;right:10px;top:5px;background:white;float:left">Cerrar</button>')
		$eles.addClass('DBH-print-mode')
		$('.celdaaffectedby_ajustarAnchoForm').data('computed-width',$('.celdaaffectedby_ajustarAnchoForm').width()).width('100%')
		$('body').data('computed-marginleft',$('body').css('margin-left')).css({'overflow':'auto','margin-left':'0'}).prepend($botoncerrar)
		$botoncerrar.on('click',function(){
			$('.celdaaffectedby_ajustarAnchoForm').width($('.celdaaffectedby_ajustarAnchoForm').data('computed-width'))
			$('body').css({'overflow':'hidden','margin-left':$('body').data('computed-marginleft')})//.remove($('.botoncerrarprint'))
			//console.log($('body').data('computed-marginleft'))
			var $eles = $('body').children().add($('#tablegeneral')).add($('#tableright')).add($container)//.add($('.celdaaffectedby_ajustarAnchoForm'))//
			$eles.removeClass('DBH-print-mode')
			$(this).remove()
		})
		//$('body').css({'overflow':'auto','margin-left':'0'}).children().hide()
		//$('#tablegeneral').show()
		//$('#tableright').hide()
		//$container.attr('style','position:absolute;top:0;left:0;width:100%;z-index:9999999999999;overflow:visible;height:100%;display:show')



	}
	this.DBH = function (pkname,timer) {


		var recsid = DBH.area().recsid
		, recid = !isNaN ( recsid ) ? recsid : ''
		, $campos = $container.find('.etiqueta-show')
		, etiqueta = ''
		, pksinactualarea = "SELECT " + that.pkname + " FROM " + that.tabla + " WHERE " + that.listadoWhere
		if ( recsid=='') {
			var condition = pkname + " IN ( " + pksinactualarea + " ) "
		} else {
			var condition = pkname + " IN ( " + recsid + " ) "
		}
		$campos.each(function(){
			var type = this.tagName
			, $campo = $(this)
			if(type=="SELECT"){
				var eti = $campo.find('option:selected').text()
			} else {
				if ( $campo.hasClass('inlinelist') ) {
					var id = $campo.attr('id')
					, id_textfield = id + "_textfield"
					, $textfield = $('[id="'+id_textfield+'"]')
					, eti = $textfield.val()
				} else {
					var eti = $campo.val()
				}
			}
			etiqueta += eti + ' '
		})
		if ( !isNaN(pkname) ) { // AREAS RELACIONADAS: en este caso, 'pkname' es el da_id del área relacionante.
			var sqll = "SELECT da_areamadre,da_tabla,da_fkfield,da_areamadrastra,da_fkfield_madrastra,(SELECT da_pkfield FROM dbh_areas b WHERE b.da_id=a.da_areamadrastra) as da_pkfield_madrastra,(SELECT da_pkfield FROM dbh_areas b WHERE b.da_id=a.da_areamadre) as da_pkfield_madre FROM dbh_areas a WHERE a.da_id = " + pkname
			, linea = DBH.ajax.select ( sqll )[0]
			, callerismother = linea.da_areamadre - da_id == 0
			if ( callerismother ) {
				var area = linea.da_areamadrastra
				, searchedfield = linea.da_pkfield_madrastra
				, keyfield_relationstable = linea.da_fkfield_madrastra
				, searchedfield_relationstable = linea.da_fkfield
			} else {
				var area = linea.da_areamadre
				, searchedfield = linea.da_pkfield_madre
				, keyfield_relationstable = linea.da_fkfield
				, searchedfield_relationstable = linea.da_fkfield_madrastra
			}
			if ( recsid==''){
				var condicion = searchedfield + " IN ( SELECT " + keyfield_relationstable + " FROM " + linea.da_tabla + " WHERE " + searchedfield_relationstable + " IN ( " + pksinactualarea + "))"
			} else {
				var condicion = searchedfield + " IN ( SELECT " + keyfield_relationstable + " FROM " + linea.da_tabla + " WHERE " + searchedfield_relationstable + " IN ( " + recsid + " ))"
			}

			var par1 = [['dbh_redactor_consultas',condicion]]
		}
		if ( pkname == 'avi_pkvalue' ) {
			var par1 = [['dbh_redactor_consultas',condition],['dbh_avisos.avi_da_id',da_id]]
			, par2 = [['dbh_redactor_consultas',condition],['dbh_avisos.avi_da_id',da_id],['dbh_avisos.avi_etiqueta',etiqueta],['dbh_avisos.avi_pkvalue',recid],['dbh_avisos.iduc',sessionStorage["usu_id"]]]
			, area = 'dbh-acciones'
		}
		if ( pkname == 'cc_pkvalue' ) {
			var par1 = [['dbh_redactor_consultas',condition],['dbh_comentarios.cc_da_id',da_id]]
			, par2 = [['dbh_redactor_consultas',condition],['dbh_comentarios.cc_da_id',da_id],['dbh_comentarios.cc_texto',etiqueta],['dbh_comentarios.cc_pkvalue',recid],['dbh_comentarios.cc_usu_id',sessionStorage["usu_id"]]]
			, area = 'dbh-comentarios'
		}
		if ( pkname == 'iac_pkvalue' ) {
			var par1 = [['dbh_redactor_consultas',condition],['dbh_comunicacionescustom.iac_da_id',da_id]]
			, par2 = [['dbh_redactor_consultas',condition],['dbh_comunicacionescustom.iac_da_id',da_id],['dbh_comunicacionescustom.iac_pkvalue',recid],['dbh_comunicacionescustom.iac_etiqueta',etiqueta]]
			, area = 'dbh-comunicaciones custom'
		}
		if ( pkname == 'his_pkvalue' ) {
			var par1 = [['dbh_redactor_consultas',condition],['dbh_historico.his_da_id',da_id]]
			, area = 'dbh-histórico'
		}
		if ( pkname == 'doc_pkvalue' ) {
			var par1 = [['dbh_redactor_consultas',condition],['docs.doc_da_id',da_id]]
			, area = 'dbh-documentos'
		}
		if ( pkname == 'ial_pkvalue' ) {
			var par1 = [['dbh_redactor_consultas',condition],['dbh_busquedas.i_da_id',da_id]]
			, area = 'dbm-comunicaciones'
		}
		if(!timer && !$('.formCuerpo[name="'+area+'"]').length ) {
			DBH.telon.areaLoad()
			//$('#divteloninit').show()
			setTimeout (function(){that.DBH(pkname,1)},0)
			return false
		}
		console.log(recid)
		var areadestino = DBH.area(area).go()
		, sqlDesc = "Vinculados de " + fromDB + " " + ( recid.length == 1 ? '(' + recid[0] + ')' : that.queryEditor.returnQT() )
		areadestino.formContainer.find('[id="dbh_redactor_consultas"]').attr('dbh-query-description',sqlDesc).attr('dbh-query-da_id',da_id)
		var valuesSet = areadestino.setvalues (par1)
		if ( !valuesSet ) {
			//alerta('Guarde los cambios para utilizar esta función.')
			return false;
		}
		areadestino.filter()
		if (par2) areadestino.setvalues (par2)
		//if(par2)areadestino.setvalues (par2)
		DBH.telon.hide()
		//$('#divteloninit').hide()
	}
	this.clear = function (force,setDefaults) {
		//var that = this
		if(formCabecera.formModificado("")&&!force){
			vars.confirm('Cambios sin guardar','Guardar los cambios?',function () {that.clear(force,setDefaults)})
			return false
		}
		$container.find('.remove-on-clear').remove()
		$container.find('option.hide').removeClass('hide').show()
		$container.find('[data-available-ids]').removeAttr('data-available-ids')
		$container.find('.inputText').not('[name="static"]').each(function(){
			var $cp = $(this)
			, val = setDefaults*1?$cp.attr("data_default_value"):''
			//console.log(this.id + val)
			//if ( $cp.hasClass('inline-search') ) debugger;
			$cp.valor(val).removeData('data-filter-conditions');
			this.readOnly=0
			if ($cp.prop('tagName')!='SELECT') setTextareaHeight($cp[0])//$cp.css('height','')
		})
		formCabecera.formCabeceraEtiquetaUpdate('Ning&uacute;n registro seleccionado.');
		$container.find( '.divCampoForm .no-insert' ).prop('disabled',false)
		document.getElementById('idlistado').value=""
		$(inlineform2_elements).each ( function () {
			var $areas = DBH.area().container.find('*');
			if(this.$divlistado.is($areas))this.clearForm(true)
		})
		$container.find('select.multistatebutton').each ( function () { this.selectedIndex=0;$(this).find('option').removeAttr('selected').eq(0).attr('selected','1');  })
		$(multistatebuttons_elements).each ( function () { this.setcss() })
		$container.find('.inlinelist').val('')
		$('#iframeListadoCuerpo .menu1OpcionSeleccionada:visible').removeClass('menu1OpcionSeleccionada')
		clearDocumentAlerts()
		$('[id="filter_operator"]').val('IN')
		DBH.date().setcolor($container.find('.dbh_fecha_color'),'unset')
		$container.find('.divdocumentslisttop').html('')
		$container.trigger ( 'topform:modechange' , '' )
		$container.find('select[data-select-vinculada-madre][data-select-vinculada-madre!=""] option').show()
		DBH.valueLists().setColor()
		return true
	}
	this.filter = function (bypass) {
		var v = $camposform.filter('#'+pkname).val()
		//if( v && v !="" && !bypass ){alerta('Debe limpiar el formulario antes de ejecutar un filtrado.');return false} // NO PERMITO FILTRAR SI SE ESTÁ EN UNA FICHA
		//return
		parent.mostrarTelon(1)
		$(document).trigger('area:filter:before',[that])
			//console.log('bbbbbbb')
		setTimeout ( function () { that.filter_real(bypass) }, 30 )
	}
	this.filter_real = function (bypass) {
		//alert('a')
		if ( bypass ) {
			if(bypass==2){that.listadoWhere='1=1';that.listadoWhereText=''};
			reFilter(that.queryEditor.listadoWhere(),that.queryEditor.returnQT());
			return false
		}
		var cps = camposfilter.slice(0)
		cps.push("dbh_redactor_consultas")
		var variablesFiltro=parent.formatFilter(cps,container)
		//var variablesFiltro=parent.formatFilter(camposfilter.push('dbh_redactor_consultas'),container)
//		console.log(variablesFiltro)
		var listadoWhere=variablesFiltro.listadoWhere
		var listadoWhereText=variablesFiltro.listadoWhereText
		, top = this
		, inlineforms_wherearr = []
		, wherearr = variablesFiltro.wherearr
//console.log(wherearr)
		, $redactor = that.$container.find('[id="dbh_redactor_consultas"]')
		, da_areamadrastra_redactor = $redactor.attr('dbh-query-da_id')

		//SECONDARY FORMS
		$(inlineform2_elements).each(function (inlineformIndex){
			var inlineform = this
			, filterKeys = this.filterKeys()
			, tabla = filterKeys.tabla
			, customview = filterKeys.customview
			, pkfieldname = filterKeys.pkfieldname
			, fkfieldname = filterKeys.fkfieldname
			, fkfieldname = fkfieldname.substring(fkfieldname.indexOf('.')+1)
			, filter_operator = filterKeys.filter_operator
			, $cmpsfiltro = filterKeys.$fields
			/*
			, da_areamadrastra = this.da_areamadrastra
			, includeRedactor = ( da_areamadrastra_redactor && ( da_areamadrastra == da_areamadrastra_redactor ) )
			, $redactortemp = includeRedactor ? $redactor : $()
			$cmpsfiltro.filter(':visible').add($redactortemp).each(function(){
			*/
			$cmpsfiltro.filter(':visible').each(function(){
				//console.log(this)
				var $cmp = $(this)
				if ( $(this).val() != '' || $(this).data('data-filter-conditions') != '' ) {
					//var variablesFiltroin = $formatFilter($cmpsfiltro)
					var variablesFiltroin = $formatFilter($cmp)
					, lw = "(" + pkname + " " + filter_operator + " (SELECT " + fkfieldname + " FROM " + customview + " WHERE " + variablesFiltroin.listadoWhere + "))"
					, lwt = that.queryEditor.returnQT(variablesFiltroin.wherearr)
					//console.log(lwt)
					//if ( $cmpsfiltro.filter(':visible').length == 0 ) return
					var whereobj = {
						id : ''
						, name : filterKeys.formname
						, sql : lw
						, value : lwt
						, parameters : 'active'
						, leftexp : ''
						, rightexp : ''
						, inlineformIndex : inlineformIndex
						, inlineformSubquery : variablesFiltroin.listadoWhere
					}
					if(variablesFiltroin.listadoWhere!="1=1"){
						listadoWhere += lw
						listadoWhereText += lwt
						wherearr=$.merge(wherearr,[whereobj])
					}
				}
			})
		})
		var qeqp = that.queryEditor.returnQP()
		if(!$.isArray(qeqp))qeqp = qeqp.queryparameters
		if(qeqp) {
			var splices = 0
			for (var i = qeqp.length - 1; i >= 0; i--) {
				var qpar = qeqp[i]
				, ele = '<div class="'+qpar.parameters+'"/>'
				, $fakeqp = $(ele)
				if ( !$fakeqp.is('.pinned') ) {
					qeqp.splice(i, 1);
				}
			}
			wherearr = $.merge(qeqp,wherearr )
		}
/*
		if ( callback_customfilter ) {
			var cf = callback_customfilter()
			, lw = cf.lw
			, lwt = cf.lwt
			listadoWhere += lw
			listadoWhereText += lwt
		}
*/
		that.queryEditor.queryparameters = wherearr
		that.queryEditor.load()
		listadoWhere = that.queryEditor.listadoWhere()
		listadoWhereText = that.queryEditor.returnQT()
		if(listadoWhereText=="")listadoWhereText=""
		that.listadoWhere=listadoWhere
		that.listadoWhereText=listadoWhereText

		reFilter(listadoWhere,listadoWhereText)
		$('#iframeListadoCuerpo').show()
		listado.get('checkedids')
	}
	this.getPresentSelect = function (addas) {
		var campos = []
		campos.push ( pkname + " AS id" )
		$(etiquetasListado).each(function(i){
			var as = addas ? " AS [" + etiquetasListado[i][1] + "]" : ''
			campos.push ( etiquetasListado[i][0] + as )
		})
		var sql = ("SELECT " + campos + " FROM " + tabla + " WHERE " + that.listadoWhere).replace(/'/g,"''")
		var sql = ("SELECT " + campos + " FROM " + tabla + " WHERE " + pkname + " IN (SELECT idlistado FROM DBH_LISTADO WHERE pkname = '" + pkname + "' AND sessionid = '" + DBH.sessionid + "' )").replace(/'/g,"''")
		return sql
	}
	this.sortcolumns = function () {
		var etiquetasListadoNew = []
		$('#tablaEncabezado #trCeldasEncabezados td:not(:first)').each ( function (i) {
			var pos = $(this).attr('orden')-1
			, orderby = $(this).attr('orderby')
			etiquetasListadoNew.push (  etiquetasListado[pos] )
		})
		if ( etiquetasListado === etiquetasListadoNew ) return false
		etiquetasListado = etiquetasListadoNew
		that.resetListado()
	}
	this.removecolumn = function ( i ) {
		if ( i == 0 ) {
			return false
		}
		if ( etiquetasListado.length < 3 ) {
			alerta ( 'El listado no puede tener menos de 2 columnas.' )
			return false
		}
		etiquetasListado.splice(i-1, 1 )
		//etiquetasview.splice(i-1, 1 )
		alerta ( 'La columna ha sido eliminada del listado',1)
		that.resetListado()
	}
	this.addcolumn_click = function (butt) {
		var $i = $(butt).closest('.divCampoForm').find(':input').not('button')
		, name = $i.attr('name')
		, id = $i.attr('id')
		, sql = that.sqlSelectListado($i)
		, grupo = $i.attr('grupo')
		console.log(sql)
		that.addcolumn(sql,id,name,grupo)
	}
	this.addcolumn = function (colsql,colname,collabel,grupo,noReset) {
		//var sel = selectListado ? 'SELECT ' + colsql + ',' + selectListado.substr ( 6, selectListado.length ) : 'SELECT ' + colsql + ' FROM ' + tabla
//		console.log(typeof colsql)
		if ( typeof colsql != 'string' ) {
			var sqlParams = colsql
			colsql = sqlParams.sql
		}
		var colsql = ( typeof colsql == 'string' ) ? colsql : colsql.sql
		var id = colsql
		,label = collabel
		,alreadyinlist = 0
		$(etiquetasListado).each(function(){
			if ( this[1] == label ) alreadyinlist = 1
		})
		//if ( $.inArray(colsql,that.etiquetaslistadovars().campos) > -1 ) {
		if ( alreadyinlist ) {
			alerta ( "Esta columna ya está en el listado." ) ; return false
		} else {
			//selectListado = sel
			etiquetasListado.unshift ( [id,label,grupo,sqlParams] )
			var lobi = $('#listadoOrderByIndex').val()
			//etiquetasview.unshift ( id )
		}
		if (!noReset) {
			that.resetListado()
			alerta ( "La columna ha sido añadida al listado.",1 )
		}
	}
	this.show = function () {
		$('.topform-buttonbar').hide()
		that.$buttonbar.show()


	}
	this.loadInfoCreacion = function (pkvalue) {
		return
		$('#divCabeceraEtiqueta')[0].title=""
		var listadoView=pktabla
		//var sql = "SELECT (select usu_nombre from DBH_USUARIOS as b where b.usu_id="+listadoView+".iduc) as nombreuc,(select usu_nombre from DBH_USUARIOS as b where b.usu_id="+listadoView+".idum) as nombreum,fechauc,fechaum FROM "+listadoView+" WHERE " + pkname + "="+pkvalue
		var joinhistorico = " LEFT JOIN dbh_historico ON his_da_id = " + da_id + " AND his_pkvalue = " + pkname + " AND his_id IN (select max(his_id) from dbh_historico group by his_da_id,his_pkvalue)"
		//if(listadoView=='dbh_historico')
		joinhistorico=""
		var sql = "SELECT (select usu_nombre from DBH_USUARIOS as b where b.usu_id=his_usu_id) as nombreusu,dbh_historico.his_fecha FROM "+listadoView+joinhistorico+" WHERE " + pkname + "="+pkvalue
		//console.log(sql)
		var infoCreacionArr=sqlExec(sql,0)
		if ( $(infoCreacionArr).length == 0 ) return true
		var usu_nombre=infoCreacionArr[0].childNodes[0].textContent
		var fecha=infoCreacionArr[0].childNodes[1].textContent//.substr(0,10)
		var divCabeceraEtiqueta=document.getElementById('divCabeceraEtiqueta')
		//$('.divCabeceraEtiqueta:visible')[0].title="Creado: "+fechauc+" ("+iduc+")\nModificado por ultima vez: "+fechaum+" ("+idum+")"
		$('#divCabeceraEtiqueta')[0].title="Modificado por ultima vez: "+fecha+" ("+usu_nombre+")"
	}
	this.setandfilter = function (areaid,obj,i_queryeditor_params,i_stringifyparams) {
		mostrarTelon(1)
		etiquetasListado=obj.etiquetasListado
		orderindexListado=obj.listadoOrderByIndex
		$('#listadoOrderByIndexDesc').val(obj.listadoOrderByIndexDesc)
		if ( i_queryeditor_params ) {
		//console.log(i_queryeditor_params)
			that.queryEditor.queryparameters = i_queryeditor_params
			that.queryEditor.load()
			var listadoWhere = that.queryEditor.listadoWhere()
			var listadoWhereText = that.queryEditor.returnQT()
		} else { //FOR LEGACY VIEWS
			that.queryEditor.queryparameters = []
			that.queryEditor.load()
			var listadoWhere = i_stringifyparams.listadoWhere
			var listadoWhereText = i_stringifyparams.listadoWhereText
		}
		that.resetListado(listadoWhere,listadoWhereText)
		//that.clear()
	}
	this.navegar_vinculada = function (eshija,timer) {
		var da_id_hija = $selecthijas.val()
		, da_id_vinculada = eshija ? vinculada_pkname : da_id_hija
		, $areavinculada = $('.formCuerpo[da_id="'+da_id_vinculada+'"]')
		if(!timer && !$areavinculada.length ) {
			DBH.telon.areaLoad()
			//$('#divteloninit').show()
			setTimeout (function(){that.navegar_vinculada(eshija,1)},0)
			return false
		}
		if ( !$areavinculada.length ) {
			loadTopForms(da_id_vinculada)
		}
		var $areavinculada = $('.formCuerpo[da_id="'+da_id_vinculada+'"]')
		, tablavinculada = $areavinculada.attr('pktabla')
		, fkname = eshija ? vinculada_fkname : that.pkname
		, areaname = $('.formCuerpo:visible').attr('name')
		, areavinculada_name = $areavinculada.attr('name')
		, pkname = $areavinculada.attr('customview') + '.' + $areavinculada.attr('pkname')
		, mp = $('#menuPrincipal .menu1Opcion[name="'+areavinculada_name+'"]')[0]
		, fkname_vinculada = $areavinculada.attr('customview') + '.' + $areavinculada.attr('fkname')
		, keyname = eshija ? pkname : fkname_vinculada
		, val = eshija ? $('.formCuerpo:visible').find('[id$=".'+fkname+'"]').val() : $('.formCuerpo:visible').find('[id="'+fkname+'"]').val()
		, recsid = DBH.area().recsid
		//debugger
		if(!recsid.length){
			var listadoWhereText = areaname + ' <b>[filtrados]</b>'
			//var areadestino = DBH.area(areavinculada_name).go()
			listado.memoryfilter(-1)
			/*
			if(!eshija) {
				var vinculada_condition = listado.limittovinculada(1)
			}else{
//				console.log('parriba'+da_id)
				var vinculada_condition = listado.limittovinculada(0,da_id)
			}
			*/
			//var vinculada_condition = listado.limittovinculada(!eshija,da_id_hija)
			//debugger
			let actualwhere = that.queryEditor.listadoWhere()
			, vinculada_condition = !eshija ? dbhArea ( da_id_hija ).sqlForHija ( actualwhere ) : dbhArea ( da_id ).sqlForMadre ( actualwhere )
			//, vinculada_condition = listado.limittovinculada(!eshija,da_id_hija)
			var listadoWhere = vinculada_condition
		}else{
			//var areadestino = DBH.area(areavinculada_name).go()
			listado.memoryfilter(-1)
			if ( !eshija ) {
				var listadoWhere = keyname+' IN ('+recsid+')'
			} else {
				var listadoWhere = keyname+' IN ( SELECT ' + fkname + ' FROM ' + pktabla + ' WHERE ' + that.pkname + ' IN ('+recsid+'))'
			}
			/*
			if ( recsid.length == 1 ) {
				var listadoWhereText = areaname + ' <b>[' + $('.divCabeceraEtiqueta[da_id="'+da_id+'"]').html() + ']</b>'
			} else {
				var listadoWhereText = areaname + ' <b>[varios]</b>'
			}
			listado.memoryfilter(listadoWhere,listadoWhereText)
			*/
		}
		var areadestino = DBH.area(areavinculada_name).go()
		//switchiframes_real.stopReset = 1
		//switchiframes_real(areadestino.pestana)
		var par1 = [['dbh_redactor_consultas',listadoWhere]]
		, queryDesc = ( !eshija? 'Hijos de ' : 'Padres de ' ) + areaname + " " + ( recsid.length == 1 ? '(' + recsid[0] + ')' : that.queryEditor.returnQT() ) //that.queryEditor.returnQT()
		areadestino.formContainer.find('[id="dbh_redactor_consultas"]').attr('dbh-query-description', queryDesc )
		areadestino.setvalues (par1).filter()
		//var par1 = [['dbh_redactor_consultas','']]
		//areadestino.setvalues (par1)
		DBH.telon.hide()
		//$('#divteloninit').hide()

		//DBH.area(areavinculada_name).topform.filter(2)
		//$('#divteloninit').hide()
	}
	this.etiqueta = function () {
		this.value = function () {
			return $('.divCabeceraEtiqueta:visible').text()
		}
		return this
	}
	this.print = function () {
		var $eles = that.$container.find ( '.divCampoForm:visible' ).not ('.divinsertform *')
		, area = DBH.area()
		, id = that.$container.find('input[type="hidden"][id]').val()
		, $area = $('<dbharea/>').attr('nombre',area.name).attr('id',area.id)
		, $registro = $('<registro/>').attr('id',id)
		//, $registro = $('<registro/>').attr('id',id)
		$eles.each( function () {
			var $ele = $(this)
			, label = $ele.find('label[for]').text()
			, $input = $ele.find('.inputText')
			if ($input.length) {
				var value = $input[0].tagName == 'SELECT' ? $input.find('option:selected').text() : $input.val()
				, banda = $ele.closest('[order-index]').find('h4 span').text()
				, $banda = $registro.find('banda[nombre="'+banda+'"]')
				, isgrouped = $ele.closest('[order-index]').find('.divlistado.grouped').length
				, $lineamodelo = $ele.closest('.lineamodelo')
				, $campoxml = $('<campo nombre="' + label + '">' + value + '</campo>')
				if ( !$banda.length ) {
					$banda = $('<banda nombre="' + banda + '" class="'+(isgrouped?'grouped':'')+'"/>')
					$registro.append ( $banda )
				}
				if ( isgrouped ) {
					const $groupcontainer = $ele.closest('.inline-group-container')//.find('h4 span').text()
					, grupo = $groupcontainer.find('.inline-group-title').text()
					var $grupo = $registro.find('grupo[nombre="'+grupo+'"]')
					if ( !$grupo.length ) {
						$grupo = $('<grupo nombre="' + grupo + '"/>')
						$banda.append($grupo)
					}
				}
				if ( $lineamodelo.length ) {
					var id = $lineamodelo.find('input[type="hidden"][id]').val()
					, $registro2 = $banda.find('registro[id="'+id+'"]')
					if ( ! $registro2.length ) {
						$registro2 = $('<registro/>').attr('id',id)
						if ( isgrouped ) {
							$grupo.append ( $registro2 )
						} else {
							$banda.append ( $registro2 )
						}
					}
					$registro2.append ( $campoxml )
				} else {
					if ( isgrouped ) {
						$grupo.append ( $campoxml )
					} else {
						$banda.append ( $campoxml )
					}
				}
				//pairOfValues.push ( {label:label,value:value,grupo:banda} )
			}
		})
		//printableTopform.pairOfValues = pairOfValues
		//, $doc = $(win.document)
		//$doc.append($area)
		//console.log( $registro.html() )
		var etiqueta = that.etiqueta().value()
		$area.append($registro.attr('nombre',etiqueta))
		var html = $area.wrap('<div/>').parent().html()
		, win = window.open (  )
		//conole.log(win)
		, $winbody = $(win.document.body)
		//return false
		//$winbody.html ( html )
		$winbody.html ( '<!DOCTYPE html><title>'+etiqueta+'</title><link rel="stylesheet" type="text/css" href="' + $('#DBHpath').val() + 'css/dbh-print.css?'+Math.random()+'">'+html )
		$winbody.find('campo').attr('title','Doble-click para ocultar').each ( function () {
			var $this = $(this)
			, regexp = new RegExp ( String.fromCharCode (10), "g" )
			$this.html($this.text().replace(regexp,"<br>"))
		})
		$winbody.find('[nombre]').each ( function () {
			var $this = $(this)
			, nombre = $this.attr('nombre')
			, $label = $('<label/>').text(nombre)
			$this.prepend ( $label )
		})
		$winbody.on('dblclick','campo,registro>label',function(){$(this).hide()})
		//setTimeout(function(){win.print()},0)
		//$winbody.append('<link rel="stylesheet" type="text/css" href="theme.css">')
	}
	$container.find('.takefields').removeClass('takefields').addClass('divinlineform')
	return this;
};
