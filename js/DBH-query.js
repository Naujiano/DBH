{
	String.prototype.escape_sql = function() {
		return this.replace(/\'/g,"''");
	}
	dbhQuery = function ( settings ) {
		if ( typeof settings == 'string' )
			return cacheMap.get(settings)
		let type = settings.type
		, sqlquery = settings.sqlquery
		if ( sqlquery ) return query.init ( settings )
		if ( !type || type == 'select' ) return query_select.init ( settings )
		if ( type == 'insert' ) return query_insert.init ( settings )
		if ( type == 'update' ) return query_update.init ( settings )
		if ( type == 'insert_select' ) return query_insert_select.init ( settings )
	};
	let cacheMap = new Map()
	class query {
		constructor ( settings ) {
			let {
			    idfield,
			    fields,
			    assigns,
			    select,
			    table = '',
			    where = '',
			    orderby = '',
					sqlquery = '',
					datatype = 'xml',
			    httphandler = DBH.ajax.select,
			    url,
			    cache
			} = settings
			//if ( ! table ){ console.log( 'Class query: table parameter has not been provided.' ); return false;	}
			this.idfield = idfield ? idfield.trim() : idfield
			this.fields = fields
			this.table = table.trim()
			this.where = where.trim()
			this.orderby = orderby.trim()
			this.sqlquery = sqlquery.trim()
			this.assigns = assigns
			this.select = select
			this.httphandler = httphandler
			this.cacheName = cache
			this.url = 'selectXML_new.asp'//url
			//this.dataType = this.sqlquery == '' ? 'xml' : 'text';
			this.datatype = datatype;
			if ( cache ) cacheMap.set ( cache , this );
			//this.httphandler = httphandler ? httphandler : sqlExecVal
			//this.settings = settings
		}
		executeSyntax () {
			//debugger
			if ( this.sqlquery == '' ) {
				console.log( 'Class query: sqlquery has not been specified.' )
				return false;
			}
			return this.sqlquery;
		}
		execute ( httphandler , ...argumentos ) { // Devuelve la respuesta del httphandler tal cual.
			//return this.executeSyntax()
			let handler = httphandler ? httphandler : this.httphandler
			if ( ! handler ) {
				console.log ( 'Class query: httphandler has not been specified.' );
				return false;
			}
			let respuesta = handler ( this.executeSyntax() , ...argumentos )
			this.http_response = respuesta;
			return respuesta;
		}
		request ( successFn ) { // Devuelve un xml o text
			let data = "sql=" + encodeURIComponent(this.executeSyntax())
			, that = this;
			that.http_request_successfull = false;
			$.ajax({ type: "POST",
				url: this.url,
				async: false,
				dataType: this.datatype,
				data: data,
				success : function ( xml ) {
					that.http_request_successfull = true;
					that.cache ( xml );
					if ( successFn ) successFn ( xml );
				},
				error: function ( jqXHR, textStatus, errorThrown)
				{
					//console.log("textStatus: "+textStatus)
					//console.log("param: "+param)
					console.log(errorThrown)
					//alerta ( "Error de SQL. ")
					/*
					$.post ( urll, param ,function( data ) {
						//console.log( data );
						//respuesta = "error"
					})
					*/
				}
			});
		}
		cache (xml) {
				if ( !xml ) return this.hound
				this.http_response = xml
				let $rows = $(xml).find('xml').children()
				, that = this
				if ( this.idfield ) {
					$rows.each ( function () {
						let $row = $(this)
						, $idNode = $row.find(`[fieldname="${that.idfield}"]`)
						, id = $idNode.text()
						$idNode.parent().attr('sqlQuery-id',id)
					})
				}
				this.hound = $rows
		}
		ready () {
			return this.http_request_successfull
		}
		search ( param ) {
			let json = this.json()
			, matches = []
			json.forEach ( obj => {
				let match = true;
				Object.keys(param).forEach ( key => {
					let yes = obj[key] == param[key]
					if ( ! yes ) match = false;
				})
				if ( match ) matches.push(obj);
			})
			return matches;
		}
		filter ( id ) { // Return jQuery <tr>
			let idArr = id.split ( ',' )
			, selector
			idArr.forEach ( id => {
					selector += `,[sqlQuery-id="${id}"]`
			})
			selector = selector.substring ( 1 )
			let hound = this.cache()
			, $rows = hound.filter(selector)
			return $rows
		}
		json ( id ) { // Return json formated rows
			//return false
			let  xmldoc = this.http_response
			, rows = DBH.ajax.xmlToObject ( xmldoc )
			, filteredRows = []
			for ( let i = 0 ; i < rows.length ; i ++ ) {
				let row = rows[i]
				, rowid = row[this.idfield]
				, included = ( id ? ( id == rowid ) : 1 )
				if ( included ) filteredRows.push ( row )
			}
			return filteredRows
		}
		static init ( settings ){
			return new query ( settings )
		}
	}
	class query_insert extends query {
		constructor ( settings ) {
			super ( settings )
			//let notValid = ( ! super.fields.length )
			//if ( notValid ) { console.log( 'Class query_insert: wrong provided parameters.' ); return false; }
		}
		executeSyntax () {
			this.insert = {}
			this.insert.fields = []
			this.insert.values  = []
			Object.keys(this.assigns).forEach ( key => {
				let fieldName = key
				, fieldValue = this.assigns[key]
				this.insert.fields.push ( fieldName )
				this.insert.values.push ( `'${ fieldValue.escape_sql() }'` )
			})
			//debugger
			let insertSyntax = `INSERT INTO ${this.table} ( ${this.insert.fields} ) VALUES ( ${this.insert.values} ) SELECT MAX(${this.idfield}) FROM ${this.table}`
			return insertSyntax
		}
		static init ( settings ){
			return new query_insert ( settings )
		}
	}
	class query_update extends query {
		constructor ( settings ) {
			super ( settings )
		}
		executeSyntax () {
			this.update = []
			Object.keys(this.assigns).forEach ( key => {
				let fieldName = key
				, fieldValue = this.assigns[key]
				this.update.push ( `${fieldName} = '${ fieldValue.escape_sql() }'` )
			})
			//debugger
			let insertSyntax = `UPDATE ${this.table} SET ${this.update} WHERE ${this.where}`
			return insertSyntax
		}
		static init ( settings ){
			return new query_update ( settings )
		}
	}
	class query_insert_select extends query_update {
		constructor ( settings ) {
			super ( settings )
		}
		executeSyntax () {
			let insertSyntax = `INSERT INTO ${this.table} ( ${this.fields} ) ( ${this.select.selectSyntax()} )`
			return insertSyntax
		}
		static init ( settings ){
			return new query_insert_select ( settings )
		}
	}
	class query_select extends query {
		constructor ( settings ) {
			super ( settings )
		}
		executeSyntax () {
			let executeSyntax = `SELECT ${this.fields} FROM ${this.table} ${ this.where ? 'WHERE ' + this.where : '' } ${ this.orderby ? 'ORDER BY ' + this.orderby : '' }`
			return(executeSyntax);
		}
		reset ( where ) {
			if ( where ) this.where = where.trim()
			return this;
		}
		autoparse ( sqlQueryString ) {
			sqlQueryString = sqlQueryString.toLowerCase().trim()
			let firstSpacePos = sqlQueryString.indexOf ( " " )
			, firstComaPos = sqlQueryString.indexOf ( "," )
			, fromPos = sqlQueryString.lastIndexOf ( " from " )
			, wherePos = sqlQueryString.lastIndexOf ( " where " )
			, orderbyPos = sqlQueryString.lastIndexOf ( " order by " )
			, idfield = sqlQueryString.substr ( firstSpacePos , firstComaPos )
			, fields = sqlQueryString.substr ( firstComaPos + 1 , fromPos )
			, table = sqlQueryString.substr ( fromPos + 6 , wherePos )
			, where = sqlQueryString.substr ( wherePos + 7 , orderbyPos )
			, orderby = sqlQueryString.substr ( orderbyPos + 10  )
			return {idfield , fields , table , where , orderby }
		}
		static init ( settings ){
			return new query_select ( settings )
		}
	}

	query_select.prototype.getJSON = function ( where ) {
		let json = this.reset ( where ).execute (DBH.ajax.select)
		return json
	}
	query_select.prototype.getRows = function ( where ) {
		let $rows = this.reset ( where ).execute (DBH.ajax.toRows)
		return $rows
	}
}
/*
let eee = DBH.query({
  table: 'personas'
  , idfield: 'codpersona'
  , fields : 'top 2 nombre,apellidos'
  //, where : 'codpersona = 3'
  //, httphandler: DBH.ajax.select
}).execute();
*/
//dbhQuery.defaultHttpHandler = DBH.ajax.select
/*
let eee = DBH.query({
  table: 'persona'
  , idfield: 'codpersona'
  , assigns: {
    nombre: 'juan',
    apellidos: 'martinez'
  }
  , fields : ['nombre','apellidos']
  , where : 'codpersona = 50214'
  //, httphandler: DBH.ajax.select
  //, type: 'insert'
 }).execute();
*/

/*
let a = dbhQuery({
	fields : 'top 2 codpersona,nombre,apellido1'
	, table: 'personas'
	, cache: "sss-oi"
	, idfield : "codpersona"
	//, where : 'codpersona = 50214'
})
a.request(function(xml){
	console.log($(xml).find('xml').html())
	console.log(dbhQuery('sss-oi').filter('4893,4894'))
	//console.log($(xml).find('xml').html())
});
*/
