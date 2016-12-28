{
	String.prototype.escape_sql = function() {
		return this.replace(/\'/g,"''");
	}
	class query {
		constructor ( sqlQueryObj ) {
			let { idfield , fields , assigns , select , table , where = '' , orderby = '' , httphandler } = sqlQueryObj
			if ( ! table ){ console.log( 'Class query: table parameter has not been provided.' ); return false;	}
			this.idfield = idfield ? idfield.trim() : idfield
			this.fields = fields
			this.table = table.trim()
			this.where = where.trim()
			this.orderby = orderby.trim()
			this.assigns = assigns
			this.select = select
			this.httphandler = httphandler ? httphandler : sqlExecVal
			//this.sqlQueryObj = sqlQueryObj
		}
		execute ( ...argumentos ) {
			return this.executeSyntax()
			let respuesta = this.httphandler ( this.executeSyntax() , ...argumentos )
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
			let that = new query_insert ( sqlQueryObj )
			
			return that.execute();
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
			let that = new query_update ( sqlQueryObj )
			return that.execute();
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
			let that = new query_insert_select ( sqlQueryObj )
			return that.execute();
		}
	}
	class query_select extends query {
		constructor ( sqlQueryObj ) {
			super ( sqlQueryObj )
		}
		selectSyntax () {
			let selectSyntax = `SELECT ${this.fields} FROM ${this.table} ${ this.where ? 'WHERE ' + this.where : '' } ${ this.orderby ? 'ORDER BY ' + this.orderby : '' }`
			return(selectSyntax);
		}
		reset ( where ) {
			if ( ! where ) this.where = where.trim()
			return this;
		}
		getRows ( where ) {
			this.reset ( where )
			let $rows = DBH.ajax.toRows ( this.selectSyntax() , this.idfield )
			return $rows
		}
		getJSON ( where ) {
			this.reset ( where )
			let json = DBH.ajax.select ( this.selectSyntax() )
			return $rows
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
	DBH.query = function ( sqlQueryObj ) {
		let instance = query_select.init ( sqlQueryObj )
		return instance
	};
	DBH.insert = function ( sqlQueryObj ) {
		let instance = query_insert.init ( sqlQueryObj )
		return instance
	};
	DBH.update = function ( sqlQueryObj ) {
		let instance = query_update.init ( sqlQueryObj )
		return instance
	};
	DBH.insert_select = function ( sqlQueryObj ) {
		let instance = query_insert_select.init ( sqlQueryObj )
		return instance
	};
}

let eee = DBH.query({
  table: 'personas'
  , idfield: 'codpersona'
  , fields : ['nombre','apellidos']
  , where : 'codpersona = 3'
  , httphandler: DBH.ajax.toRows
})
let ddd = DBH.insert_select({
  table: 'personas'
  , idfield: 'codpersona'
  , assigns: {
    nombre: 'juan',
    apellidos: 'martinez'
  }
  , fields : ['nombre','apellidos']
  , where : 'codpersona = 3'
  , select: eee
})
console.log(ddd)
