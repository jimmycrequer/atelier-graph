(async () => {

    const axios = require('axios')
    const cheerio = require('cheerio')


    const res = await axios('https://wikiwiki.jp/escha-logy/%E7%B4%A0%E6%9D%90')
    
    const $ = cheerio.load(res.data)

    const rows = $('#content > div.ie5 > table > tbody > tr')
    rows.each((i, row) => {
        if (i >= rows.length - 3)
            return

        const name = $(':nth-child(1)', row).text()
        
        const categories = $(':nth-child(2)', row).contents()
            .filter(function() { return this.nodeType === 3 })
            .map((j, el) => el.data)
            .toArray()

        const locations = $(':nth-child(11)', row).contents()
            .filter(function() { return this.nodeType === 3 && this.data != 'なし' })
            .map((j, el) => el.data)
            .toArray()

        const monsters = $(':nth-child(12)', row).contents()
            .filter(function() { return this.nodeType === 3 && this.data != 'なし' })
            .map((j, el) => el.data)
            .toArray()

        console.log(`${name},${categories.join('|')},${locations.join('|')},${monsters.join('|')}`)
    })

})()