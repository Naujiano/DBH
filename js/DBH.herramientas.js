{
    DBH.aviso = function(idaviso) {
        if (isNaN(idaviso)) {
            idaviso = $(idaviso).closest('[avi_id]').attr('avi_id')
        }
        if (idaviso)
            aviso_obj.id = idaviso;
        return aviso_obj;
    }
    let aviso_obj = new function() {
        var that = this
        this.go = function() {
            var da_id = $('#treemenu li[name="dbh-acciones"]').attr('da_id')
            //console.log(da_id+'**'+that.id)
            DBH.gorecord(da_id, that.id)
            return that
        }
        this.posponer = function(minutos) {
            var sqls = "UPDATE dbh_avisos SET avi_fecha = DATEADD(minute," + minutos + ",getdate()), avi_alertado=0 WHERE avi_id = " + that.id
            console.log(sqls)
            DBH.ajax.sql(sqls)
            alerta("Tarea pospuesta " + minutos + " minutos.", 1)
            return that
        }
        this.desactivar = function() {
            var sqls = "UPDATE dbh_avisos SET avi_accion = 0 WHERE avi_id = " + that.id
            DBH.ajax.sql(sqls)
            return that
        }
        this.save = function(fecha) {
            var sqls = "UPDATE dbh_avisos SET avi_fecha = '" + fecha + "', avi_alertado=0 WHERE avi_id = " + that.id
            DBH.ajax.sql(sqls)
            return that
        }
        this.alertar = function(rec) {
            var $container = $('#alertaaviso')
            /*
                var sqls = "SELECT avi_id,avi_etiqueta,avi_texto,avi_fecha,avi_da_id,avi_pkvalue FROM dbh_avisos WHERE avi_id = " + that.id,
                    recs = DBH.ajax.select(sqls, 'withLineFeeds')
                //console.log(recs[0])
                if (!recs) {
                    alerta('DBH.aviso.alert(): Ningún aviso tiene el ID "' + that.id + '"');
                    return false
                }
                */
                var etiqueta = rec.avi_etiqueta,
                    avi_id = rec.avi_id,
                    da_id = rec.avi_da_id,
                    pkvalue = rec.avi_pkvalue,
                    texto = rec.avi_texto,
                    fecha = rec.avi_fecha,
                    fecha = fecha.length > 16
                        ? fecha.substring(0, 16)
                        : fecha,
                    divtext = "<br><b><a style='color:#32AB9F' href='javascript:;' title='Click para ir al registro vinculado' onclick='DBH.gorecord(" + da_id + "," + pkvalue + ")'>" + etiqueta + "</a></b><br><pre style='white-space:pre-wrap;'>" + texto + "</pre>",
                    $input = $container.find('.info input'),
                    $texto = $container.find('.info .textcontainer')
                $texto.html(divtext)
                $input.val(fecha)
                DBH.date().setcolor($input)
                var $clone = $('[id="alertaaviso"][avi_id="' + avi_id + '"]')
                if (!$clone.length) {
                    var $clone = $container.clone().attr('avi_id', avi_id).attr('da_id', da_id)
                    $container.after($clone)
                }
                //$clone.show().addClass('zoomedin')
                if (!$clone.is(':visible')) {
                    $clone.css({'zoom': 0.00000001}).show()
                    $clone.animate({
                        'zoom': 1
                    }, 'slow');
                }

                return that
            }
            this.olvidar = function() {
                var sqls = "UPDATE dbh_avisos SET avi_alertado = 1 WHERE  avi_id = " + that.id,
                    recs = DBH.ajax.sql(sqls)
                alerta("Tarea marcada como avisada.", 1)
            }
            return this;
        }
        DBH.avisos = {}
        DBH.avisos.gorecord = function() { //va al registro relacionado con el aviso seleccionado en el area avisos.
            var $con = DBH.area().container,
                areaid = $con.find('[id="dbh_avisos.avi_da_id"]').val(),
                recid = $con.find('[id="dbh_avisos.avi_pkvalue"]').val()
            if (!recid || !areaid) {
                alerta('Este aviso no está relacionado con un registro.');
                return false;
            }
            DBH.gorecord(areaid, recid)
        }
        DBH.avisos.show = function() { //Muestra los avisos activados.
            var par = [
                [
                    'dbh_avisos.avi_accion', '1'
                ],
                ['dbh_avisos.iduc', sessionStorage['usu_id']]
            ]
            DBH.area('dbh-acciones').go().setvalues(par).filter()
        }
        DBH.avisos.setbutton = function(force) {
            if (!force) {
                var areaname = DBH.area().name
                //			console.log(areaname)
                if (areaname != 'dbh-acciones')
                    return false
            }
            var sqls = "SELECT min(avi_fecha) as fechamin, max(avi_fecha) as fechamax, count(avi_id) as count FROM dbh_avisos where iduc = " + sessionStorage['usu_id'] + " AND avi_accion = 1",
                res = DBH.ajax.select(sqls),
                $boton = $('#avisosgeneral')
            if (!res) {
                var txt = "0",
                    tit = "0 avisos\n - "
            } else {
                var rec = res[0],
                    fechamin = rec.fechamin,
                    fechamax = rec.fechamax,
                    count = rec.count,
                    txt = count,
                    tit = count + " avisos\n" + fechamin + " - " + fechamax,
                    fecha = fechamin.substr(0, 10)
                //console.log(fecha)
                $boton.html(fecha)
                DBH.date().setcolor($boton)
            }
            $boton.html(txt).attr('title', tit)
            //		console.log(fecha)
            //		console.log($boton)
        }
        DBH.historico = {}
        DBH.historico.gorecord = function() {
            var $con = DBH.area().container,
                areaid = $con.find('[id="dbh_historico.his_da_id"]').val(),
                recid = $con.find('[id="dbh_historico.his_pkvalue"]').val()
            DBH.gorecord(areaid, recid)
        }
        DBH.comentarios = {}
        DBH.comentarios.gorecord = function() {
            var $con = DBH.area().container,
                areaid = $con.find('[id="dbh_comentarios.cc_da_id"]').val(),
                recid = $con.find('[id="dbh_comentarios.cc_pkvalue"]').val()
            DBH.gorecord(areaid, recid)
        }
        DBH.documentos = {}
        DBH.documentos.gorecord = function() {
            var $con = DBH.area().container,
                areaid = $con.find('[id="dbh_documentos.doc_da_id"]').val(),
                recid = $con.find('[id="dbh_documentos.doc_pkvalue"]').val()
            DBH.gorecord(areaid, recid)
        }
    }
