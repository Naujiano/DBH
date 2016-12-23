/********************************´
***********************************************************/
/**  esFechaIgualoPosterior ( d1, m1, a1, d2, m2, a2 );                                   **/
/**  esFechaValida (fecha);                                                         **/
/**  textNoRellenos (form, prefijo);                                                      **/
/**  listasNoRellenas (form, prefijo);                                                    **/
/**  radiosNoMarcados (form, prefijo);                                                    **/
/**  checkMarcadas (form, prefijo);                                                       **/
/**  esCuentaValida (banco,oficina,dc,cuenta);                                            **/
/**  esNifValido (nif);                                                                   **/
/**  edad_actuarial ( dia , mes , ano );						  **/
/**  redondear ( cifra , decimales );							  **/
/**  selecciona_opcion_lista ( lista , opcion );					  **/
/**  separarMiles ( numero,decimalSeparator );					  **/
/**  esFechaYHoraValida(fecha);					  **/
/**  Age(fecha);					  **/
/**  formathtml(txt)   **/
/**  tildes_unicode(txt)  **/
/**  monthtext(m) ***/
/**  trim(txt) ***/
/*******************************************************************************************/

function Age(fecha)
{
	if(!esFechaValida(fecha))return -1
	var fecharr=fecha.split("/")
  var bday=fecharr[0];
  var bmo=fecharr[1]-1;
  var byr=fecharr[2];
var byr;
var age;
var now = new Date();
tday=now.getDate();
tmo=(now.getMonth());
tyr=(now.getFullYear());

{
if((tmo > bmo)||(tmo==bmo & tday>=bday))
{age=byr}

else
{age=byr*1+1}
return (tyr-age)
}}
function trim(txt){
	return txt.replace(/^\s*|\s*$/g,"")
}
function separarMiles(n,decimalSeparator){
	if(n=="")return n
	nArr=n.split(decimalSeparator)
	nDec=""
	if(nArr.length==2){
		nDec=","+nArr[1].substr(0,2)
		if(nDec.length<3)nDec+="0"
		n=nArr[0]
	}
	if(isNaN(n))return n
	nn=""
	for(i=n.length-1;i>=0;i--){
		nn=n.substr(i,1)+nn
		if( Math.round( (n.length-i)/3 )-( (n.length-i)/3 )==0 && i > 0 )nn="."+nn
	}
	return nn+nDec
}
function esFechaIgualoPosterior ( d1, m1, a1, d2, m2, a2 )
{
  if ( a1 - a2 == 0 && m1 - m2 == 0 && d1 - d2 == 0 ) return true
  if ( a2 < a1 ) return true
  if ( a2 > a1 ) return false
  if ( m2 < m1 ) return true
  if ( m2 > m1 ) return false
  if ( d2 < d1 ) return true
  if ( d2 > d1 ) return false
  return false
}

  function selecciona_opcion_lista ( lista , opcion )
  {
    for ( i = 0 ; i < lista.options.length ; i++ )
    {
//  	alert (lista.options[i].value.toLowerCase() + "\n" + opcion.toLowerCase() )
      if ( lista.options[i].text.toLowerCase() == opcion.toLowerCase() )
      {
        lista.options[i].selected = true
      }
    }
  }

