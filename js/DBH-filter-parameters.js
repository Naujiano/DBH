function formatFilter(cmpsfiltro,container){
//	console.log(cmpsfiltro)
	var $cmpsfiltro = $()
	, $container = $(container)
	for(var j=0;j<cmpsfiltro.length;j++){
		var n = cmpsfiltro[j]
		, $campo=$container.find('[id="' + n + '"]')
		$cmpsfiltro = $cmpsfiltro.add($campo)
		//console.log('campo:'+$cmpsfiltro.length)
	}
	return $formatFilter($cmpsfiltro)
}
function $formatFilter($cmpsfiltro){
	var listadoWhere="1=1 AND "
	var listadoWhereText=""
	, filtro = $('[id="buttonfilter"]:visible').hasClass('color-blue')
	, idsselectsrepesconselectedoption = []
	, wherearr = []
	//console.log('$cmpsfiltro:'+$cmpsfiltro.length)
	$cmpsfiltro.each ( function () {
		if ( this == null ) console.log ( "Function formatFilter: el campo " + n + " no se encuentra." )
		var v = this.value
		, $field = $(this)
		, data = $(this).data('data-filter-conditions')
		, sqlfilter = $(this).attr('data-sql-filter')
		, usefilterdata = false
		, l = this.name
		if ( v != '' && v && v != null && this.tagName=="SELECT" ) { //Es select repetida con valor directo seleccionado
			var repeticiones = $cmpsfiltro.filter('[id="' + this.id + '"]').length
			, notieneelid = $.inArray(this.id,idsselectsrepesconselectedoption)==-1
//			console.log(this.id)
			if(notieneelid)idsselectsrepesconselectedoption.push(this.id)
			return
		}
				//console.log($field.data('data-filter-conditions'))
		if ( ! sqlfilter || v == '' ) { //Si tiene filtro especial y selecciona una valor dejo que se ocupe la función de filtro custom del topform.
			//if ( filtro && data  ) {
			if ( data  ) {
				var vv = $field.data('data-filter-conditions')
				usefilterdata = true
				if ( sqlfilter ) {
					var variablesFiltro = {}
					, id = sqlfilter.substring ( sqlfilter.indexOf ( "{" )+1, sqlfilter.indexOf ("}") )
					, $cmp = $('<textarea id="' + id + '">' + vv + '</textarea>')
					, cmp = $cmp[0]
					, variablesFiltro = filterStringMatch(cmp,this)
					variablesFiltro.r = sqlfilter.replace ( '{' + id + '}', variablesFiltro.r )
				} else {
					if(this.tagName=="SELECT" &&  !$field.attr('data-select-options')) {
						if ( $field.attr('data-sql-listado')  ) {
							var id="(" + $field.attr('data-sql-listado') + ")"
						} else {
							var id = "(SELECT des FROM DBH_LISTAS b WHERE grupo = '" + $field.attr('grupo') + "' AND b.li1_id = " + this.id + ")"
						}
					} else {
						var id= this.id
					}
					var $cmp = $('<textarea id="' + id + '">' + vv + '</textarea>')
					, cmp = $cmp[0]
					, variablesFiltro=filterStringMatch(cmp,this)
					//console.log(cmp)
//					console.log(variablesFiltro)
				}
				listadoWhere += "(" + variablesFiltro.r + ") AND "
				listadoWhereText+=l+" <b>["+variablesFiltro.v+"]</b><br>"
				//variablesFiltro.whereobj.name = $field.attr('name')
				//variablesFiltro.whereobj.id = $field.attr('id')
				//variablesFiltro.whereobj.querydesc = rarr[1]
				wherearr.push(variablesFiltro.whereobj)
			}
			if(v!=""){
				var fieldid = $field.attr('id')
				, fieldval = $field.val()
				if ( $field.hasClass('tags-cloud') ) {
					let tags = $field.val().split(',')
					if ( tags.length ) {
						let name = $field.attr('name')
						tags.forEach ( tag => {
							let sql = fieldid + " LIKE '%" + tag + "%'"
							listadoWhere += sql + " AND "
							listadoWhereText += name + " <b>[" + tag + "]</b><br>"
							var whereobj = {
								id : fieldid
								, name : name
								, sql : sql
								, value : tag
								, parameters : 'active'
								, leftexp : ''
								, rightexp : ''
							}
							wherearr.push(whereobj)
							
						})
					}
				} else if ( fieldid != "dbh_redactor_consultas" ) {
					//console.log($(this).attr('id'))
					var cmp = this
					var variablesFiltro=filterStringMatch(cmp,this)
					listadoWhere += "(" + variablesFiltro.r + ") AND "
					listadoWhereText+=l+" <b>["+variablesFiltro.v+"]</b><br>"
					wherearr.push(variablesFiltro.whereobj)
				} else {
					listadoWhere += fieldval.toString()+ " AND "
					listadoWhereText += "redactor <b>[" + fieldval + "]</b><br>"
					//console.log($field.attr('dbh-query-description'))
					var whereobj = {
						id : fieldid
						, name : 'Redactor'
						, sql : fieldval
						, value : $field.attr('dbh-query-description') ? $field.attr('dbh-query-description') : fieldval
						, parameters : 'active'
						, leftexp : ''
						, rightexp : ''
						, da_id : $field.attr('dbh-query-da_id')
					}
					wherearr.push(whereobj)
					
				}
			}
		}
		
	})
	
	//console.log('idsselectsrepesconselectedoption'+idsselectsrepesconselectedoption)
	$(idsselectsrepesconselectedoption).each ( function (i) {
		var $twins = $cmpsfiltro.filter('[id="' + idsselectsrepesconselectedoption[i] + '"]').not('.lineamodelo_wrapper *')
		, vals = []
		, names = []
		, cmp = $twins[0]
		$twins.each ( function (i) {
			if ( $(this).val() != '' && $(this).val()!=null && typeof this.value != 'undefined' ) {
				vals.push("'"+this.value+"'");
				names.push($(this).find('option[value="'+this.value+'"]').text())
			}
		} )
		if ( vals.length ) {
			var variablesFiltro=filterStringMatch(cmp,cmp)
			//r=$twins[0].id+" IN ("+vals+")"
			//listadoWhere += "(" + r + ") AND "
			//listadoWhereText+=$twins[0].name+" <b>["+names+"]</b><br>"
			listadoWhere += "(" + variablesFiltro.r + ") AND "
			listadoWhereText+=$twins[0].name+" <b>["+variablesFiltro.v+"]</b><br>"
			
			wherearr.push(variablesFiltro.whereobj)
		}

	})
	if(listadoWhere!="")listadoWhere=listadoWhere.substr(0,listadoWhere.length-5)
	if(listadoWhereText!="")listadoWhereText=listadoWhereText.substr(0,listadoWhereText.length-4)
	return {listadoWhere:listadoWhere,listadoWhereText:listadoWhereText,wherearr:wherearr}
}
function filterStringMatch(campo,campooriginal){
	var v=campo.value+""
	, n=campo.id
	, leftsql = n
	, $campo = $(campo)
	, tipo=$campo.data('tipo')
	, data_sql_select=$campo.attr('data-customfield-sql-select')
	//console.log(data_sql_listado)
	if ( typeof data_sql_select != 'undefined' && data_sql_select.length ) n = "(" + data_sql_select + ")"
	if(campo.tagName=="SELECT"){
		if(v=="True")v="1"
		if(v=="False")v="0"
	}
	if(tipo<10){
		v=v.replace(".","")
		v=v.replace(",",".")
	}
	var re=/"([^"]*)"/gi
	, espacioraro=new RegExp(String.fromCharCode(160),"g")
	, saltodelinea=new RegExp(String.fromCharCode(10),"g")
	, sqlparanulo = '(" is null" or "=' + "''" + '")'
	, vt=v
	, r=""
	, l=""
	, $campooriginal = $(campooriginal)
	, esinlinelist = $campooriginal.hasClass('inlinelist')
	, whereobj = {}
	v=v.replace(espacioraro,"").replace(saltodelinea,"")
	if(tipo<10||tipo==135){v=v.replace('""',sqlparanulo)}
	var matches=v.match(re)
	if(matches){
		if(tipo<10||tipo==135){
			r=v.replace(re,n+"$1")
			//if(tipo==135 && v.toLowerCase().indexOf('getdate')==-1 && v.toLowerCase().indexOf(sqlparanulo)==-1){
			if(tipo==135){
				var red=new RegExp("[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}","g")
				var matchesf = r.match(red)
				//if (matchesf == null){alerta('Sintaxis de filtrado no válida');return false}
				//for(var i=0;i<matchesf.length;i++)r=r.replace(matchesf[i],"'"+matchesf[i]+"'")
				if (matchesf != null){
					for(var i=0;i<matchesf.length;i++){
						//if(tipo==135 && v.toLowerCase().indexOf('getdate')==-1 && v.toLowerCase().indexOf(sqlparanulo)==-1)
							r=r.replace(matchesf[i],"'"+matchesf[i]+"'")
					}
				}
			}
		}else{
			for(var i=0;i<matches.length;i++)v=v.replace(matches[i],eliminarAcentos(matches[i]))
			r=v.replace(re,n+" like '$1'")
			r=r.replace(n+" like ''","("+n+" is null OR "+n+"='')")
		}
	}else{
		if(campo.type=="hidden"){
			r=n+" = '"+v+"'"
		}
		else if(campo.tagName=="SELECT"||esinlinelist){
			vt=esinlinelist? $campo.siblings().filter('input.inlinelist').val() :campo.options[campo.selectedIndex].text
			r=n+" IN ('"+v+"')"
		}else if(tipo==135) {
			r="convert(char(10),"+n+",103) like '%"+eliminarAcentos(v)+"%'"
		}else{
			r=n+" like '%"+eliminarAcentos(v)+"%'"
		}

	}
//	console.log(r)
	var rarr = r.split("like")
	whereobj.id = $campooriginal.attr('id')
	whereobj.name = $campooriginal.attr('name')
	//whereobj.leftsql = leftsql
	//whereobj.rightsql = rightsql
	whereobj.sql = '('+r+')'
	whereobj.value = vt
	if(DBH.area().topform.queryEditor.$container.attr('active-state')!="2")whereobj.parameters = "active"
	//if ( v == '""' ) r = "(" + n + " IS NULL OR " + n + " = '')"
	return {r:r,v:vt,whereobj:whereobj}
}
