(async () => {

    const SAVE_TO_DB = true

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')

    const BASE_URL = "https://h1g.jp/escha-logy/?%E6%BD%9C%E5%8A%9B"

    const properties = {}

    let res = await axios(BASE_URL)
    let $ = cheerio.load(res.data)

    const data = $("body > div.menu_body > table > tbody > tr > td:nth-child(2) > div > div.ie5 > table > tbody > tr").toArray()
    for (let i = 0; i < data.length; i++) {
        const name = $("td:nth-child(1)", data[i]).text()
        const description = $("td:nth-child(2)", data[i]).text()
        let conditions = $("td:nth-child(9)", data[i]).text()
          .replace("PP効率強化", "PP枠効率強化")
          .replace("消費MPカット", "消費MP削減")
          .replace("MPコスト圧縮", "消費MP圧縮")
          .replace("精霊の力", "精霊の加護")
          .split("×")
        if (conditions.length == 1 && conditions[0] =="-") {
          conditions = []
        }
        const attack = $("td:nth-child(3)", data[i]).text() == "○"
        const heal = $("td:nth-child(4)", data[i]).text() == "○"
        const support = $("td:nth-child(5)", data[i]).text() == "○"
        const weapon = $("td:nth-child(6)", data[i]).text() == "○"
        const armor = $("td:nth-child(7)", data[i]).text() == "○"
        const ornament = $("td:nth-child(8)", data[i]).text() == "○"

        properties[name] = {
          name,
          description,
          conditions,
          attack,
          heal,
          support,
          weapon,
          armor,
          ornament
        }
      }

      if (SAVE_TO_DB) {
        require('dotenv').config()
        const driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD))

        for (let key in properties) {
          let prop = properties[key]
          // check validty of conditions
          for(let c = 0; c < prop.conditions.length; c++) {
            if (!properties[prop.conditions[c]]) {
              console.log(`Couldn't find property:[${prop.conditions[c]}] for name:[${prop.name}]`)
              break
            }
          }

          const session = driver.session()
          result = await session.run(
            `
              MERGE (p:Test {name: $name})
                SET p.description = $description
                SET p.attack = $attack
                SET p.heal = $heal
                SET p.weapon = $weapon
                SET p.armor = $armor
                SET p.ornament = $ornament
              FOREACH (c IN $conditions |
                MERGE (p2:Test {name: c})
                CREATE (p2)-[:TO]->(p))
            `, prop
          )
          await session.close()          
        }

        await driver.close()
      }

        // if (SAVE_TO_DB) {
        //   const session = driver.session()
        //   result = await session.run(
        //     `
        //       MERGE (p:Property {name: $name})
        //         ON CREATE SET p.description = $description
        //       FOREACH (c IN $condition |
        //         MERGE (p2:Property {name: c})
        //         MERGE (p2)-[:TO]->(p))
        //       FOREACH (m IN $materials |
        //         MERGE (mat:Item {name: m})
        //         MERGE (mat)-[:HAS]->(p))
        //     `, { name, description, condition, materials }
        //   )
        //   await session.close()
        // }
        //
        // console.log(i, name)

})()
