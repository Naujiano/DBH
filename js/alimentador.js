var alimentadorAutomatico = ( function () {
	var pub = {};
	var local = {};
	function init(){
		$('.lengueta,button,input,select').data('obj',alimentadorAutomatico)
		$('#alimentador')
			.on ( 'click' , '.alimentador-btnsavefilter' , function(){$(this).data('obj').guardarfiltro()} )
			.on ( 'click' , '.alimentador-btnclearfilter' , function(){$(this).data('obj').limpiarfiltro()} )
			.on ( 'click' , '.alimentador-btnaddcolumn' , function(){$(this).data('obj').addcolumn()} )
			.on ( 'click' , '.alimentador-btnorderby' , function(){$(this).data('obj').orderbythis()} )
			.on ( 'click' , '.alimentador-btnedit' , function(){$(this).data('obj').edit()} )
			.on ( 'click' , '.alimentador-btndupicate' , function(){$(this).data('obj').duplicates()} )
			.on ( 'click' , '.alimentador-btnlock' , function(){$(this).data('obj').lock()} )
			.on ( 'click' , '.alimentador-btngoselectarea' , function(){$(this).data('obj').goselectarea()} )
			.on ( 'click' , '.alimentador-btnaddtolist' , function(){$(this).data('obj').add()} )
			.on ( 'click' , '.alimentador-btnrenamelist' , function(){$(this).data('obj').rename()} )
			.on ( 'click' , '.alimentador-btnremovefromlist' , function(){$(this).data('obj').remove()} )
			.on ( 'click' , '.alimentador-btnsavecolor' , function(){$(this).data('obj').savecolor()} )
			.on ( 'change' , '#alimentadorListaEntradasCambiarNombre' , function(){$(this).data('obj').listElementChanged(this)} )

		$($('#alimentador .lengueta')[0]).click(function(){$(this).data('obj').mostrar(0)});
		$($('#alimentador .lengueta')[1]).click(function(){$(this).data('obj').mostrar(1)});
		$($('#alimentador .lengueta')[2]).click(function(){$(this).data('obj').mostrar(2)});
		$($('#alimentador .lengueta')[3]).click(function(){$(this).data('obj').mostrar(3)});
		$($('#alimentador .lengueta')[4]).click(function(){$(this).data('obj').mostrar(4)});
		$('#alimentador').on('vistas:list:changed',function (e) {
			var sql = "SELECT i_id,i_nombre FROM dbh_busquedas WHERE i_nombre is not null and i_tabla is not null and i_listadowhere is not null AND i_da_id = " + DBH.area().id + " ORDER BY i_nombre"
			load$listas($('#alimentadorVista'),sql)			
		});
		$('#alimentador').trigger('vistas:list:changed')
		$('#alimentadorFiltro').keypress(function (e) {
			if (e.which == 13) {
				$(this).data('obj').guardarfiltro();
			}
		});
		pub.mostrar(0)
		//$('#alimentadorFiltro')[0].focus()
	};
	pub.setViewAsParam = function () {
		var $sel = $('#alimentadorVista')
		, i_id = $sel.val()
		, i_nombre = $sel.find('option:selected').text()
		, value = 'IN ' + i_nombre
		, $divCampoForm = $(local.caller).closest('.divCampoForm')
		, $label = $divCampoForm.find('label')
		, $campo = $divCampoForm.find('.inputText')
		, id = $campo.attr('id')
		, name = $label.text()
		, sql = "SELECT i_listadowhere,i_tabla FROM dbh_busquedas WHERE i_id = " + i_id
		, rec = DBH.ajax.select (sql)[0]
		, i_listadowhere = rec.i_listadowhere
		, i_tabla = rec.i_tabla
		, sql = id + " IN ( SELECT " + id + " FROM " + i_tabla + " WHERE " + i_listadowhere + " ) "
		, whereobj = {
			id : id
			, name : name
			, sql : sql
			, value : value
			, parameters : 'active'
		}
		console.log(whereobj)
		var qe = DBH.area().topform.queryEditor
		qe.queryparameters.push ( whereobj )
		qe.load()
		$('#alimentador').fadeOut('fast')
	}
	pub.goselectarea = function () {
		DBH.gorecord($(local.caller).attr('data_select_da_id'),$(local.caller).val())
		$('#alimentador').fadeOut('fast')
	}
	pub.lock = function () {
		var $divCampoForm = $(local.caller).closest('.divCampoForm')
		, $label = $divCampoForm.find('label')
		, $campo = $divCampoForm.find('.inputText')
		if ( $campo.hasClass( 'dbh-resizable' ) ) {
			//$label.removeClass('filter-locked')
			var resizedsize = [$campo.width(), $campo.height()]
			$divCampoForm.data('resized-size',resizedsize)
			//console.log(resizedsize)
			$divCampoForm.removeClass('dbh-unlocked').css({position:'static',background:'transparent',width:$divCampoForm.data('static-size')})
			$campo.css({resize:'none',width:'100%'}).removeClass('dbh-resizable')
			setTextareaHeight($campo[0])
		} else {
			//$label.addClass('filter-locked')
			var staticSize = $divCampoForm[0].style.width
			, resizedSize = $divCampoForm.data('resized-size')
			, firstUnlock = 0
			if (!resizedSize) {
				resizedSize = [50,50]
				firstUnlock = 1
			}
			//, divoffset = [$divCampoForm.offset().left,$divCampoForm.offset().top]
			//console.log(staticSize)
			$divCampoForm.data('static-size',staticSize)
			$divCampoForm.addClass('dbh-unlocked').css({position:'fixed',width:'auto', background:'#fbfbfb','z-index':1100}).draggable({ handle: "label" })
			if ( firstUnlock ) $divCampoForm.css({top: '50%', left: '50%'})
			$campo.css({resize:'both'}).addClass('dbh-resizable').width(resizedSize[0])
			if ( $campo[0].tagName != "SELECT" ) $campo.height(resizedSize[1])
		}
		//console.log($(local.caller)[0].tagName)
		$('#alimentador').fadeOut('fast')
	}
	pub.orderbythis = function () {
		$(local.label).data('inlineform').orderby(local.label)
		hide()
	}
	pub.edit = function () {
		var data_id = $(local.caller).attr('data_id')
		, da_id = DBH.area('[campos]').id
		DBH.gorecord(da_id,data_id)
		hide()
	}
	pub.duplicates = function () {
		var cmp = $(local.caller)
		, id = cmp.attr('id')
		, sql = id + " in ( select " + id + " from personas group by " + id + " having count(" + id + ")>1 )"
		, DBH_area = DBH.area()
		DBH_area.redactor = sql
		DBH_area.topform.filter()

		hide()
	}
	pub.addcolumn = function () {
		var lab = local.label
		, $lab = $(lab)
		, inlineform = $lab.data('inlineform')
		if(inlineform){
			inlineform.addcolumn ( lab );
		} else {
			$('#iframeFormCuerpo').data('topform').addcolumn_click ( local.label );
		}
		hide()
	}
	pub.limpiarfiltro = function () {
		var $r = $(local.caller)
		$r.removeData('data-filter-conditions');
		$r.closest('.divCampoForm').find('label').removeClass('filter-locked');
		$('#alimentadorFiltro').val('');
		$('#alimentador').fadeOut('fast')
	}
	pub.guardarfiltro = function () {
		//alert('a')
		var v = $('#alimentadorFiltro').val()
		if ( v != '' ) {
			$(local.caller).data('data-filter-conditions',v)
			$(local.caller).closest('.divCampoForm').find('label').addClass('filter-locked')
		} else {
			$(local.caller).removeData('data-filter-conditions')
			$(local.caller).closest('.divCampoForm').find('label').removeClass('filter-locked')
		}
		//console.log($(local.caller)[0].tagName)
		$('#alimentador').fadeOut('fast')
	}
	function show(){
		contextMenu.show($('#alimentador')[0],local.caller);
	};
	function hide(){
		contextMenu.hide();
	};
	function add_sql(des) {
		var $sel = $(local.caller)
		, madreid = $sel.attr('data-select-vinculada-madre')
		, $madre = $('[id="'+madreid+'"]')
		, li2_li1_id = $madre.val()
		, li2_des = des
		if ( ! $sel.hasClass('db-edit') ) {
			if ( madreid ) { // es hija
				var sql3 = "INSERT INTO DBH_LISTAS ( li1_padre_li1_id, des, grupo ) VALUES ( '" + li2_li1_id + "','" + li2_des + "','" + local.grupo + "' )"
				if ( li2_li1_id == '' ) {
					alerta ( "Debe seleccionar un valor en la lista madre para poder añadir otro a la lista hija." )
					return false;
				}
				sqlExecVal ( sql3 , 0 )
				sqlm = "SELECT MAX(li1_id) FROM DBH_LISTAS"
			} else {
				var sql = "SELECT id FROM DBH_LISTAS WHERE grupo = '" + local.grupo + "'"
				, sql1 = "INSERT INTO DBH_LISTAS ( grupo, id, des ) ( SELECT '" + local.grupo + "', MAX(id)+1 AS a,'" + des + "' FROM DBH_LISTAS WHERE grupo = '" + local.grupo + "' )"
				, sql2 = "INSERT INTO DBH_LISTAS ( grupo, id, des ) VALUES ( '" + local.grupo + "', 1 ,'" + des + "' )"
				, sql = sqlExecVal ( sql ) ? sql1 : sql2
				sqlExecVal ( sql , 0 )
				sqlm = "SELECT MAX(li1_id) FROM DBH_LISTAS"
			}
			var a = sqlExecVal ( sqlm , 0 )
		} else {
			if ( ! $sel.hasClass('db-edit-tables') ) {
				if ( confirm ( 'Si continua AÑADIRÁ UNA COLUMNA A LA BD.' ) ) {
					var tabla = des.substring ( 0, des.indexOf('.') )
					, field = des.substring ( des.indexOf('.')+1 )
					, sql = "ALTER TABLE " + tabla + " ADD " + field
					, a = sqlExecVal ( sql , 0 )
					load$listas ( $sel , $sel.attr('data-sql-loadlista') )
					alerta ( 'Columna ' + field + ' añadida a la tabla ' + tabla, 1 )
				}
			} else {
				if ( confirm ( 'Si continua AÑADIRÁ UNA TABLA A LA BD.' ) ) {
					var tabla = des.substring ( 0, des.indexOf('.') )
					, sql = "CREATE TABLE " + des + " ( " + des + "_id int) "
					, a = sqlExecVal ( sql , 0 )
					load$listas ( $sel , $sel.attr('data-sql-loadlista') )
					alerta ( 'Tabla ' + des + ' añadida a la BD', 1 )
				}
			}
		}
		return a
	}
	function rename_sql(id,des) {
		var $sel = $(local.caller)
		, madreid = $sel.attr('data-select-vinculada-madre')
		, sql = "UPDATE DBH_LISTAS SET des = '" + des + "' WHERE li1_id = " + id + " AND grupo = '" + local.grupo + "'"
		if ( ! $sel.hasClass('db-edit') ) {
			var a = ajaxExecuterValor(encodeURIComponent(sql),0)
		} else {
			if ( confirm ( 'Si continua RENOMBRARÁ UNA COLUMNA DE LA BD.' ) ) {
				var fieldid = $sel.attr('id')
				, tabla = fieldid.substring ( 0, fieldid.indexOf('.') )
				, sql = "EXEC sp_RENAME '" + fieldid + "' , '" + des + "', 'COLUMN'"
			}
		}
		console.log(sql)
	}
	function remove_sql(id) {
		var $sel = $(local.caller)
		, madreid = $sel.attr('data-select-vinculada-madre')
		, sql = "DELETE DBH_LISTAS WHERE li1_id = " + id 
		if ( ! $sel.hasClass('db-edit') ) {
			var a = ajaxExecuterValor(encodeURIComponent(sql),0)
		} else {
			if ( ! $sel.hasClass('db-edit-tables') ) {
				if ( confirm ( 'Si continua ELIMINARÁ UNA COLUMNA DE LA BD.' ) ) {
					var tabla = id.substring ( 0, id.indexOf('.') )
					, field = id.substring ( id.indexOf('.')+1 )
					, sql = "ALTER TABLE " + tabla + " DROP COLUMN " + field
					, a = sqlExecVal ( sql , 0 )
					//console.log(sql)
					load$listas ( $sel , $sel.attr('data-sql-loadlista') )
					alerta ( 'Columna ' + field + ' eliminada de la tabla ' + tabla, 1 )
				}
			} else {
				if ( confirm ( 'Si continua ELIMINARÁ UNA TABLA A LA BD.' ) ) {
					var tabla = id.substring ( 0, id.indexOf('.') )
					, sql = "DROP TABLE " + id 
					, a = sqlExecVal ( sql , 0 )
					load$listas ( $sel , $sel.attr('data-sql-loadlista') )
					alerta ( 'Tabla ' + id + ' eliminada de la BD', 1 )
				}
			}
		}
		console.log(sql)
	}
	pub.abrir = function (caller,grupo,tablahija,campohijo,$twinlists,insert_sql_fn,update_sql_fn,delete_sql_fn){
		local.caller = caller;
		//local.caller = $(caller).closest('.divCampoForm').find('#'+$(caller).attr('for'));
		//console.log('$(caller).attr(for)'+$(caller).attr('for'))
		//console.log('local.caller'+local.caller)
		//$(local.caller).css('border','1px solid red')
		local.label = $(caller).closest('.divCampoForm').find('label')[0];
		//$('#alimentador #info').html('Nombre en base de datos:<br><br>' + $(caller).attr('id'));
		$('#alimentadorTitulo').html(caller.name )
		$('#alimentadorCampoId').html($(caller).attr('id'))
		$('#alimentador .lengueta').show()
//		console.log(caller.tagName)
		if(typeof $('.lengueta,button').data('obj') == 'undefined' ) init();
		local.grupo = grupo;
		local.tablahija = tablahija;
		local.campohijo = campohijo;
		local.insert_sql_fn = insert_sql_fn;
		local.update_sql_fn = update_sql_fn;
		local.delete_sql_fn = delete_sql_fn;
		var attrgrupo = $(caller).attr('grupo')
		if ( attrgrupo ) {
			$twinlists = $(caller.ownerDocument).find('select[grupo="'+attrgrupo+'"][grupo]')
			local.grupo = attrgrupo
		} else {
			if ( typeof $twinlists == 'undefined' ) $twinlists = $(caller)
		}
		var v = $(local.caller).data('data-filter-conditions')
		, bgcolor = $(local.caller).find('option:selected').attr('dbh-background-color')
//		console.log('v'+v)
		$('#alimentadorFiltro').val(v?v:'')
		$('#alimentadorColor').val(bgcolor?bgcolor:'').css({'background-color':bgcolor})//.trigger('keydown').trigger('keypress').trigger('keyup')
		var alimentable = ( $(caller).attr('grupo') && ! $(caller).is('.tags-cloud')  ) || $(caller).hasClass('db-edit')
		var insideinlineform = $(caller).closest('.inlineform').length > 0
		if ( insideinlineform ) {
			$('.alimentador-btnlock').hide()
			$('.alimentador-btndupicate').hide()
			//$('.alimentador-btnaddcolumn').hide()
			$('.alimentador-btnorderby').show()
		} else {
			$('.alimentador-btnlock').show()
			$('.alimentador-btndupicate').show()
			$('.alimentador-btnaddcolumn').show()
			$('.alimentador-btnorderby').hide()
			
		}
		if ( $(caller).attr('data_select_da_id') ) {
			$('.alimentador-btngoselectarea').show()
		} else {
			$('.alimentador-btngoselectarea').hide()
		}
		if ( ! alimentable ) { $('#alimentador .lengueta').hide(); $('#alimentador .lengueta').eq(0).show(); $('#alimentador .lengueta').eq(4).show();show(); pub.mostrar(0); return true }
//		console.log( $twinlists.length)
		local.$twinlists = $twinlists;
		$('#alimentadorListaEntradasCambiarNombre').html(caller.innerHTML)
		$('#alimentadorListaEntradasEliminar').html(caller.innerHTML)
		if(typeof caller.options[caller.selectedIndex] != "undefined" ) $('#alimentadorNuevoNombre')[0].value=caller.options[caller.selectedIndex].text
		$('#alimentadorListaEntradasCambiarNombre')[0].selectedIndex=caller.selectedIndex
		$('#alimentadorListaEntradasEliminar')[0].selectedIndex=caller.selectedIndex
		
		show();
		setTimeout(function(){$('#alimentador :input:visible').not('button')[0].focus()},50)
		return this
	};
	pub.mostrar = function(i){
		$("#alimentador .lengueta").each(function(){$(this).removeClass('selected');})
		$("#alimentador .content").each(function(){$(this).hide();})
		$($("#alimentador .lengueta")[i]).addClass('selected')
		$('#alimentador #content'+i).show()
		
		//alert('a')
		//if(typeof $('#alimentador #content'+i).find('input')[0] != 'undefined' ) setTimeout(function(){$('#alimentador #content'+i).find('input')[0].focus()},50)
//			console.log($('#alimentador :input:visible').not('button').length)
		setTimeout(function(){$('#alimentador :input:visible').not('button')[0].focus();$('.datepicker').hide()},50)
	};
	pub.add = function(){
		var des = $('#alimentadorNuevaEntrada').val()
		if ( typeof local.insert_sql_fn == "undefined" || local.insert_sql_fn == null ) {
			a = add_sql ( des )
		} else {
			a = local.insert_sql_fn ( des )
		}
		if ( !a ) return false
		local.$twinlists.each ( function () {
			var $sel = $(this)
			, grupo = $sel.attr('grupo')
			, htmll = '<option class="hide" value="'+a+'" selectid="'+grupo+'">'+des+'</option>'
			,$o = $(htmll)
			$sel.append($o)
			$sel.data('fulloptions', $sel.data('fulloptions')+htmll )
		});
		var $sel = $(local.caller)
		local.caller.selectedIndex=local.caller.options.length-1
		alerta('Opción ' + des + ' añadida a la lista.', 1 )
		formCabecera.formModificado(1)
		hide()
	};
	pub.rename = function(){
		var des = $('#alimentadorNuevoNombre').val()
		var listid = $('#alimentadorListaEntradasCambiarNombre').val()
		if ( typeof local.update_sql_fn == "undefined" || local.update_sql_fn == null ) {
			rename_sql ( listid, des )
		} else {
			local.update_sql_fn ( listid, des )
		}
		//$(caller.options[caller.selectedIndex]).text(des)
		local.$twinlists.each ( function () {
			$(this).find("option[value='" + listid + "']").text(des)
		});
		var $sel = $(local.caller)
		, $fulloptions = $('<select>'+$sel.data('fulloptions')+'</select>').find('[value="'+listid+'"]').text(des).parent()
		$sel.data('fulloptions', $fulloptions.html() )
		alerta('Opción ' + $('#alimentadorListaEntradasCambiarNombre').find("option[value='" + listid + "']").text()  + ' renombrada a ' + des, 1 )
		hide()
	};
	pub.savecolor = function(){
		var des = $('#alimentadorColor').val()
		, $caller = $('#alimentadorListaEntradasCambiarNombre')
		, li1_id = $caller.find('option:selected').val()
		, sql = "UPDATE dbh_listas SET li1_color = '" + des + "' WHERE li1_id = " + li1_id + " AND grupo = '" + local.grupo + "'"
		DBH.ajax.sql(sql)
		DBH.valueLists.$grupos.find('grupo[grupo="'+local.grupo+'"]').remove()
		DBH.load().loadValores(local.grupo)
		//$(local.caller).find('option[value="'+li1_id+'"]').css({'background-color': bgcolor, 'color' :  fgcolor })
		DBH.valueLists($(local.caller).find('option[value="'+li1_id+'"]')).setColor()
		DBH.valueLists().setColor()
		alerta('Color de opción guardado.',1)
		hide()
	
	};
	pub.listElementChanged = function(sel){
		console.log('aa')
		var $color = $('#alimentadorColor')
		, $name = $('#alimentadorNuevoNombre')
		, $caller = $(sel)
		, $option = $caller.find('option:selected')
		, bgcolor = $option.attr('dbh-background-color')
		$color.val ( bgcolor ).css({'background-color':bgcolor})
		$name.val(  $option.text() )
	};
	pub.remove = function(){
		var listid = $('#alimentadorListaEntradasEliminar').val()
		, $sel = $(local.caller)
		, hijaid = $sel.attr('data-select-vinculada-hija')
		if ( hijaid && ! confirm ('Eliminar los valores correspondientes en la lista hija también?') ) return false
		if ( typeof local.delete_sql_fn == "undefined" || local.delete_sql_fn == null ) {
			remove_sql ( listid )
		} else {
			local.delete_sql_fn ( listid )
		}
		
		local.$twinlists.each ( function () {
			$(this).find("option[value='" + listid + "']").remove()
		});
		var $sel = $(local.caller)
		, $fulloptions = $('<select>'+$sel.data('fulloptions')+'</select>')
		$fulloptions.find('[value="'+listid+'"]').remove()
		$sel.data('fulloptions', $fulloptions.html() )
		alerta('Opción ' + $('#alimentadorListaEntradasEliminar').find("option[value='" + listid + "']").text() + ' eliminada de la lista.', 1 )
		hide()
	};
	return pub;
} () );