function esFechaHoraValida (fechaHora)
{
	fechaHoraArr = fechaHora.split ( " " )
	if ( fechaHoraArr.length < 2 ) {
		return false
	}
	var fecha = fechaHoraArr[0]
	var hora = fechaHoraArr[1]
	if ( ! esFechaValida (fecha) ){
		return false
	}
	if ( ! esHoraValida (hora) ){
		return false
	}
	return true
}
function esHoraValida (hora)
{
	var horaArr = hora.split ( ":" )
	if ( horaArr.length < 3 ) {
		return false
	}
	var hora = horaArr[0]
	var minuto = horaArr[1]
	var segundo = horaArr[2]
  // Compruebo la hora.
  if (hora == "" || isNaN(hora) || hora < 0 || hora > 23 || (hora - Math.round(hora)) != 0) return false
  // Compruebo el minuto y el segundo.
  if (minuto == "" || isNaN(minuto) || minuto < 0 || minuto > 59 || (minuto - Math.round(minuto)) != 0) return false
  if (segundo == "" || isNaN(segundo) || segundo < 0 || segundo > 59 || (segundo - Math.round(segundo)) != 0) return false
  // Todo bien.
  return true
}
function esFechaValida (fecha)
{
	fecha = fecha.split ( "/" )
	if ( fecha.length < 3 ) {
		return false
	}
	dia = fecha[0]
	mes = fecha[1]
	ano = fecha[2]

  // Compruebo el mes.

  if (mes == "" || isNaN(mes) || mes < 1 || mes > 12 || (mes - Math.round(mes)) != 0) return false

  // Compruebo el año.

  if (ano == "" || isNaN(ano) || ano < 1900 || (ano - Math.round(ano)) != 0) return false

  // Compruebo el día.

  if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12)
    diaMax = 31
  else if (mes == 2)
    diaMax = 29
  else
    diaMax = 30
  if (dia == "" || isNaN(dia) || dia < 1 || dia > diaMax || (dia - Math.round(dia)) != 0) return false

  // Todo bien.

  return true
}
	function esFechaYHoraValida(fecha){
		if(!fecha.length>0){return false}
		fechaArr = fecha.split ( " " )
		if ( fechaArr.length < 2 ) { horaPart = "0:0:0" }
		else { horaPart = fechaArr[1] }
		fechaPart = fechaArr[0]
		fechaArr = fechaPart.split ( "/" )
		if ( fechaArr.length < 3 ) { return false }
		dia = fechaArr[0]
		mes = fechaArr[1]
		ano = fechaArr[2]
		horaArr = horaPart.split ( ":" )
		if ( horaArr.length < 3 ) { return false }
		hora = horaArr[0]
		minutos = horaArr[1]
		segundos = horaArr[2]
		//alert(horaPart)
    // Compruebo el mes.
    
    if (mes == "" || isNaN(mes) || mes < 1 || mes > 12 || (mes - Math.round(mes)) != 0) return false
    
    // Compruebo el año.
    
    if (ano == "" || isNaN(ano) || ano < 1900 || (ano - Math.round(ano)) != 0) return false
    
    // Compruebo el día.
    
    if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12)
      diaMax = 31
    else if (mes == 2)
      diaMax = 29
    else
      diaMax = 30
    if (dia == "" || isNaN(dia) || dia < 1 || dia > diaMax || (dia - Math.round(dia)) != 0) return false
    
    // Compruebo la hora
    if(isNaN(hora)||hora==""||hora<0||hora>24)return false
    // Compruebo el minuto
    if(isNaN(minutos)||minutos==""||minutos<0||minutos>59)return false
    // Compruebo el segundo
    if(isNaN(segundos)||segundos==""||segundos<0||segundos>59)return false
    
    // Todo bien.
    
    return true
  }
function esFechaValidaAbreviada (fecha)
{
	fecha = fecha.split ( "." )
	if ( fecha.length < 3 ) {
		return false
	}
	dia = fecha[0]
	mes = fecha[1]
	ano = fecha[2]

  // Compruebo el mes.

  if (mes == "" || isNaN(mes) || mes < 1 || mes > 12 || (mes - Math.round(mes)) != 0) return false

  // Compruebo el año.

  if (ano == "" || isNaN(ano) || ano < 0 || (ano - Math.round(ano)) != 0) return false

  // Compruebo el día.

  if (mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12)
    diaMax = 31
  else if (mes == 2)
    diaMax = 29
  else
    diaMax = 30
  if (dia == "" || isNaN(dia) || dia < 1 || dia > diaMax || (dia - Math.round(dia)) != 0) return false

  // Todo bien.

  return true
}

