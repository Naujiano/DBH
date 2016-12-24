var multistatebuttons_elements = []
var multistatebutton = function (sel) {
	multistatebuttons_elements.push(this)
	var $sel = $(sel)
	, classsel = $sel.attr ( 'class' )
	, $boton = $('<div style="font-size:px;" class="multistatebutton-button genericon"></div>')
	, $wrapper = $sel.wrap('<div style="border:0px solid red;margin:0;padding:0;float:;width:100%;height:100%;box-sizing:border-box"/>').parent()
	, that = this
	, clases = []
	, estilos = []
	, clasesdefault = ['genericon-minimize','genericon-close','genericon-checkmark']
	, estilosdefault = ['','color:red','color:green']
	, clasesfinal = []
	, estilosfinal = []
	, readOnly = $sel.hasClass ( 'multistatebutton-readonly' )
	//$sel.closest('.divCampoForm').css('padding',0)
	$sel.prepend('<option/>')
	//$sel.find('option:first').attr('class','genericon-minimize').attr('style','').prop('selected',true)
	if ( ! readOnly ) {
		var nopt = $sel.find('option').length
		$boton.on ( 'click' , function () {
			var si = sel.selectedIndex * 1 + 1
			, topformedit = $(this).closest('.topform-mode-edit').length
			, inlineformfilter = $(this).closest('.inlineform .divinsertform').length
			, simin = ( inlineformfilter || ! topformedit ) ? 0 : 1
			si = si > ( nopt - 1 ) ? simin : si
			sel.selectedIndex = si
			//$sel.find('option').removeAttr('selected').eq(si).attr('selected','1')
			$sel.find('option').prop('selected',0).eq(si).prop('selected','1')
			that.setcss()
			$sel.trigger('multistatebutton:click')
		})
		$boton.addClass ( 'multistatebutton-write' )
		$boton.css ( 'cursor', 'pointer' )
	} else {
		$boton.css ( 'cursor', 'default' )
	}
	$sel.find('option').each(function(){
		clases.push ( $(this).attr ( 'class' ) )
		estilos.push ( $(this).attr ( 'style' ) )
	})
	$(clases).each(function(i){
		var clase = clases[i]
		, estilo = estilos[i]
		, clasedefault = clasesdefault[i]
		, estilodefault = estilosdefault[i]
		,cfinal,efinal
		//console.log('clase:'+typeof clase)
		if ( typeof clase != 'undefined' && clase!='' && clase!=null ) {
//			console.log('si:' + clase)
			cfinal = clase 
			//cfinal = clasedefault 
		} else {
			cfinal = clasedefault 
		}
		if ( typeof estilo != 'undefined'  ) {
			//console.log('si:' + clase)
			efinal = estilo 
		} else {
			efinal = estilodefault 
		}
		//console.log('option ' + i + ' - clase:*' + cfinal + '*' )
		clasesfinal.push ( cfinal )
		estilosfinal.push ( efinal )
		
	})
	$wrapper.append($boton)
	//$wrapper.append($sel)
	//this.setcss()
	$sel.hide()
	$sel.find('option').eq(0).prop('selected',true)
	$sel.data( 'multistatebutton-obj', this )

	this.setcss = function () {
		if ( ! $sel[0] ) return
		var v = $sel.find ('option[selected="1"]' ).prop('selected',1)
		,v=$sel[0].selectedIndex
		,v=v==-1?0:v
		, estilo = estilosfinal[v]
		$(clasesfinal).each(function(i){$boton.removeClass ( clasesfinal[i] )})
		$boton.attr ( 'style', estilo?estilo:'' )
		if ( ! readOnly ) $boton.css ( 'cursor', 'pointer' )
		$boton.addClass ( clasesfinal[v] )
//	console.log(v+"**"+clasesfinal[v])
	}
	/*
	this.onclick = function (fn) {
		$boton.on ( 'click', fn )
		formCabecera.formModificado(1)
	}
	*/
	that.setcss()
	return this
}
