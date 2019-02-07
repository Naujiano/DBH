DBH.ajax = ( function () {
  var that = this
  this.selectToXml = function (sql,eslogin) {
    var pars = "sql=" + encodeURIComponent(sql) + (eslogin ? '&db=login' : '')
    //console.log(pars)
    var res = DBH.ajax.request('selectXML_new.asp',pars)
    var r = $(res)
    //console.log(res)
    return r
  }
  this.toXml = function (sql,pkname,oldXml) {
    var oldXml = oldXml ? oldXml : that.selectToXml(sql)
    , $oldXml = $(oldXml)
    , $newXml = $('<lines/>').attr('data-idFieldName',pkname)
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
  this.xmlToJSON = function ($oldXml) {
    let lines = []
    $oldXml.find('line').each ( function () {
      var $rec = $(this)
      , $fields = $rec.children()
      , li1_id = $rec.attr('id')
      , obj = {li1_id }
      $fields.each ( function () {
        var $field = $(this)
        , propertyName = $field.attr('fieldname')
        , propertyValue = $field.text()
        obj[propertyName] = propertyValue
      })
      lines.push(obj)
    })
    return lines
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
    if (!operacion || ( operacion != 'update' && operacion != 'insert' ) ) {
      var res = that.request( 'DBH_SQL.asp','DBH_sql='+encodeURIComponent(sql) + '&DBH_operacion=' + ( operacion ? operacion : '' ) )
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
          , pc_tipo = $pcon.find('pc_tipo').text() // 1 = Obligatoria. 2 = Aviso
          , msge = '<span style="text-transform:uppercase;color:'+(pc_tipo=='1'?'red':'')+'">' + pc_nombre + '</span><br><span style="white-space:normal;color:'+(pc_tipo=='1'?'red':'')+'">' + pc_descripcion + '</span><br>'
          msg += msge
		  alert ( pc_nombre + (pc_tipo=='1'?' (Obligatoria)':' (Aviso)') + '\n\n' + pc_descripcion )
        })
        alerta (msg)
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
		, obligatorias = 0
        $res.find('precondicion').each(function(){
          var $pcon = $(this)
          , pc_id = $pcon.find('pc_id').text()
          , pc_nombre = $pcon.find('pc_nombre').text()
          , pc_descripcion = $pcon.find('pc_descripcion').text()
          , pc_tipo = $pcon.find('pc_tipo').text() // 1 = Obligatoria. 2 = Aviso
          , msge = '<span style="text-transform:uppercase;color:'+(pc_tipo=='1'?'red':'')+'">' + pc_nombre + '</span><br><span style="white-space:normal;color:'+(pc_tipo=='1'?'red':'')+'">' + pc_descripcion + '</span><br>'
          msg += msge
		  alert ( pc_nombre + (pc_tipo=='1'?' (Obligatoria)':' (Aviso)') + '\n\n' + pc_descripcion )
		  if ( pc_tipo == '1' ) obligatorias = 1
        })
        alerta (msg)
		if ( obligatorias ) return false
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
      $camposform.each(function(){
        const $this = $(this)
        , val = $this.val()
        if ( val ) $this.prop('oldValue',val)
      })
      //$camposform.prop('oldValue',$camposform.val())
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
