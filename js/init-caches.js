{
    let cacheMap = new Map();
    DBH.cache_areas_state = function () {
        let ready = true
        for ( let [key,state] of cacheMap ) {
            if ( ! state ) ready = false;
        }
        return ready
    }
    DBH.cache_tree_state = () => cacheMap.get('areas')
    let load = function () {
        cacheMap.set ( 'areas' , false )
        dbhQuery({
            fields : `case when (COL_LENGTH(da_pktabla,'dbh_perfiles_admitidos_xreg') is null ) then '0' else '1' end as tiene_columna_dbh_perfiles_excluidos
    , (select a.da_id from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_id_madre,(select a.da_tabla from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_pktabla_madre
    ,(select a.da_pkfield from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_pkfield_madre,(select a.da_descripcion from DBH_AREAS as a where a.da_id = b.da_areamadre ) as namemadre
    ,(select cast(da_id as char) + ',' from DBH_AREAS as a where b.da_id = a.da_areamadre AND a.da_nivel = 1 AND a.da_activa=1 FOR XML PATH ('') ) as da_ids_hijas
    , (select cast(da_id as char) + ',' from DBH_AREAS as a where (b.da_id = a.da_areamadre OR b.da_id = a.da_areamadrastra) AND a.da_nivel = 2 AND a.da_areamadrastra is not null FOR XML PATH ('') ) as da_ids_relacionantes
    , (select cast(da_descripcion as char) + ',' from DBH_AREAS as a where (b.da_id = a.da_areamadre OR b.da_id = a.da_areamadrastra) AND a.da_nivel = 2 AND a.da_areamadrastra is not null FOR XML PATH ('') ) as da_nombres_relacionantes
    ,(select cast(da_descripcion as char) + ',' from DBH_AREAS as a where b.da_id = a.da_areamadre AND a.da_nivel = 1 AND a.da_activa=1 FOR XML PATH ('') ) as da_nombre_hijas
    ,case when (COL_LENGTH(da_pktabla,'dbh_perfiles_admitidos_xreg') is null ) then '0' else '1' end as tiene_columna_dbh_perfiles_excluidos
    ,(select a.da_pkfield from DBH_AREAS as a where a.da_id = b.da_areamadre ) as pkmadre,(select a.da_perfiles from DBH_AREAS as a where a.da_id = b.da_areamadre ) as da_perfiles_madre,*`
    //,da_pktabla,da_id,da_perfiles_excluidos,da_perfiles,da_orderindexlistado,da_tabla,da_pkfield,da_fkfield,da_areamadre,da_areamadrastra,da_nivel,da_descripcion,da_custom_buttons,da_callback_save,da_callback_load`
            , table : 'DBH_AREAS as b'
            , where : 'da_activa = 1'
            , orderby : 'da_nivel desc,da_orderindex'
            , idfield : 'da_id'
            ,cache:'areas'
        }).request(function(xml) {
            DBH.areasSqlArr = dbhQuery('areas').json()
            console.log('loaded areas')
            cacheMap.set ( 'areas' , true )
            $document.trigger('cache:areas:loaded')
        })
    }();
    let campos = function() {
        cacheMap.set ( 'campos' , false )
        let fields = "" +
            "case when ((select da_tabla from DBH_AREAS where da_id = data_da_id) = left(data_field_id,charindex('.',data_field_id)-1)) then '0' else '1' end as noinsert" +
            ",(select da_descripcion from DBH_AREAS where da_id = (select da_areamadre from DBH_AREAS where da_id = data_da_id)) as areamadre_name" +
            ",IS_NULLABLE as is_nullable,TABLE_NAME,COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH" +
            ",(select cast(das_da_id as varchar) + ','  from DBH_CAMPOS_AREASAFECTANTES WHERE das_data_id = data_id FOR XML PATH ('') ) as da_ids_areasafectantes" +
            ", DBH_CAMPOS.* ",
            table = "" +
            "DBH_CAMPOS inner join DBH_AREAS on data_da_id = da_id inner join INFORMATION_SCHEMA.COLUMNS " +
            "on TABLE_NAME = left(data_field_id,charindex('.',data_field_id)-1) " +
            "and COLUMN_NAME = replace(data_field_id,left(data_field_id,charindex('.',data_field_id)),'') ",
            where = "data_activo = 1 ANd da_activa = 1",
            orderby = "1 desc,data_orderindex"

        const query = dbhQuery({
            fields,
            table,
            where,
            orderby
        })

        query.request(function(xml) {

            let data = xml.getElementsByTagName("xml")[0].childNodes
            DBH.$camposXml = $(data)
            DBH.$camposXml.each(function() {
                var $registro = $(this),
                    da_id = $registro.find('[fieldname="data_da_id"]').text()
                $registro.attr('da_id', da_id)
            })

            window.camposJSON = DBH.ajax.xmlToObject ( xml ) //query.getJSON()
            console.log('loaded campos')
            cacheMap.set ( 'campos' , true )
        });

    }();
    let valores = function() {
        cacheMap.set ( 'valores' , false )
        let fields = "li1_id,des,li1_color,grupo",
            table = "dbh_listas",
            where = "grupo IN ( SELECT data_field_grupo FROM dbh_campos inner join dbh_areas on data_da_id = da_id WHERE data_activo = 1 and da_activa = 1 )",
            orderby = "grupo,des"

        dbhQuery({
            fields,
            table,
            where,
            orderby
        }).request(function(xml) {
            //console.log(xml)
            let toXmled = xml ? DBH.ajax.toXml('', 'li1_id', xml) : $('<xml/>')
            DBH.$valoresXml = toXmled
            //return
            let $xml = DBH.$valoresXml.find('[fieldname="grupo"]'),
                gruposSet = new Set()
            $xml.each(function() {
                let grupo = $(this).attr('fieldvalue')
                gruposSet.add(grupo)
            })

            for (let key of gruposSet.values()) {
                let $lines = DBH.$valoresXml.find('[fieldname="grupo"][fieldvalue="' + key + '"]').parent(),
                    deses = []
                $lines.each(function() {
                        let $line = $(this),
                            li1_id = $line.attr('id'),
                            li1_color = $line.find('[fieldname="li1_color"]').attr('fieldvalue'),
                            des = $line.find('[fieldname="des"]').attr('fieldvalue'),
                            obj = {
                                li1_id,
                                li1_color,
                                des
                            }
                        //deses.push(obj)
                            deses.push(des)
                    })
                    //, json = DBH.xmlToJSON ( $xml2 )
                    //console.log(key)
                    //console.log(deses)
                let hound = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    //datumTokenizer: Bloodhound.tokenizers.obj.whitespace('des'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    //,identify: function(obj) { return obj.des; }

                    local: deses
                });
                // hound.add ( JSON.stringify ( json )  )
                //debugger;
                DBH.hounds.set('grupos:' + key, hound)
            }

            cacheMap.set ( 'valores' , true )
            console.log('loaded valores')
        });
    }();



}
