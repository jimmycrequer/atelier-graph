(async () => {

    const SAVE_TO_DB = true

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')

    const BASE_URL = "https://omoteura.com/atelier_eschalogy/item-potential.html"

    const props = []
    const propsIdx = {}

    let res = await axios(BASE_URL)
    let $ = cheerio.load(res.data)

    const data = $("h2").toArray()
    for (let i = 0; i < data.length; i++) {
        h2 = $(data[i])

        const prop = {}

        prop.name = h2.text()

        const infos = $(h2.next())
        if (infos.text() != "潜力情報") {
          console.error(`[ERROR] Couldn't find 潜力情報 for ${prop.name}`)
          process.exit()
        }
        const infosTable = $(infos.next())

        prop.description = $("tr:nth-child(2)", infosTable).text().trim()

        prop.conditions = []
        let tt = $("tr:nth-child(4) > td", infosTable).contents().filter(function () {
          if (this.nodeType != 3)
            return

          let tmp = this.data
          tmp = tmp.replace("クリティカル＋×クリティカル＋", "クリティカル＋×クリティカル＋＋")
          tmp = tmp.replace("強烈な破壊力", "強力な破壊力")
          tmp = tmp.replace("精霊の力", "精霊の加護")
          tmp = tmp.indexOf("×") > -1 ? tmp.split("×") : []

          tmp.forEach(t => {
            prop.conditions.push(t)
          })
        })

        prop.items = $("tr:nth-child(6) a", infosTable).toArray().map(a => $(a).text())


        const inheritance = $(infosTable.next())
        if (inheritance.text() != "潜力引き継ぎ情報") {
          console.error(`[ERROR] Couldn't find 潜力引き継ぎ情報 for ${prop.name}`)
          process.exit()
        }

        const inheritanceTable = $(inheritance.next())
        prop.pp = $("tr:nth-child(3) > td:nth-child(1)", inheritanceTable).text()
        prop.restrictions = [
          $("tr:nth-child(3) > td:nth-child(2)", inheritanceTable).text() == "○",
          $("tr:nth-child(3) > td:nth-child(3)", inheritanceTable).text() == "○",
          $("tr:nth-child(3) > td:nth-child(4)", inheritanceTable).text() == "○",
          $("tr:nth-child(3) > td:nth-child(5)", inheritanceTable).text() == "○",
          $("tr:nth-child(3) > td:nth-child(6)", inheritanceTable).text() == "○",
          $("tr:nth-child(3) > td:nth-child(7)", inheritanceTable).text() == "○"
        ]

        props.push(prop)
        propsIdx[prop.name] = 1
      }

      // ================================================
      // VALIDATION
      // ================================================

      props.forEach(prop => {
        prop.conditions.forEach(cond => {
          if (!propsIdx[cond]) {
            console.error(`[ERROR] Couldn't find required property ${cond} for ${prop.name}`)
            process.exit()
          }
        })
      })

      // ================================================
      // DB
      // ================================================

      if (SAVE_TO_DB) {
        require('dotenv').config()
        const driver = neo4j.driver(`bolt://${process.env.VUE_APP_NEO4J_HOST}`, neo4j.auth.basic(process.env.VUE_APP_NEO4J_USER, process.env.VUE_APP_NEO4J_PWD))

        for (let i = 0; i < props.length; i++) {
          prop = props[i]

            const session = driver.session()
            result = await session.run(
              `
                MERGE (p:Property {name: $name})
                  SET p.description = $description
                  SET p.restrictions = $restrictions
                  SET p.pp = $pp
                FOREACH (c IN $conditions |
                  MERGE (p2:Property {name: c})
                  CREATE (p2)-[:TO]->(p))
                FOREACH (itemName IN $items |
                  MERGE (i:Item {name: itemName})
                  CREATE (i)-[:HAS]->(p))
              `, prop
            )
            await session.close()
          }

        await driver.close()
      }

})()
