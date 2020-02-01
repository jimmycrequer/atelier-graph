(async () => {

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')

    require('dotenv').config()

    const driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD))

    const BASE_URL = 'https://barrelwisdom.com'

    const res = await axios(BASE_URL + '/escha/Materials')
    const $ = cheerio.load(res.data)

    const rows = $('#mw-content-text > table > tbody > tr')
    const materials = []
    rows.each((i, row) => {
        if (i == 0)
            return

        const uri = $(':nth-child(1) a', row).attr('href')
        materials.push({ uri })
    })

    for await (const m of materials) {
        const ress = await axios(BASE_URL + m.uri)
        const $$ = cheerio.load(ress.data)

        m.name = $$('#firstHeading').text()

        const categoriesCell = $$('#mw-content-text > table:nth-child(2) > tbody > tr > td:contains("Categories")').next()
        m.categories = $$('a', categoriesCell).contents()
                .filter(function() { return this.nodeType === 3 })
                .map((j, el) => el.data)
                .toArray()

        console.log(`Finished: ${m.name}`)
        await new Promise(r => setTimeout(r, 50));
    }

    console.log(materials)

    var session = driver.session()

    result = await session.run(`
        UNWIND $materials AS material 
        MERGE (m:Material {name: material.name })
        FOREACH (category IN material.categories |
            MERGE (c:Category {name: category})
            MERGE (m)-[:IS]->(c)
        )
        `, { materials }
    )

    await session.close()
    await driver.close()




    // const res = await axios('https://wikiwiki.jp/escha-logy/%E7%B4%A0%E6%9D%90')
    
    // const $ = cheerio.load(res.data)

    // const rows = $('#content > div.ie5 > table > tbody > tr')
    // rows.each((i, row) => {
    //     if (i >= rows.length - 3)
    //         return

    //     const name = $(':nth-child(1)', row).text()
        
    //     const categories = $(':nth-child(2)', row).contents()
    //         .filter(function() { return this.nodeType === 3 })
    //         .map((j, el) => el.data)
    //         .toArray()

    //     const locations = $(':nth-child(11)', row).contents()
    //         .filter(function() { return this.nodeType === 3 && this.data != 'なし' })
    //         .map((j, el) => el.data)
    //         .toArray()

    //     const monsters = $(':nth-child(12)', row).contents()
    //         .filter(function() { return this.nodeType === 3 && this.data != 'なし' })
    //         .map((j, el) => el.data)
    //         .toArray()

    //     console.log(`${name},${categories.join('|')},${locations.join('|')},${monsters.join('|')}`)
    // })

})()