function textNoRellenos (form, prefijo)
{
  vacios = new Array(0)
  contador = 0
  for (i = 0; i < form.elements.length; i++)
  {
    e = form.elements[i]
    if (e.type == "text" && e.value == "" && e.name.substr (0,prefijo.length) == prefijo )
    {
      vacios[contador] = e.name
      contador++
    }
  }
  return vacios
}

function listasNoRellenas (form, prefijo)
{  
  vacios = new Array(0)
  contador = 0
  for (i = 0; i < form.elements.length; i++)
  {
    e = form.elements[i]
    if (e.type == "select-one" && e.name.substr (0,prefijo.length) == prefijo)
    {
      nombre = form.elements[i].name
      indice_seleccionado = form.elements[nombre].selectedIndex
      valor_seleccionado = form.elements[nombre].options[indice_seleccionado].value
      if (valor_seleccionado == "")
      {
        vacios[contador] = nombre
        contador++
      }
    }
  }
  return vacios
}

function radiosNoMarcados (form, prefijo)
{  
  vacios = new Array(0)
  contador = 0
  for (i = 0; i < form.elements.length; i++)
  {
    e = form.elements[i]
    if (e.type == "radio" && e.name.substr (0,prefijo.length) == prefijo )
    {
      nombre = form.elements[i].name
      radio = eval("form.elements['"+nombre+"']")
      marcado = false
      for (j = 0; j < radio.length; j++)
      {
        if (radio[j].checked) marcado = true
      }
      if (!marcado)
      {
        yaEsta = 0
        for ( j = 0; j < vacios.length; j++ ) { if ( vacios[j] == nombre ) yaEsta = 1 }
        if ( ! yaEsta ) { vacios[contador] = nombre; contador++ }
      }
    }
  }
  return vacios
}

function checkMarcadas (form, prefijo)
{  
  vacios = new Array(0)
  contador = 0
  for (i = 0; i < form.elements.length; i++)
  {
    if (form.elements[i].type == "checkbox")
    {
      nombre = form.elements[i].name
      check = eval("form.elements['"+nombre+"']")
      marcado = check.checked
      if (marcado)
      {
        vacios[contador] = nombre
        contador++
      }
    }
  }
  return vacios
}

