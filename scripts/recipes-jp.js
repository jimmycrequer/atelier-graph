(async () => {

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')

    require('dotenv').config()
    const driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD))


    // resources

    let res = await axios("https://omoteura.com/atelier_eschalogy/item-material.html")
    let $ = cheerio.load(res.data)


    let data = $("h2").toArray()
    console.log(data.length)

    for (let i = 0; i < data.length; i++) {
        h2 = $(data[i])

        const name = h2.text()

        let dataArea = $(h2.next().next())

        let categories = $("tr:nth-child(3) > td:nth-child(2)", dataArea).text().trim().split("、")

        const session = driver.session()
        result = await session.run(
          `
            MERGE (i:Item {name: $name})
            FOREACH (category IN $categories |
              MERGE (c:Item:Category {name: category})
              MERGE (c)-[:CONTAINS]->(i))
          `, { name, categories }
        )
        await session.close()

        console.log(name, categories)
    }

    // await driver.close()
    // returna

    const SOURCES = [
        { url: "https://omoteura.com/atelier_eschalogy/item-use.html", heading: "h3"},
        { url: "https://omoteura.com/atelier_eschalogy/item-mix.html", heading: "h2"}
    ]


    for (let u = 0; u < SOURCES.length; u++) {
      res = await axios(SOURCES[u].url)
      $ = cheerio.load(res.data)


      data = $(SOURCES[u].heading).toArray()
      console.log(data.length)

      for (let i = 0; i < data.length; i++) {
          h3 = $(data[i])

          const name = h3.text()

          let dataArea = $(h3.next().next())

          let categories = $("tr:nth-child(3) > td:last-child", dataArea).text().trim().split("、")

          let ingredients = $("tr:nth-child(7) a", dataArea).toArray().filter(a => {
            return $(a).attr("href").indexOf("item-book.html") == -1
          }).map(a => $(a).text())

          const session = driver.session()
          result = await session.run(
            `
              MERGE (i:Item {name: $name})
              FOREACH (category IN $categories |
                MERGE (c:Item:Category {name: category})
                MERGE (c)-[:CONTAINS]->(i))
              FOREACH (ingredient IN $ingredients |
                MERGE (i2:Item {name: ingredient})
                MERGE (i)-[:NEEDS]->(i2))
            `, { name, categories, ingredients }
          )
          await session.close()

          console.log(name, categories, ingredients)
      }
    }

    await driver.close()

})()
