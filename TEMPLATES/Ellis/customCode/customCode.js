var customjs = ( function () {
	this.callbacks = {}
	this.callbacks.clientes_save = function () {
		var $tipo = $('[id="personas.tipo"]')
		, si = $tipo[0].selectedIndex
		, tipo = $tipo.find('option').eq(si).val()
		, codpersona = $('[id="codpersona"]').val()
		console.log(tipo)
		if ( tipo != "8802" ) {
			if ( confirm ( "El TIPO seleccionado no es 'Vigor'.\n\nSi continua se asignara TIPO DE FICHA = 'Baja' para todas las polizas de este cliente." ) ) {
				var sql = "UPDATE personas_riesgos SET pr_tipo = 8807 WHERE pr_codpersona = " + codpersona
				DBH.ajax.sql(sql)
			}
		}
	}
	this.filtros = ( function () {
		var pub = {},
			loc = {},
			that = this;
		pub.testSQL = function () {
			var sql = $('#i_sql').val()
			, $div_testSQL = $('#div_testSQL')
			if ( $div_testSQL.html() != '' ) { $div_testSQL.html(''); return }
			if ( sql == '' ) return
			
			var testsqlrecordslimit = 30 //$('#testsqlrecordslimit').val()
			sql = "SELECT TOP " + testsqlrecordslimit + sql.substr(6,sql.length)
			//sql = sql.replace()
			//console.log(sql)
			var registros = parent.sqlExec ( sql,0 )
			, $registros = $(registros)
			, $line = $('<div class="testsql-line"/>')
			, $col = $('<div class="testsql-col"/>')
			//console.log(registros)
			$registros.first().children().each ( function () {
				var tagname = $(this).prop('tagName')
				$div_testSQL.append($col.clone().append($line.clone().addClass('testsql-headercell').html(tagname)))
				
			})
			var $cols = $div_testSQL.find ( '.testsql-col' )
			, maxcolwidth = 100 / $registros.first().children().length
			$cols.css ( 'max-width', maxcolwidth + '%' ) 
			$registros.each ( function () {
				var $campos = $(this).children()
				$campos.each ( function (i) {
					var txt = $(this).text() + '&nbsp;'
					, $lineactual = $line.clone().html(txt)
					, $colactual = $cols.eq(i)
					$colactual.append($lineactual)
				})
			})
		}
		pub.sqlfromparams = function (stringifyparams) {
			var i_stringifyparams = stringifyparams ? stringifyparams : $('[id="informes.i_stringifyparams"]').val()
			, pars = JSON.parse(i_stringifyparams)
			, tabla = pars.tabla
			, etiquetasListado = pars.etiquetasListado
			, listadoWhere = pars.listadoWhere
			, listadoWhereText = pars.listadoWhereText
			, listadoOrderByIndex = pars.listadoOrderByIndex
			, listadoOrderByIndexDesc = pars.listadoOrderByIndexDesc ? pars.listadoOrderByIndexDesc : ""
			, i_pkfield = $('.formCuerpo[da_id="'+$('[id="informes.i_da_id"]').val()+'"]').attr('pkname')
			, campos = []
			$(etiquetasListado).each ( function (i) {
				var campo = etiquetasListado[i][0] + " AS [" + etiquetasListado[i][1] + "]"
				campos.push ( campo )
			} )
			var sql = "SELECT " + campos + " FROM " + tabla + " WHERE " + listadoWhere
			if(!stringifyparams){
				var $i_sql = $('[id="informes.i_sql"]')
				$i_sql.val(sql)
				setTextareaHeight($i_sql[0])
				$i_sql.val(sql)
			} else {
				return sql
			}
		}
		pub.sendAvisos = function () {
			//window.open('customcode/informes_avisos_sendemail.asp?i_id=' + $('#i_id').val() )
			window.open('http://localhost:81/avisos/' )
		}
		pub.resetAvisos = function () {
			if ( ! confirm ( 'Desea borrar el registros de envíos para todos los avisos de este informe y resetearlo?') ) return false
			var i_id = $('#i_id').val()
			parent.sqlExec ( "dbo.sp_resetAvisos 'ia_i_id'," + i_id )
			if(informesForm.botonavisos.isOpen)avisosinlineform.listar()
		}
		pub.download_eml = function () {
			//console.log($('.iseml').length)
			var $email_mime = $('.formCuerpo:visible .iseml')
			, $clone = $email_mime.clone()
			, $form = $('<form action="customcode/avisos/avisos_view_email.asp" target="_blank" method="post"></form>')
			$form.append($clone.attr('name','email_mime'))
			console.log($email_mime.val())
			//$form.find('input').val(email_mime)
			$form[0].submit()
			//window.open('customcode/avisos/avisos_view_email.asp?email_mime='+email_mime)
		}
		pub.excel = function () {
			pub.sqlfromparams()
			var sql = $('[id="informes.i_sql"]').val().replace(/\'/g,"''")
			, areaname = trim($('[id="informes.i_nombre"]').val())
			, filterconditions = $('[id="informes.i_descripcion"]').val()
			, e = vars.createViewForExcel(sql,areaname,filterconditions)
			, view = e.view
			, tit = e.title.replace(new RegExp('&#60;','g'),'<')
			, filename = e.filename;
			console.log(e)
			window.open ( 'excelMaker.asp?titulo=' + filename + '&tituloexcel=' + tit + '&vista=' + view )
		}
		return pub;
	} () );
	this.riesgos = ( function () {
		var pub = {},
			loc = {},
			alerta = parent.alerta,
			that = this;
		pub.updateVencimientoRecibo = function (field) {
			var $container = $(field).closest ( '.lineamodelo' )
			if ( ! $container.length ) $container = $( '#divinsertformrecibos' )
			var efecto = $container.find('#r_fechaefecto').val()
			var vencimiento = $container.find('#r_fechavencimiento').val()
			var fp = $('#pr_idformapago').val()
			/*
			console.log ( efecto )
			console.log(fp )
			console.log(vencimiento)
			*/
			if ( efecto != '' && fp != '' ) {
				if ( vencimiento != '' && typeof vencimiento != 'undefined' ) {
					if ( ! confirm ( 'Actualizar la fecha de vencimiento del recibo de acuerdo a la fecha de efecto y la forma de pago?' ) ) return false
				}
				var efectoArr = efecto.split ( '/' )
				var vencimiento = new Date(efectoArr[2],efectoArr[1]*1-1,efectoArr[0]);
			//	console.log(vencimiento )
				vencimiento.setMonth(vencimiento.getMonth()+12/fp);
			//	console.log(vencimiento )
				vencimiento = vencimiento.getDate() + "/" + ( vencimiento.getMonth() * 1 + 1 )  + "/" + vencimiento.getFullYear()
				$container.find('#r_fechavencimiento').val(vencimiento)
				$container.find('#r_fechavencimiento')[0].focus()
			//	console.log(vencimiento )
				
			}
		}
		pub.clickOnCarta = function ( boton ) {
			var $boton = $(boton)
				,pr_fechavencimiento = $(document).data('pr_fechavencimiento')
			if (pr_fechavencimiento == '' ) return false
			var $pr_cartadeanulacion = $('#pr_cartadeanulacion')
				,msinday = 24 * 60 * 60 * 1000
				,fvArr = pr_fechavencimiento.split ( "/")
				,fechavencimiento = new Date ( fvArr[2], fvArr[1]-1, fvArr[0] )
				,f2 = new Date ( fechavencimiento.getTime() - msinday * 370 )
				,fechadeayer = f2.getDate() + '/' + ( f2.getMonth() * 1 + 1 ) + '/' + f2.getFullYear()
			//console.log ( f3)
			if ( $pr_cartadeanulacion.val () == '' && pr_fechavencimiento != '' ){
				$pr_cartadeanulacion.val(pr_fechavencimiento)
			}else if ( !$boton.hasClass ( 'middlestate' ) ) {
				$pr_cartadeanulacion.val(fechadeayer)
				//$pr_cartadeanulacion.addClass ( 'middlestate' )
			} else {
				$pr_cartadeanulacion.val('')
			}
			riesgosForm.setCssBotonCarta(boton)
			//riesgosinlineform.guardar($pr_cartadeanulacion[0])
	//		parent.parent.vars.setAlertasRecordatorios()
		}
		pub.setCssBotonCarta = function(boton){
			var $boton = $(boton)
				,$boton2 = $('#botonestadoriesgo')
				,pr_fechavencimiento = $(document).data('pr_fechavencimiento')
				,val = $('#pr_cartadeanulacion').val()
				,val2 = $(document).data('riesgos_ok')
			$boton.removeClass ( 'middlestate' )
			if ( val.length > 7 && pr_fechavencimiento != '' ){
				$boton.addClass ( 'botondowned botonswitchdowned' )
				var valArr = val.substr(0,10).split ( '/' )
					,msinday = 24 * 60 * 60 * 1000
					,fcarta = new Date ( valArr[2], valArr[1]-1, valArr[0] )
					,fvArr = pr_fechavencimiento.substr(0,10).split ( "/")
					,fvencimiento = new Date ( fvArr[2], fvArr[1]-1, fvArr[0] )
					,msdif = fvencimiento.getTime()-fcarta.getTime()
					,diasdif = msdif / msinday;
				if ( Math.abs(diasdif) > 2 ) $boton.addClass ( 'middlestate' )
			}else{
				$boton.removeClass ( 'botondowned botonswitchdowned' )
				//$boton.addClass ( 'botondownedtransparent' )
				//$boton.css ( 'opacity' , 0.5 )
				//$boton.find('div').css ( 'background' , 'gray' )
			}
			if ( val2 != "!" ) {
				$boton2.addClass ( 'botondowned botonswitchdowned' )
			}else{
			//console.log(val2)
				$boton2.removeClass ( 'botondowned botonswitchdowned' )
				$boton2.addClass ( 'botondowned botonswitchdownedred' )
			}
			
	
		}
		pub.cargarListaTiposSubcontratista = function (l) {
			var $select = $('#filter_tipodesubcontratista')
			, usu_id = l.value
			, sql = "SELECT uts_id,uts_nombre from usuarios_tipossubcontratistas where uts_idusuario = " + usu_id
			$select.html('')
			parent.loadLista ( $select[0] , sql, 'uts_id', 'uts_nombre' )
		}
		pub.goCliente = function () {
			switchiframes(0,'codpersona='+$('#pr_codpersona').val(),'Cliente = <b>[' + $('#pr_codpersona').text() + ']</b>')
		}
		pub.cloneRiesgo = function () {
			var pr_id = $('#pr_id').val()
			, sql = "declare @a int exec @a = dbo.clonarRiesgo " + pr_id + " select top 1 @a as a from personas_riesgos;"
			, max_pr_id = parent.sqlExecVal ( sql )
			, lw = "pr_id = " + max_pr_id
			, lwt = "No = <b>[" + max_pr_id + "]</b>" 
			parent.uidialog.botones(
			[
				{
					text: "Dar de baja",
					icons: {
						primary: "ui-icon-folder-open"
					},
					click: function() {
						parent.uidialog.close();
						var sql = "UPDATE personas_riesgos SET pr_estado = 1 WHERE pr_id = " + pr_id
						parent.sqlExecVal ( sql )
						parent.golengueta('riesgos',lw,lwt)
					}
				},
				{
					text: "No dar de baja",
					icons: {
						primary: "ui-icon-folder-collapsed"
					},
					click: function() {
						parent.uidialog.close();
						parent.golengueta('riesgos',lw,lwt)
					}
				},
				{
					text: "Cancelar",
					icons: {
						primary: "ui-icon-close"
					},
					click: function() {
						parent.uidialog.close();
					}
				}
			])
			parent.uidialog.open ( 'Se dispone a hacer una copia de riesgo seleccionado.\n\nDesea darlo de baja antes de clonar?','Clonar el riesgo actual?' )
		}
		return pub;
	} () );
	this.printhtml = function (fieldid,button) {
		if ( typeof button != 'undefined' ) {
			var html = $(button).closest('.lineamodelo').find('[id="' + fieldid + '"]').val()
		} else {
			var html = $('[id="' + fieldid + '"]').val()
		}
		DBH.html.print(html)
	}
	this.sendemail = function (emailFieldId) {
		var email = DBH.area().topform.$container.find('[id="'+emailFieldId+'"]').val()
		//window.location.href = "mailto:" + email
		$(window).unbind('beforeunload')
		$('<a href="mailto:' + email + '">')[0].click()
		$(window).bind('beforeunload',function(){return true})		
	}
	this.importarVisual = function () {
		if ( ! confirm ( '¿Importar datos desde Visual Seg?' ) ) return false
		var recs = DBH.ajax.select ( "select count(id) as no from visualseg_objetos_huerfanos" )
		if(recs[0].no!="0"){alerta('No se puede importar!<br><br>Hay objetos huérfanos en Visualseg.',1);return false}
		var sql = "exec dbo.sp_VSImport_clientes_polizas_riesgos"
	     , res = DBH.ajax.sql(sql)
		//console.log('*'+res+'*')
		if ( !res ) {
			alerta('Se ha producido un error en la importacion')
		}else{
			alerta('Datos de Visual Seg importados correctamente',1)
		}
	}
	this.dbBackup = function () {
		if ( ! confirm ( '¿Hacer un Backup de la BD?' ) ) return false
		var sql = "exec dbo.sp_backupDatabase"
		, res = DBH.ajax.sql(sql)
		//console.log('*'+res+'*')
		if ( !res ) {
			alerta('Se ha producido un error al realizar el Backup')
		}else{
			alerta('Backup realizado correctamente',1)
		}
	}
	return this
} () ); 
