var docs = {
	'loadDocsList' : function (registros,div,callbackFnWhenDeleteFile){
		var $div = $(div)
		$div.html ( '' )
		if ( registros == null ) return false
		if ( registros.length == 0 ) return false
			//console.log(registros )
		$(registros).each ( function (item, ele){
			//console.log(this)
			var id = $(ele).find('[fieldname="id"]').text()
			var nombrearchivo = $(ele).find('[fieldname="nombrearchivo"]').text()
			var nombreoriginal = $(ele).find('[fieldname="nombreoriginal"]').text()
			var perfil = $(ele).find('[fieldname="perfil"]').text()
			var path = $(ele).find('[fieldname="path"]').text()
			var sdiv = document.createElement("div")
			sdiv.className = "link-docs" + " " + "perfil" + perfil
			sdiv.title = ""//sgdoc_nombrearchivo
			sdiv.onclick=function(){parent.docs.openDoc( path,nombrearchivo )}
			var sdiv2 = document.createElement("div")
			sdiv2.className = "cruz-eliminar"
			sdiv2.onclick=function(event){parent.docs.deleteDoc( id  , this.parentNode, path + '\\' + nombrearchivo, event, callbackFnWhenDeleteFile )}
			sdiv2.innerHTML = "X"
			$(sdiv).append ( $(sdiv2) )
			$(sdiv).append ( nombreoriginal )
			$div.append ( $(sdiv) )
		})
	},
	'openDoc' : function ( fileabsolutepath,doc_nombrearchivo ) {
		var str = "fileDownloader.asp?fileabsolutepath=" + escape(fileabsolutepath) + "&filename=" + encodeURIComponent(doc_nombrearchivo)
		console.log(str)
		window.open ( str )
	},
	'openUpload' : function (obj) {
		var d = $("#divsubirdocs", window.parent.parent.document)
		var $win = $("#iframesubirdocs",window.parent.parent.document)
		var windowjQuery = $win[0].contentWindow.$;
		windowjQuery.data($win.contents()[0],"pars", obj );
		d.show(100,function(){
			parent.parent.gIframeInit();
		})
	},
	'deleteDoc': function  ( id,div,path,mouseevent,callbackFnWhenDeleteFile ) {
		if(!confirm("Borrar el documento?"))return false;
		mouseevent.stopPropagation();
		mouseevent.preventDefault();
		var respuesta = parent.ajaxExecuter("deleteFile.asp","fileabsolutepath=" + path,0)
		if ( typeof callbackFnWhenDeleteFile != 'undefined' ) callbackFnWhenDeleteFile(id,div)
	},
	'doc_manager': function (da_id){
		var that = this
		, divsarr = []
		dir = $('#docpath').val()
		this.uploadDocsS = function (doc_pkvalue) {
			jQuery(document).data("filesuploaddir",dir)
			var nombrearchivo = doc_pkvalue
			, idusuario = sessionStorage['usu_id']//$(parent.parent.document).find("#idusuario").val()
			, divlist = divsarr[doc_pkvalue]
			, docsUploadCallback = function (filename,originalfilename){
				var sql = "INSERT INTO DBH_DOCUMENTOS ( doc_da_id,doc_pkvalue, doc_nombrearchivo, doc_nombreoriginal, doc_path, idUC, idUM ) VALUES ( '" + da_id + "'," + doc_pkvalue + ",'" + filename + "','" + originalfilename + "','" + dir + "'," + idusuario + "," + idusuario + ")"
				, respuesta = parent.parent.sqlExecVal(sql,0)
				//console.log(sql)
				divlist.innerHTML = ""
				that.loadDocsListS(doc_pkvalue,divlist)
			}
			var obj = { nombrearchivo: nombrearchivo , dir: dir, callbackFn: docsUploadCallback };
			parent.docs.openUpload(obj)
		}
		this.deleteDocS = function  ( id,div ) {
			var sql = "DELETE DBH_DOCUMENTOS WHERE doc_id = " + id
			parent.sqlExec(sql,0)
			console.log(sql)
			$(div).hide()
		}
		this.loadDocsListS = function (doc_pkvalue,divlist,tienedocs){
			divsarr[doc_pkvalue] = divlist
			//console.log(tienedocs)
			if ( tienedocs == 0  ) return
			var sql = "SELECT doc_id as id,doc_nombrearchivo as nombrearchivo,doc_nombreoriginal as nombreoriginal,doc_path as path FROM DBH_DOCUMENTOS WHERE doc_da_id = '" + da_id + "' AND doc_pkvalue = " + doc_pkvalue + " order by fechauc desc"
			, registros = parent.sqlExec(sql,0)
			//console.log("sql:"+sql)
//			console.log("registros:"+registros)
			docs.loadDocsList ( registros, divlist, this.deleteDocS )
		}
		return this
	}
}
