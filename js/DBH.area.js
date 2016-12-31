{
    $document.on('tree-load', function() {
        DBH.areasSqlArr.forEach(rowObj => {
            dbhArea(rowObj)
        })
    })
    let areasMap = new Map()
    dbhArea = function(settings) {
        if (typeof settings == 'string')
            return areasMap.get(settings)
        return new area(settings)
    }
    class area {
        constructor(settings) {
            //console.log( settings)
            //return
            let {
                    da_id,
                    da_pktabla,
                    da_pkfield,
                    da_fkfield,
                    da_areamadre,
                    da_descripcion,
                    da_nivel,
                    da_perfiles
                } = settings,
                cache = dbhQuery("loadform-data")
            this.da_pkfield = da_pkfield;
            this.da_fkfield = da_fkfield;
            this.da_pktabla = da_pktabla;
            this.da_id = da_id;
            this.da_areamadre = da_areamadre;
            areasMap.set(da_id, this)
            //, arearow = cache.json(da_id)
        }
        sqlForHija ( where ) {
            let madre = dbhArea ( this.da_areamadre )
            , pkmadre = madre.da_pkfield
            , tablamadre = madre.da_pktabla
            , sql = `${this.da_fkfield} IN (SELECT ${pkmadre} FROM ${tablamadre} WHERE ${where})`
            return sql;
        }
        sqlForMadre ( where ) {
            let madre = dbhArea ( this.da_areamadre )
            , pkmadre = madre.da_pkfield
            , tablamadre = madre.da_pktabla
            , sql = `${pkmadre} IN (SELECT ${this.da_fkfield} FROM ${this.da_pktabla} WHERE ${where})`
            return sql;
        }
    }
}
{
    DBH.area = function(name) {
        //Si el area no se ha inicializado el container no existe aún, por eso uso la pestaña para obtener el da_id.
        if (name && typeof name != 'undefined' && name != 'undefined' && isNaN(name)) {
            var name = name
                    ? name.toLowerCase()
                    : 0,
                $pestana = $('#treemenu li[name="' + name + '"]'),
                selector = '[name="' + name + '"]'
        } else if (!isNaN(name)) {
            var $pestana = $('#treemenu li[da_id="' + name + '"]'),
                selector = '[da_id="' + name + '"]'
        } else {
            var $pestana = $('#treemenu li[aria-selected="true"]'),
                selector = ':visible'
        }
        if (!$pestana.length) {
            alerta("DBH.area(): No existe el área con nombre '" + name + "'");
            return false
        }
        var nombre = $pestana.attr('name')
        area_obj.name = nombre
        area_obj.pestana = $pestana
        area_obj.id = $pestana.attr('da_id')
        area_obj.pkname = $pestana.attr('pkname')
        return area_obj
    }
    let area_obj = new function() {
        var that = this
        this.setvalues = function(pararr) {
            var topformCleared = that.topform.clear()
            if (!topformCleared) {
                return false;
            }
            var $container = that.container
            if (!$container.length) {
                alerta('Se ha llamado a area.setvalues() antes de inicializar el area.', 'red')
                return false
            }
            $(pararr).each(function() {
                var par = this,
                    fieldid = par[0],
                    fieldvalue = par[1],
                    $field = $container.find('[id="' + fieldid + '"]')
                $field.val(fieldvalue)
                setTextareaHeight($field)
            })
            return that
        }
        this.setButtons = function() {
            var recsid = DBH.area().recsid
            if (recsid.length) {
                $('#divbotonesprincipalesserie').find('button').add('.req-serie').prop('disabled', false)
            } else {
                $('#divbotonesprincipalesserie').find('button').add('.req-serie').prop('disabled', true)
            }
            /*
        var selectinvertida = $('.listadoCuerpoContainer:visible').data('selectinvertida')
        if ( selectinvertida ) {
            $('#selectinvertida').addClass ('color-tomato')
        } else {
            $('#selectinvertida').removeClass ('color-tomato')
        }
        */
        }
        Object.defineProperties(that, {
            "loaded": {
                get: function() {
                    return $('.formCuerpo[da_id="' + that.id + '"]').length
                }
            },
            "container": {
                get: function() {
                    /*
                var name = that.name
                var selector = '[name="'+name+'"]'
                var $cont = $('.formCuerpo'+selector).add('[id="iframeFormCabecera"]')//.add('div.botones_principales:visible')
                */
                    var $cont = that.formContainer //.add('[id="iframeFormCabecera"]')//.add('div.botones_principales:visible')
                    return $cont
                }
            },
            "formContainer": {
                get: function() {
                    var name = that.name
                    var selector = '[name="' + name + '"]'
                    var $cont = $('.formCuerpo' + selector)
                    return $cont
                }
            },
            "topform": {
                get: function() {
                    var name = that.name
                    /*
                if (name){
                    var $topform = $('.formCuerpo[name="'+name+'"]')
                } else {
                    var $topform = $('.formCuerpo:visible')
                }
                */
                    var $topform = $('.formCuerpo[name="' + name + '"]')
                    var topform = $topform.data('topform')
                    return topform
                }
            },
            "recid": {
                get: function() {
                    var name = that.name
                        var pkname = that.pkname,
                            recid = that.container.find('[id="' + pkname + '"]').val()
                        return recid
                    }
                },
                "recsid": {
                    get: function() {
                        //var ci = that.checkedids
                        var ci = that.formContainer.data('checkedids'),
                            ci = !ci
                                ? []
                                : ci.slice(), //.split(",")
                            recid = that.recid
                        if (recid && recid != '' && ci.indexOf(recid) == -1)
                            ci.push(recid)
                            //console.log(ci)
                        return ci
                    }
                },
                "redactor": {
                    get: function() {
                        //var ci = that.checkedids
                        var ci = that.formContainer.find('.dbh_redactor_consultas')
                        return ci.val()
                    },
                    set: function(txt) {
                        //var ci = that.checkedids
                        var ci = that.formContainer.find('.dbh_redactor_consultas')
                        ci.val(txt)
                        return true
                    }
                },
                "unsaved": {
                    get: function() {
                        return that.topform.unsaved
                    },
                    set: function(val) {
                        that.topform.unsaved = val
                        var $savebutton = $('.form-toolbar[da_id="' + that.id + '"] .toolbar-button-save')
                        if (val) {
                            $savebutton.addClass('unsaved')
                        } else {
                            $savebutton.removeClass('unsaved')
                        }
                        return true
                    }
                },
                "checkedids": {
                    get: function() {
                        var ids = that.formContainer.data('checkedids'),
                            //console.log(ids)
                            ids = ids
                                ? ids
                                : []
                        //console.log(ids.length)
                        return ids
                    },
                    set: function(ids) {
                        that.formContainer.data('checkedids', ids)
                        return ids
                    }
                }
            });
            this.childAreas = function(name) {
                if (name) {
                    var name = name
                            ? name.toLowerCase()
                            : 0,
                        $pestana = that.container.find('.divinlineform[title="' + name + '"]')
                }
                DBH.childAreas_obj.name = name
                DBH.childAreas_obj.pestana = $pestana
                DBH.childAreas_obj.id = $pestana.attr('da_id')
                DBH.childAreas_obj.pkname = $pestana.attr('pkname')
                return childAreas_obj
            }
            this.childAreas_obj = function() {
                var that = this
                return this
            }
            this.go = function() { //alert('aa')
                $('#divnombreusuariogeneral').find('div[id="nombrearea"]').remove()
                $('#divnombreusuariogeneral').append('<div id="nombrearea" style="float:none;margin:-1px 0 0 0;font-weight:inherit;font-size:inherit;color:inherit">' + that.name + '</div>')
                $('#treemenu').jstree('deselect_all').jstree('select_node', $('#treemenu li[da_id="' + that.id + '"]').attr('id'))
                //if ( stopReset ) switchiframes_real.stopReset = 1
                switchiframes_real(that.pestana);

                cabezar();
                ajustarAnchoEncabezados();
                scrollEventHandler($('#divlist')[0]);

                return that;
            }
            this.filter = function(bypass) {
                that.topform.filter_real(bypass)
                return that
            }
            return this
        }
    }
