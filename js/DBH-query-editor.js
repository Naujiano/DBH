function dbhQueryEditor (parameters) {
    var that = this
	, QP = parameters.queryparameters;
    this.$container = parameters.$container.addClass('dbh-query-editor')
    this.$template = parameters.$template.find('.template-loop');
    this.queryparameters = QP;
    this.$container.prepend(parameters.$template.clone().children().not('.template-loop'))
    that.$container
       .attr('pinned-state',0)
       .attr('active-state',0)
       .attr('options-level',0)
    this.load = function () {
		var $loopContainer = that.$container.find('.template-loop-container')
		, QP = that.queryparameters;
		that.$container.find('.parameter-container').remove()
		//console.log(JSON.stringify(QP))
		if( !$.isArray(QP)){
			QP = QP.queryparameters
			that.$container.attr('options-level',1)
			that.$container.find('button.options').addClass('boton-switch-checked')
		}
		if ( ! QP ) return false
		for(var i=0;i<QP.length;i++){
			var label = QP[i].name
			, value = QP[i].value
			, $clone = that.$template.clone().addClass('parameter-container')
			if ( that.$container.attr('pinned-state') == "1" && QP[i].parameters.indexOf ( 'pinned' ) == -1 ) QP[i].parameters += " pinned"
			var classes = QP[i].parameters
			$clone.find('.label').html(label)
			$clone.find('.value').html($('<div/>').text(value).html())
			$clone.addClass(classes)
			$clone.find( 'button.operator' ).html ( $clone.is('.operator-or') ? 'OR' : 'AND' )
			$clone.data( 'queryparameters', QP[i] )
			$loopContainer.append($clone)
			$clone.find('.parentesis').eq(0).find('input').val ( QP[i].leftexp ).trigger('input')
			$clone.find('.parentesis').eq(1).find('input').val ( QP[i].rightexp ).trigger('input')
		}
		if ( !$loopContainer.is(".ui-sortable") ) $loopContainer.sortable({ items: '.parameter-container', stop: that.remakeQP })
		that.$container.find('input').trigger('input')
		
    }
	this.remakeQP = function () {
		that.queryparameters = []
		that.$container.find('.parameter-container').each ( function () {
			that.queryparameters.push ( $(this).data('queryparameters') )
		} )
	}
    this.returnQP = function () {
		var QP = that.queryparameters
		if( !$.isArray(QP)){
			QP = QP.queryparameters
		}
		if(!QP)return false
		var pinnedState = that.$container.attr('pinned-state')
		, activeState = that.$container.attr('active-state')
		, optionsLevel = that.$container.attr('options-level') * 1
		that.$container.find('.parameter-container').each(function(i){
			var $qpar = $(this)
			, pars = ''
			, leftexp = $qpar.find('.parentesis').eq(0).find('input').val()
			, rightexp = $qpar.find('.parentesis').eq(1).find('input').val()
			if ( $qpar.hasClass('pinned') ) var endps = 1
			if ( pinnedState == 1 ) var endps = 1
			if ( pinnedState == 2 ) var endps = 0
			if ( $qpar.hasClass('active') ) var endas = 1
			if ( activeState == 1 ) var endas = 1
			if ( activeState == 2 ) var endas = 0
			pars += endps ? 'pinned' : ''
			pars += endas ? ' active' : ''
			pars += $qpar.is('.operator-or') ? ' operator-or' : ''
			//pars += $qpar.is('.operator-not') ? ' operator-not' : ''
			//console.log(i)
			QP[i].parameters = pars
			QP[i].leftexp = leftexp
			QP[i].rightexp = rightexp
		})
		if(optionsLevel) QP = {queryparameters:QP}
		//console.log(QP.queryparameters)
		return (QP)
    }
    this.listadoWhere = function (QP) {
		var listadoWhere = ""
		, openbracket = 0
		, optionsLevel = that.$container.attr('options-level') * 1
		, inlineformSubquery = 0
		if ( !QP ) {
			var QP = that.returnQP()
			if(!$.isArray(QP))QP = QP.queryparameters
			var sinQP = 1
		} else {
			inlineformSubquery = 1
		}
		//console.log(QP)
 		$(QP).each(function(i){
			var qpar = this
			, ele = '<div class="'+qpar.parameters+'"/>'
			, $fakeqp = $(ele)
			if ( $fakeqp.is('.active') ) {
				var operator = $fakeqp.is('.operator-or') ? 'OR' : 'AND'
				, condition = inlineformSubquery ? qpar.inlineformSubquery.substring(7) : qpar.sql
				if ( ! optionsLevel ) {
					// PARÉNTESIS AUTOMÁTICOS
					var prefix = ""
					, sufix = ""
					if ( operator == "OR" && !openbracket ) { prefix = "(" ; openbracket = 1 }
					if ( operator == "AND" && openbracket ) { sufix = ")" ; openbracket = 0 }
					//listadoWhere += " " + prefix + qpar.sql + sufix   // Esta linea añade los paréntesis automáticos más lógicos para el Operador OR. Lo desestimé pq da diferente resultado si activas o no las opciones avanzadas.
					listadoWhere += " " + condition
				} else {
					var leftexp = qpar.leftexp ? qpar.leftexp : ''
					, rightexp = qpar.rightexp ? qpar.rightexp : ''
					listadoWhere += " " + leftexp + " " + condition + " " + rightexp
				}
				listadoWhere += " " + operator + " "
			}
		})
		if ( listadoWhere != "" ) {
			listadoWhere = listadoWhere.substring ( 0, listadoWhere.length - 4 )
			if ( openbracket ) listadoWhere += ")"
		} else {
			listadoWhere = "1=1"
		}
//		if(!sinQP)console.log(listadoWhere)
		return listadoWhere
    }
	this.groupedColumnSql = function (sqlParams) {
		var inlineformIndex = sqlParams ? sqlParams.inlineformIndex : -1
		//, da_areamadrastra = sqlParams ? sqlParams.da_areamadrastra : 'NaN'
		//, da_areamadrastra_redactor = DBH.area().container.find('[id="dbh_redactor_consultas"]').attr('dbh-query-da_id')
		//, includeRedactor = ( da_areamadrastra_redactor && ( da_areamadrastra == da_areamadrastra_redactor ) )
		, QP = QP ? QP : that.returnQP()
		if(!$.isArray(QP))QP = QP.queryparameters
		//console.log(QP)
		var QPinlineformIndex = QP.filter(function( obj ) {
			//return ( ( obj.inlineformIndex == inlineformIndex ) );
			if ( obj.inlineformIndex == inlineformIndex ) return true
			//if ( ( obj.id == "dbh_redactor_consultas" ) && includeRedactor ) return true
			return false
			//console.log(obj.da_areamadrastra)
			//console.log(da_areamadrastra_redactor)
			//return ( ( obj.inlineformIndex == inlineformIndex ) || ( da_areamadrastra_redactor && obj.da_areamadrastra == da_areamadrastra_redactor ) );
		});	
//		console.log(QPinlineformIndex)
		var listadoWhere = that.listadoWhere ( QPinlineformIndex )
		return(listadoWhere)
	}
    this.returnQT = function (QP) {
      var pars = ""
	  , QP = QP ? QP : that.returnQP()
	  if(!$.isArray(QP))QP = QP.queryparameters
      $(QP).each(function(i){
        var qpar = this
        , $fakeqp = $('<div class="'+qpar.parameters+'"/>')
        if ( $fakeqp.is('.active') ) {
			var operador = " " + ( $fakeqp.is('.operator-or') ? "OR" : "AND" ) + " "
			, isLastParam = i == QP.length - 1
			if ( isLastParam ) operador = ""
			pars += ( qpar.leftexp ? qpar.leftexp : '' ) + " " + qpar.name + " = [" + qpar.value + "]" + " " + ( qpar.rightexp ? qpar.rightexp : '' ) + operador
        }
      })
	  return pars
    }
    this.$container.on ( 'click', '.template-loop-container .parameter-container .parameter button', function (event) {
      var $btn = $(event.target)
      , $container = $btn.closest('.parameter-container')
      , classname = 'pinned'
      , ischecked = $container.hasClass(classname)
      if (ischecked) {
        $container.removeClass(classname)
      } else {
        $container.addClass(classname)
      }
      event.stopImmediatePropagation() ;
    })
    this.$container.on ( 'click', '.template-loop-container .parameter-container .parameter', function (event) {
      var $container = $(event.target).closest('.parameter-container')
      , classname = 'active'
      , ischecked = $container.hasClass(classname)
      if (ischecked) {
        $container.removeClass(classname)
      } else {
        $container.addClass(classname)
      }
      //event.stopPropagation();
      event.stopImmediatePropagation() ;
    })
    this.$container.on ( 'dblclick', '.template-loop-container .parameter-container .parameter', function (event) {
      event.stopImmediatePropagation() ;
      var $container = $(event.target).closest('.parameter-container')
      $container.remove()
	  that.remakeQP()
	  alerta ( 'Parámetro eliminado' , 1 )
    })
    this.$container.on ( 'click', '.parameter-container button.operator', function (event) {
      var $btn = $(event.target)
      , $container = $btn.closest('.parameter-container')
      , isor = $container.is('.operator-or')// == 'AND' ? 'OR' : 'AND'
	  if ( isor ) {
			$container.removeClass('operator-or')
			$btn.html('AND')
	  } else {
			$container.addClass('operator-or')
			$btn.html('OR')
	  }
      event.stopImmediatePropagation() ;
    })
	/*
    this.$container.on ( 'click', '.parameter-container button.not', function (event) {
      var $btn = $(event.target)
      , $container = $btn.closest('.parameter-container')
      , isnot = $container.is('.operator-not')// == 'AND' ? 'OR' : 'AND'
	  if ( isnot ) {
			$container.removeClass('operator-not')
	  } else {
			$container.addClass('operator-not')
	  }
      event.stopImmediatePropagation() ;
    })
    */
    this.$container.on ( 'click','button.pinned,button.active', function (event) {
		that.$container.find('.parameter-container').addClass ( 'pinned' )
		return true
	  if ( event.target.tagName != "BUTTON" ) {
		var $btn = $(event.target).closest('button')
	  } else {
		var $btn = $(event.target)
	  }
      var classname = $btn.is('.pinned') ? 'pinned' : ( $btn.is('.active') ? 'active' : '' )
      , pinnedState = that.$container.attr('pinned-state')
      , activeState = that.$container.attr('active-state')
	  
      , nextPinnedState = pinnedState * 1 + 1
      , nextPinnedState = nextPinnedState > 1 ? 0 : nextPinnedState
      , nextActiveState = activeState * 1 - 1
      , nextActiveState = nextActiveState < 1 ? 1 : nextActiveState
	  
	  //, nextPinnedState = pinnedState != "2" ? "2" : "1"
	  //, nextActiveState = activeState != "2" ? "2" : "1"
      if(classname=="pinned"){
		  that.$container.attr('pinned-state',nextPinnedState)
		  if ( nextPinnedState == "1" ) that.$container.find('.parameter-container').addClass ( 'pinned' )
	  }
      if(classname=="active")that.$container.attr('active-state',nextActiveState)
      console.log(that.returnQT())
    })
    this.$container
		.on ( 'click','button.reset', function (event) {
			that.$container
			.attr('pinned-state',0)
			.attr('active-state',0)
		})
		.on ( 'click','button.options', function (event) {
			var optlvl = that.$container.attr('options-level' ) * 1 ? 0 : 1
			that.$container
			.attr('options-level', optlvl )
		})
		.on ( 'click','button.clearpars', function (event) {
			if ( !confirm ( 'Borrar todos los parámetros de filtrado?' ) ) return false
			that.queryparameters = []
			that.load()
		})
		.on ( 'click','button.activatepars', function (event) {
			var $btn = $(this)
			, clicked = $btn.data('clicked')
			, $params = that.$container.find('.parameter-container')
			if ( clicked ) {
				$params.addClass ( 'active' )
				$btn.data('clicked',false)
			} else {
				$params.removeClass ( 'active' )
				$btn.data('clicked',true)
			}
		})
		.on('input', 'input', function (event) {
			var $inp = $(event.target)
			//console.log(event.target.tagName)
			, $span = $inp.closest('.parentesis').find('.hide')
			, keycode = event.keyCode
			, leftValidkeycodesRegExp = new RegExp (/[^not(]/g)
			, rightValidkeycodesRegExp = new RegExp (/[^)]+/g)
			, validkeycodesRegExp = $inp.closest('.parentesis').is(':first-child') ? leftValidkeycodesRegExp : rightValidkeycodesRegExp
			, val = $inp.val().replace(validkeycodesRegExp,"")
			$span.attr('class',$inp.attr('class')).addClass('hide').text(val);
			$inp.width($span.width());
			$inp.val(val)
		});
	//this.$container.sortable({});
    
    return this;
}
