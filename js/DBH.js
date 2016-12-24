var DBH = ( function () {
	var that = this
	this.start = function () {
		var urlparams = {};
		if (location.search) {
			var parts = location.search.substring(1).split('&');
		
			for (var i = 0; i < parts.length; i++) {
				var nv = parts[i].split('=');
				if (!nv[0]) continue;
				urlparams[nv[0]] = nv[1] || true;
			}
		}
		DBH.loaded = false
		//LOAD STYLES
		var dbhpath = $('#DBHpath').val()
		, DBHroot =  $('#DBHroot').val()
		, html = ''
		, $head = $('head')
		, $body = $('body')
		, usu_perfiles_admitidos = sessionStorage["usu_perfiles_admitidos"]
		, usu_nombre = sessionStorage["usu_nombre"]
		, usu_perfil = sessionStorage["usu_perfil"]
		, usu_id = sessionStorage["usu_id"]
		, template_title = $('#template_title').val()
		$('.cabecera-general #btnusuario').html(usu_nombre)
		$('.cabecera-general #btnversion').html($('#dbh_version').val())
		$('.cabecera-general #btntitle').html($('#template_title').val())
		$('.grupodf #usuario').val(localStorage['usuario'])
		$('.grupodf #contrasena').val(localStorage['contrasena'])
		$('.grupodf #recordarcontra')[0].checked=localStorage['recordarcontra']
		//$head.append( '<title>' + template_title + '</title>' )
		//$head.append( '<link rel="shortcut icon" href="' + DBHroot + 'favicon.ico" />' )
		if ( !urlparams.log ) $('.layout-log-container').hide()
		/*
		//$head.append( '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css">' )
		if ( ! urlparams.min ) {
			console.log('not min')//,{title:'Load Mode'})
			$head.append( '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">' )
			$head.append( '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/genericons/3.1/genericons.css">' )
			$head.append( '<link rel="stylesheet" href="http://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css">' )
			$head.append( '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/themes/default/style.min.css">' )
			$.getScript('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js')
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js')
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.0/mousetrap.min.js')
			$.getScript('https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.3/jstree.min.js')
			var csspath = ['css/main.css','css/dbh-nauj-tempstyles.css']
			var cssroot = ['jquery-simple-datetimepicker-master/jquery.simple-dtpicker.css']
			var jsspath = ["js/dbh-queryEditor.js","js/general.js","js/blockButton.js","js/inlineform.js","js/toplevelform.js","js/multistatebutton.js","js/docs.js","js/alimentador.js","js/index.js","js/listadoCuerpo.js","js/myAjax.js","js/DBH.cache.js"]
			var jssroot = ["jquery-simple-datetimepicker-master/jquery.simple-dtpicker.js"]
			$(csspath).each(function(){
				$head.append('<link rel="stylesheet" href="' + dbhpath+'/'+this + '" type="text/css" />');
			})
			$(cssroot).each(function(){
				$head.append('<link rel="stylesheet" href="' + DBHroot+'/'+this + '" type="text/css" />');
			})
			//LOAD SCRIPTS
			$(jsspath).each(function(){
				$.getScript(dbhpath+this)
			})
			$(jssroot).each(function(){
				$.getScript(DBHroot+this)
			})
		} else {
			$.getScript(DBHroot+'js/LIBRARIES.min.js')
			$.getScript(dbhpath+'js/DBH.min.js')
			$head.append( '<link rel="stylesheet" href="'+dbhpath+'css/DBH.min.css">' )
			$head.append( '<link rel="stylesheet" href="'+dbhpath+'css/03-dbh-nauj-tempstyles.css">' )
			$head.append( '<link rel="stylesheet" href="'+DBHroot+'css/LIBRARIES.min.css">' )
		}
		*/
		//CHECK IF LOGGUED
		//console.log(sessionStorage["usu_id"])
		function checkLogin() {
			if(!DBH.islogged || isNaN(sessionStorage["usu_id"]) ){
				var agent = window.navigator.userAgent.toLowerCase()
				, ischrome = ( agent.indexOf('chrome') != -1 || agent.indexOf('applewebkit') != -1 )
				, isfirefox = agent.indexOf('firefox') != -1
				if ( !ischrome && !isfirefox ) {
					$('#browsersalert button').hide()
				}
				if ( !ischrome ) { 
					$('#browsersalert').show() 
				}
				DBH.telon.$container.hide()
				$('#divacceso').show();
				//console.log(agent)
			} else {
				DBH.sessionid = usu_id + '_' + sessionStorage["sessionid"]
				localStorage["interface_usu_id"] = usu_id
				setTimeout (DBH.load().all(),0) 
				//DBH.load()
				//$('body').prepend('<input id="loaded_usu_id" type="hidden" value="'+usu_id+'">')
			}
			$('body').show()
		}
		function inittimer() {
			var pagloaded = ( ( typeof showtip != 'undefined' ) && ( typeof scrollDivision != 'undefined' ) && ( typeof preinit != 'undefined' ) && ( typeof ajaxExecuter != 'undefined' ) && ( typeof sqlExec != 'undefined' ) && $.ui && $.jstree  )
			if (pagloaded) { 			
				clearInterval(initinterval)
				var t1 = performance.now();
				DBH.consola( "Load Scripts: " + (t1 - t0) + " milliseconds.");
				DBH.telon.texto.append ('Scrips' );setTimeout (checkLogin,0) 
			}
		}
		var t0 = performance.now();
		initinterval = setInterval(function(){inittimer()},200)		
		
	};
	this.telon = {
		$container: $initCover = $('.init-cover')
		, $textContainer: $initCover = $('.init-cover').find('div')
		, areaLoad: function () {
			DBH.telon.show()
			DBH.telon.texto.append('Generando el Área...')
		}
		, show: function () {
			DBH.telon.texto.clear()
			DBH.telon.$container.show()
		}
		, hide: function () {
			DBH.telon.$container.css({'background':'rgba(41,44,58,0.8)'}).fadeOut()//.find('img').hide()
		}
		, texto: {
			append: function (txt) {
				var $initCover = DBH.telon.$textContainer
				//, secs = Math.round(milisegundos / 100) / 10
				//txt += ' (' + secs + ' seg)'
				$initCover.append('<br>'+txt)
			}
			, clear: function () {
				DBH.telon.$textContainer.html('')
			}
		}
		
	}
	this.load = function () {
		var that = this
		this.loadValores = function (grupo) {
			var t3 = performance.now();
			if ( grupo ) {
				var sql = "SELECT li1_id,des,li1_color,grupo FROM dbh_listas WHERE grupo ='"+grupo+"' ORDER BY des"
				, $grupoXml = DBH.ajax.toXml ( sql, 'li1_id' )
				, $xml = DBH.$valoresXml.find('[fieldname="grupo"][fieldvalue="'+grupo+'"]').parent()
				$xml.remove()
				DBH.$valoresXml = DBH.$valoresXml.add($grupoXml)
			} else {
				var sql = "SELECT li1_id,des,li1_color,grupo FROM dbh_listas WHERE grupo IN ( SELECT data_field_grupo FROM dbh_campos inner join dbh_areas on data_da_id = da_id WHERE data_activo = 1 and da_activa = 1 ) ORDER BY grupo,des"
				DBH.$valoresXml = DBH.ajax.toXml ( sql, 'li1_id' )
				DBH.telon.texto.append ('Valores')
			}
			var t4 = performance.now();DBH.consola( "loadXmlValores: " + (t4 - t3) + " milliseconds.")
		}
		this.all = function () {
			that.loadValores()
			setTimeout ( that.loadXmlCampos, 0 )
			setTimeout ( loadAreasArr, 0 )
		}
		function loadEnd () {
			vars.pinger()
			DBH.loaded = true
			DBH.telon.hide()
		}
		function loadTree() {
			//DBH.loadTopPestanas()
			preinit()
			DBH_help = new parent.blockButton( document.getElementById('buttonhelp') , document.getElementById('tipdiv') )
			showtip('rnd')
			var t3 = performance.now();
			DBH.tree.load();
			var t4 = performance.now();DBH.consola( "loadTree: " + (t4 - t3) + " milliseconds.")
			$('#alertaaviso').on('click','button',function(){
				DBH.avisos.setbutton()
			})
			$('#treeresizable').width($('#treeresizable').outerWidth())
			//DBH.tree.setWidth();
			var treewidth = $('.layout-tree-container').width()
			if ( treewidth < 170 ) treewidth = 170
			$('.layout-tree-container').css({width:treewidth})
			$('.botonesform').find(sessionStorage["usu_perfil"]).hide() //OCULTO BOTONES SEGÚN PERFIL
			DBH.telon.texto.append ('Árbol')
			setTimeout ( loadEnd, 0 )
		}
		function loadAreasArr () {
			var t3 = performance.now()
			, sqls = 'SELECT * FROM DBH_AREAS WHERE da_activa = 1 ORDER BY da_nivel desc,da_orderindex'
			DBH.areasSqlArr = that.ajax.select(sqls)
			var t4 = performance.now();DBH.consola( "loadAreasArr: " + (t4 - t3) + " milliseconds.")
			DBH.telon.texto.append ('Areas')
			setTimeout ( loadTree, 0 )
		}
		this.loadXmlCampos = function () {
			var t3 = performance.now();
			var sql = "SELECT " +
				"case when ((select da_tabla from DBH_AREAS where da_id = data_da_id) = left(data_field_id,charindex('.',data_field_id)-1)) then '0' else '1' end as noinsert" +
				",(select da_descripcion from DBH_AREAS where da_id = (select da_areamadre from DBH_AREAS where da_id = data_da_id)) as areamadre_name" +
				",IS_NULLABLE as is_nullable" +
				",(select cast(das_da_id as varchar) + ','  from DBH_CAMPOS_AREASAFECTANTES WHERE das_data_id = data_id FOR XML PATH ('') ) as da_ids_areasafectantes" +
				", DBH_CAMPOS.* " +
				"FROM DBH_CAMPOS inner join DBH_AREAS on data_da_id = da_id inner join INFORMATION_SCHEMA.COLUMNS " +
				"on TABLE_NAME = left(data_field_id,charindex('.',data_field_id)-1) " +
				"and COLUMN_NAME = replace(data_field_id,left(data_field_id,charindex('.',data_field_id)),'') " +
				"WHERE data_activo = 1 ANd da_activa = 1" +
				"ORDER BY 1 desc,data_orderindex" ;
			//console.log(encodeURIComponent(sql))
			DBH.$camposXml = $(sqlExec ( sql ))
			//, $camposXml = $(DBH.camposXml)
			//console.log($camposXml.find('registro').length)
			DBH.$camposXml.each ( function () {
				var $registro = $(this)
				, da_id = $registro.find ( '[fieldname="data_da_id"]' ).text()
				$registro.attr('da_id',da_id)
			})
			var t4 = performance.now();DBH.consola( "loadXmlCampos: " + (t4 - t3) + " milliseconds.")
			DBH.telon.texto.append ('Campos')
			
		}
		return this
	}
	this.logout = function () {
		sessionStorage.clear()
		$('#divacceso').fadeIn();
		//DBH.ajax.request("logout.asp")
	}
	this.login = function (userchecked){
		var usuario=$('.grupodf #usuario').val()
		, contrasena=$('.grupodf #contrasena').val()
		, perfilesarr = ''
		, idusuario = localStorage["interface_usu_id"]
		//, DBConnectionString =  $('#DBConnectionString').val()
		//console.log(DBConnectionString)
		//sessionStorage["DBConnectionString"]=DBConnectionString
		//DBH.ajax.session ('DBConnectionString',DBConnectionString,1)
		if(usuario==""||contrasena==""){alert('Introduzca Usuario y Contraseña');return false;}
		var sql = "SELECT usu_id,usu_perfil,usu_nombre,usu_perfiles_admitidos,usu_perfiles_caninsert FROM DBH_USUARIOS WHERE BINARY_CHECKSUM(usu_usuario)=BINARY_CHECKSUM('"+usuario+"') AND BINARY_CHECKSUM(usu_contrasena)=BINARY_CHECKSUM('"+contrasena+"') AND usu_estado=1"
		, res=DBH.ajax.selectlogin(sql)
		if(res.length==0){alert('Usuario no reconocido.');return false}
		//console.log(res)
		var usu = res[0]
		, usu_id=usu.usu_id
		, usu_perfil=usu.usu_perfil
		, usu_nombre=usu.usu_nombre
		, usu_perfiles_admitidos=usu.usu_perfiles_admitidos
		, usu_perfiles_caninsert=usu.usu_perfiles_caninsert
		//if (!userchecked) {DBH.login.checkuser(usu_id,DBConnectionString);return false}
		if ( usu_perfiles_caninsert ) {
			usu_perfiles_caninsert = trim(usu_perfiles_caninsert)
			usu_perfiles_caninsert = usu_perfiles_caninsert.replace(/  /g," ")
			usu_perfiles_caninsert = usu_perfiles_caninsert.replace(/ /g," .")
			usu_perfiles_caninsert = "." + usu_perfiles_caninsert
		}
			
		//console.log(usu_id)
		if(usu_perfil){
			usu_perfil = trim(usu_perfil)
			var perfilesarr = usu_perfil.replace(/\  /gi,' ')
			, perfilesarr = ('.'+usu_perfil).replace(/\ /gi,',.')
			, perfilesarr = trim(perfilesarr)
		}
		DBH.ajax.session('idusuario',usu_id)
		//DBH.ajax.session('regXPag',$('#regXPag').val())
		//DBH.ajax.session('regXPag',120)
		sessionStorage['usu_id']=usu_id
		sessionStorage['sessionid']=$('#sessionid').val()
		sessionStorage['usu_perfil']=perfilesarr
		sessionStorage['usu_perfiles_admitidos']=usu_perfiles_admitidos
		sessionStorage['usu_perfiles_caninsert']=usu_perfiles_caninsert
		sessionStorage['usu_nombre']=usu_nombre
		sessionStorage['regXPag']=$('#regXPag').val()
		//DBH.loggedUsers[usu_id]=$('#sessionid').val()
		var sqls = "UPDATE DBH_USUARIOS SET dbh_sessionid = " + sessionStorage['sessionid'] + " WHERE usu_id = " + usu_id
		DBH.ajax.sql(sqls)
		if(document.getElementById('recordarcontra').checked){
			localStorage['usuario']=usuario
			localStorage['contrasena']=contrasena
			localStorage['recordarcontra']=true
		}else{//alert('a')
			localStorage.removeItem('usuario');
			localStorage.removeItem('contrasena');
			localStorage.removeItem('recordarcontra');
			$('.grupodf #usuario').val('')
			$('.grupodf #contrasena').val('')
			//$('.grupodf #recordarcontra')[0].checked=0
		}
		//alert(DBH.loaded+"***"+(idusuario!=usu_id))
		//return false
		if(!DBH.loaded||idusuario!=usu_id){;$(window).unbind('beforeunload');location = location;return false}
		$('#divacceso').fadeOut(function(){vars.ping()})
	}	
	this.login.checkuser = function (usu_id,template_name) {
		//DBH.login(1)
		var urll = "http://www.naujcloud.com/DBH/DBHC_checkuser.php?usu_id=" + usu_id + "&template_name=" + template_name.replace("\\",'\\\\\\\\')
		//console.log(urll)
		$.ajax({
			url:urll,
			dataType: 'jsonp'
		});
	}
	this.login.checkuser_response = function (res) {
		//console.log(res)
		//alert( !(res*1) )
		if( !(res*1) ) { alert('Este usuario no está activado en el proveedor');DBH.logout(); return false } else {DBH.login(1)}
		//DBH.islogged = res
		//alert(res)
		
	}
	this.html = ( function () {
		this.print = function (html) {
//			console.log(html)
			var win = window.open('')
			, $body = $(win.document).find('body')
			$body.append(html)
		}
		return this

	}());
	this.ajax = ( function () {
		var that = this
		this.selectToXml = function (sql,eslogin) {
			var pars = "sql=" + encodeURIComponent(sql) + (eslogin ? '&db=login' : '')  
			//console.log(pars)
			var res = DBH.ajax.request('selectXML_new.asp',pars)
			var r = $(res)
			//console.log(res)
			return r
		}
		this.toXml = function (sql,pkname) {
			var oldXml = that.selectToXml(sql)
			, $oldXml = $(oldXml)
			, $newXml = $('<lines/>')
			$oldXml.find('registro').each ( function () {
				var $rec = $(this)
				, $fields = $rec.children().not('[fieldname="'+pkname+'"]')
				, id = $rec.find('[fieldname="'+pkname+'"]').text()
				console.assert ( !isNaN(id), 'DBH.ajax.toXml: ' + pkname + ' no ha sido suministrada en la Select: ' + sql )
				$fields.each ( function () {
					var $field = $(this)
					$field.attr('fieldvalue',$field.text())
				})
				var $line = $('<line/>').attr ( 'id' , id ).append ($fields)
				$newXml.append($line)
			})
			return $newXml
		}
		this.toRows = function (sql,pkname) {
			var oldXml = that.selectToXml(sql)
			, $oldXml = $(oldXml)
			, $newXml = $('<table/>').attr('data-idFieldName',pkname)
			$oldXml.find('registro').each ( function () {
				var $rec = $(this)
				, $fields = $rec.children()//.not('[fieldname="'+pkname+'"]')
				, id = $rec.find('[fieldname="'+pkname+'"]').text()
				, $tr = $('<tr/>').attr ( 'data-id' , id )
				console.assert ( !isNaN(id), 'DBH.ajax.toXml: ' + pkname + ' no ha sido suministrada en la Select: ' + sql )
				$fields.each ( function () {
					var $field = $(this)
					, $td = $( '<td/>' ).attr('data-field-name',$field.attr('fieldname')).attr('data-field-value',$field.text()).text($field.text())
					$tr.append($td)
					//$field.attr('fieldvalue',$field.text())
				})
				$newXml.append($tr)
			})
			return $newXml.find('tr')
		}
		this.xmlToObject = function (xml,withlinefeeds){
			var records = []
			//console.log($(xml).find('registro').length)
			$(xml).find('registro').each(function(recnum){
				var $rec = $(this).find('*')
				, fields = {}
				$rec.each(function(fieldnum){
					var $field = $(this)
					, fieldname = $field.attr('fieldname')
					, fieldname = fieldname ? fieldname : 'propiedad' + fieldnum
					, regexp10 = new RegExp ( String.fromCharCode(10), "gi" )
					, regexp13 = new RegExp ( String.fromCharCode(13), "gi" )
					, fieldvalue = $field.text()
					, fieldvalue = withlinefeeds ? fieldvalue : fieldvalue.replace(regexp10,"").replace(regexp13,"")//.replace(/\'/g,"'''")
					, fieldarr = [fieldname,fieldvalue]
					//eval("fields." + fieldname + "='" + fieldvalue + "'")
					eval("fields." + fieldname + "=fieldvalue")
				})
				records.push (fields)
			})
			//console.log(records)
			return records
			
		}
		this.selectlogin = function ( sql ){
			var r1 = that.selectToXml ( sql,true )
			return that.xmlToObject(r1)
		}
		this.select = function ( sql, withlinefeeds ){
			var r1 = that.selectToXml ( sql )
			, arr = that.xmlToObject(r1,withlinefeeds)
			//console.log(arr)
			return arr
		}
		this.insert = function ( requestStr ){
			var res = that.sql(requestStr,'insert')
			if (!res) return false
//			console.log(res)
			var $res = $(res)
			var id = $res.find('respuesta').text()
			//console.log(id)
			return id
		}
		this.update = function ( requestStr ){
//			console.log('aa')
			return that.sql(requestStr,'update')
			
		}
		this.valor = function (sql) {
			var recs = that.select (sql)
			//console.log(recs)
			if (!recs.length ) return false
			var propname = Object.keys(recs[0])[0]
			, val = eval("recs[0]."+propname)
			//, val = unescape($res.find('respuesta').text())
			//console.log(res)
			//console.log(val)
			return val
		}
		this.session = function (session,val,isapp) {
			if(isapp){var func="application"}else{var func="session"}
			var rstr = "DBH_ASP.asp?func="+func+"&id="+session+"&val="+(val?val:'')
			, res = DBH.ajax.request(rstr)
			return res
		}
		this.application = function (app,val) {
			return that.session(app,val,true)
		}
		this.sql = function ( sql, operacion, msg2147217900 ){
			if (!msg2147217900) msg2147217900 = 'Error en sentencia SQL'
			if (!operacion || operacion == 'custom' ) {
				var res = that.request( 'DBH_SQL.asp','DBH_sql='+encodeURIComponent(sql) )
//				console.log(sql)
			}
			if ( operacion == 'insert' ) { //'sql' is the request String in this case.
				var param = sql + '&DBH_operacion=insert&DBH_da_id=' + DBH.area().id
				,res = that.request( 'DBH_SQL.asp',param)
				, $res = $(res)
				//console.log(res)
				if ( $res.find('precondicion').length > 0 ) { 
					// PRECONDICIONES INCLUMPLIDAS
					var msg = ""
					$res.find('precondicion').each(function(){
						var $pcon = $(this)
						, pc_id = $pcon.find(pc_id).text()
						, pc_nombre = $pcon.find('pc_nombre').text()
						, pc_descripcion = $pcon.find('pc_descripcion').text()
						msg += '<span style="text-transform:uppercase;">' + pc_nombre + '</span><br><span style="white-space:normal">' + pc_descripcion + '</span>'
					})
					alerta (msg)
					return false
				}
				//console.log(param)
			}
			if ( operacion == 'update' ) {
				var param = sql + '&DBH_operacion=update&DBH_da_id=' + DBH.area().id
//				console.log(param)
				,res = that.request( 'DBH_SQL.asp',param)
				, $res = $(res)
				if ( $res.find('precondicion').length > 0 ) { 
					// PRECONDICIONES INCLUMPLIDAS
					var msg = ""
					$res.find('precondicion').each(function(){
						var $pcon = $(this)
						, pc_id = $pcon.find('pc_id').text()
						, pc_nombre = $pcon.find('pc_nombre').text()
						, pc_descripcion = $pcon.find('pc_descripcion').text()
						, msge = '<span style="text-transform:uppercase;">' + pc_nombre + '</span><br><span style="white-space:normal">' + pc_descripcion + '</span><br>'
						msg += msge
						//console.log(msge)
					})
					alerta (msg)
					return false
				}
			}
			if (!res) return false
			var $res = $(res)
			, errnum = $res.find('errnum').text()
			, errdesc = unescape($res.find('errdesc').text())
			, requeststr = unescape($res.find('requeststr').text())
			, sql = unescape($res.find('sql').text())
			, respuesta = unescape($res.find('respuesta').text())
			if ( errnum == -2147217900 ) {
				alerta( msg2147217900,'red' );
			}else if ( errnum == -2147217913 ) {
				alerta( "Tipo de datos no válido" );
			} else if ( errnum != 0 ) {
				alerta("Error de escritura",'red' );
			}
			if (errnum!=0) {
				console.log(sql);
				console.log(errnum);
				console.log(errdesc);
//				console.log(sql);
				return false
			}
			if ( operacion == 'update' ) {
				var $camposform = DBH.area().topform.$camposform
				$camposform.prop('oldValue',$camposform.val())
			}
			return $res
		}
		this.request = function (urllrelative,param){
			//var islogged = $.get("DBH_ASP.asp?func=session&id=idusuario") 
			//if (!DBH.islogged) {;mostrarTelon(0);$('#divacceso').fadeIn();return false}
			//console.log(param)
			var apppath = $('#apppath',parent.parent.document).val()
			, apppath = apppath ? apppath : ''
			, urll = apppath + '/' + urllrelative
			, respuesta=''
			, dataType = 'text'
			, res = $.ajax({ type: "POST",   
				url: urll,   
				async: false,
				dataType: dataType,
				data: param,
				success : function(txt)
				{
					return txt
					console.log(txt)
				},
				error: function ( jqXHR, textStatus, errorThrown)
				{
					console.log("urllrelative: "+urllrelative)
					console.log("param: "+param)
					console.log("textStatus: "+textStatus)
					console.log("errorThrown: "+errorThrown)
					alerta ( "Error Ajax Request. ")
					return false
				}
			}); 
			return res.responseText
		}
		return this;
	}());
	this.area = function(name){
			//Si el area no se ha inicializado el container no existe aún, por eso uso la pestaña para obtener el da_id.
			if(name && typeof name != 'undefined' && name != 'undefined' && isNaN(name) ){
				var name = name ? name.toLowerCase() : 0
				, $pestana =  $('#treemenu li[name="'+name+'"]')
				//, $pestana =  $('#menuPrincipal .menu1Opcion[name="'+name+'"]')
				, selector = '[name="'+name+'"]'
			} else if ( !isNaN(name) ) {
				var $pestana =  $('#treemenu li[da_id="'+name+'"]')
				//, $pestana =  $('#menuPrincipal .menu1Opcion[da_id="'+name+'"]')
				, selector = '[da_id="'+name+'"]'
			} else {
				var $pestana =  $('#treemenu li[aria-selected="true"]')
				//, $pestana =  $('#menuPrincipal .menu1OpcionSeleccionada')
				, selector = ':visible'
			}
//			console.log($pestana.length)
			if(!$pestana.length){alerta("DBH.area(): No existe el área con nombre '" + name + "'" );return false}
			var nombre = $pestana.attr('name')
			//console.log('a'+nombre)
			DBH.area_obj.name = nombre
			DBH.area_obj.pestana = $pestana
			DBH.area_obj.id = $pestana.attr('da_id')
			DBH.area_obj.pkname = $pestana.attr('pkname')
			return area_obj
	}
	this.area_obj = new function () {
		var that = this
		this.setvalues = function (pararr) {
//			console.log(pararr)
			var topformCleared = that.topform.clear()
			if ( !topformCleared ) {
				return false;
			}
			var $container = that.container
			if (!$container.length) {
				alerta ( 'Se ha llamado a area.setvalues() antes de inicializar el area.','red')
				return false
			}
			$(pararr).each(function(){
				var par = this
				, fieldid = par[0]
				, fieldvalue = par[1]
				, $field = $container.find('[id="'+fieldid+'"]')
				$field.val(fieldvalue)
				setTextareaHeight($field)
			})
			return that
		}
		this.setButtons = function () {
			var recsid = DBH.area().recsid
			if(recsid.length){
				$('#divbotonesprincipalesserie').find('button').add('.req-serie').prop('disabled',false)
			} else {
				$('#divbotonesprincipalesserie').find('button').add('.req-serie').prop('disabled',true)
			}
			/*
			var selectinvertida = $('.listadoCuerpoContainer:visible').data('selectinvertida')
			if ( selectinvertida ) {
				$('#selectinvertida').addClass ('color-tomato')
			} else {
				$('#selectinvertida').removeClass ('color-tomato')
			}
			*/
		}
		Object.defineProperties(that, {
			"loaded": {
				get: function(){
					return $('.formCuerpo[da_id="'+that.id+'"]').length
				}
			},
			"container": {
				get: function(){
					/*
					var name = that.name
					var selector = '[name="'+name+'"]'
					var $cont = $('.formCuerpo'+selector).add('[id="iframeFormCabecera"]')//.add('div.botones_principales:visible')
					*/
					var $cont = that.formContainer//.add('[id="iframeFormCabecera"]')//.add('div.botones_principales:visible')
					return $cont
				}
			},
			"formContainer": {
				get: function(){
					var name = that.name
					var selector = '[name="'+name+'"]'
					var $cont = $('.formCuerpo'+selector)
					return $cont
				}
			},
			"topform": {
				get: function(){
					var name = that.name
					/*
					if (name){
						var $topform = $('.formCuerpo[name="'+name+'"]')
					} else {
						var $topform = $('.formCuerpo:visible')
					}
					*/
//					console.log(name)
					var $topform = $('.formCuerpo[name="'+name+'"]')
					var topform = $topform.data('topform')
					return topform 
				}
			},
			"recid": {
				get: function(){
					var name = that.name
					/*
					if (name){
						var $topform = $('.formCuerpo[name="'+name+'"]')
					} else {
						var $topform = $('.formCuerpo:visible')
					}
					*/
//					console.log(name)
					var pkname = that.pkname
					, recid = that.container.find('[id="'+pkname+'"]').val()
					return recid
				}
			},
			"recsid": {
				get: function(){
					//var ci = that.checkedids
					var ci = that.formContainer.data('checkedids')
//					console.log(ci)
					, ci = !ci ? [] : ci.slice()//.split(",")
					, recid = that.recid
					if(recid && recid != '' && ci.indexOf(recid)==-1 ) ci.push(recid)
					//console.log(ci)
					return ci
				}
			},
			"redactor": {
				get: function(){
					//var ci = that.checkedids
					var ci = that.formContainer.find('.dbh_redactor_consultas')
					return ci.val()
				},
				set: function(txt){
					//var ci = that.checkedids
					var ci = that.formContainer.find('.dbh_redactor_consultas')
					ci.val(txt)
					return true
				}
			},
			"unsaved": {
				get: function(){
					return that.topform.unsaved
				},
				set: function(val){
					that.topform.unsaved = val
					var $savebutton = $('.form-toolbar[da_id="'+that.id+'"] .toolbar-button-save')
					if ( val ) {
						$savebutton.addClass('unsaved')
					} else {
						$savebutton.removeClass('unsaved')
					}
					return true
				}
			},
			"checkedids": {
				get: function(){
					var ids = that.formContainer.data('checkedids')
					//console.log(ids)
					, ids = ids ? ids : []
					//console.log(ids.length)
					return ids
				},
				set: function(ids){
					that.formContainer.data('checkedids',ids)
					return ids
				}
			}
		});
		this.childAreas = function (name) {
			if(name){
				var name = name ? name.toLowerCase() : 0
				, $pestana =  that.container.find('.divinlineform[title="'+name+'"]')
			}
			DBH.childAreas_obj.name = name
			DBH.childAreas_obj.pestana = $pestana
			DBH.childAreas_obj.id = $pestana.attr('da_id')
			DBH.childAreas_obj.pkname = $pestana.attr('pkname')
			return childAreas_obj
		}
		this.childAreas_obj = function () {
			var that = this
			return this
		}
		this.go = function () {//alert('aa')
			$('#divnombreusuariogeneral').find('div[id="nombrearea"]').remove()
			$('#divnombreusuariogeneral').append('<div id="nombrearea" style="float:none;margin:-1px 0 0 0;font-weight:inherit;font-size:inherit;color:inherit">'+that.name+'</div>')
			$('#treemenu').jstree('deselect_all').jstree('select_node', $('#treemenu li[da_id="'+that.id+'"]').attr('id'))
			//if ( stopReset ) switchiframes_real.stopReset = 1
			switchiframes_real(that.pestana);

			cabezar();
			ajustarAnchoEncabezados();
			scrollEventHandler($('#divlist')[0]);

			return that;
		}
		this.filter = function (bypass) {
			that.topform.filter_real(bypass)
			return that
		}
		return this
	}
	this.aviso = function (idaviso) {
		if(isNaN(idaviso)) {
			idaviso = $(idaviso).closest('[avi_id]').attr('avi_id')
		}
		if (idaviso) that.aviso_obj.id = idaviso;
		return that.aviso_obj;
	}
	this.aviso_obj = new function () {
		var that = this
		this.go = function () {
			var da_id = $('#treemenu li[name="dbh-acciones"]').attr('da_id')
			//console.log(da_id+'**'+that.id)
			DBH.gorecord(da_id,that.id)
			return that
		}
		this.posponer = function (minutos) {
			var sqls = "UPDATE dbh_avisos SET avi_fecha = DATEADD(minute,"+minutos+",getdate()), avi_alertado=0 WHERE avi_id = " + that.id
			console.log(sqls)
			DBH.ajax.sql(sqls)
			alerta ( "Tarea pospuesta " + minutos + " minutos." , 1 )
			return that
		}
		this.desactivar = function () {
			var sqls = "UPDATE dbh_avisos SET avi_accion = 0 WHERE avi_id = " + that.id
			DBH.ajax.sql(sqls)
			return that
		}
		this.save = function (fecha) {
			var sqls = "UPDATE dbh_avisos SET avi_fecha = '" + fecha + "', avi_alertado=0 WHERE avi_id = " + that.id
			DBH.ajax.sql(sqls)
			return that
		}
		this.alertar = function () {
			var $container = $('#alertaaviso')
			var sqls = "SELECT avi_id,avi_etiqueta,avi_texto,avi_fecha,avi_da_id,avi_pkvalue FROM dbh_avisos WHERE avi_id = " + that.id
			, recs = DBH.ajax.select(sqls,'withLineFeeds')
			//console.log(recs[0])
			if ( !recs ) {alerta('DBH.aviso.alert(): Ningún aviso tiene el ID "' + that.id + '"');return false}
			var etiqueta = recs[0].avi_etiqueta
			, avi_id = recs[0].avi_id
			, da_id = recs[0].avi_da_id
			, pkvalue = recs[0].avi_pkvalue
			, texto = recs[0].avi_texto
			, fecha = recs[0].avi_fecha
			, fecha = fecha.length > 16 ? fecha.substring(0,16) :  fecha
			, divtext = "<br><b><a style='color:#32AB9F' href='javascript:;' title='Click para ir al registro vinculado' onclick='DBH.gorecord("+da_id+","+pkvalue+")'>" + etiqueta + "</a></b><br><pre style='white-space:pre-wrap;'>" + texto + "</pre>"
			, $input = $container.find('.info input')
			, $texto = $container.find('.info .textcontainer')
			$texto.html(divtext)
			$input.val(fecha)
			DBH.date().setcolor($input)
			var $clone = $('[id="alertaaviso"][avi_id="'+avi_id+'"]')
			if ( !$clone.length ) {
				var $clone = $container.clone().attr('avi_id',avi_id).attr('da_id',da_id)
				$container.after($clone)
			} 
			//$clone.show().addClass('zoomedin')
			if (!$clone.is(':visible')){
				$clone.css({ 'zoom': 0.00000001 }).show()
				$clone.animate({ 'zoom': 1 }, 'slow');
			}
			
			return that
		}
		this.olvidar = function () {
			var sqls = "UPDATE dbh_avisos SET avi_alertado = 1 WHERE  avi_id = " + that.id
			, recs = DBH.ajax.sql(sqls)
			alerta ( "Tarea marcada como avisada." , 1 )
		}
		return this;
	}
	this.avisos = {}
	this.avisos.gorecord = function () { //va al registro relacionado con el aviso seleccionado en el area avisos.
		var $con=DBH.area().container
		, areaid = $con.find('[id="dbh_avisos.avi_da_id"]').val()
		, recid = $con.find('[id="dbh_avisos.avi_pkvalue"]').val()
		if ( !recid || !areaid ) { alerta('Este aviso no está relacionado con un registro.'); return false; }
		DBH.gorecord(areaid,recid)
	}
	this.avisos.show = function () { //Muestra los avisos activados.
		var par = [['dbh_avisos.avi_accion','1'],['dbh_avisos.iduc',sessionStorage['usu_id']]]
		DBH.area('dbh-acciones').go().setvalues (par).filter()
	}
	this.avisos.setbutton = function (force) {
		if(!force){
			var areaname = DBH.area().name
//			console.log(areaname)
			if(areaname!='dbh-acciones')return false
		}
		var sqls = "SELECT min(avi_fecha) as fechamin, max(avi_fecha) as fechamax, count(avi_id) as count FROM dbh_avisos where iduc = " + sessionStorage['usu_id'] + " AND avi_accion = 1"
		, res = DBH.ajax.select (sqls)
		, $boton = $('#avisosgeneral')
		if (!res) {
			var txt = "0"
			, tit = "0 avisos\n - "
		} else {
			var rec = res[0]
			, fechamin = rec.fechamin
			, fechamax = rec.fechamax
			, count = rec.count
			, txt = count
			, tit = count + " avisos\n" + fechamin + " - " + fechamax
			, fecha = fechamin.substr(0,10)
			//console.log(fecha)
			$boton.html(fecha)
			DBH.date().setcolor($boton)
		}
		$boton.html(txt).attr('title',tit)
//		console.log(fecha)
//		console.log($boton)
	}
	this.historico = {}
	this.historico.gorecord = function () {
		var $con=DBH.area().container
		, areaid = $con.find('[id="dbh_historico.his_da_id"]').val()
		, recid = $con.find('[id="dbh_historico.his_pkvalue"]').val()
		DBH.gorecord(areaid,recid)
	}
	this.comentarios = {}
	this.comentarios.gorecord = function () {
		var $con=DBH.area().container
		, areaid = $con.find('[id="dbh_comentarios.cc_da_id"]').val()
		, recid = $con.find('[id="dbh_comentarios.cc_pkvalue"]').val()
		DBH.gorecord(areaid,recid)
	}
	this.documentos = {}
	this.documentos.gorecord = function () {
		var $con=DBH.area().container
		, areaid = $con.find('[id="dbh_documentos.doc_da_id"]').val()
		, recid = $con.find('[id="dbh_documentos.doc_pkvalue"]').val()
		DBH.gorecord(areaid,recid)
	}
	this.gorecord = function (areaid,recid,timer) {
//		console.log('#treemenu li[da_id="'+areaid+'"]')
//return false
		var areahabilitada = $('#treemenu li[da_id="'+areaid+'"]').length
		if(!areahabilitada){alert('Su usuario no tiene permiso para acceder a este área.');return false}
		var sqls = "SELECT * FROM DBH_AREAS WHERE da_id = " + areaid
		, res = DBH.ajax.select ( sqls )
		if ( !res ) { alerta ( 'DBH.area.gorecord(): ' + da_id + ' no es un id de área válido.' ); return false }
		//alert('a')
		
		if(!timer && !$('.formCuerpo[da_id="'+areaid+'"]').length ) {
			DBH.telon.areaLoad()
			//DBH.telon.texto.append('Generando el Área...')
			//$('#divteloninit').show()
			setTimeout (function(){DBH.gorecord(areaid,recid,1)},50)
			return false
		}
		
		var record = res[0]
		, da_nivel = record.da_nivel
		, da_id = record.da_id
		, da_areamadreid = record.da_areamadre
		, name = record.da_descripcion
		, pkname = record.da_pkfield
		, pkname = pkname.substring(pkname.indexOf(".")+1)
		, fkname = record.da_fkfield
		, pktabla = record.da_pktabla.toLowerCase()
		if (da_nivel == 2 ) {
			var sqls = "SELECT * FROM DBH_AREAS WHERE da_id = " + da_areamadreid
			, res = DBH.ajax.select ( sqls )
			, record = res[0]
			, parentname = record.da_descripcion.toLowerCase()
			, da_id = record.da_id
			if(recid){
				var sqls = "(SELECT " + fkname + " FROM " + pktabla + " WHERE " + pkname + "=" + recid + ")"
				, recid = DBH.ajax.valor(sqls)
				, area = DBH.area(parentname).go()
				, condition = area.pkname + "=" + sqls
			}
		} else {
			var condition = pkname + "=" + recid
			, parentname = name
		}
		parentname = parentname.toLowerCase()
		if(recid){
			//console.log(parentname)
			var pars = [['dbh_redactor_consultas',condition]]
			//, area = DBH.area(parentname).go().setvalues(pars).filter()
			DBH.gorecord(da_id,undefined,1)
			var area = DBH.area()
			area.setvalues(pars).filter()
			area.topform.load(recid)
			//$('h4.blockbutton:visible:first-child').data('blockbutton').abrir()
			//area
		} else {
			var area = DBH.area(parentname).go()
		}
		if(da_nivel==2){
			setTimeout(function(){
				var str = 'button.pestanas[title="'+name.toLowerCase()+'"]:visible'
				console.log(str)
				, $pestana = $(str)
				console.log($pestana.length)
				$pestana.trigger('click')
			},100)
		}
		DBH.telon.hide()
		//$('#divteloninit').hide()
	}
	this.callbacks = {}
	this.callbacks.area = {}
	this.date = function (fecha) {
		var that = this
		if ( typeof fecha == 'undefined' ) {
			var fecha = new Date()
			DBH.date_obj.date = false
		}
		if ( typeof fecha == 'string' ) {
			if ( fecha == '' || ! esFechaYHoraValida ( fecha ) ) { return false }
			//if ( ! esFechaYHoraValida ( fecha ) ) { alerta ( 'DBH.date(): "' + fecha + '" no es una fecha válida.' );return false }
			var horaarr = fecha.length>=16?fecha.split(" ")[1].split(":"):[0,0]
			, fechaarr = fecha.split(" ")[0].split("/")
			,day = fechaarr[0]
			,month = fechaarr[1]-1
			,year = fechaarr[2]
			,hour = horaarr[0]
			,minute = horaarr[1]
			var fecha = new Date(year,month,day,hour,minute,0,0)
			DBH.date_obj.date = fecha
		}
		this.setcolor = function ($campos){
			date_obj.setcolor($campos)
		}
		return date_obj
	}
	
	this.date_obj = new function () {
		var that = this
		that.setcolor = function ($campos,unset) {
			//console.log($campos)
			$campos.each(function(){
				var $campo = $(this)
				, iscolor = $campo.hasClass('dbh_fecha_color')
				//console.log(iscolor)
				if(iscolor){
					var fecha = (($campo.prop('tagName') == 'TEXTAREA') || ($campo.prop('tagName') == 'SELECT') || ($campo.prop('tagName') == 'INPUT')) ? $campo.val() : $campo.html()
//					console.log(fecha)
					if(unset || !fecha || trim(fecha) == '' ){
						var bg = ''
						, fg = ''
					}else{
						var fecha = trim(fecha.toString())
						, actualbgc = $campo.css('background-color')
						, actualcolor = $campo.css('color')
						DBH.date(fecha).date
						, colores = that.colores()
						, fg = colores.fg
						, bg = colores.bg
					}
					//console.log(fecha)
					$campo.css({
						'background-color':bg ? bg : ''
						,'color':fg ? fg : ''
					})
				}
			})
				
		}
		this.colores = function () {
			if(!that.date)return false
			var date = that.date
			, now = new Date()
			, ms = date - now
			, days = ms / 1000 / 60 / 60 / 24
			, index = days
			, index = index > 45 ? 45 : index
			, index = index < -30 ? -30 : index
			, interval = index//30 - index //255/index
			//console.log(index)
			//console.log(interval)
			if ( interval >= 30 ) {
				var red = (interval-30) * 17
				, green = 255
				, blue = (interval-30) * 17
			} 
			if ( interval < 30 && interval >= 15 ) {
				var red = (30-interval) * 17
				, green = 255
				, blue = 0
			} 
			if ( interval < 15 && interval >=0 ){
				var red = 255
				, green = interval * 17
				, blue = 0
			}
			if ( interval < 0  ){
				var red = (interval+15) * 17
				, green = 0
				, blue = 0
			}
			var bgcolor = 'rgba('+Math.round(red)+','+Math.round(green)+','+Math.round(blue)+',0.6)'
			, complementario = 'rgb('+Math.round(255-red)+','+Math.round(255-green)+','+Math.round(255-blue)+')'
			, obj = {bg:bgcolor,fg:complementario}
			//console.log(date)
			//console.log(color)
			return obj
		}
		return this
	}
	this.readonly = function(field){
		//console.log(field)
		var $field = field ? $(field) : $(this)
		, isreadonly = $field.data('noinsert') == '1'
//		console.log($field.data('noinsert'))
		return isreadonly;
	}
	this.data = function (id) {
		return sessionStorage[id]
	}
	this.printhtml = function (fieldid,button) {
		if ( typeof button != 'undefined' ) {
			var html = $(button).closest('.lineamodelo').find('[id="' + fieldid + '"]').val()
		} else {
			var html = $('[id="' + fieldid + '"]').val()
		}
		DBH.html.print(html)
	}
	this.loadTopPestanas = function loadTopPestanas(){
		console.log('loadTopPestanas NO DEBE EJECUTARSE!')
		var sql = "SELECT (select a.da_id from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_id_madre,(select a.da_descripcion from DBH_AREAS as a where a.da_id = b.da_areamadre ) as namemadre,(select cast(da_id as char) + ',' from DBH_AREAS as a where b.da_id = a.da_areamadre AND a.da_nivel = 1 AND a.da_activa=1 FOR XML PATH ('') ) as da_ids_hijas,(select cast(da_descripcion as char) + ',' from DBH_AREAS as a where b.da_id = a.da_areamadre AND a.da_nivel = 1 AND a.da_activa=1 FOR XML PATH ('') ) as da_nombre_hijas,* FROM DBH_AREAS as b WHERE ( da_areamadre is null or da_nivel = 1 ) and da_activa = 1 order by da_orderindex" 
		//console.log(DBH.ajax.select)
		//, records = DBH.ajax.select (sql)
		//return false
		, r = sqlExec (sql)
		, nopestanas = $(r).length
		, ancho = 100/nopestanas + '%'
		//, ancho = 'auto'
		$(r).each ( function () {
			var da_descripcion = $(this).find('[fieldname="da_descripcion"]').text().toLowerCase() 
			, da_perfiles = $(this).find('[fieldname="da_perfiles"]').text().toLowerCase() 
			, da_pkfield = $(this).find('[fieldname="da_pkfield"]').text().toLowerCase() 
			, da_fkfield = $(this).find('[fieldname="da_fkfield"]').text().toLowerCase() 
			, da_nivel = $(this).find('[fieldname="da_nivel"]').text().toLowerCase() 
			, da_areamadre = $(this).find('[fieldname="da_areamadre"]').text().toLowerCase() 
			, vinculada_fkname = da_fkfield.substring(da_fkfield.indexOf('.')+1)
			, vinculada_madre_name = $(this).find('[fieldname="namemadre"]').text()
			, $tempfield = $('<div class="'+da_perfiles+'"/>')
			, config_usu_perfil = sessionStorage["usu_perfil"]//$(document).data('')
			, da_id = $(this).find('[fieldname="da_id"]').text().toLowerCase() 
			, $pestana = $('<div class="menu1Opcion" style="padding-top:8px;min-height: 30px;overflow:hidden;text-align:center;box-sizing:border-box;width:auto" id="div_opcionClientes" da_nivel="' + da_nivel + '" da_areamadre="' + da_areamadre + '" fkname="' + da_fkfield + '" name="' + da_descripcion + '" pkname="'+da_pkfield.split(".")[1] + '" da_id="'+da_id+'" >' + (vinculada_fkname?'&nbsp;&nbsp;&nbsp;':'') + da_descripcion + '</div>')
			
			$pestana.on('click',function(){switchiframes (this)})
			if ( vinculada_fkname ) $pestana.prepend ( $('<div style="position:absolute;margin:-8px 0 0 -15px;transform:rotate(0deg)" class="genericon genericon-link" title="Vinculada con ' + vinculada_madre_name + '"></div>') )
			if ( ! $tempfield.is ( config_usu_perfil ) ) $('#menuPrincipal').append($pestana)
		})
		$('#menuPrincipal').css({
			//'white-space':'nowrap'
			//,'background':'red'
			width:'calc(100% - 350px)'
		})
		var $pest = $('[id="div_opcionClientes"]')
		$pest.each(function(){
			var $pes = $(this)
			$pes.css({
				//'white-space':'nowrap'
				//,'background':'red'
				'max-width':$pes.outerWidth()
				,'width':ancho
			})
		})
		
	}
	this.tree  = {}
	this.tree.load = function () {
		var $ul = $('<ul/>')//.addClass('jstree-children').attr('role','group')
		, $li = $('<li/>').attr('style','white-space:noblank')//.attr('role','treeitem')//.attr('data-jstree','{"selected" : true}')
		, das_madres = []
		, $treemenu = $('#treemenu')
		//, sqls = 'SELECT * FROM DBH_AREAS WHERE da_activa = 1 ORDER BY da_nivel desc,da_orderindex'
		, areas = DBH.areasSqlArr
		//, sqls = 'SELECT * FROM DBH_AREAS WHERE da_activa = 1 AND da_areamadre  is null ORDER BY da_orderindex'
		//, recs = that.ajax.select(sqls)
		var recs = areas.filter(function( obj ) {
			return ( obj.da_areamadre == '' && obj.da_nivel == '1' )
		});	
		$(recs).each(function(){
			var rec = this
			, nombre = rec.da_descripcion
			, da_id = rec.da_id
			, pkname = rec.da_pkfield
			//console.log('da_id'+da_id)
			, $clone = $ul.clone()//.attr('da_id',da_id)
			, da_perfiles = rec.da_perfiles
			, $tempfield = $('<div class="'+da_perfiles+'"/>')
			//console.log("da_perfiles:"+da_perfiles)
			//console.log("usu_perfil:"+sessionStorage["usu_perfil"])
			if ( ! $tempfield.is ( sessionStorage["usu_perfil"] ) ) {
				$clone.append ( $li.clone(true).attr('title',nombre).attr('name',nombre.toLowerCase()).attr('id',da_id).attr('da_id',da_id).attr('pkname',pkname.split(".")[1].toLowerCase()).html('<span class="">'+nombre.replace("DBH-","")+'</span>').append('<ul/>').attr('data-jstree','{"icon":"fa fa-database"}' ) )
				$treemenu.append ( $clone )
				das_madres.push(da_id)
			}
			//, idmadre = rec.da_areamadre
			
		})
		//console.log(das_madres)
		do {
			//var sqls = 'SELECT * FROM DBH_AREAS WHERE da_activa = 1 AND da_areamadre  IN (' + das_madres + ') ORDER BY da_nivel desc,da_orderindex'
			//console.log(sqls)
			//, recs = that.ajax.select(sqls)
			var recs = areas.filter(function( obj ) {
				//console.log(obj.da_areamadre)
				return ( das_madres.indexOf ( obj.da_areamadre ) != -1 )
			});	
			var das_madres = []
				//console.log(das_madres)
			$(recs).each(function(){
				var rec = this
				, nombre = rec.da_descripcion
				, da_id = rec.da_id
				, da_areamadre = rec.da_areamadre
				, pkname = rec.da_pkfield
				, da_descripcion = rec.da_descripcion
				, da_nivel = rec.da_nivel
				, $clone = $li.clone().attr('title',nombre).attr('name',nombre.toLowerCase()).attr('id',da_id).attr('da_id',da_id).attr('da_nivel',da_nivel).attr('pkname',pkname.split(".")[1].toLowerCase()).html('<span>'+nombre.replace("DBM-","")+'</span>').append('<ul/>')
				if ( da_nivel == 1 ) {
					//$clone.attr('data-jstree','{"icon":"//jstree.com/tree.png"}' )
					$clone.attr('data-jstree','{"icon":"fa fa-database"}' )//.find( 'span').addClass('color-blue')
				} else {
					$clone.attr('data-jstree','{"icon":"fa fa-bars"}' )
					//$clone.find('i').hide()
				}
				$treemenu.find('li[da_id="'+da_areamadre+'"]>ul').append ( $clone )
				das_madres.push(da_id)
			})
		} while ( das_madres.length )
		var $nodos = $treemenu.find('li')
		, $select = $('.toolbar-select-multirec-navegacion')
		$nodos.each ( function () {
			var $nodo = $(this)
			, da_id = $nodo.attr('da_id')
			, name = $nodo.attr('title')
			, pkname = $nodo.attr('pkname')
			//$nodo.attr('name',name).attr('pkname',pkname)
			//if ( name.indexOf('DBH-') != -1 )  $nodo.attr('data-jstree','{"icon":"fa fa-database"}' )
			if ( name == "[VALORES]" || name == "[AREAS]" || name == "[CAMPOS]" ) {
				var clase = "fa fa-cogs"
			}
			//$nodo.attr('title',name).attr('id',da_id)
			if ( name == "DBH-Importador" ) var clase = "fa fa-file-excel-o"
			if ( name == "DBH-Usuarios" ) var clase = "fa fa-user"
			if ( name == "DBH-Vistas" ) var clase = "fa fa-binoculars"
			if ( name == "DBH-Comunicaciones" ) var clase = "fa fa-envelope-o"
			if ( name == "DBM-Comunicaciones agrupadas" ) var clase = "fa fa-paper-plane-o"
			if ( name == "DBH-Acciones" ) {
				var $option = $('<option/>').val ( "$('#iframeFormCuerpo').data('topform').DBH('avi_pkvalue')" ).text('Acciones')
				, clase = 'fa fa-bolt'
			}
			if ( name == "DBH-Comentarios" ) {
				var $option = $('<option/>').val ( "$('#iframeFormCuerpo').data('topform').DBH('cc_pkvalue')" ).text('Comentarios')
				, clase = 'fa fa-commenting-o'
			}
			if ( name == "DBH-Documentos" ) {
				var $option = $('<option/>').val ( "$('#iframeFormCuerpo').data('topform').DBH('doc_pkvalue')" ).text('Documentos')
				, clase = 'fa fa-paperclip'
			}
			if ( name == "DBH-Histórico" ) {
				var $option = $('<option/>').val ( "$('#iframeFormCuerpo').data('topform').DBH('his_pkvalue')" ).text('Histórico')
				, clase = 'fa fa-history'
			}
			if ( name == "DBM-Comunicaciones" ) {
				var $option = $('<option/>').val ( "$('#iframeFormCuerpo').data('topform').DBH('ial_pkvalue')" ).text('Com. enviadas')
				, clase = 'fa fa-paper-plane-o'
			}
			if ( name == "DBH-Comunicaciones custom" ) {
				var $option = $('<option/>').val ( "$('#iframeFormCuerpo').data('topform').DBH('iac_pkvalue')" ).text('Com. custom')
				, clase = 'fa fa-envelope'
			}
			if ( clase ) $nodo.attr('data-jstree','{"icon":"'+clase+'"}' )
			if ( $option ) $select.append($option.addClass(clase))
		})
	
		$treemenu
			.on('click','a',function(){
				var $a = $(this)
				, da_id = $a.closest('li').attr('da_id')
				DBH.gorecord(da_id)
			} )
			.on('after_open.jstree', function (e, data) {
			})
			.on('after_close.jstree', function (e, data) {
			})
			
			.jstree({
			"core" : {
				"themes" : {
					"variant" : "large"
					//,"dots": false
					//,"stripes":true
				}
				,"multiple":false
			}
			})
			.jstree('open_all')
			.show()
			
		$treemenu.children('ul').width('100%')
		$('.layout-tree-container')
			.resizable({
				handles:'e'
			})
		$('.layout-log-container')
			.resizable({
				handles:'n'
				,resize : function () {
					$(this).css({top:'auto'})
				}
			})
		$('.layout-alertas-container')
			.resizable({
				handles:'n'
				,resize : function () {
					$(this).css({top:'auto'})
				}
			})
		$('.layout-form-container')
			.resizable({
				handles:'e'
				,stop: function () {
					DBH.area().topform.$container.find('textarea.inputText').each(function(){setTextareaHeight(this)})
				}
			})
	}
	this.tree.setWidth = function () {
		return false //OBSOLETO
		var $treemenu = $('#treemenu')
		, $botones  = $('#treemainbuttons')
		var anchotree = $('#treeresizable').outerWidth()
		//, anchotree = anchotree < 130 ? 130 : anchotree
		, anchoform = $('#tableleft').outerWidth()
		//$('.toolbar').css({'width' : 'calc(100vw - '+anchotree+'px)'})
		$('.toolbar').css({'width' : '100vw','margin-left' : '-'+anchotree+'px'})
		$botones.css({'max-width':(anchotree),'width':(anchotree)})
		$('body').css({'margin-left':(anchotree-1)})
		$('#divScrollDivision').css({'left':anchotree+anchoform})
		ajustarAnchoForm()
	}
	this.tree.expand = function (btn) {
		var $btn = $(btn)
		, isexpanded = $btn.hasClass('tree-button-expanded')
		if(isexpanded){
			$btn.removeClass('tree-button-expanded')
			$('#treemenu').jstree('close_all')
		}else{
			$btn.addClass('tree-button-expanded')
			$('#treemenu').jstree('open_all')
		}
		//$('#treeresizable').width('0')
		//$('#treemenu').width('0').closest('div').width('0')
		//DBH.tree.setWidth()
	}
	this.tree.nodes = new function () {
		var that = this
		this.hide = function () {
			$('#treemenu').find('li'+selector).hide()
		}
		this.show = function () {
			$('#treemenu').find('li'+selector).show()
		}
		this.toggle = function (btn) {
			var $nodes = $('#treemenu').find('li'+that.selector)
			, $btn = $(btn)
			, ison = $btn.hasClass('color-blue')
			if ( ison ) {
				$btn.removeClass('color-blue')
				$('#treemenu').addClass('tree-lvl2-hidden')
				//$nodes.addClass('tree-node-hidden')
			}else{
				$btn.addClass('color-blue')
				//$nodes.removeClass('tree-node-hidden')
				$('#treemenu').removeClass('tree-lvl2-hidden')
			}
			ajustarAnchoEncabezados()
			//setTimeout(function(){DBH.tree.setWidth()},1000)
		}
		return function (selector) {
			that.selector = '[da_nivel="2"]'
			return that
		}
	}
	this.tree.expand = function (btn) {
		var $btn = $(btn)
		, isexpanded = $btn.hasClass('color-blue')
		if(isexpanded){
			$btn.removeClass('color-blue')
			$('#treemenu').jstree('close_all')
		}else{
			$btn.addClass('color-blue')
			$('#treemenu').jstree('open_all')
		}
		ajustarAnchoEncabezados()
	}
	this.tree.toggle = function () {
		var $tree = $('#treeresizable')
		if($tree.hasClass('toggle-hidden')){
			$tree.removeClass('toggle-hidden')
			$tree.width($tree.data('actualwidth'))
		}else{
			$tree.addClass('toggle-hidden')
			$tree.data('actualwidth',$tree.outerWidth())
			//$tree.width(0)
		};
		ajustarAnchoEncabezados()
	}
	this.valueLists = function ($campos) {
		var that = this
		if ( !DBH.valueLists.$grupos )  DBH.valueLists.$grupos = $('<grupos/>')
		if ( !DBH.valueLists.styleSelectors )  DBH.valueLists.styleSelectors = []
		if ( ! $campos ) $campos = $('.dbh_valores_color')
		this.getColor = function ($campo) {
			if (!$campo) $campo = $('.inputText[grupo][grupo!=""]').eq(0)
			var tagName = $campo[0].tagName
			, grupo = $campo.attr('grupo')
			, idfield = $campo.attr('id')
			if ( tagName == 'OPTION' ) grupo = $campo.closest('select').attr('grupo')
			if ( tagName == 'INPUT' || tagName == 'TEXTAREA' ) {
				var value = $campo.val()
			} else if ( tagName == 'SELECT' ) {
				var value = $campo.find('option:selected').text()
			} else {
				var value = $campo.text()
				if ( value.indexOf(', ') != "-1" ) value = value.replace (", ","")
				value  = trim(value)
//					console.log("*"+value+"*")
			}
			if ( ! DBH.valueLists.$grupos.find('grupo[grupo="'+grupo+'"]').length ) {
				/*
				var sql = "SELECT li1_id,des,li1_color FROM dbh_listas WHERE grupo = '" + grupo + "'"
				, $xml = DBH.ajax.toXml ( sql, 'li1_id' )
				*/
				var $xml = DBH.$valoresXml.find('[fieldname="grupo"][fieldvalue="'+grupo+'"]').parent()
				//console.log(DBH.$valoresXml.html())
				//console.log(DBH.$valoresXml.find('[fieldname="grupo"][fieldvalue="'+grupo+'"]').length)
				, $grupo = $('<grupo/>').attr('grupo',grupo).append($xml)
				DBH.valueLists.$grupos.append($grupo)
				//console.log(DBH.valueLists.$grupos)
			}
			var color = DBH.valueLists.$grupos.find('grupo[grupo="'+grupo+'"]').find('[fieldname="des"][fieldvalue="'+value+'"]').parent().find('[fieldname="li1_color"]').text()
			return color
		}
		this.setColor = function () {
			//console.log($campo)
			//if(!$camposcutom) var $camposcutom = $campos
			$campos.each(function(){
				var $this = $(this)
				, tagName = $this[0].tagName
				, bgcolor = that.getColor ( $this )
				, brightness = get_brightness ( bgcolor )
				, fgcolor = ( brightness > (254/2) || !bgcolor || bgcolor == null ) ? 'black' : 'white'
				$this.attr('dbh-background-color',bgcolor)
				if ( tagName == 'TD' ) {
					var selector = 'td.dbh_valores_color[dbh-background-color="'+bgcolor+'"]:before'
					if ( DBH.valueLists.styleSelectors.indexOf(selector) == -1 ) {
//						console.log(selector)
						$("<style type='text/css'> "+selector+"{background-color:"+bgcolor+";} </style>").appendTo("head");
						DBH.valueLists.styleSelectors.push(selector)
					}
				} else {
					$this.css({ 'background-color' : bgcolor , 'color' :  fgcolor , 'border-bottom-color' : '#ECECEC' })
				}
				//console.log(that.getColor ( $this ))
			})
		}
		function get_brightness(hexCode) {
			// strip off any leading #
			hexCode = hexCode.replace('#', '');
			
			var c_r = parseInt(hexCode.substr(0, 2),16);
			var c_g = parseInt(hexCode.substr(2, 2),16);
			var c_b = parseInt(hexCode.substr(4, 2),16);
			
			return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
		}
		return this
	}
	return this;
}());
Object.defineProperties(DBH, {
	"islogged": {
		get: function() { 
			var idusuario = sessionStorage["usu_id"]
//			console.log(idusuario)
			return (isNaN(idusuario)?false:idusuario)
		/*
			var res = $.ajax({ type: "POST",   
				url: 'DBH_ASP.asp',   
				async: false,
				dataType: 'text',
				data: 'func=session&id=idusuario',
				success : function(txt)
				{
					return txt
					console.log(txt)
				},
				error: function ( jqXHR, textStatus, errorThrown)
				{
					console.log("urllrelative: "+urllrelative)
					console.log("param: "+param)
					console.log("textStatus: "+textStatus)
					console.log("errorThrown: "+errorThrown)
					alerta ( "Error Ajax Request. ")
					return false
				}
			}); 
			return res.responseText
		*/
		}
	}
});
//DBH.logSet = new Set()
DBH.log = class {
	constructor ( txt = '[Sin texto]' , title = '[Sin title]' ) {
		this.texto = txt
		this.title = title
		var options = {
			weekday: undefined,
			year: undefined,
			month: undefined,
			day: undefined,
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		};
		var IntlFormat = new Intl.DateTimeFormat("en-US",options)
		var fecha = IntlFormat.format(new Date()) 
		this.datetime = fecha;
		//DBH.logSet.add(this)
	}
}
DBH.consola = function( txt , { title } = 0 ) {
	if ( ! title ) return false;
	if ( ! this.$logsContainer ) {this.$logsContainer = $('.layout-log-container')}
	let log = new DBH.log ( txt , title )
	, { texto , datetime } = log
	, $msg = $('<div class="log"/>')
	$msg
		.append( $('<div class="log-date"/>').text(datetime) )
		.append( $('<div class="log-title"/>').text(title).addClass(title) )
		.append( $('<div class="log-texto"/>').text(texto) )
	this.$logsContainer.prepend( $msg )
	//console.log(texto)
}


Array.prototype.pushUnique = function (item){
		if(item.length==0) return this;
		var arrorig = this
		, arrnew = item.toString().split(",")
	//console.log(arrnew)
		$(arrnew).each(function(i){
	//		console.log(arrnew[i])
			var val = arrnew[i]
			if(arrorig.indexOf(val) == -1 && val.indexOf(".")>-1) {
			//if(jQuery.inArray(item, this) == -1) {
				arrorig.push(val);
			}
		})
		return arrorig;
	}
Array.prototype.addArray = function ( arr ) {
		if(arr.length==0) return this;
		var arrorig = this
		, arrnew = arr
		$(arrnew).each(function(i){
	//		console.log(arrnew[i])
			var val = arrnew[i]
			if(arrorig.indexOf(val) == -1 ) {
			//if(jQuery.inArray(item, this) == -1) {
				arrorig.push(val);
			}
		})
		return arrorig;
	}
Array.prototype.removeAS = function ( ) {
		$arr = $(this)
		$arr.each(function(i,val){
			this[i] = val.toLowerCase().split ( " as " )[0]
			console.log(val.toLowerCase().split ( " as " )[0])
		})
		return this;
	}
