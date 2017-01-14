const dbhPrint = function(data) {
    const win = window.open('/LAB/src/static/index.html')
    const load = function() {
        //const container = $winbody.find('div')
        const container = win.document.getElementById('container')
        console.log(container)
        if (!container) {
            setTimeout(load, 1000)
        } else {
            const testReport = function() {
                console.log(data)
                const intenta = function() {
                    console.log(intenta)
                    if (!win.printReport) {
                        setTimeout(intenta, 1000)
                    } else {
                        win.printReport({
                            container: container,
                            state: {
                                reportTitle: 'Búsqueda',
                                rowTitleField: 'rowtitle',
                                data: data
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