function esCuentaValida(banco,oficina,dc,cuenta)
{
  //... chequeo del digito de control
  var objChequeo = new ChequeaDC ();
  objChequeo.banco   = banco;
  objChequeo.oficina = oficina;
  objChequeo.cuenta  = cuenta;
  var errorCta = objChequeo.chequea();
  
  if (errorCta)
  {
     return false
  }
  else
  {
     if (dc.length == 2 && stringIsInteger(dc))
     {
        if (!(objChequeo.dc[0] == dc.charAt(0) && objChequeo.dc[1] == dc.charAt(1)))
        {
           return false
        }
     } 
     else 
     {
        return false
     }
  }
  return true
  //... chequeo del digito de control

  function ChequeaDC () {                                                      
     this.banco   = "";
     this.oficina = "";                                                        
     this.cuenta  = "";                                                        
     this.error   = false;                                                     
     this.dc      = [0,0];                                                     
     this.chequea = chequea;                                                   
  }                                                                            

  function chequea () {                                                        
     if (this.banco.length != 4) {                                             
        this.error = true;                                                     
     }                                                                         
     if (!stringIsInteger(this.banco)) {                                       
        this.error = true;                                                     
     }                                                                         
                                                                               
     if (this.oficina.length != 4) {                                           
        this.error = true;                                                     
     }                                                                         
     if (!stringIsInteger(this.oficina)) {                                     
        this.error = true;                                                     
     }                                                                         
                                                                               
     if (this.cuenta.length != 10) {                                           
        this.error = true;                                                     
     }                                                                         
     if (!stringIsInteger(this.cuenta)) {                                      
        this.error = true;                                                     
     }                                                                         
                                                                               
     var tabla = new Array (13);                                               
                                                                               
     for (var i = 0; i < 13; i++) {                                            
        tabla[i] = [0,0,0];                                                    
     }                                                                         
                                                                               
     tabla[0][0]  = 6;                                                         
     tabla[1][0]  = 3;                                                         
     tabla[2][0]  = 7;                                                         
     tabla[3][0]  = 9;                                                         
     tabla[4][0]  = 10;                                                        
     tabla[5][0]  = 5;                                                         
     tabla[6][0]  = 8;                                                         
     tabla[7][0]  = 4;                                                         
     tabla[8][0]  = 2;                                                         
     tabla[9][0]  = 1;                                                         
     tabla[10][0] = 0;                                                         
     tabla[11][0] = 0;                                                         
     tabla[12][0] = 0;                                                         
                                                                               
     //___oficinas                                                             
     for (var i = 0; i < 4; i++) {                                             
        tabla[i][1]   = tabla[i][0]   * parseInt(this.oficina.charAt(3-i));    
        tabla[4+i][1] = tabla[4+i][0] * parseInt(this.banco.charAt(3-i));      
     }                                                                         
                                                                               
     //___oficinas                                                             
     for (var i = 0; i < 10; i++) {                                            
        tabla[i][2] = tabla[i][0] * parseInt(this.cuenta.charAt(9-i));         
     }                                                                         
                                                                               
     for (var i = 0; i < 13; i++) {                                            
        this.dc[0] += tabla[i][1];                                             
        this.dc[1] += tabla[i][2];                                             
     }                                                                         
                                                                               
     this.dc[0] = 11 - (this.dc[0] % 11);                                      
     this.dc[1] = 11 - (this.dc[1] % 11);                                      
                                                                               
     this.dc[0] = (this.dc[0] > 9)?11-this.dc[0]:this.dc[0];                   
     this.dc[1] = (this.dc[1] > 9)?11-this.dc[1]:this.dc[1];                   
                                                                               
     return (this.error);
  }
  function stringIsInteger (s) {
     for (var i = 0; i < s.length; i++) {
        if (isNaN(s.charAt(i))) {
           return false;
        }
     }
     return true;
  }
}

