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
			var i_stringifyparams = $('#i_stringifyparams').val()
			, pars = JSON.parse(i_stringifyparams)
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
	} () )
	this.printfactura = function (codfactura) {
	console.log('a')
		window.open ( 'customcode/factura.asp?codfactura='+codfactura )
	}
	return this
} () );
</script>
$(customjs.printfactura)
asdf