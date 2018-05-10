var customjs = ( function () {
	var pub=[]
	pub.dbBackup = function () {
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
	pub.printfactura = function (codfactura) {
		//window.open ( 'customcode/factura.asp?codfactura='+codfactura )
		var sql = "SELECT usu_factura_urllogo,usu_factura_html,usu_factura_datosfiscales,usu_factura_modalidaddepago FROM dbh_usuarios WHERE usu_id = " + localStorage["interface_usu_id"]
		, obj = {}
		, records = DBH_select ( sql )
		, record = records[0]
		, usu_factura_html = record.usu_factura_html
		, usu_factura_datosfiscales = record.usu_factura_datosfiscales
		, usu_factura_modalidaddepago = record.usu_factura_modalidaddepago
		, usu_factura_urllogo = record.usu_factura_urllogo
		, sql = "SELECT codcliente,fecha,iva,irpf,importetotal,baseimponible,nombre,domicilio,cp,localidad,provincia,pais,cif,codfactura,nofactura,ivaeuros,irpfeuros FROM viewfacturas where codfactura = " + codfactura
		, records = DBH_select ( sql )
		, record = records[0]
		for (var fieldname in record) {
			if (record.hasOwnProperty(fieldname)) {
				var regexp = new RegExp ("{" + fieldname + "}","gi")
				, value = eval("record." + fieldname )
				usu_factura_html = usu_factura_html.replace(regexp,value )
			}
		}
		var regexp = new RegExp ("{usu_factura_datosfiscales}","gi")
		usu_factura_html = usu_factura_html.replace(regexp,usu_factura_datosfiscales )
		var regexp = new RegExp ("{usu_factura_modalidaddepago}","gi")
		usu_factura_html = usu_factura_html.replace(regexp,usu_factura_modalidaddepago )
		var regexp = new RegExp ("{usu_factura_urllogo}","gi")
		usu_factura_html = usu_factura_html.replace(regexp,usu_factura_urllogo )
		var sql = "SELECT codPresupuesto, DesPresupuesto, importe, fecha FROM viewFacturasPresupuestos WHERE codFactura = " + codfactura + " ORDER BY codPresupuesto"
		, records = DBH_select ( sql )
		, $presupuestos = $('<div/>')
		$(records).each(function(){
			var rec = this
			, $html = $('<TR><TD style="width:485px">(' + rec.codpresupuesto + ')&nbsp;' + rec.fecha + '. ' + rec.despresupuesto + '</TD><TD class="importe" style="">' + rec.importe + '</TD></TR>')
			$presupuestos.append ($html)
		})
		var regexp = new RegExp ("{presupuestos}","gi")
		usu_factura_html = usu_factura_html.replace(regexp,$presupuestos.html() )
		var win = window.open ()
		, $doc = $(win.document.body)
		, $html = $(usu_factura_html)
		$doc.append( $html )
	}
	pub.init = function () {
		function helptimer () {
			if ( typeof DBH_help != 'undefined' ) {
				clearInterval(helptimerpointer )
				DBH_help.abrir()
				showtip('rnd')
			}
		}
		$(document).on('area:on:navigate',function(){pub.hidebuttons()})
		if ( $('.grupodf #usuario').val() == '' ) {
			$('div.grupodf #usuario').val('Demo')
			$('div.grupodf #contrasena').val('Demo')
		}
		if($('.grupodf #usuario').val()=='Demo')helptimerpointer = setInterval ( function(){helptimer ()},500)
		DBH.callbacks.area.clear = pub.area.events.clear
		var usu_perfiles_admitidos = DBH.data('usu_perfiles_admitidos')
		$('button[title="Crear filtro a partir de este listado"]').hide()
		$('div.grupodf').css({'margin-top':'40px'}).append('<br><br><span style="color:gray">Esta aplicación es totalmente gratuita.</span><br><br><a target="_blank" href="http://dbhunter.naujcloud.com/#contact">> Solicitar un usuario</a>')
	}
	pub.hidebuttons = function () {
		var $area = $('.formCuerpo:visible')
		, da_id = $area.attr('da_id')
		, $container = $('.botones_principales:visible')
		, $formCuerpo = DBH.area().container
		, usu_perfiles_admitidos = DBH.data('usu_perfiles_admitidos')
		if ( usu_perfiles_admitidos != '' ) {
			$('[id*="dbh_perfiles_admitidos_xreg"]').parent().hide()
			if($formCuerpo.attr('da_id')=="7") {
				var $campos = $formCuerpo.find('.general-container .inputText').not('[id="naujusuarios.usu_contrasena"]').not('[id="naujusuarios.usu_usuario"]')
				$campos.addClass('no-insert')
			}
		}
	}
	pub.area = {}
	pub.area.events = {}
	pub.area.events.clear = function () {
		var usu_id = DBH.data('usu_id')//$('#idusuario').val()
		, perfil = 'user' + usu_id
		, $field = DBH.area().container.find('[id*="dbh_perfiles_admitidos_xreg"]')
		, usu_perfiles_admitidos = DBH.data('usu_perfiles_admitidos')
		if ( usu_perfiles_admitidos != '' ) {
			$field.val(perfil)
		}
	}
	return pub
} () );
$(customjs.init)
