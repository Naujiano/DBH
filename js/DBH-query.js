{
	String.prototype.escape_sql = function() {
		return this.replace(/\'/g,"''");
	}
	class query {
		constructor ( sqlQueryObj ) {
			let { idfield , fields , assigns , select , table , where = '' , orderby = '' , httphandler = DBH.query.defaultHttpHandler } = sqlQueryObj
			if ( ! table ){ console.log( 'Class query: table parameter has not been provided.' ); return false;	}
			this.idfield = idfield ? idfield.trim() : idfield
			this.fields = fields
			this.table = table.trim()
			this.where = where.trim()
			this.orderby = orderby.trim()
			this.assigns = assigns
			this.select = select
			this.httphandler = httphandler
			//this.httphandler = httphandler ? httphandler : sqlExecVal
			//this.sqlQueryObj = sqlQueryObj
		}
		execute ( httphandler , ...argumentos ) {
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
	}
	class query_insert extends query {
		constructor ( sqlQueryObj ) {
			super ( sqlQueryObj )
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
		static init ( sqlQueryObj ){
			return new query_insert ( sqlQueryObj )
		}
	}
	class query_update extends query {
		constructor ( sqlQueryObj ) {
			super ( sqlQueryObj )
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
		static init ( sqlQueryObj ){
			return new query_update ( sqlQueryObj )
		}
	}
	class query_insert_select extends query_update {
		constructor ( sqlQueryObj ) {
			super ( sqlQueryObj )
		}
		executeSyntax () {
			let insertSyntax = `INSERT INTO ${this.table} ( ${this.fields} ) ( ${this.select.selectSyntax()} )`
			return insertSyntax
		}
		static init ( sqlQueryObj ){
			return new query_insert_select ( sqlQueryObj )
		}
	}
	class query_select extends query {
		constructor ( sqlQueryObj ) {
			super ( sqlQueryObj )
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
		static init ( sqlQueryObj ){
			return new query_select ( sqlQueryObj )
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
	
	DBH.query = function ( sqlQueryObj ) {
		let type = sqlQueryObj.type
		if ( !type || type == 'select' ) return query_select.init ( sqlQueryObj )
		if ( type == 'insert' ) return query_insert.init ( sqlQueryObj )
		if ( type == 'update' ) return query_update.init ( sqlQueryObj )
		if ( type == 'insert_select' ) return query_insert_select.init ( sqlQueryObj )
	};
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
DBH.query.defaultHttpHandler = DBH.ajax.select
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
let eee = DBH.query({
	fields : 'top 2 nombre,apellidos' 
	, table: 'personas' 
	, where : 'codpersona = 50214' 
}).execute();

console.log(eee)
*/