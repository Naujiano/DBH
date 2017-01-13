DBH.tree  = {}
DBH.tree.load = function () {
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
      const navigate = function () {
        const $a = $(this)
        , da_id = $a.closest('li').attr('da_id')
        , areaLoaded = DBH.area(da_id).loaded
        , viewData = dbhQuery('initialViews').json(da_id)
        , haveInitialView = viewData.length
        if ( !areaLoaded && haveInitialView ) {
          //console.log(viewData[0])
          const view_da_id = viewData[0].da_id
          , view_i_id = viewData[0].i_id
          , i_stringifyparams = viewData[0].i_stringifyparams
          , i_queryeditor_params = viewData[0].i_queryeditor_params
          //debugger
          vars.goArea ( 0, view_da_id, view_i_id,i_stringifyparams,i_queryeditor_params)
        } else {
          DBH.gorecord(da_id)
        }
      }.bind(this)
      DBH.telon.show()
      setTimeout(navigate,0)
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
/*
DBH.tree.setWidth = function () {
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
*/
/*
DBH.tree.expand = function (btn) {
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
*/

DBH.tree.nodes = new function () {
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


DBH.tree.expand = function (btn) {
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
/*
DBH.tree.toggle = function () {
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
*/
