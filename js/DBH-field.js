/************
Dependent on: jQuery, bootstrap-tagsinput, typeahead (bundle with Bloodhound)
**********/

{	

	var taginput_original = $.fn.tagsinput
	console.log(taginput_original)
	$.fn.tagsinput = function ( ...argumentos ) {
		if ( argumentos[0] == 'reload' ) {
			let valArray = this.val().split(',')
			console.log(valArray)
			this.tagsinput('removeAll')
			valArray.forEach ( v => {
				this.tagsinput('add', v)
			})
		} else {
			return taginput_original.apply(this, argumentos);
			//return this.taginput_original ( option )
		}
	}
	
	$.fn.extend({
		valor: function (val) {
			console.assert ( this.length , 'dbhField: passed an empty jQuerySet.')
			let $input = this.eq(0)
			, dbhFieldInstance = $input.data('dbh-field-instance')
			if(dbhFieldInstance) {
				dbhFieldInstance.val(val);
			} else {
				this.val(val);
			}
			return this
		}
	})
	DBH.stylesMap = new Map()
	DBH.field = DBH_field_instantiate
	function DBH_field_instantiate( $jquerySet ) {
		if ( ! $jquerySet.length ) return undefined;
		let $input = $jquerySet.eq(0)
		, type = $input.attr ( 'data-dbh-field-type' )
		, isInlineSearch = $input.hasClass ( 'inline-search' )
		, fieldClassInstance
		if ( $input.hasClass ( 'inline-search' ) ) {
			fieldClassInstance = new field_search ( $input )
		} else if ( $input.hasClass ( 'tags-cloud' ) ) {
			fieldClassInstance = new field_tags ( $input , $input.attr('grupo') )
		} else {
			fieldClassInstance = new field ( $input )
		}
		return fieldClassInstance
	}
	class field {
		constructor ( $input ) {
			$input.addClass ( '_dbh-field' )
			this.$input = $input
			let existsIntance = $input.data( 'dbh-field-instance' )
			$input.data( 'dbh-field-instance' , this )
		}
		val (_val ) {
			if ( !_val && _val.trim() != '' ) {
				let _val = this.$input.val()
				return _val
			} else {
				this.$input.val( _val )
				//return this.$input
			}
		}
	}
	class field_search extends field {
		constructor ( $input ) {
			super ( $input )
		}
		val (_val) {
			if ( !_val && _val.trim() != '' ) {
				return super.val()
			} else {
				let $input = this.$input
				if ( _val != '' ) {
					let id = this.$input.attr('id')
					, isInlineForm = $input.closest('.lineamodelo').length
					id = id.substring(id.indexOf('.')+1)
					if ( isInlineForm ) {
						var txt = DBH.mapaSql(id).mapa.get( _val )
					} else {
						var idfield = $input.attr('select-id-field')
						, textfield = $input.attr('select-text-field')
						, table = $input.attr('select-table')
						, sqlQueryObj = { idFieldName : idfield , fieldNames : `${idfield},${textfield}` , table : table }
						DBH.mapaSql ( id , sqlQueryObj ).addIds ( _val )
						txt = DBH.mapaSql(id).mapa.get(_val)
					}
					var opt = '<option value="'+_val+'" selected>'+(txt?txt:'')+'</option>'
				}
				$input.find('option').remove()
				$input.append('<option/>').append(opt)	
				//super.val ( _val )
			}
		}
	}
	class field_tags extends field {
		constructor ( $input , grupo ) {
			super ( $input )
			this.grupo = grupo
			this.hound = DBH.hounds.get('grupos:'+grupo)
			//debugger
			$input.tagsinput({
				//itemValue: 'li1_id',
				//itemText: 'des',
				tagClass: function(item) {
					return ('custom-color-'+item);
				},
				typeaheadjs: [{
					highlight: true
					,minLength : 0
					}
					,{
					//source: this.hound
			source: function nflTeamsWithDefaults(q, sync) {
				if (q === '') {
					sync($input.data( 'dbh-field-instance' ).hound.all()); // This is the only change needed to get 'ALL' items as the defaults
				}
				else {
					$input.data( 'dbh-field-instance' ).hound.search(q, sync);
				}
			}
					,display:'des'
				}]
				
			});
			$input.on('itemRemoved',	function (event) {
				let isEdition = DBH.area().recid.length
				if ( isEdition ) formCabecera.formModificado(1)
			})
			$input.on('itemAdded',	function (event) {
				console.log(event.item)
				let item = event.item
				, $input = $(this)
				, cached = $input.data( 'dbh-field-instance' ).hound.get(item).length
				, isEdition = DBH.area().recid.length
				if ( isEdition ) formCabecera.formModificado(1)
				if ( ! cached && isEdition ) {
					let  sql = "SELECT id FROM DBH_LISTAS WHERE grupo = '" + grupo + "'"
					, sql1 = "INSERT INTO DBH_LISTAS ( grupo, id, des ) ( SELECT '" + grupo + "', MAX(id)+1 AS a,'" + item + "' FROM DBH_LISTAS WHERE grupo = '" + grupo + "' )"
					, sql2 = "INSERT INTO DBH_LISTAS ( grupo, id, des ) VALUES ( '" + grupo + "', 1 ,'" + item + "' )"
					sql = sqlExecVal ( sql ) ? sql1 : sql2
					sqlExecVal ( sql , 0 )
					let sqlm = "SELECT MAX(li1_id) FROM DBH_LISTAS"
					, li1_id = sqlExecVal ( sqlm , 0 )
					, obj = {li1_id,des:item,grupo}
					$input.data( 'dbh-field-instance' ).hound.add(obj)
					//$input.data( 'dbh-field-instance' ).hound.add(item)
				}
				let itemObj = $input.data( 'dbh-field-instance' ).hound.get(item)[0]
				, li1_id  = itemObj.li1_id
				, color  = itemObj.li1_color
				, $style = $("<style type='text/css'>.tag.custom-color-"+item+"{background:" + color  + "}</style>")
				if( ! DBH.stylesMap.has ( item ) ) {
					$style.appendTo("head")
					DBH.stylesMap.set(item, $style)
				}
				//debugger
				//if(color)$input.css({background:color})
			})
		}
		val ( _val ) {
			if ( !_val && _val.trim() != '' ) {
				return super.val()
			} else {
				let grupo = this.grupo
				, li1_id = 1
				, li1_color = ''
				, valArr = _val.split(',')
				valArr.forEach ( des => {
					//	this.hound.add ( {grupo, li1_id, li1_color, des} )
				} )
				super.val( _val )
				this.$input.tagsinput('reload')
			}
		}
	}
}
