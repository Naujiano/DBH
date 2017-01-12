/************
Dependent on: jQuery, bootstrap-tagsinput, typeahead (bundle with Bloodhound)
**********/
$(document).on('form:save', function ( ){
	let $container = $(this)
	, $tagFields = $container.find ( '._dbh-field._dbh-field-tags' )
	, tagSetsMap = new Map()
	$tagFields.each ( function () {
		let $tagField = $(this)
		, grupo = $tagField.attr('grupo')
		, tags = $tagField.val().split ( ',' )
		, tagSet = tagSetsMap.get ( grupo )
		if ( ! tagSet ) tagSet = new Set()
		tags.forEach ( tag => { tagSet.add ( tag ) } )
		tagSetsMap.set ( grupo , tagSet )
	})
	let inserts = "";
	for ( let [grupo , groupSet] of tagSetsMap ) {
		for ( let val of groupSet  ) {
			let insert = " INSERT INTO dbh_listas ( grupo , des ) VALUES ( '" + grupo + "','" + val + "' )"
			inserts += insert
		}
	}
	dbhQuery ({sqlquery:inserts}).request(function(xml){
		console.log(xml)
	})
	/*
	DBH.sql ( inserts ) {
		let sqlm = "SELECT MAX(li1_id) FROM DBH_LISTAS"
		, li1_id = sqlExecVal ( sqlm , 0 )
		, obj = {li1_id,des:item,grupo}
		$input.data( 'dbh-field-instance' ).hound.add(obj)
		//$input.data( 'dbh-field-instance' ).hound.add(item)
	}
	*/
	/*
	let itemObj = $input.data( 'dbh-field-instance' ).hound.get(item)[0]
	, li1_id  = itemObj.li1_id
	, color  = itemObj.li1_color
	, $style = $("<style type='text/css'>.tag.custom-color-"+item+"{background:" + color  + "}</style>")
	if( ! stylesMap.has ( item ) ) {
		$style.appendTo("head")
		stylesMap.set(item, $style)
	}
*/
//	console.log($fields.length)
});


{

	let taginput_original = $.fn.tagsinput
	//console.log(taginput_original)
	$.fn.tagsinput = function ( ...argumentos ) {
		if ( argumentos[0] == 'reload' ) {
			let valArray = this.val().split(',')
			//console.log(valArray)
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
	let stylesMap = new Map()
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
			//let existsIntance = $input.data( 'dbh-field-instance' )
			$input.data( 'dbh-field-instance' , this )
		}
		val (_val ) {
			if ( !_val && _val.trim() != '' ) {
				let _val = this.$input.val()
				return _val
			} else {
				this.$input.val( _val )
				//debugger
				//console.log(this.$input.attr( 'id' )+ "**"+_val)
			}
		}
	}
	class field_search extends field {
		constructor ( $input ) {
			super ( $input )
			$input.addClass ( '_dbh-field-search' )
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
						, sqlQueryObj = { idfield : idfield , fields : `${idfield},${textfield}` , table : table }
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
			$input.addClass ( '_dbh-field-tags' )
			this.grupo = grupo
			this.hound = DBH.hounds.get('grupos:'+grupo)
			if ( ! this.hound ) {console.log('aa')
				let hound = new Bloodhound({
					//datumTokenizer: Bloodhound.tokenizers.whitespace,
					datumTokenizer: Bloodhound.tokenizers.obj.whitespace('des'),
					queryTokenizer: Bloodhound.tokenizers.whitespace
					//,identify: function(obj) { return obj.des; }
					,local: []
				});
				this.hound = hound
				DBH.hounds.set('grupos:'+grupo, hound)
			}
			//debugger
			$input.tagsinput({
				//itemValue: 'des',
				//itemText: 'des',
				tagClass: function(item) {
					return ('custom-color-'+item);
				},
				typeaheadjs: [{
					highlight: true
					,minLength : 0
					}
					,{
					source: function (q,cb) {
						const query = dbhQuery ( {
							fields:'des'
							,table:'dbh_listas'
							,where:`grupo='${grupo}' AND des like '%${q}%'`
							,orderby:'des'
						})
						//debugger
						//console.log (query.getArray())
							let matches = query.getArray()
							cb ( matches )

					}
					, limit: 20
					/*
					source: function nflTeamsWithDefaults(q, sync) {
						if (q === '') {
							sync($input.data( 'dbh-field-instance' ).hound.all()); // This is the only change needed to get 'ALL' items as the defaults
						}
						else {
							$input.data( 'dbh-field-instance' ).hound.search(q, sync);
						}
					}
					*/
					//,display:'des'
				}]

			});
			$input.on('itemRemoved',	function (event) {
				let isEdition = DBH.area().recid.length
				if ( isEdition ) formCabecera.formModificado(1)
			})
			$input.on('itemAdded',	function (event) {
				let isEdition = DBH.area().recid.length
				if ( isEdition ) formCabecera.formModificado(1)
			})
			$input.on ( 'area:save' , function () {
				let $input = $(this)
				, dbhField = $input.data( 'dbh-field-instance' )
				dbhField.save()
				console.log('abfefs')
			})
		}
		save () {
			console.log('abfefs')
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
