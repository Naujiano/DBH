{
  class tabla {
    constructor ( name , $tabla ) {
      this.name = name
      this.$table = $tabla ? $tabla : $('<table/>')
    }
    row ( index ) {
      let $table = this.$table
      , $row = $table.find('tr').eq ( index )
      return $row
    }
    get colsNumber () {
      return this.$table.find('tr').length
    }
    addRow ( ...cellValues ) {
      let $row = $ ( '<tr/>' )
      , colsNumber = this.colsNumber
      for ( let i = 0 ; i < colsNumber ; i ++ ) {
        let $cell = $ ( '<td/>' )
        , val = ''
        if ( typeof cellValues[i] != 'undefined' ) val = cellValues[i]
        $cell.html ( val )
        $row.append ( $cell )
      }
      this.$table.append ( $row )
    }
    add$rows ( $rows ) {
      this.$table.append ( $rows )
    }
    clear () {
      this.$table.find('tr').remove()
	  return this;
    }
  }
  class tabla_sql extends tabla {
    constructor ( name , sqlQueryObj , $tabla ) {
      super ( name , $tabla )
      this.sqlQuery = dbhQuery ( sqlQueryObj )
	  this.$table
		.attr('data-idfieldname',sqlQueryObj.idfield)
		.attr('data-fieldnames',sqlQueryObj.fields)
		.attr('data-table',sqlQueryObj.table)
		.attr('data-where',sqlQueryObj.where)
		.attr('data-orderby',sqlQueryObj.orderby)
      this.ids = this.getIds()
      //this.query()
    }
    addIds (...ids) {
      let presentIds = this.ids
//      console.log(ids)
      ids.forEach ( ( id , i ) => ids[i] = id * 1 )
      let newIds = ids.filter ( x => presentIds.indexOf ( x ) == -1 )
      if ( ! newIds.length ) return false;
      this.ids.push(...newIds)
      //debugger
      let idFieldName = this.sqlQuery.idfield.trim()
      , where = `${idFieldName} IN ( ${newIds} )`
      //, selectSyntax = this.sqlQuery.reset ( where ).selectSyntax()
      , $rows = this.sqlQuery.getRows( where )
//      console.log(selectSyntax)
      //let $rows = DBH.ajax.toRows ( selectSyntax , idFieldName )
      this.add$rows ( $rows )
      console.log(idFieldName+presentIds)
//	  console.log(this.$table.wrap('<div/>').parent().html())
    }
	clear () {
		this.ids = [];
		super.clear();
		return this;
	}
	/*
    query () {
      let idFieldName = this.sqlQuery.sqlQueryObj.idFieldName.trim()
      , selectSyntax = this.sqlQuery.selectSyntax()
      let $rows = DBH.ajax.toRows ( selectSyntax , idFieldName )
      this.$table.append( $rows )
	  console.log(this.$table.html())
    }
	*/
    getIds ( ) {
      let ids = []
      this.$table.find('tr').each(function(){
        let $tr = $(this)
        , id = $tr.attr('data-id')
        ids.push(id * 1 )
      })
      return ids
    }
  }
  class mapa_sql extends tabla_sql {
    constructor ( name , sqlQueryObj  , cache  ) {
		if ( cache ) var $table_cache = createFromCache( name )
		super ( name , sqlQueryObj , $table_cache )
		function createFromCache ( name ) {
			let cache = localStorage[`mapa_sql.$table:${name}`]
			if ( ! cache ) return false;
			let $table_cache = $(cache)
			, idfield = $table_cache.attr('idfieldname')
			, fields = $table_cache.attr('fieldnames')
			, table = $table_cache.attr('table')
			, where = $table_cache.attr('where')
			, orderby = $table_cache.attr('orderby')
			, sqlQueryObj = { idfield , fields , table , where , orderby }
			console.log('from cache')
			return $table_cache;
		}
    }
	clearCache () {
		localStorage.removeItem(this.name);
		return this;
	}
    get mapa () {
      let mapa = new Map()
      , $table = this.$table
      $table.find('tr').each(function(){
        let $tr = $(this)
        , $tds = $tr.find('td')
        , idValue = $tds.eq(0).text()
        , textValue = $tds.eq(1).text()
        //console.log( "id" + idValue + "txt" +  textValue)
        mapa.set ( idValue , textValue )
      })
      return mapa
    }
    addIds ( ...ids ) {
		super.addIds ( ...ids )
		localStorage[`mapa_sql.$table:${this.name}`] = this.$table.wrap('<div/>').parent().html()
    }
    set ( idValue , textValue ) {
      this.addRow ( idValue , textValue )
    }
  }
    let mapas_sql = new Map()

   // DBH.sqlQuery = sqlQuery
    //DBH.mapa_sql = mapa_sql

	DBH.mapaSql = function ( name , sqlQueryObj ) {
		//console.log(JSON.stringify(sqlQueryObj))
		let instance = false
		if ( mapas_sql.has ( name ) ) {
		  instance = mapas_sql.get ( name )
		  if ( sqlQueryObj ) instance.sqlQueryObj = sqlQueryObj
		} else {
			instance = new mapa_sql ( name , sqlQueryObj )
			mapas_sql.set ( name , instance )
		}
		return instance
	}
	DBH.hounds = new Map ()
}
