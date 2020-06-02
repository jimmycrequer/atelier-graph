(async () => {

    const axios = require('axios')
    const cheerio = require('cheerio')

    const BASE_URL = "https://omoteura.com/atelier_eschalogy/item-potential.html"


    let res = await axios(BASE_URL)
    let $ = cheerio.load(res.data)

    $("h2").each((i, h2) => {
        if (i > 5) return

        h2 = $(h2)

        const name = h2.text()

        let dataArea = $(h2.next().next())


        let description = $("tr:nth-child(2)", dataArea).text().trim()
        
        let condition = $("tr:nth-child(4)", dataArea).text().trim()
        if (condition.indexOf("×") > -1) {
            condition = condition.split("×")
        }
        else {
            condition = []
        }

        let materials = $("tr:nth-child(6) a", dataArea).toArray().map(a => $(a).text())

        console.log(i, name, description, condition, materials)
        
    })

})()