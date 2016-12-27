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
			var hound = DBH.hounds.get('grupos:'+grupo)
			//debugger;
			if ( ! hound ) {
				let data = DBH.hounds.get('grupos').get(grupo)
				var hound = new Bloodhound({
					datumTokenizer: Bloodhound.tokenizers.whitespace,
					queryTokenizer: Bloodhound.tokenizers.whitespace
					//,identify: function(obj) { return obj.des; }
					,local: data
				});
				DBH.hounds.set('grupos:'+grupo,hound)
			}
			this.hound = hound
			//debugger;
			$input.tagsinput({
				//itemValue: 'li1_id',
				//itemText: 'des',
				typeaheadjs: [{
					highlight: true
					}
					,{
					source: hound
					//,display:'des'
				}]
				
			});
			$input.on('itemAdded',	function (event) {
				console.log(event.item)
				let item = event.item
				, $input = $(this)
				, cached = $input.data( 'dbh-field-instance' ).hound.get(item).length
				if ( ! cached ) {
					let  sql = "SELECT id FROM DBH_LISTAS WHERE grupo = '" + grupo + "'"
					, sql1 = "INSERT INTO DBH_LISTAS ( grupo, id, des ) ( SELECT '" + grupo + "', MAX(id)+1 AS a,'" + item + "' FROM DBH_LISTAS WHERE grupo = '" + grupo + "' )"
					, sql2 = "INSERT INTO DBH_LISTAS ( grupo, id, des ) VALUES ( '" + grupo + "', 1 ,'" + item + "' )"
					sql = sqlExecVal ( sql ) ? sql1 : sql2
					sqlExecVal ( sql , 0 )
					let sqlm = "SELECT MAX(li1_id) FROM DBH_LISTAS"
					let a = sqlExecVal ( sqlm , 0 )
					$input.data( 'dbh-field-instance' ).hound.add(item)
				}
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
