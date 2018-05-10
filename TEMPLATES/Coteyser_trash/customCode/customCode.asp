<script>
var customjs = ( function () {
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
		pub.sqlfromparams = function () {
			var i_stringifyparams = $('[id="informes.i_stringifyparams"]').val()
			console.log(i_stringifyparams)
			, pars = JSON.parse(i_stringifyparams)
			console.log(pars)
			, tabla = pars.tabla
			, etiquetasListado = pars.etiquetasListado
			, listadoWhere = pars.listadoWhere
			, listadoWhereText = pars.listadoWhereText
			, listadoOrderByIndex = pars.listadoOrderByIndex
			, listadoOrderByIndexDesc = pars.listadoOrderByIndexDesc ? pars.listadoOrderByIndexDesc : ""
			, i_pkfield = $('#i_pkfield').val()
			, campos = []
			$(etiquetasListado).each ( function (i) {
				var campo = etiquetasListado[i][0] + " AS [" + etiquetasListado[i][1] + "]"
				campos.push ( campo )
			} )
			/*
			var sql = "SELECT it_table FROM informes_tablas_pk WHERE it_pkfield = '" + i_pkfield + "'"
			, it_table = sqlExecVal ( sql )
			, orderby = etiquetasListado[listadoOrderByIndex][0] + " " + listadoOrderByIndexDesc
			*/
			var sql = "SELECT " + i_pkfield + "," + campos + " FROM " + tabla + " WHERE " + listadoWhere
			$('#i_sql').val(sql)
			setTextareaHeight($('#i_sql')[0])
			$('#i_sql').val(sql)
		}
		pub.sendAvisos = function () {
			window.open('informes_avisos_sendemail.asp?i_id=' + $('#i_id').val() )
		}
		pub.resetAvisos = function () {
			if ( ! confirm ( 'Desea borrar el registros de envíos para todos los avisos de este informe y resetearlo?') ) return false
			var i_id = $('#i_id').val()
			parent.sqlExec ( "dbo.sp_resetAvisos 'ia_i_id'," + i_id )
			if(informesForm.botonavisos.isOpen)avisosinlineform.listar()
		}
		pub.excel = function () {
			window.open('informes_SQL_excelmaker.asp?sql='+$('#i_sql').val().replace(/%/gi,'%25')+'&titulo='+$('#i_nombre').val())
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
	} () )
	return this
} () );
</script>