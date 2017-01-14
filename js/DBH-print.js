const dbhPrint = function( settings ) {
    const win = window.open('./index.html')
    const load = function() {
        //const container = $winbody.find('div')
        const container = win.document.getElementById('container')
        console.log(container)
        if (!container) {
            setTimeout(load, 1000)
        } else {
            const testReport = function() {
                console.log(settings.data)
                const intenta = function() {
                    console.log(intenta)
                    if (!win.printReport) {
                        setTimeout(intenta, 1000)
                    } else {
                        win.printReport({
                            container: container,
                            state: {
                                reportTitle: settings.titulo,
                                rowTitleField: 'rowtitle',
                                data: settings.data
                            }
                        })
                    }
                }
                intenta()
            }()
        }
    }
    load()
}
