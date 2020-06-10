(async () => {

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')

    require('dotenv').config()
    const driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD))


    const BASE_URL = "https://omoteura.com/atelier_eschalogy/item-potential.html"


    let res = await axios(BASE_URL)
    let $ = cheerio.load(res.data)


    const data = $("h2").toArray()
    console.log(data.length)

    for (let i = 0; i < data.length; i++) {
        h2 = $(data[i])

        const name = h2.text()

        let dataArea = $(h2.next().next())

        let description = $("tr:nth-child(2)", dataArea).text().trim()

        let condition = $("tr:nth-child(4)", dataArea).text().trim()
        if (condition.indexOf("強烈な破壊力") > -1)
          condition = condition.replace("強烈な破壊力", "強力な破壊力")
        condition = condition.indexOf("×") > -1 ? condition.split("×") : []

        let materials = $("tr:nth-child(6) a", dataArea).toArray().map(a => $(a).text())

        const session = driver.session()
        result = await session.run(
          `
            MERGE (p:Property {name: $name})
              ON CREATE SET p.description = $description
            FOREACH (c IN $condition |
              MERGE (p2:Property {name: c})
              MERGE (p2)-[:TO]->(p))
            FOREACH (m IN $materials |
              MERGE (mat:Item {name: m})
              MERGE (mat)-[:HAS]->(p))
          `, { name, description, condition, materials }
        )
        await session.close()

        console.log(i, name)
    }

    await driver.close()

})()
