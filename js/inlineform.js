var inlineform2_objpar  = function (objpar) {
	return new inlineform2 ( objpar.tablapkfkArr, objpar.camposlistado, objpar.$fkformfield, objpar.$divinlineform, undefined, objpar.idusuario, objpar.callbackFnWhenAddClone, objpar.callbackFnWhenAddNew, objpar.orderBy, objpar.callbackFnWhenEnd, objpar.callbackFnBeforeAddNew, objpar.files, objpar.readOnly, objpar.blockButton, objpar.$topcontainer, objpar.da_id, objpar.customview, objpar.da_areamadre, objpar.fkname, objpar.da_fkfield_areamadre, objpar.da_areamadrastra )
};
var inlineform2_elements = []
var inlineform2 = ( function ($,undefined) {
	//CONSTRUCTOR
	//alert('inlineform')
	var cls = function ( tablapkfkArr, camposlistado, $fkformfield, $divinlineform, doc, idusuario, callbackFnWhenAddClone, callbackFnWhenAddNew, orderBy, callbackFnWhenEnd, callbackFnBeforeAddNew, files, readOnly, blockButton, $topcontainer, da_id, customview, da_areamadre, fkname, da_fkfield_areamadre, da_areamadrastra ) {
		inlineform2_elements.push(this)

		var that = this
		that.inlineformIndex = inlineform2_elements.length - 1
		that.doc = document
		that.da_areamadrastra = da_areamadrastra
		if ( tablapkfkArr ) {
			that.tabla = tablapkfkArr[0]
			var pktablefieldname = tablapkfkArr[1]
			that.pktablefieldname = pktablefieldname.substring(pktablefieldname.indexOf('.')+1)
			that.fktablefieldname = tablapkfkArr[2]
			that.$fkformfield = $fkformfield
			that.operative = true
		}
		if ( ! $divinlineform ) {
			$divinlineform = $('<div class="divinlineform" da_id="'+da_id+'" da_areamadre="'+da_areamadre+'" da_fkfield_areamadre="'+da_fkfield_areamadre+'" fkname="'+fkname+'" customview = "' + customview + '"/>');
			$topcontainer.append ( $divinlineform );
			$divinlineform.append ( $('<div class="general-container"/>') );
			vars.createFormFields (that.tabla,$divinlineform,that,da_id)
		}
		$divinlineform.prepend ( $('<input type="hidden" class="inputText no-insert no-filter"/>').attr('id',that.pktablefieldname) );
		var $lineamodelo = $('<div class="lineamodelo"></div>')
		, $divinlineformchildren = $divinlineform.children().detach()
		$lineamodelo.append($divinlineformchildren)
		$divinlineform.append ( $lineamodelo )
		that.$lineamodelo = $divinlineform.find('.lineamodelo')
		that.$lineamodelo.css ( 'width' , '100%' )
		that.$lineamodelo.find('label').each(function(){
			var $label = $(this)
			, fieldname = $label.closest('.divCampoForm').find(':input').attr('id')
			$label.css ('cursor','pointer')
			$label.attr('for',fieldname)
			$label.data('inlineform',that)
		})
		var campostabla = []
		that.$lineamodelo.find('.inputText').not('.no-insert').each ( function (i,ele) {
			campostabla.push(ele.id)
		});
		if(customview){programarCampos(campostabla,that.$lineamodelo,customview,1)};
		$divinlineform.on ( 'click', '.divlistado .multistatebutton-write', function() {that.guardar(this)} )
		that.$divinsertform = $divinlineform.prepend('<div class="divinsertform divgrupo lineamodelo"/>').find('.divinsertform')
		var $botonopenform = $('<button type="button" class="boton botonopenform boton-switch" title="Insertar / Buscar" style="width:auto;padding:0" value=""></button>')
		$divinlineform.attr('title',blockButton)
		if ( blockButton ) {
			var $bb = $('<h4 class=" bb-inlineform" title="'+blockButton+'"><span>' + blockButton + '</span></h4>')
			$bb.on ( 'mouseup', function () { if(!that.cargado)that.listar(); } )
			$bb.append( $botonopenform.append($('.form-toolbar #switch-redactor').eq(0).find('svg').clone()) )
			$botonopenform.on ( 'click', function () { $(this).toggleClass('boton-switch-checked')} )
			/*
			var $filterop = $('<button type="button" title="Devolver los registros excluidos de la búsqueda actual" class="boton botonancho boton-listado botongenericicons fa fa-random" id="filter_operator" Value="IN"></button>')
			$filterop.on('mouveover', function(){$(this).css({'border-color':'black'})})
			$filterop.on('onmouseout', function(){$(this).css({'border-color':'transparent'})})
			$filterop.on('click',function(){
				var si = this.value
				, $this = $(this)
				this.value=si=="IN"?"NOT IN":"IN";
				if(!$this.hasClass("color-tomato")){
					$this.addClass("color-tomato")
				}else{
					$this.removeClass("color-tomato")
				};
				event.stopPropagation()
			})
			$bb.append($filterop)
			*/
			$divinlineform.wrap ( '<div class="blockbutton-div inlineform"/>' ).parent().prepend($bb)
			that.bb = new parent.blockButton($bb[0],$divinlineform[0])
			that.$bb = $bb
			that.formname = blockButton
		}

		$divinlineform.data('inlineform',that)
		//$botonopenform.css ( 'background-position', '5px 5px')
		new parent.blockButton($botonopenform[0],that.$divinsertform[0],function(){that.bb.abrir()})
		this.camposlistado = camposlistado
		if ( ! this.camposlistado ) {
			this.camposlistado = []
			that.$lineamodelo.find('.inputText').not('.no-select').each ( function () {
				var $cp = $(this)
				, id = $cp.attr('id')
				if ( $.inArray(id, that.camposlistado) == -1 && id != that.pktablefieldname ) {
					var data_customfield_sql_select = $cp.attr('data-customfield-sql-select')
					, id = data_customfield_sql_select ? '(' + data_customfield_sql_select + ') AS [' + id.substring(id.indexOf('.')+1) +']' : id
					that.camposlistado.push( id )
				}
			})
		}
		that.$divlistado = $('<div class="divlistado" style="border:0px solid yellow;width:100%;"></div>') //divinlineform.find('.divlistado')
		that.$divlistado.html('<div class="inlineform-vacio">Vacío</div>')
		$divinlineform.append ( that.$divlistado )
		that.cargado = 0
		that.campos = [];
		var $divcampos = that.$lineamodelo.find('.inputText').closest('.divCampoForm')
		, $divcamposnofilter = that.$lineamodelo.find('.no-filter').closest('.divCampoForm')
		, $lineamodelofilter = $divcampos.not($divcamposnofilter)
		that.$divinsertform.append ( $lineamodelofilter.clone(true,true) )
		that.$divinsertform.find('.inputText').each(function(){
			var $inp = $(this)
			, id = this.id
			, noinsert = $lineamodelofilter.find('[id="'+id+'"]').data('noinsert')
			$inp.data('noinsert',noinsert)
		})
		var $mb = that.$divinsertform.find('.multistatebutton')
		if ( $mb ) new multistatebutton($mb[0])
		var $divbotonesoperaciones = $('<div class="botonesoperaciones toolbar"></div>')
		var $botonguardar = $('<button class="boton req-register boton-toolbar" style="margin-right:5px" disabled title="Crear esta nueva entrada"></button>')
		, $botonfiltrar = $('<button class="boton req-register boton-toolbar" style="margin-right:5px" disabled title="Filtrar los resultados de este area."></button>')
		, $botonsaveserie = $('<button class="boton mini toolbar-group-series-inlineform" style="margin-left:5px;margin-top:5px;float:right;clear:none" title="Crear entradas en los registros seleccionados">Añadir Serie</button>')
		, $botonremoveserie = $('<button class="boton mini toolbar-group-series-inlineform" style="margin-left:5px;margin-top:5px;float:right;clear:none" title="Quitar entradas de los registros seleccionados">Eliminar Serie</button>')
		, $botonborrar = $('<button class="boton boton-toolbar" style="margin-right:5px" title="Limpiar el formulario"></button>')
		$botonguardar.append($('.form-toolbar .dbh-toolbar-button-add').eq(0).find('svg').clone()).on ( 'click', function () { that.crear() } )
		$botonfiltrar.append($('.form-toolbar #buttonfilter').eq(0).find('svg').clone()).on ( 'click', function () { that.listar('filter') } )
		$botonsaveserie.on ( 'click', function () { that.saveserie() } )
		$botonremoveserie.on ( 'click', function () { that.removeserie() } )
		$divbotonesoperaciones.append ( $botonborrar )
		$divbotonesoperaciones.append ( $botonfiltrar )
		$divbotonesoperaciones.append ( $botonremoveserie )
		$divbotonesoperaciones.append ( $botonsaveserie )
		$divbotonesoperaciones.find(sessionStorage["usu_perfil"]).hide()
		$botonborrar.append($('.form-toolbar #buttonclear').eq(0).find('svg').clone()).on ( 'click', function () {
			that.clearForm (  )
		} )
		/*
		$botonborrar.on ( 'click', function () {
			$(this).closest('.divinsertform').find('.inputText').each ( function(){
				this.value='';
				parent.setTextareaHeight(this);
				$(this).css('background',parent.$(this).data ( 'oldbg' ))
			})
		} )
		*/
		var $wrapper = $( '<div style="width:15px;margin-left:-15px;float:left;box-sizing:border-box;"/>' )
		if ( readOnly ) {
			var $botoneliminar = $('<div disabled></div>')
			$botoneliminar.css ( 'cursor', 'default' )
		} else {
			$divbotonesoperaciones.prepend ( $botonguardar )
			var $botoneliminar = $('<div title="ELIMINAR" class="enabled"></div>')
		}
		if ( files ) {
			var $botonfiles = $('<div class="boton miniboton miniboton-inlineform botonfiles genericon genericon-attachment" title="ARCHIVOS"></div>')
			//$wrapper.append ( $botonfiles )
			//that.docs = new parent.docs.doc_manager ( that.pktablefieldname )
			that.docs = new parent.docs.doc_manager ( da_id )
		}
		var $botonavisos = $('<div title="TAREAS" class="enabled"></div>')
		, $botoncomentarios = $('<div title="COMENTARIOS" class="enabled"></div>')
		, $botonhistorico = $('<div title="HISTÓRICO" style="font-family:arial;font-size:12px;" class="enabled boton miniboton miniboton-inlineform genericon dbh_boton_historico" title="Ver histórico del registro"><div style="margin:1px 0 0 2px">H</div></div>')
		$botoneliminar.addClass('boton miniboton miniboton-inlineform botoneliminar genericon genericon-trash')
		$botonavisos.addClass('boton miniboton miniboton-inlineform boton-avisos fa fa-bell-o').css({'font-size':'10px'})
		$botoncomentarios.addClass('boton miniboton miniboton-inlineform boton-comentarios fa fa-commenting-o').css({'font-size':'10px',padding:'2px 0 0 3px'})
		$wrapper.append ( $botoneliminar )
		$wrapper.css({opacity:1}).append (
			$('<div style="width:16px;height:16px;overflow:hidden;border:1px solid #ddd;z-index:;background:white;position:relative;margin-top:0px;"><div class="boton miniboton miniboton-inlineform" style="padding:0" title=""><div style="margin:-1px 0 0 3px">+</div></div></div>' ).append ( $botonavisos ).append ( $botoncomentarios ).append ( $botonfiles ).append ( $botonhistorico )
			.on ( 'mouseover' , function () {
			var $this = $(this)
			$this.width('auto')
			console.log('aa')
		}).on ( 'mouseout' , function () {
			$(this).width(16)
		})
		)
		//$wrapper.append ( $botonhistorico )
		$divinlineform.on('click','.dbh_boton_historico',function(){
			var $lm = $(this).closest('.lineamodelo')
			, id = $lm.find('[id="'+that.pktablefieldname+'"]').val()
			, par = [['dbh_historico.his_pkvalue',id],['dbh_historico.his_da_id',da_id]]
			DBH.area('dbh-histórico').go().setvalues (par).filter()
		})
		that.$divinsertform.append ( $divbotonesoperaciones )
		that.$divinsertform.append ( $divbotonesoperaciones )
		var $c =that.$divinsertform.find('.dbh_calendar')
//		console.log ($c.length)
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
		
		//that.$lineamodelo.prepend  ( $botoneliminar.wrap ( '<div style="width:15px;margin-left:-15px;float:left;box-sizing:border-box;"/>' ).parent() )
		that.$lineamodelo.removeClass ( 'lineamodelo' )
		that.$lineamodelo = that.$lineamodelo.wrap ( '<div class="lineamodelo_wrapper" style="width:100%;padding-left:15px;box-sizing:border-box;clear:both;"/>' ).parent()
		that.$lineamodelo
			.on ( 'click', '.botoneliminar.enabled', function (e) { that.borrar(this);e.preventDefault(); } )
			.on ( 'click', '.boton-avisos', function (e) {
				e.preventDefault();
				var $lm = $(this).closest('.lineamodelo')
				, id = $lm.find('[id="'+that.pktablefieldname+'"]').val()
				, $campos = $lm.find('.aviso-show')
				, etiqueta = ''
				$campos.each(function(){
					var type = this.tagName
					, $campo = $(this)
					if(type=="SELECT"){
						var eti = $campo.find('option:selected').text()
					} else {
						var eti = $campo.val()
					}
					etiqueta += eti + ' '
				})
				var par = [['dbh_avisos.avi_pkvalue',id],['dbh_avisos.avi_da_id',da_id]]
				DBH.area('dbh-avisos').go().setvalues (par).filter()
				var par = [['dbh_avisos.avi_pkvalue',id],['dbh_avisos.avi_da_id',da_id],['dbh_avisos.avi_etiqueta',etiqueta]]
				DBH.area().setvalues (par)
			} )
			.on ( 'click', '.boton-comentarios', function (e) {
				e.preventDefault();
				var $lm = $(this).closest('.lineamodelo')
				, id = $lm.find('[id="'+that.pktablefieldname+'"]').val()
				, $campos = $lm.find('.aviso-show')
				, etiqueta = ''
				$campos.each(function(){
					var type = this.tagName
					, $campo = $(this)
					if(type=="SELECT"){
						var eti = $campo.find('option:selected').text()
					} else {
						var eti = $campo.val()
					}
					etiqueta += eti + ' '
				})
				var par = [['dbh_comentarios.cc_pkvalue',id],['dbh_comentarios.cc_da_id',da_id]]
				DBH.area('dbh-comentarios').go().setvalues (par).filter()
				var par = [['dbh_comentarios.cc_pkvalue',id],['dbh_comentarios.cc_da_id',da_id],['dbh_comentarios.cc_texto',etiqueta]]
				DBH.area().setvalues (par)
			} )
//		console.log(DBH.area('clientes').id)
		that.$lineamodelo.prepend  ( $wrapper )
		that.$lineamodelo.addClass ( 'lineamodelo' )

		that.$lineamodelo.find('.inputText').each ( function (i,ele) {
			if ( this.tagName == 'TEXTAREA' ) {
				$(this).on ( 'keyup' , function () {
					parent.setTextareaHeight(this);
				});
			}
			that.campos[that.campos.length] = ele.id
		});
		//if(that.tabla){programarCampos2(that.tabla);programarLabels($divinlineform.find('label[for]'))}
		that.$divinsertform.find('.inputText').each ( function (i,ele) {
			$(this).on ( {
				'keyup': function () {
					parent.setTextareaHeight(this);
				},
				'focus': function () { $(this).removeClass('validation-notvalid') }
			})
		});

		//-------------------------------------------------------------
		this.orderby = function(lbl) {
			var fieldname = $(lbl).attr('for');
			var $inputdiv = $(lbl).closest('.divCampoForm')
			,$inputdivs = $(lbl).closest('.lineamodelo').find('.divCampoForm')
			,fieldname = $inputdivs.index($inputdiv)*1+1
			orderBy=(fieldname+(orderBy==fieldname+' DESC'?'':' DESC'));
			that.listar()
		}
		this.filterKeys = function () {
			return { tabla: that.tabla, fkfieldname: that.fktablefieldname, pkfieldname:that.pktablefieldname, $fields: that.$divinsertform.find(':input').not('button').not('.no-filter'), formname: blockButton, filter_operator: 'IN', customview: customview }
			//return { tabla: that.tabla, fkfieldname: that.fktablefieldname, pkfieldname:that.pktablefieldname, $fields: $divinlineform.find(':input').not('button').not('.no-filter'), formname: blockButton, filter_operator: that.$bb.find('#filter_operator').val(), customview: customview }
		}
		this.addcolumn = function (label,topform) {
			var $i = $(label).closest('.divCampoForm').find(':input').not('button')
			, name = $i.attr('name')
			, grupo = $i.attr('grupo')
			, id = $i.attr('id')
			, noResetListado = topform ? 1 : undefined
			, tablamadre = topform ? topform.tabla : $('#iframeFormCuerpo').attr('customview')
			, pkmadre = topform ? topform.pkname : $('#iframeFormCuerpo').attr('pkname')
			, inlineform = that
			, filterKeys = inlineform.filterKeys()
			, tabla = filterKeys.tabla
			, customview = filterKeys.customview
			, pkfieldname = filterKeys.pkfieldname
			, fkfieldname = filterKeys.fkfieldname
			, fkfieldname = fkfieldname.substring(fkfieldname.indexOf('.')+1)
			, $cmpsfiltro = filterKeys.$fields
			, filter_operator = filterKeys.filter_operator
			, variablesFiltro = $formatFilter($cmpsfiltro)
			, lw = " AND " + pkname + " " + filter_operator + " (SELECT " + fkfieldname + " FROM " + customview + " WHERE " + variablesFiltro.listadoWhere + ")"
			, topform = topform ? topform : $('#iframeFormCuerpo').data('topform')
			, fields = topform.sqlSelectListado($i)
			, sql = "(SELECT distinct cast(" + fields + " as varchar) + ', ' FROM " + that.tabla + " WHERE " + variablesFiltro.listadoWhere + " AND " + that.fktablefieldname + " = " + tablamadre + "." + pkmadre + " FOR XML PATH(''))"
			, sqlParams = {
				fields : fields
				, table : that.tabla
				, where : (that.fktablefieldname + " = " + tablamadre + "." + pkmadre)
				, sql : sql
				, inlineformIndex : that.inlineformIndex
				//, da_areamadrastra : da_areamadrastra
			}
			//console.log($i.attr('tipo')== 'datetime')
			topform.addcolumn ( sqlParams, "", blockButton+": "+name, grupo, noResetListado );
			//console.log(sql)

		}
		this.hide = function () {
			that.cargado = 0
			if ( that.$bb ) that.$bb.parent().hide()
		}
		this.show = function () {
			that.cargado = 0
			if ( that.$bb ) {
				that.$bb.parent().show()
				if ( $divinlineform.is(':visible') ) {
					that.listar()
				}
			}
		}
		this.addbutton = function (txt,tit,fn) {
			var $boton = $('<button class="boton mini" style="margin-right:5px" title="' + tit + '">' + txt + '</button>')
			$boton.on ( 'click', function () {
				fn()
			} )
			$divbotonesoperaciones.prepend($boton)
		}
		this.clearForm = function (clearrecords) {
			var $form = that.$divinsertform
			$form.find('.inputText').each ( function(){
				const $input = $(this)
				, skip = ( clearrecords == "fromCrear" && $input.hasClass('no-autoclear') )
				if ( ! skip ) {
					this.value='';
					parent.setTextareaHeight(this);
					$(this).css('background',$input.data ( 'oldbg' ))
				}
			})
			if ( clearrecords && clearrecords != "fromCrear" ) that.$divlistado.html('<div class="inlineform-vacio">Vacío</div>')
			$divinlineform.find('*').removeClass('validation-notvalid')
			DBH.valueLists().setColor()
		}
		this.setup = function () {
			that.$divlistado.find('textarea').each ( function (i,ele) {
				parent.setTextareaHeight(this)
			});
		}
		function addRecordsToListado(registros,slide){

			//if ( ! slide ) {
			var $iiss = that.$lineamodelo.find('select.inline-search')
			//console.log(registros)
			$iiss.each ( function () {
				var $ta = $(this)
				, id = $ta.attr('id')
				id = id.substring(id.indexOf('.')+1)
				//if ( ! DBH.mapas_sql.has( id ) ) {
				var ids = []
				$(registros).each ( function (i,registro) {
					ids.push ( $(this).find('[fieldname="'+id+'"]').text() )
				});
				//console.log(ids)
				if ( ids.length > 0 ) {
					var idfield = $ta.attr('select-id-field')
					, textfield = $ta.attr('select-text-field')
					, table = $ta.attr('select-table')
					, sqlQueryObj = { idfield : idfield , fields : `${idfield},${textfield}` , table : table }
					//console.log(ids)
					DBH.mapaSql ( id , sqlQueryObj ).clear().addIds ( ...ids )
				}
			});

			$(registros).each ( function (i,registro) {
				that.addCloneLine($(this),slide)
			});
		}
		function registrosListado(optionalId,filter){
			that.fkfieldvalue = that.$fkformfield.val()
			var formatFilter = parent.$formatFilter ( that.$divinsertform.find('.inputText').not('.no-filter').not('.hidden-flexfield') )
			if ( that.fkfieldvalue == '' && !optionalId ) return false
			var tienedocsfield = '0 as tienedocs'
			, tieneavisos = '0 as tieneavisos'
			if ( files ) tienedocsfield = "(SELECT TOP 1 COUNT(doc_id) FROM DBH_DOCUMENTOS WHERE doc_da_id = " + da_id + " AND doc_pkvalue = " + that.pktablefieldname + ") as tienedocs"
			/*
			SELECT PARA RECOGER LOS AVISOS QUE TIENE CADA REGISTRO (comentada un buen día por desuso.)

			var avisossql = "from dbh_avisos where " + customview + "." + that.pktablefieldname + " = avi_pkvalue and avi_da_id = " + da_id + " AND avi_accion= 1"
			var avisocampos = "(select min(avi_fecha) " + avisossql + ") as avisosfechamin,(select max(avi_fecha) " + avisossql + ") as avisosfechamax,(select count(avi_id) " + avisossql + ") as avisoscount"
			var sql = "SELECT " + that.camposlistado + "," + that.pktablefieldname + ", " + tienedocsfield + "," + avisocampos + " FROM " + customview + " LEFT JOIN DBH_avisos ON " + customview + "." + that.pktablefieldname + " = avi_pkvalue and avi_da_id = " + da_id
			*/

			var da_fkfield_areamadre = $divinlineform.attr('da_fkfield_areamadre')
			, sql = "SELECT " + that.camposlistado + "," + that.pktablefieldname + ", " + tienedocsfield + " FROM " + customview
			, formatFilterListadoWhere = filter ? formatFilter.listadoWhere : '1=1'
			if ( typeof optionalId != 'undefined' && !isNaN(optionalId) ) {
				sql += " WHERE " + that.pktablefieldname + " = " + optionalId
			} else {
				if ( typeof that.fkfieldvalue != 'undefined' && !isNaN(that.fkfieldvalue) ) {
					sql += " WHERE " + that.fktablefieldname.substring(that.fktablefieldname.indexOf('.')+1) + " = " + that.fkfieldvalue + " AND ( " + formatFilterListadoWhere + " ) "
				} else {
					sql += " WHERE ( " + formatFilterListadoWhere + " ) "
				}
			}
			if ( da_fkfield_areamadre ) sql += " AND " + da_fkfield_areamadre + " = " + DBH.area().id
			if ( orderBy && typeof orderBy != 'undefined' ) {
				if ( !isNaN ( orderBy ) ) {
					var ascdesc = ( orderBy < 0 || ! orderBy ) ? 'desc' : 'asc'
					sql += " ORDER BY " + Math.abs(orderBy) + ' ' + ascdesc
				} else {
					sql += " ORDER BY " + orderBy
				}
			} else {
				sql += " ORDER BY " + customview + "." + that.pktablefieldname + " desc"
			}
//			console.log(sql)
			var registros = parent.sqlExec(sql,0)
			return registros
		}
		this.addCloneLine = function ($registro,slide) {
//			console.log($registro);
			var $clone = that.$lineamodelo.clone(true,true).prependTo(that.$divlistado[0])
			, fieldname = that.pktablefieldname//.substring ( that.pktablefieldname.indexOf('.') + 1 )
			, id = $registro.find('[fieldname="'+fieldname+'"]').text()
			, tienedocs = $registro.find('[fieldname="tienedocs"]').text()

			$clone.data ( 'id' , id )
			$clone.data ( 'tienedocs' , tienedocs )
			$clone.on('keyup', '.inputText', function () {
				parent.setTextareaHeight(this);
			});
				//console.log("registro:"+$registro.html())
			programarSelectsVinculadas($clone)
			vars.filterSelectsHijas($clone,1)
			$clone.find('.inputText').each ( function (i,ele) {
				var cloneta = this
				, $cloneta = $(this)
				, ar = this.id.split(".")
				, fieldname = ar[ar.length-1]
				, valor = $registro.find('[fieldname="'+fieldname+'"]').text()
				, noinsert = that.$lineamodelo.find('[id="'+this.id+'"]').data('noinsert')
				$cloneta.data('noinsert',noinsert)
				DBH.field($cloneta);
				if( cloneta.tagName != 'DIV' ) {
					//$cloneta.find ( 'option').removeAttr('selected').filter('[value="'+valor+'"]').attr ( 'selected','1' )
					$cloneta.valor(valor)
					//if ( $cloneta.hasClass('inlinelist') )  cloneta.objeto.loadLista(1)
					//console.log( 'id:'+cloneta.id+' valor:'+valor)
				} else {
					cloneta.innerHTML = valor
				}
				if( cloneta.tagName == 'SELECT' && !$cloneta.hasClass('multistatebutton') ) {
					if (cloneta.selectedIndex > -1 ) cloneta.title = cloneta.options[cloneta.selectedIndex].text
				}
				$cloneta.data ( 'id' , id )
				$cloneta.data('oldValue',valor)
				$cloneta.data ( 'fieldname' , that.campos[i] )
				$cloneta.prop ( 'valor' , valor )
				//$cloneta.find ( 'option').removeClass('selected')
				$cloneta.addClass ( 'inputTextTransparent' )
				if ( $cloneta.hasClass( 'no-insert' ) ) $cloneta[0].disabled = 1
				$cloneta.trigger ( 'change' )
				$cloneta.on ( 'blur' , function (e) {
					//console.log(this)
					that.guardar(this);
				}).on ( 'focus', function (e) {
					$(this).closest('.lineamodelo').addClass('edited')
				});
				//that.campos[that.campos.length] = ele.id
			});
			//$clone.find('.inline-search').valor(valor)
			var $botones = $clone.find('.boton')
			, divdocumentslist = $clone.find('.divdocumentslist')[0]
			$botones.each ( function () {
				$(this).data ( 'id' , id )
			})
			$($botones[$botones.length-1]).data ( 'divdocumentslist' , divdocumentslist )
			if ( files ) {
				var $divfileswrapper = $('<div class="divCampoForm" style="width:100%;"><label>&nbsp;</label><div class="divdocumentslist" style="box-sizing:border-box;clear:both;background:;height:auto;width:100%;border:0px solid red;padding:0 0 1px 0"></div></div>')
				$clone.append ( $divfileswrapper )
//				console.log(tienedocs)
				that.docs.loadDocsListS ( id, $divfileswrapper.find('.divdocumentslist')[0] , tienedocs )
//				console.log('b')
				$clone.on ( 'click', '.botonfiles', function (e) { that.docs.uploadDocsS(id);e.preventDefault(); } )
			}
			if ( typeof callbackFnWhenAddClone != 'undefined' && that.$fkformfield.val() != '' ) callbackFnWhenAddClone(id,$clone)
			if ( typeof slide != 'undefined' && ! isNaN ( slide ) )
				$clone.slideDown('slow')
			else
				$clone.show()

			//that.$divlistado.find('.multistatebutton-button').remove()
			var $mb = $clone.find('.multistatebutton')
			if ( $mb ) new multistatebutton($mb[0])
/*
			var $c = $clone.find('.dbh_calendar')
			$c.appendDtpicker({
				'locale': 'es'
				,'firstDayOfWeek':1
				,"onSelect" : function(handler, targetDate){
					DBH.date().setcolor($c);
					$('.datepicker').hide()
					}
			});
*/
			return $clone
		}
		this.saveserie = function () {
			var checkedids = DBH.area().checkedids
			, fkformfieldval = that.$fkformfield.val()
			, fkfieldvalue = that.fkfieldvalue
			, noregs = checkedids == '' ? 0 : checkedids.length
			, sql = ''
			, sserie = this
			if ( !confirm('Si continua creará entradas en ' + blockButton + ' con los datos que ha introducido en los registros seleccionados en el listado (' + noregs + ').' ) ) return false
			if(!checkedids.length) return
			mostrarTelon(1)
			this.heavytask = function () {
				var res = that.crear(1)
				if ( !res ) {mostrarTelon(0);return false}
				var campos = res.campos
				, valores = res.valores
				/*
				that.$divinsertform.find('.inputText.no-insert.dbh-autoinsert-user').each ( function (i,ele) {
					var valor = sessionStorage["usu_id"]
					, id = this.id
					, id = id.substring(id.indexOf('.'))
					, id = that.tabla + id
					valores += "," + valor
					campos += "," + id
				});
				*/
				var sql = "set dateformat dmy INSERT INTO " + that.tabla + " (" + that.fktablefieldname + "," + campos + ") (SELECT " + $topcontainer.attr('pkname') + "," + valores + " FROM " + $topcontainer.attr('pktabla') + " WHERE " + $topcontainer.attr('pkname') + " IN (" + checkedids + "))"
				console.log(sql)
				parent.sqlExec ( sql, 0 )
				mostrarTelon(0)
				alerta ( 'Serie de registros actualizada',1 )
			}
			setTimeout(function(){sserie.heavytask()},100)
		}
		this.removeserie = function () {
			var condiciones = ''
				, campos = ''
				, checkedids = DBH.area().checkedids
				, noregs = checkedids == '' ? 0 : checkedids.length
				, fkformfieldval = that.$fkformfield.val()
				, fkfieldvalue = that.fkfieldvalue
				, sql = ''
				, rserie = this
			that.$divinsertform.find('.inputText').not('.no-insert').not('.hidden-flexfield').each ( function (i,ele) {
				var valor = this.value
				if ( valor != '' ) condiciones += " AND " + this.id + " like '" + valor + "'"
			});
			if ( condiciones == '' ) {
				alerta ('Debe introducir algún valor');return false}
			else {
				if ( !confirm('Si continua eliminará las entradas de ' + blockButton + ' de los registros seleccionados en el listado (' + noregs + ') que cumplan las siguientes condiciones:\n\n' + condiciones ) ) return false
			}
			if(!checkedids.length) return
			mostrarTelon(1)
			this.heavytask = function () {
				/*
				$(checkedids.split(',')).each ( function (id,val) {
					sql += " DELETE " + that.tabla + " WHERE " + that.fktablefieldname + " = " + val + condiciones
				})
				*/
				var sql = " DELETE " + that.tabla + " WHERE " + that.fktablefieldname + " IN (" + checkedids + ") " + condiciones
				console.log(sql)
				parent.sqlExecVal ( sql, 0 )
				mostrarTelon(0)
				alerta ( 'Serie de registros actualizada',1 )
			}
			setTimeout(function(){rserie.heavytask()},100)
		}
		this.crear = function (serie) {
			var DBHsql = DBH.ajax.sql
			, topformloaded = that.$fkformfield.val() != ''
			if ( topformloaded || typeof serie != 'undefined' ) {
				var validacionerror = validar(that.$divinsertform)
				if ( validacionerror ) {
					parent.parent.alerta ( 'Corrija los campos indicados' );
					return false;
				}
				if ( typeof callbackFnBeforeAddNew != 'undefined' ) callbackFnBeforeAddNew()
			}
			var valores = '',
				valArr = [],
				campos = '';
			that.$divinsertform.find('.inputText').not(DBH.readonly).not('.hidden-flexfield').each ( function (i,ele) {
				if(!DBH.readonly(this)){
				var valor = this.value
				, id = this.id
				, id = id.substring(id.indexOf('.'))
				, id = that.tabla + id
				valArr[valArr.length] = valor
				if ( valor == '' ) { valor = 'null' } else { valor = "'" + valor + "'" }
				valores += valor + ","
				//campos += this.id.substring(this.id.indexOf('.')+1) + ','
				campos += id + ','
				}
			});
			that.$divinsertform.find('.inputText.no-insert.dbh-autoinsert-user').each ( function (i,ele) {
				var valor = sessionStorage["usu_id"]
				, id = this.id
				, id = id.substring(id.indexOf('.'))
				, id = that.tabla + id
				valores += valor + ","
				campos += id + ','
			});
			var da_fkfield_areamadre = $divinlineform.attr('da_fkfield_areamadre')
			if ( da_fkfield_areamadre ) {
				campos += da_fkfield_areamadre + ","
				valores += DBH.area().id + ","
			}
			//console.log(campos)
			valores = valores.substr ( 0 , valores.length - 1 )
			campos = campos.substr ( 0 , campos.length - 1 )
			if ( typeof serie != 'undefined' ) return {campos:campos,valores:valores}
			if ( typeof that.fkfieldvalue != 'undefined' && !isNaN(that.fkfieldvalue) ) {
				var sql = "set dateformat dmy INSERT INTO " + that.tabla + " (" + that.fktablefieldname + "," + campos + ") VALUES (" + that.fkfieldvalue + "," + valores + " )"
			} else {
				var sql = "set dateformat dmy INSERT INTO " + that.tabla + " (" + campos + ") VALUES (" + valores + " )"
			}
			//if ( typeof serie != 'undefined' ) return sql
			if ( topformloaded ) {
				var r = DBHsql ( sql, 'custom' )
				if ( !r ) return false
			}
			//console.log(r)
			var sql = "SELECT max ( " + that.pktablefieldname + " ) from " + that.tabla
			//console.log(sql)
			var id = DBH.ajax.valor ( sql )
			//DBH.mapaSql ( id ).addIds ( id )
			//console.log(id)
			var sqlsentence = "insert into DBH_historico ( his_da_id, his_pkvalue, his_usu_id, his_fieldname, his_valor, dbh_perfiles_admitidos_xreg ) VALUES ( "+da_id+", "+id+", "+sessionStorage['usu_id']+", '[NUEVO REGISTRO]', '[NUEVO REGISTRO]', '"+sessionStorage['usu_perfiles_admitidos']+"' )"
			DBH.ajax.sql ( sqlsentence )

			var registros = registrosListado(id)
			if ( typeof serie == 'undefined' ) {
				that.$divlistado.find('.inlineform-vacio').remove()
				addRecordsToListado(registros,1)
			}
			if ( ! topformloaded ) {
				var $clmodelo = that.$divlistado.find('.lineamodelo:visible:first').find(':input:visible').not('button')
				var $ciform = that.$divinsertform.find(':input:visible').not('button')
				$ciform.each ( function (i) {
					$clmodelo.eq(i).val(this.value)
				})
				that.$divlistado.find('.botonfiles').removeClass('botonfiles').css('cursor','default').attr('disabled',true)
			}
			that.setup();
			if ( typeof serie == 'undefined' )that.clearForm('fromCrear')

			if ( typeof callbackFnWhenAddNew != 'undefined' ) callbackFnWhenAddNew()
			return true
		}
		this.guardar = function (ta) {
			if ( that.$fkformfield.val() == '' || DBH.readonly(ta) ) return false
			var $ta = $(ta)
			, DBHsql = DBH.ajax.sql
			,validacionerror = validar($ta.closest('.lineamodelo'),$ta)//
			, id = $ta.closest('.lineamodelo').find('[id="'+that.pktablefieldname+'"]').val()
			,sql = ''
			if ( validacionerror ) {
				parent.alerta ( 'Corrija los campos indicados' );
				return false;
			}
			//$ta.each ( function () {
				//var $ta = $(this)
				var fieldname = $ta.data ( 'fieldname' )
				, fieldname = that.tabla + '.' + fieldname.substring ( fieldname.indexOf('.')+1 )
				, valor = $ta.val()
				, oldValue = $ta.data('oldValue')
				, usu_id = sessionStorage['usu_id']
				if ( valor != '' ) {
					valor = "'" + valor + "'"
				} else {
					valor = "null"
				}
				sql += " UPDATE " + that.tabla + " SET " + fieldname + " = " + valor + " WHERE " + that.pktablefieldname + " = " + id
				//console.log(sql)
				//console.log($ta.attr ( 'id' ))
			//})
			/*
			sql = "set dateformat dmy " + sql
			console.log(sql)
			parent.sqlExecVal ( sql , 0 )
			*/
			//console.log(DBHsql)
			var res = DBHsql(sql, 'custom')
			if (!res) return false
			var sqlhistorico = "INSERT INTO DBH_historico (his_da_id,his_pkvalue,his_fieldname,his_valor,his_usu_id,dbh_perfiles_admitidos_xreg) VALUES ("+da_id+","+id+",'"+fieldname+"','"+oldValue+"',"+usu_id+",'"+sessionStorage['usu_perfiles_admitidos']+"') "
			console.log(sqlhistorico)
			DBH.ajax.sql(sqlhistorico)
			$ta.data('oldValue',$ta.val())
		}
		this.borrar = function (boton) {
			if ( that.$fkformfield.val() != '' ) {
				if ( ! confirm ( '¿Borrar esta entrada?' ) ) return false;
				var id = $(boton).closest('.lineamodelo').find('[id="'+that.pktablefieldname+'"]').val()
				var sql = "DELETE " + that.tabla + " WHERE " + that.pktablefieldname + " = " + id
				console.log(sql)
				parent.sqlExecVal ( sql, 0 )
			}
			$(boton).parents('.lineamodelo').slideUp('slow')
			if ( that.$divlistado.find('.lineamodelo:visible').length == 1  ) that.$divlistado.html('<div class="inlineform-vacio">Vacío</div>')
			//console.log(that.$divlistado.find('.lineamodelo:visible').length)
		}
		this.listar = function (filter){
			if ( ! that.operative ) return true
			if ( that.$fkformfield.val() == '' ) return false
			mostrarTelon(1)
			setTimeout ( function(){listar_fn(filter)}, 20 )
			//alert('a')

		}
		function listar_fn(filter) {
			var registros = registrosListado(undefined,filter)
			//console.log('fin')
			//return false
//	console.log(registros)
			that.$divlistado.html('')
			addRecordsToListado(registros)
			that.setup();
			that.cargado=1;
			if ( $(registros).length == 0 ) { that.$divlistado.html('<div class="inlineform-vacio">Vacío</div>')} else {that.$divlistado.find('.inlineform-vacio').remove()}
			if ( typeof callbackFnWhenEnd != 'undefined' ) callbackFnWhenEnd()
			$(multistatebuttons_elements).each(function(){this.setcss();})
			let $insertf = that.$divinsertform
			//	console.log($insertf.find('inline-group').length)
			, $inlineGroup = $insertf.find('.inline-group').eq(0)
			, $rows = that.$divlistado.find ('.lineamodelo')
			, inlineGroupMap = new Map()
			if ( $inlineGroup.length ) {
				let keyFieldId = $inlineGroup.attr('id')
				//, precedentKey = false
				$rows.each ( function () {
					let $row = $(this)
					, $keyField = $row.find ( `[id="${keyFieldId}"]` )
					, isSelect = $keyField[0].tagName == 'SELECT'
					, key = isSelect ? $keyField.find('option:selected').text() : $keyField.val()
					, $divCampo = $keyField.closest('.divCampoForm')
					, inlineGroupId = $keyField.find('option:selected').val()
					, $rowset = inlineGroupMap.get ( key )
					if ( ! $rowset ) {
						$rowset = $()
						//console.log('init rowset'+key)
					}
					$rowset = $rowset.add ( $row )
					//console.log( $rowset.length)
					inlineGroupMap.set ( key == '' ? '------' : key , $rowset )
					$divCampo.addClass('inline-group')
					/*
					if ( key != precedentKey ) {
						$row.addClass('inline-group-first').before($inlineGroupDiv.clone().text(key))
						precedentKey = key
					}
					*/
				})
				for ( let [ key , $rowset ] of inlineGroupMap.entries() ) {
					let $container = $('<div class="inline-group-container opened"></div>').attr ( 'keyFieldId' , keyFieldId ).attr ( 'key' , key )
					, $title = $('<div class="inline-group-title"></div>').text(key).click ( function () {$(this).closest('.inline-group-container').toggleClass('opened').find('.inline-group-toggle-div').slideToggle()} )
					, $toggleContainer = $('<div class="inline-group-toggle-div"/>')
					$container.append ( $title )
					$container.append ( $toggleContainer )
					$toggleContainer.append ( $rowset.detach() )
					that.$divlistado.append($container)
//					console.log(key+'**'+ $rowset.length)
				}
				that.$divlistado.addClass('grouped')//find('label[for]').hide()
			}
			mostrarTelon(0)
			$document.trigger('inlineform:'+da_id+':listed')
		}
	}
	//PRIVATE STATIC METHODS
	function validar ($divfila,$ta) {
		var error = 0
		, $fields = $ta ? $ta.closest('.divCampoForm') : $divfila
		$fields.find('.noblank').not('.no-insert').not('.hidden-flexfield').each ( function (i,ele) {
			var $campo = $(ele)
			, valor = $campo.val()
			console.log("valor:"+valor+isNaN($campo.val()))
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			if ( $campo.val() == '' || $campo.val() == null ) {
				invalidarCampo($campo)//.addClass('validation-notvalid')
				error = 1
			};
		});
		$fields.find('.data-type-date').not('.no-insert').each ( function (i,ele) {
			var $campo = $(ele)
			//console.log($campo.val())
			//console.log(parent.esFechaYHoraValida ( $campo.val() ) )
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			if ( $campo.val() != '' && !parent.esFechaYHoraValida ( $campo.val() ) ) {
				invalidarCampo($campo)
				error = 1
			};
		});
		$fields.find('.data-type-number').not('.no-insert').each ( function (i,ele) {
			var $campo = $(ele)
			$campo.css ( 'background' , $campo.data ( 'oldbg' ) )
			if ( $campo.val() != '' && isNaN ( $campo.val() ) ) {console.log($campo.val())
				invalidarCampo($campo)
				error = 1
			};
		});
		return error;
	}
	return cls;
} (window.jQuery) );