function esNifValido(s) {
  if (s.length != 9) return false;
   
  t1 = s.substring ( 0 , 1 )
  t2 = s.substring ( 1 , 8 )
  t3 = s.substring ( 8 , 9 )
  
  esNIF = ! isNaN ( t1 ) && ! isNaN ( t2 ) && isNaN ( t3 )
  esCIF =   isNaN ( t1 ) && ! isNaN ( t2 ) && ! isNaN ( t3 )
  esX = t1.toLowerCase() == 'x' && ! isNaN ( t2 ) && isNaN ( t3 )
  
  if ( ! esNIF && ! esCIF && ! esX) return false;
  
  if ( esNIF )
  {
    s = t1 + t2 + t3
  }
  if ( esCIF )
  {
    //s = t2 + t3 + t1
    return true
  }
  if ( esX )
  {
    s = "0" + t2 + t3
  }

   var x=s.substring(0,8);
   var y=(x % 23);
   var z=s.substring(8,9);
//   alert("x="+x+" y="+y+" z="+z)
   
   if (y==0  && (z=="t" || z=="T")){ return true; }
   if (y==1  && (z=="r" || z=="R")){ return true; }
   if (y==2  && (z=="w" || z=="W")){ return true; }
   if (y==3  && (z=="a" || z=="A")){ return true; }
   if (y==4  && (z=="g" || z=="G")){ return true; }
   if (y==5  && (z=="m" || z=="M")){ return true; }
   if (y==6  && (z=="y" || z=="Y")){ return true; }
   if (y==7  && (z=="f" || z=="F")){ return true; }
   if (y==8  && (z=="p" || z=="P")){ return true; }
   if (y==9  && (z=="d" || z=="D")){ return true; }
   if (y==10 && (z=="x" || z=="X")){ return true; }
   if (y==11 && (z=="b" || z=="B")){ return true; }
   if (y==12 && (z=="n" || z=="N")){ return true; }
   if (y==13 && (z=="j" || z=="J")){ return true; }
   if (y==14 && (z=="z" || z=="Z")){ return true; }
   if (y==15 && (z=="s" || z=="S")){ return true; }
   if (y==16 && (z=="q" || z=="Q")){ return true; }
   if (y==17 && (z=="v" || z=="V")){ return true; }
   if (y==18 && (z=="h" || z=="H")){ return true; }
   if (y==19 && (z=="l" || z=="L")){ return true; }
   if (y==20 && (z=="c" || z=="C")){ return true; }
   if (y==21 && (z=="k" || z=="K")){ return true; }
   if (y==22 && (z=="e" || z=="E")){ return true; }
   if (y==23 && (z=="t" || z=="T")){ return true; }
   
   return false;
}

  function edad_actuarial( dia1 , mes1 , anos1 , dia2 , mes2 , anos2 )
  {
  	if ( ! esFechaValida ( dia1 , mes1 , anos1 )  || ! esFechaValida ( dia2 , mes2 , anos2 ) ) 
  	{
  		alert ( "Mensaje de la función 'edad_actuarial()'.\nLas fechas introducidas no son válidas" )
  		return
  	}
  	
    // 1 - Fecha de nacimiento.
    // 2 - Fecha de efecto.

    dm = mes1 - mes2
    
    // Calculo la edad real

    if ( dm < 0 || ( dm == 0 && dia1 < dia2 ) )
      anos = anos2 - anos1
    else
      anos = anos2 - anos1 - 1
      
    // Calculo la edad actuarial (Si la persona cumple años menos de 6 meses después de la fecha de efecto se considera que tiene un año más de los que tiene realmente)

    caso1 = ((dm == 0) && (dia1 > dia2)) // La persona cumple años antes de que acabe el mes.
    caso2 = ((dm > 0) && (dm < 6)) // La persona cumple años en menos de 6 meses.
    caso3 = ((dm < 0) && (dm < -6)) // La persona cumple años en menos de 6 meses.
    caso4 = ((dm == 6 || dm == -6) && (dia1 < dia2)) // La persona cumple en 6 meses menos algunos días.
	
    if (caso1 || caso2 || caso3 || caso4) anos = anos + 1
    
    return anos
  }

//--------------------------------------------------------------------------------------------

	function redondear ( cifra , decimales )
	{
		o = Math.pow ( 10 , decimales )
		c = Math.round ( cifra * o ) / o
		return c
	}
  function formathtml(s) {         
  	return s
  var translate = {
      "á": "&aacute;", "Á": "&Aacute;"
    , "é": "&aecute;", "É": "&Eacute;"
    , "í": "&iacute;", "Í": "&Iacute;"
    , "ó": "&oacute;", "Ó": "&Oacute;"
    , "ú": "&uacute;", "Ú": "&Uacute;"
    , "ñ": "&ntilde;", "Ñ": "&Ntilde;"
  };
  var translate_re = /[áÁéÉíÍóÓúÚñÑ]/g;
  return ( s.replace(translate_re, function(match) { return translate[match]; } ) );
  }	
  function tildes_unicode(str){
	str = str.replace('á','\u00e1');
	str = str.replace('é','\u00e9');
	str = str.replace('í','\u00ed');
	str = str.replace('ó','\u00f3');
	str = str.replace('ú','\u00fa');

	str = str.replace('Á','\u00c1');
	str = str.replace('É','\u00c9');
	str = str.replace('Í','\u00cd');
	str = str.replace('Ó','\u00d3');
	str = str.replace('Ú','\u00da');

	str = str.replace('ñ','\u00f1');
	str = str.replace('Ñ','\u00d1');
	return str;
}  
function monthtext(m){
	if(m==1)return "Jan"
	if(m==2)return "Feb"
	if(m==3)return "Mar"
	if(m==4)return "Apr"
	if(m==5)return "May"
	if(m==6)return "Jun"
	if(m==7)return "Jul"
	if(m==8)return "Aug"
	if(m==9)return "Sep"
	if(m==10)return "Oct"
	if(m==11)return "Nov"
	if(m==12)return "Dic"
}