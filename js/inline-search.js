function inlineSearch ($campo,sqlConfig) {

	var that = this
	if ( !sqlConfig.hasOwnProperty('idfield') ) sqlConfig.idfield = sqlConfig.field
	this.sqlConfig = sqlConfig

	//CONTAINERS
	this.$container = $('.inlinesearch-container')//.css(containerCss)
	this.$filamodelo = $('<option class="inlinesearch-fila"></option>')//.css(filaCss)
	this.$filamodelo = $('<tr/>')
	
	this.$container.on ( 'mouseover' , 'tr' , function () {
		let $trs = that.$container.find('tbody tr')
		, $tr = $(this)
		$trs.removeClass('hovered')
		$tr.addClass('hovered')
	})
//console.log('inlinesearch')
	this.show = function (){
		//if ( ! that.$container.is ( ':visible' ) )  $campo.val(sqlConfig.$field.find('option:selected').text())
		that.$container.show()
		that.position()
	}
	this.position = function (){
		if ( ! that.$container.is ( ':visible' ) ) return false
		var inputPosition = $campo.offset()
		, inputHeight = $campo.outerHeight()
		, inputWidth = $campo.outerWidth()
		, top = ( inputPosition.top * 1 + inputHeight + 0 ) 
		, lineheight = that.$container.find('thead tr').eq(0).height()
		, topbody = top + lineheight
		, left = inputPosition.left
		, $field = sqlConfig.$field
		that.$container.css({left: left,top: topbody, 'min-width' : inputWidth })
		that.$container.find('thead').css({'margin-top': -1 * lineheight})
		
	}
	this.hide = function (){
		that.$container.hide()
	}
	this.keypressed = function (event) {
		if ( event.keyCode == 38 || event.keyCode == 40 ) {
			let $trs = that.$container.find('tbody tr')
			, $hoveredTr = $trs.filter('.hovered')
			, domindex = $trs.index($hoveredTr)
			//domindex = domindex == -1 ? 0 : domindex
			domindex = ( domindex * 1 + ( event.keyCode - 39 ) )
			if ( domindex < 0 ) domindex = 0
			if ( domindex > ( $trs.length - 1 ) ) domindex = $trs.length - 1 
			let $tr = $trs.eq(domindex)
			$trs.removeClass('hovered')
			$tr.addClass('hovered')
			let scrollTop = that.$container.scrollTop()
			, trHeight = $tr.outerHeight()
			, trTop = $tr.position().top + trHeight
			, maxHeight = that.$container.outerHeight()
			, topPosBottom = trTop - maxHeight
			, topPosTop = trTop - trHeight
			if ( trTop > maxHeight ) that.$container.scrollTop(scrollTop+topPosBottom)
			if ( trTop < trHeight ) that.$container.scrollTop(scrollTop+topPosTop)
				//console.log(maxHeight+'**'+trTop+'**'+scrollTop)
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
			return false;
		}
		if(event && $campo.hasClass('inlinesearch-tempfield')){
			if(event.keyCode == 13){
				var inputVal = $campo.val()
				if (inputVal==""){
					$campo.attr('idvalue','').val('');
					//setTextareaHeight($campo[0]);
					$campo.trigger('inlinelist:user:select');
				}
				//console.log('enter')
				//event.stopImmediatePropagation()
				that.$container.find('.hovered').trigger('mousedown')
				that.hide();
				$campo.blur();
				event.preventDefault();
				event.stopImmediatePropagation();
				event.stopPropagation();
				console.log('enter')
				return false;
			}
			if(event.keyCode == 27){
				that.hide();
				$campo.trigger('blur');
				return true;
			}
		}
		if ( typeof that.timer != "undefined" ) {clearTimeout (that.timer)}
		//console.log(event == "0")
		if ( event == "0" ) {
			that.timer = setTimeout (function (){that.search(1)},200)
		} else {
			that.timer = setTimeout (function (){that.search()},200)
		}
		
	}
	this.search = function (focus) {
		if ( ! $campo.is(':visible') ) return false
		var sqlConfig = that.sqlConfig
		, inputVal = $campo.val()
		, $field = sqlConfig.$field
		, selectInlineSearch = $field.attr('data-sql-inline-search')
		, $table = $('<table class="inline-search-table"><thead><tr/></thead><tbody/></table>')
		, $header = $table.find('tr')
		, $body = $table.find('tbody')
		, availableIds = $field.attr('data-available-ids')
		, whereAvailableIds = ''
		//debugger;
		if ( availableIds || availableIds == "" ) {
			whereAvailableIds = " AND " + sqlConfig.idfield + " IN (" + availableIds + ") "
		}
		//if (inputVal.length<1 && !focus) {that.hide();return false}
		that.$container.find('table').remove()
		that.$container.append($table)
		console.log(selectInlineSearch)
		if ( selectInlineSearch ) {
			selectInlineSearch = selectInlineSearch.replace(/\[enteredtext\]/gi,inputVal)
			selectInlineSearch = selectInlineSearch.substring ( selectInlineSearch.toLowerCase().indexOf ( 'select' ) + 6 )
			var sql = `SELECT top 30 ${sqlConfig.idfield} as dbh_temp_idvalue, ${sqlConfig.field} as dbh_temp_valor, ${selectInlineSearch}`.toLowerCase().trim()
			, splitOrderBy = sql.split ( ' order by ' )
			, sql = splitOrderBy[0] + whereAvailableIds + " order by " + splitOrderBy[1]
			console.log(sql)
		} else {
			//return false
			var sql = "SELECT top 30 " + sqlConfig.idfield + " as dbh_temp_idvalue," + sqlConfig.field + " as dbh_temp_valor FROM " + sqlConfig.table + " WHERE " + sqlConfig.field + " LIKE '%" + inputVal + "%'" + whereAvailableIds + " ORDER BY " + sqlConfig.field
			console.log(sql)
			$table.find('thead').remove()
		}
		let resultados = DBH.ajax.select (sql)
		

		$(resultados).each(function(i){
			let rowObj = this
			, $fila = that.$filamodelo.clone().attr('idvalue',rowObj.dbh_temp_idvalue).attr('valor',rowObj.dbh_temp_valor)
			, count = 0
			, ignoreBefore = selectInlineSearch ? 1 : 0
			Object.keys(rowObj).forEach(function (key) {
				if ( count > ignoreBefore ) {
					let value = rowObj[key]
					, name = key
					, $celda = $('<td/>').text(value)
					$fila.append($celda)
					if ( i == 0 ) {
						$header.append ( `<td>${name}</td>` )
					}
				}
				count++;
			});
			$body.append($fila)
		})
		$body.on ('mousedown','tr',function(event){
			//console.log($(this).attr('idvalue'))
			//console.log($(this).attr('valor'))

				event.preventDefault();
				//event.stopImmediatePropagation();
				event.stopPropagation();
				//console.log('nnewww')
				//return false;

			$campo.attr('idvalue',$(this).attr('idvalue')).val($(this).attr('valor'));
			setTextareaHeight($campo[0]);
			that.hide();
			$campo.trigger('inlinelist:user:select');
		})
		function setHeaderWidth() {
		let $bodycells = $body.find('tr:first-child td')
		, $headercells = $header.find('td')
		for ( let i = 0 ; i < $headercells.length; i++ ) {
			//console.log($bodycells.length)
			let $bodycell = $bodycells.eq(i)
			, $headercell = $headercells.eq(i)
			, bodycellwidth = $bodycell.width()
			$headercell.width ( bodycellwidth )
			//console.log(bodycellwidth)
			//$headercell.width ( 100 )
		}
		}
		//if(!$('.inlinesearch-container:visible').length) that.show()
			setTimeout(setHeaderWidth,0)
		that.show()
		//console.log($select.html())
	}

	//EVENT LISTENER
	$campo.on ( 'keydown' , function(event){that.keypressed(event)} )
	$campo.on ( 'focus' , function(){that.keypressed(0)} )
	$campo.on ( 'blur' , function(){that.hide()} )
	sqlConfig.$field.on ( 'setValue' , function(valor){
	} )
	$(document).on ( 'scrolled' , that.position )
	//$campo.on ( 'blur' , function(){that.hide()} )
}
$.fn.extend({
	valor: function (val) {
		let $jquerySet = this
		$jquerySet.each ( function () {
			let $cloneta = $(this)
			, isInlineSearch = $cloneta.hasClass ( 'inline-search' )
			if ( isInlineSearch ) {
				var id = $cloneta.attr('id')
				, id = id.substring(id.indexOf('.')+1)
				, isInlineForm = $cloneta.closest('.lineamodelo').length
				if ( isInlineForm ) {
					var txt = DBH.mapaSql(id).mapa.get( val )
				} else {
					var idfield = $cloneta.attr('select-id-field')
					, textfield = $cloneta.attr('select-text-field')
					, table = $cloneta.attr('select-table')
					//, sqlll = "SELECT " + textfield + " FROM " + table + " WHERE " + idfield + " = " + val
					//, txtopt = val ? DBH.ajax.valor ( sqlll ) : ''
					//, txt = txtopt
					, sqlQueryObj = { idFieldName : idfield , fieldNames : `${idfield},${textfield}` , table : table }
					//console.log(sqlQueryObj)
					//console.log(id+sqlQueryObj)
					DBH.mapaSql ( id , sqlQueryObj ).addIds ( val )
					txt = DBH.mapaSql(id).mapa.get(val)
				}
				let opt = '<option value="'+val+'" selected>'+(txt?txt:'')+'</option>'
				//console.log(opt)
				$cloneta.find('option').remove()
				$cloneta.append('<option/>').append(opt)
			} else {
				$cloneta.val(val)
			}
		})
	}
})
