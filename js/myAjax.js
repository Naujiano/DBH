function ajaxExecuterValor(sql,controldeerrores,db){
	var pars = "sql=" + sql
	if ( typeof db != "undefined" ) pars += "&db=vs"
	var objXMLDoc=ajaxExecuter('selectXML_new.asp',pars,controldeerrores)
	if ( objXMLDoc == null ) return '';
	//if ( !objXMLDoc ) { console.log( 'ERROR EN ' + arguments.callee.caller.name ); return false }
	if ( typeof objXMLDoc.getElementsByTagName == 'undefined' ) {
		//console.log ( 'Respuesta: "' + respuesta + '"' )
		return objXMLDoc;
		return 'error2';
	}
	var xmlRootNode = objXMLDoc.getElementsByTagName("xml")[0]
	if ( typeof xmlRootNode == "undefined" || typeof xmlRootNode.childNodes[0] == "undefined" ) {
		console.log ( 'Sql: ' + sql )
		//console.log ( 'Respuesta: "' + respuesta + '"' )
		return 'error';
	}
	var root=xmlRootNode.childNodes[0];
	return root.text || root.textContent
}
function sqlExecVal (sql,controldeerrores,db){
	return ajaxExecuterValor(encodeURIComponent(sql),controldeerrores,db)
}
function sqlExec (sql,controldeerrores,db){
	var pars = "sql=" + encodeURIComponent(sql)
	if ( typeof db != "undefined" ) pars += "&db=vs"
	var objXMLDoc=ajaxExecuter('selectXML_new.asp',pars,controldeerrores)
	if ( objXMLDoc == null ) return null
	if ( typeof objXMLDoc.getElementsByTagName == 'undefined' ) {
		parent.alerta("Error de SQL")
		if(typeof respuesta != 'undefined')console.log ( 'Respuesta: "' + respuesta + '"' )
		return '';
	}
	var root=objXMLDoc.getElementsByTagName("xml")[0];
	return root.childNodes
}
function sqlExecAlterDB (sql,operation){
	//window.open ( 'sqlExecAlterDB.asp?sql='+sql )
	var res = ajaxExecuter( 'sqlExecAlterDB.asp','sql='+encodeURIComponent(sql))
	, operation = operation ? operation.toLowerCase() : ''
	, $res = $(res)
	, errnum = $res.find('errnum').text()
	, errdesc = unescape($res.find('errdesc').text())
	, sql = unescape($res.find('sql').text())
	, respuesta = unescape($res.find('respuesta').text())
	if ( errnum == -2147217900 ) {
		if (operation=='delete') {
			alerta( "Existen registros vinculados" );
		} else {
			alerta( "Ya existe un registro con esta clave única" );
		}
	}else if ( errnum == -2147217913 ) {
		alerta( "Tipo de datos no válido" );
	} else if ( errnum != 0 ) {
		alerta("Error de escritura",'red' );
	}
	if (errnum!=0) {
		console.log(errnum);
		console.log(errdesc);
		console.log(sql);
		return false
	}
	return $res
}
function DBH_select ( sql ){
	var r1 = sqlExec ( sql )
	, records = []
	$(r1).each(function(recnum){
		var $rec = $(this).find('*')
		, fields = {}
		$rec.each(function(fieldnum){
			var $field = $(this)
			, fieldname = $field.attr('fieldname')
			, regexp10 = new RegExp ( String.fromCharCode(10), "gi" )
			, regexp13 = new RegExp ( String.fromCharCode(13), "gi" )
			, fieldvalue = $field.text().replace(regexp10,"").replace(regexp13,"")
			, fieldarr = [fieldname,fieldvalue]
			eval("fields." + fieldname + "='" + fieldvalue + "'")
		})
		records.push (fields)
	})
	return records
}
function ajaxExecuterPaged (listado_sql_syntax,pagina,controldeerrores){
	let {_select,_insert,_delete,_count} = listado_sql_syntax
	var sqlll = "pagina="+pagina+"&regXPag="+sessionStorage['regXPag']+"&sqlCount="+_count+"&sqlDelete="+_delete+"&sqlInsert="+_insert+"&sqlSelect="+_select
		console.log(sqlll)

	var respuesta=ajaxExecuter('selectXMLpaged.asp',sqlll,controldeerrores)
	return respuesta
}
function ajaxExecuter(urllrelative,param,controldeerrores,respuestaestexto,eslogin){
	//var usu_id = $.get("DBH_ASP.asp?func=session&id=idusuario")
	if ( !eslogin && !DBH.islogged ) {$('#divacceso').fadeIn();mostrarTelon(0);return false}
	if ( typeof controldeerrores == 'undefined' ) controldeerrores = 0
	var apppath = $('#apppath',parent.parent.document).val()
	if ( typeof apppath == 'undefined' ) apppath = ''
	urll = apppath + '/' + urllrelative
	//console.log(urllrelative)
	//if ( typeof parent.parent.parent.vars != 'undefined' ) parent.parent.parent.vars.ping()
	param = param + "&controldeerrores=" + controldeerrores
	var respuesta=''
	//alert(urll)
	//alert(param)
	controldeerrores = 0 //desactivo el control de errores este pq es viejo
	if ( controldeerrores * 1 != 0  ) {
		var w = urll + "?" + param
		//window.open(w, '', 'width=500,height=400,scrollbars=no,top=250,left=250,resizable=1');
	}else{
		var dataType = 'text'
		if ( urllrelative != 'formInsert.asp' && urllrelative != 'formUpdate.asp' && urllrelative != 'deleteFile.asp' && urllrelative != 'selectSelectOptions.asp'  ) dataType = 'xml'
		//if ( urllrelative == 'sqlExecAlterDB.asp'  ) dataType = 'json'
		$.ajax({ type: "POST",
			url: urll,
			async: false,
			dataType: dataType,
			data: param,
			success : function(txt)
			{
				//respuesta = decodeURIComponent(txt);
				respuesta = txt
				//alert(txt)
			},
			error: function ( jqXHR, textStatus, errorThrown)
			{
				//console.log("textStatus: "+textStatus)
				//console.log("param: "+param)
				console.log(errorThrown)
				respuesta = errorThrown
				alerta ( "Error de SQL. ")
				/*
				$.post ( urll, param ,function( data ) {
					//console.log( data );
					//respuesta = "error"
				})
				*/
			}
		});
	}
	/*
	if ( !respuesta && 1==2 ) {
		$.post ( urll, param ,function( data ) {
			alerta ( "Error de SQL. ")
			console.log( "Data Loaded: " + data );
			return data
		})
	}
	*/
	return respuesta
}
/*
// loadXMLString(txt) recibe una cadena de texto XML y devuelve un documento XML.
function loadXMLString(txt) {
  if (window.DOMParser)
    {
    var parser=new DOMParser();
    var xmlDoc=parser.parseFromString(txt,"text/xml");
    }
  else // Internet Explorer
    {
    var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async="false";
    xmlDoc.loadXML(txt);
    }
  return xmlDoc;
}
*/
