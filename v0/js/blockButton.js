var blockButton = (function (){
	var cls = function (boton,capa,abrirCallbackFn,velocidad){
	//alert(typeof capa)
		if ( typeof capa == "undefined" || capa == null ) { console.log( "BLOCK BUTTON error:\n\n" + boton.id + boton.value + " no tiene capa definida."); return false }
		blockButton.objs = ( blockButton.objs || new Array() )
		blockButton.objs.push(this)
		$(boton).data('blockbutton',this)
		var that = this;
		that.isOpen = 0
		if ( typeof velocidad == 'undefined' ) velocidad = 400
		that.velocidad = velocidad
		boton.oldDisplay=boton.style.display
		boton.style.display="block"
		capa.oldLeft=boton.style.left
		capa.oldRight=capa.style.right
		capa.oldTop=capa.style.top
		boton.clasedowned='botondowned blockbutton-downed'
		boton.oldClass=boton.className
		boton.oldBackgroundImage=boton.style.backgroundImage
		boton.oldBackgroundPosition=boton.style.backgroundPosition
		//$(boton).append('<div class="divinlineformbuttons">hola que tal</div>')
		//console.log(boton.id)
		$(capa).css ( {'display': 'none','z-index':100 })
		//$(capa).css ( 'border', '1px solid red')
		$(boton).click(function(e){that.alternar();e.stopPropagation()});
		$(boton).addClass('blockbutton');
		$(boton).prepend($('<div style="color:inherit;margin-right:9px;top:-3px;left: -0px;position:relative;zoom:0.7" class="genericon genericon-uparrow flechita"></div>'))
		if(boton.oldBackgroundImage != ""){
			
			//boton.style.backgroundImage=boton.oldBackgroundImage+",url('img/flechaArribaNegrapaddingright.png')"
			//boton.style.backgroundPosition=boton.style.oldBackgroundPosition+","+(boton.offsetWidth-20)+"px 11px"
		}else{
			//boton.style.backgroundImage="url('img/flechaArribaNegrapaddingright.png')"
			//boton.style.backgroundPosition='5px center'//(boton.offsetWidth-20)+"px 11px"
		}
		this.alternar = function () {
			if(capa.style.display=='none'){that.abrir()}else{that.cerrar()}
		};
		this.cerrar = function (){
			that.isOpen = 0
			//boton.className=boton.oldClass
			$(boton).removeClass('botondowned')
			//that.ponerBackground('img/flechaArribaNegrapaddingright.png')
			$(boton).find('.flechita').not($(boton).find('.blockbutton .flechita')).remove()
			$(boton).prepend($('<div style="color:inherit;margin-right:9px;top:-3px;left: -0px;position:relative;zoom:0.7" class="genericon genericon-uparrow flechita"></div>'))
			$(capa).slideUp(that.velocidad,function(){$(boton).trigger('blockbutton:toggle')})
			
			//console.log('abrirCallbackFn')
		}
		this.scrollto = function () {
			var t = $(capa).offset().top
			, st = $('#iframeFormCuerpo .formCuerpo').scrollTop ( )
			, p = st + t - 50
			$('.formCuerpo:visible').animate({scrollTop:st + t - 135}, '200');
			//$('#iframeFormCuerpo .formCuerpo').scrollTop ( st + t - 50 )
			console.log(t)
		}
		this.abrir = function (scroll){
			//console.log('abrir')
			that.isOpen = 1
			boton.className=boton.className+" "+boton.clasedowned
			//that.ponerBackground('img/flechaAbajoNegrapaddingright.png')
			$(boton).find('.flechita').not($(boton).find('.blockbutton .flechita')).remove()
			$(boton).prepend($('<div style="color:inherit;margin-right:9px;top:5px;left: -0px;position:relative;zoom:0.7" class="genericon genericon-downarrow flechita"></div>'))
			if(capa.oldLeft==""&&capa.oldRight==""){
				var w = boton.offsetLeft
				capa.style.left=(w+0)+'px'
			}
			if(capa.oldTop==""){
				var h = $(boton).offset().top+boton.offsetHeight
				capa.style.top=(h+0)+'px'
			}
/*
			if ( scroll ) {
				$(capa).show()
				if ( typeof abrirCallbackFn != 'undefined' )abrirCallbackFn();
				$('#divnavegacionpestanas').trigger('topformbar:toggle')
				that.scrollto ( )
			} else {
*/
			$(capa).slideDown(that.velocidad,function(){
				$(capa).find('textarea').each(function(){setTextareaHeight(this)});
				if ( typeof abrirCallbackFn != 'undefined' ){
					abrirCallbackFn();
				}
				if(scroll)that.scrollto()
			})
			
			$(boton).trigger('blockbutton:toggle');
	//		}
			
			//if ( typeof abrirCallbackFn != 'undefined' ) abrirCallbackFn()
		}
		this.ponerBackground = function (urlbackgroundimage) {
			if(boton.oldBackgroundImage != ""){
				boton.style.backgroundImage=boton.oldBackgroundImage+",url('"+urlbackgroundimage+"')"
				//boton.style.backgroundPosition=boton.style.oldBackgroundPosition+","+(boton.offsetWidth-20)+"px 11px"
			}else{
				boton.style.backgroundImage="url('"+urlbackgroundimage+"')"
				//boton.style.backgroundPosition='right center'//(boton.offsetWidth-20)+"px 11px"
			}
		}
		this.ver = function ( o ) {
			if ( o==0 ) {
				$(boton).css ( { 'display': 'none' } )
				var $capa = $(capa)
				$capa.css ( { 'display': 'none' } )
			} else {
				$(boton).css ( { 'display': 'block' } )
				var $capa = $(capa)
				if ( that.isOpen ) $capa.css ( { 'display': 'block' } )
			}
		}
	}
	return cls;
}());
