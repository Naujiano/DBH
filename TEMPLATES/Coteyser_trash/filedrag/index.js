function init(){
	$("#iframesubirdocs",window.parent.document).contents().find("#divscrollsubirdocs").height($("#iframesubirdocs",window.parent.document).height()*1-300);
	//console.log( typeof ( $("#parameters").data("parameters") ) )
}
function callbackFn(filename){
	var pars =  $.data ( document , "pars" )
	pars.callbackFn(filename,pars.divlistado)
}
parent.gIframeInit = init;
