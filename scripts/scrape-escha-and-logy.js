(async () => {

    const axios = require('axios')
    const cheerio = require('cheerio')
    const neo4j = require('neo4j-driver')


    require('dotenv').config()


    const driver = neo4j.driver(`bolt://${process.env.NEO4J_HOST}`, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD))

    const BASE_URL = 'https://barrelwisdom.com'


    await importMaterials()
    await importRecipes()


    await driver.close()


    async function importMaterials() {
        const materials = []

        let res = await axios(BASE_URL + '/escha/Materials')
        let $ = cheerio.load(res.data)
    
        const rows = $('#mw-content-text > table > tbody > tr')
        rows.each((i, row) => {
            if (i == 0)
                return
    
            const uri = $(':nth-child(1) a', row).attr('href')
            materials.push({ uri })
        })
    
        for (let i = 0; i < materials.length; i++) {
            const m = materials[i]
    
            res = await axios(BASE_URL + m.uri)
            $ = cheerio.load(res.data)
    
            m.name = $('#firstHeading').text()
    
            const categoriesCell = $('#mw-content-text > table:nth-child(2) > tbody > tr > td:contains("Categories")').next()
            m.categories = $('a', categoriesCell).contents()
                    .filter(function() { return this.nodeType === 3 })
                    .map((j, el) => el.data)
                    .toArray()
    
            console.log(`Finished: ${m.name} (${i+1}/${materials.length})`)
            await new Promise(r => setTimeout(r, 10));
        }
    
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
    }

    async function importRecipes() {
        const recipes = []

        let res = await axios(BASE_URL + '/escha/Recipe_Books')
        let $ = cheerio.load(res.data)
    
        const rows = $('#mw-content-text > table > tbody > tr')
        rows.each((i, row) => {
            if (i == 0)
                return
    
            $('td.Recipes.smwtype_wpg a', row).each((j, a) => {
                const uri = $(a).attr('href')
                recipes.push({ uri })
            })  
        })
    
        for (let i = 0; i < recipes.length; i++) {
            const r = recipes[i]
    
            res = await axios(BASE_URL + r.uri)
            $ = cheerio.load(res.data)
    
            r.name = $('#firstHeading').text()

            const ingredientsCell = $('#mw-content-text > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(1)').next()
            r.ingredients = $('a', ingredientsCell).contents()
                    .filter(function() { return this.nodeType === 3 })
                    .map((j, el) => el.data)
                    .toArray()
    
            const categoriesCell = $('#mw-content-text > table:nth-child(2) > tbody > tr > td:contains("Categories")').next()
            r.categories = $('a', categoriesCell).contents()
                    .filter(function() { return this.nodeType === 3 })
                    .map((j, el) => el.data)
                    .toArray()
    
            console.log(`Finished: ${r.name} (${i+1}/${recipes.length})`)
            await new Promise(r => setTimeout(r, 10));
        }

        var session = driver.session()

        result = await session.run(`
            UNWIND $recipes AS recipe 
            MERGE (r:Recipe {name: recipe.name })
            
            WITH r, recipe
            UNWIND recipe.ingredients AS ingredient
            MATCH (i {name: ingredient})
            MERGE (r)-[:NEEDS]->(i)

            WITH r, recipe
            FOREACH (category IN recipe.categories |
                MERGE (c:Category {name: category})
                MERGE (r)-[:IS]->(c)
            )
            `, { recipes }
        )
    
        await session.close()
    }

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
