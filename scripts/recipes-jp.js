(async () => {

    const SAVE_TO_DB = true

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')

    const itemIdx = {}

    let res = await axios("https://omoteura.com/atelier_eschalogy/item-list-category.html")
    let $ = cheerio.load(res.data)

    data = $("h2").toArray()
    for (let i = 0; i < data.length; i++) {
      h2 = $(data[i])

      let name = h2.text().trim()
      name = name.replace("カテゴリが", "")
      name = name.replace("のアイテム", "")

      itemIdx[name] = { group: "CATEGORY", name }
    }

    // ================================================
    // RESOURCES
    // ================================================

    res = await axios("https://omoteura.com/atelier_eschalogy/item-material.html")
    $ = cheerio.load(res.data)


    data = $("h2").toArray()


    for (let i = 0; i < data.length; i++) {
        h2 = $(data[i])

        const name = h2.text()

        let dataArea = $(h2.next().next())

        let level = $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim()
        let categories = $("tr:nth-child(3) > td:nth-child(2)", dataArea).text().trim().split("、")
        let attributes = [
          $("tr:nth-child(3) > td:nth-child(3)", dataArea).text().trim(),
          $("tr:nth-child(3) > td:nth-child(4)", dataArea).text().trim(),
          $("tr:nth-child(3) > td:nth-child(5)", dataArea).text().trim(),
          $("tr:nth-child(3) > td:nth-child(6)", dataArea).text().trim()
        ]

        itemIdx[name] = {
          group: "RESOURCE",
          name,
          level,
          categories,
          attributes,
          ingredients: []
        }
    }

    // ================================================
    // MIX ITEMS
    // ================================================

    res = await axios("https://omoteura.com/atelier_eschalogy/item-mix.html")
    $ = cheerio.load(res.data)

    data = $("h2").toArray()
    for (let i = 0; i < data.length; i++) {
      h2 = $(data[i])

      const name = h2.text()

      let dataArea = $(h2.next().next())

      let level = $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim()
      let attributes = [
        $("tr:nth-child(3) > td:nth-child(4)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(5)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(6)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(7)", dataArea).text().trim()
      ]
      let categories = $("tr:nth-child(3) > td:last-child", dataArea).text().trim().split("、")

      let ingredients = $("tr:nth-child(7) a", dataArea).toArray().filter(a => {
        return $(a).attr("href").indexOf("item-book.html") == -1
      }).map(a => $(a).text())

      itemIdx[name] = {
        group: "MIX",
        name,
        level,
        attributes,
        categories,
        ingredients
      }

    }

    // ================================================
    // ATTACK & HEAL ITEMS
    // ================================================

    res = await axios("https://omoteura.com/atelier_eschalogy/item-use.html")
    $ = cheerio.load(res.data)

    data = $("h3").toArray()
    for (let i = 0; i < data.length; i++) {
      h3 = $(data[i])

      const id = h3.attr("id")
      const name = h3.text()

      let dataArea = $(h3.next().next())

      let level = $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim()
      let attributes = [
        $("tr:nth-child(3) > td:nth-child(4)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(5)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(6)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(7)", dataArea).text().trim()
      ]
      let categories = $("tr:nth-child(3) > td:last-child", dataArea).text().trim().split("、")

      let ingredients = $("tr:nth-child(7) a", dataArea).toArray().filter(a => {
        return $(a).attr("href").indexOf("item-book.html") == -1
      }).map(a => $(a).text())

      itemIdx[name] = {
        group: id.indexOf("use01") > -1 ? "ATTACK" : "HEAL",
        name,
        level,
        attributes,
        categories,
        ingredients
      }
    }

    // ================================================
    // WEAPON ITEMS
    // ================================================

    res = await axios("https://omoteura.com/atelier_eschalogy/item-weapon.html")
    $ = cheerio.load(res.data)

    data = $("h3").toArray()
    for (let i = 0; i < data.length; i++) {
      h3 = $(data[i])

      const id = h3.attr("id")
      const name = h3.text()

      let dataArea = $(h3.next().next())

      let level = $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim()
      let attributes = [
        $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(2)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(3)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(4)", dataArea).text().trim()
      ]
      let categories = $("tr:nth-child(3) > td:last-child", dataArea).text().trim().split("、")

      let ingredients = $("tr:nth-child(8) a", dataArea).toArray().filter(a => {
        return $(a).attr("href").indexOf("item-book.html") == -1
      }).map(a => $(a).text())

      itemIdx[name] = {
        group: "WEAPON",
        name,
        level,
        attributes,
        categories,
        ingredients
      }
    }

    // ================================================
    // ARMOR ITEMS
    // ================================================

    res = await axios("https://omoteura.com/atelier_eschalogy/item-armor.html")
    $ = cheerio.load(res.data)

    data = $("h3").toArray()
    for (let i = 0; i < data.length; i++) {
      h3 = $(data[i])

      const id = h3.attr("id")
      const name = h3.text()

      let dataArea = $(h3.next().next())

      let level = $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim()
      let attributes = [
        $("tr:nth-child(3) > td:nth-child(1)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(2)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(3)", dataArea).text().trim(),
        $("tr:nth-child(3) > td:nth-child(4)", dataArea).text().trim()
      ]
      let categories = $("tr:nth-child(3) > td:last-child", dataArea).text().trim().split("、")

      let ingredients = $("tr:nth-child(8) a", dataArea).toArray().filter(a => {
        return $(a).attr("href").indexOf("item-book.html") == -1
      }).map(a => $(a).text())

      itemIdx[name] = {
        group: "ARMOR",
        name,
        level,
        attributes,
        categories,
        ingredients
      }
    }

    // ================================================
    // VALIDATION
    // ================================================

    Object.values(itemIdx).forEach(obj => {
      if (obj.ingredients) {
        obj.ingredients.forEach(ingredient => {
          if (!itemIdx[ingredient]) {
            console.error(`[ERROR] Couldn't find required ingredient ${ingredient} for ${obj.name}`)
            process.exit()
          }
        })
      }
    })

    // ================================================
    // SAVE TO DB
    // ================================================

    if (!SAVE_TO_DB)
      return

    require('dotenv').config()
    const driver = neo4j.driver(`bolt://${process.env.VUE_APP_NEO4J_HOST}`, neo4j.auth.basic(process.env.VUE_APP_NEO4J_USER, process.env.VUE_APP_NEO4J_PWD))

    for (let i = 0; i < Object.values(itemIdx).length; i++) {
      let obj = Object.values(itemIdx)[i]

      if (obj.group == "CATEGORY") {
        const session = driver.session()
          result = await session.run(
            `
              MERGE (n {name: $name})
              SET n:Category
            `, obj
          )
          await session.close()
      }
      else {
        const session = driver.session()
          result = await session.run(
            `
              MERGE (n {name: $name})
              SET n:Item, n.level = $level, n.attributes = $attributes, n.group = $group
              FOREACH (category IN $categories |
                MERGE (c:Category {name: category})
                MERGE (c)-[:CONTAINS]->(n))
              FOREACH (ingredient IN $ingredients |
                MERGE (i {name: ingredient})
                CREATE (n)-[:NEEDS]->(i))
            `, obj
          )
          await session.close()
      }
    }

    await driver.close()

})()
