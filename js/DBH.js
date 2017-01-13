const $document = $(document)
function preinit(){
	window.onmousedown=function documentClick(){
		var iscontext = $(':focus').hasClass('jscolor')
		if ( iscontext ) return false
		$(".divMenuContextual").each( function( index, element ){
			if (!$(this).is(':hover'))$(this).hide()
		});
	}

	$('[id="tablaEncabezado"]').on ( 'click' , '.celdaCampoEncabezado', function () {
		var $this = $(this);
		if ($this.hasClass('clicked')){
			$('#iframeFormCuerpo').data('topform').removecolumn($this.attr('orden'));
			clearTimeout ( timer )
			return false;
		}else{
			$this.addClass('clicked');
			var that = this
			, index = $('.celdaCampoEncabezado:visible').index(this) * 1 + 1
			timer  = setTimeout(function() {  $this.removeClass('clicked');ordenar(index) },500);
		}
	})
	$('#tablaEncabezado').on ( 'dblclick' , 'td.celdaCampoEncabezado:visible:first', function () {
		listado.checkid('all')
	})
	var $body = $('body')
	$body.on('click','.boton-switch',function() {
		var $btn = $(this)
		if(!$btn.hasClass('boton-switch-checked')){
			$btn.addClass('boton-switch-checked')
		}else{
			$btn.removeClass('boton-switch-checked')
		}
	})
	$(window).resize(function(){onresizef()})
	$(window).bind('beforeunload',function(){
		return 'Si continua perderá su configuración.'
	})

	$('#treemenu').on('contextmenu','li[role="treeitem"]', function(event){contextmenutree(event,this);return false;})
	$document
		.on('tree-load',function(){DBH.telon.hide()})
		.on('blur','.dbh_fecha_color:not(#avisosgeneral)',function(){DBH.date().setcolor($(this))})
		.on('contextmenu','.boton-switch-right', function(event){var $btn=$(this),checked=$btn.hasClass('color-blue');if(checked){$btn.removeClass('color-blue')} else {$btn.addClass('color-blue')};event.stopImmediatePropagation();event.stopPropagation();return false; } )
		.on('focus','[id="dbh_redactor_consultas"]',function(){var $this = $(this); $this.removeAttr('dbh-query-description').removeAttr('dbh-query-da_id')})
		.on('focus','select.dbh_valores_color',function(){ $(this).css({'background-color': 'transparent' }) })
		.on('blur','select.dbh_valores_color',function(){ DBH.valueLists( $(this) ).setColor() })
		.on('change','select.dbh_valores_color',function(){ $(this).blur() })
		.on('input','.inputText:not(.no-insert):not(.inlineform *)',function(){ formCabecera.formModificado(1) })
		.on('focus','.inputText[data_default_value_sql][data_default_value_sql!=""]',function(){
			var $c = $(this)
			, val = sqlExecVal($c.attr('data_default_value_sql'))
			if($c.val() == '' || ! $c.val() ) $c.val(val)
 		})
		.on('focus','.inputText[data_default_value][data_default_value!=""]',function(){
			var $c = $(this)
			if($c.val() == '' || ! $c.val() ) {$c.val($c.attr('data_default_value'));setTextareaHeight(this)}
 		})
		.on ( 'click', 'label[for]', function (event) {
			event.preventDefault();
			event.stopPropagation();event.stopImmediatePropagation();
			var inpid = $(this).attr('for')
			, $inp = $(this).closest('.divCampoForm').find('[id="'+inpid+'"]')
			alimentadorAutomatico.abrir($inp[0])
		} )
		.on ( 'area:filter:before' , function (event,topform) {
			$('.layout-list-container').show();
			ajustarAnchoForm();
			$('#btntogglelistado').addClass('boton-switch-checked')
			//console.log(a+'*'+topform.listadoWhereText+'*')
		})
	DBH.avisos.setbutton(1)
	function contextmenutree (event,btn) {
		if ( ! confirm ( '¿Configurar este área?' ) ) return false

		var $btn = $(btn)
		, rec_id = $btn.attr('da_id')
		, da_id = DBH.area('[AREAS]').id
		DBH.gorecord(da_id,rec_id)

		event.stopImmediatePropagation();
		event.stopPropagation();
	}
}
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
		if ( !urlparams.log ) $('.layout-log-container').hide()
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
			that.loadUI()
			/*
			DBH.sessionid = usu_id + '_' + sessionStorage["sessionid"]
			localStorage["interface_usu_id"] = usu_id
			DBH_help = new parent.blockButton( document.getElementById('buttonhelp') , document.getElementById('tipdiv') )
			showtip('rnd')
			$('#alertaaviso').on('click','button',function(){
				DBH.avisos.setbutton()
			})
			$('.botonesform').find(sessionStorage["usu_perfil"]).hide() //OCULTO BOTONES SEGÚN PERFIL
			vars.pinger()
			DBH.loaded = true
			preinit()
			*/
		}
		//console.log(customjs)
		console.log(dbhpath)

		$body.addClass('DBH').show()
		DBH.telon.hide()

	};
	this.loadUI = function () {
		if ( ! DBH.cache_areas_state || ! DBH.cache_areas_state() ) {
			setTimeout ( that.loadUI , 50 )
			return false;
		}
		const loadTree = function() {
			DBH.tree.load();
			$('#treeresizable').width($('#treeresizable').outerWidth())
					//DBH.tree.setWidth();
			var treewidth = $('.layout-tree-container').width()
			if (treewidth < 170)
					treewidth = 170
			$('.layout-tree-container').css({
					width: treewidth
			})
		}()
		const usu_id = sessionStorage["usu_id"]
		DBH.sessionid = usu_id + '_' + sessionStorage["sessionid"]
		localStorage["interface_usu_id"] = usu_id
		DBH_help = new parent.blockButton( document.getElementById('buttonhelp') , document.getElementById('tipdiv') )
		showtip('rnd')
		$('#alertaaviso').on('click','button',function(){
			DBH.avisos.setbutton()
		})
		$('.botonesform').find(sessionStorage["usu_perfil"]).hide() //OCULTO BOTONES SEGÚN PERFIL
		vars.pinger()
		DBH.loaded = true
		preinit()
	}
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
		//DBH.ajax.session('idusuario',usu_id)
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
		if(idusuario!=usu_id){;$(window).unbind('beforeunload');location = location;return false}
		//if(!DBH.loaded || idusuario!=usu_id){that.loadUI()}
		if(!DBH.loaded){that.loadUI()}
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
		this.gorecord = function (areaid,recid,timer) {
		var areahabilitada = $('#treemenu li[da_id="'+areaid+'"]').length
		if(!areahabilitada){alert('Su usuario no tiene permiso para acceder a este área.');return false}
		if(!timer && !$('.formCuerpo[da_id="'+areaid+'"]').length ) {
					DBH.telon.areaLoad()
					//DBH.telon.texto.append('Generando el Área...')
					//$('#divteloninit').show()
					setTimeout (function(){DBH.gorecord(areaid,recid,1)},0)
					return false
		}
		if ( ! DBH.cache_areas_state() ) { setTimeout(function(){DBH.gorecord(areaid,recid,timer)},100) ; return }
		var sqls = "SELECT * FROM DBH_AREAS WHERE da_id = " + areaid
		//, res2 = DBH.ajax.select ( sqls )
		, res = dbhQuery ( 'areas').json(areaid)
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
			//, res = DBH.ajax.select ( sqls )
			, res = dbhQuery ( 'loadform-data').json(da_areamadreid)
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
			return (isNaN(idusuario)?false:idusuario)
		}
	}
});
//DBH.logSet = new Set()
DBH.sql = function ( _sql , settings ) {
	let { beginmsg , successmsg , errormsg } = settings.verbose
	alerta ( beginmsg , 1 )
	dbhQuery ( { sqlquery: _sql , url: 'selectXML_new.asp' } ).request( _responseHandler )
	function _responseHandler ( xml ) {
		let $xml = $(xml).find('xml')
		, errnum = $xml.find ( 'errnum' ).text()
		, errdesc = $xml.find ( 'errdesc' ).text()
		if ( errnum ) {
			if ( errormsg ) { alerta ( errormsg ) } else { alerta ( errdesc ) }
		} else {
			if ( successmsg ) { alerta ( successmsg , 1 ) }
		}
	}
}
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
Set.prototype.toArray = function () {
	let theSet = this
	, setArray = []
	for ( let item of theSet ) {
		setArray.push ( item )
	}
	return setArray
}
$(DBH.start)
