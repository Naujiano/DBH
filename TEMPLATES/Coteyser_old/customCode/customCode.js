(function () {
	customjs = {}
	customjs.callbacks = {}
	customjs.callbacks.clientes_save = function () {
		var $tipo = $('[id="personas.tipo"]')
		, si = $tipo[0].selectedIndex
		, tipo = $tipo.find('option').eq(si).val()
		, codpersona = $('[id="codpersona"]').val()
		//.log(tipo)
		if ( tipo != "8802" ) {
			if ( confirm ( "El TIPO seleccionado no es 'Vigor'.\n\nSi continua se asignara TIPO DE FICHA = 'Baja' para todas las polizas de este cliente." ) ) {
				var sql = "UPDATE personas_riesgos SET pr_tipo = 8807 WHERE pr_codpersona = " + codpersona
				DBH.ajax.sql(sql)
			}
		}
	}
	customjs.callbacks.dbh_comunicaciones_load = function () {
		return
		var $lists = $('[id="dbh_comunicaciones_busquedas.cb_i_id"]')
		, grupo_id = $('[id="dbh_comunicaciones.com_grupo_id"]').val()
		, subgrupo_id = $('[id="dbh_comunicaciones.com_subgrupo_id"]').val()
		, com_id = $('input[type="hidden"][id="com_id"]').val()
		, sql = "SELECT i_id,i_nombre FROM DBH_BUSQUEDAS WHERE i_id in (select cb_i_id from dbh_comunicaciones_busquedas WHERE cb_com_id = " + com_id + ") OR ("
		, where = "i_escomunicacion = 1"
		, orderby = "i_nombre"
		if ( grupo_id != '' && ! isNaN ( grupo_id ) ) where += " AND i_informe_grupo_id = " + grupo_id
		if ( subgrupo_id != '' && ! isNaN ( subgrupo_id ) ) where += " AND i_informe_subgrupo_id = " + subgrupo_id
		sql += where + ") ORDER BY " + orderby
		console.log( sql )
		vars.filterSelectLists( $lists,sql );
	}
	customjs.printhtml = function (fieldid,button) {
		if ( typeof button != 'undefined' ) {
			var html = $(button).closest('.lineamodelo').find('[id="' + fieldid + '"]').val()
		} else {
			var html = $('[id="' + fieldid + '"]').val()
		}
		DBH.html.print(html)
	}
	customjs.importarVisual = function () {
		if ( ! confirm ( 'Importar datos desde Visual Seg?' ) ) return false
		var recs = DBH.ajax.select ( "select count(id) as no from visualseg_objetos_huerfanos" )
		if(recs[0].no!="0"){alerta('No se puede importar!<br><br>Hay objetos hu�rfanos en Visualseg.',1);return false}
		var sql = "exec dbo.sp_VSImport_clientes_polizas_riesgos"
	     , res = DBH.ajax.sql(sql)
		//console.log('*'+res+'*')
		if ( !res ) {
			alerta('Se ha producido un error en la importacion')
		}else{
			alerta('Datos de Visual Seg importados correctamente',1)
		}
	}
	customjs.updateOfertas = function () {
		var ids = DBH.area().recsid
		if ( ! ids.length ) { alert('Seleccione registros' ); return false }
		if ( ! confirm ( 'Reducir un 5% las ofertas caducadas?' ) ) return false
		var sql = "exec dbo.sp_update_ofertas '" + ids + "'"
	     , res = DBH.ajax.sql(sql)
		console.log(sql)
		if ( !res ) {
			alerta('Error en la actualización de ofertas.')
		}else{
			alerta('Ofertas actualizadas correctamente.',1)
		}
		console.log(ids)
	}
	//customjs.importar
}());
