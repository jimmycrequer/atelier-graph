<template>
    <div>
        <h1>Manage Custom Properties</h1>

        <table>
            <thead>
            <tr>
                <th>Item Categories</th>
                <th>Item Name</th>
                <th>Property</th>
            </tr>
            <tr>
                <th><autocomplete :source="categories" results-property="name" results-display="name" /></th>
                <th><autocomplete :source="items" results-property="name" results-display="name" /></th>
                <th><autocomplete :source="properties" results-property="name" results-display="name" /></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="c in custom" :key="+c.id">
                <td>{{ c.categories.join(" ") }}</td>
                <td>{{ c.item }}</td>
                <td>{{ c.property }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Autocomplete from 'vuejs-auto-complete'

export default {
    components: {
        Autocomplete
    },

    data() {
        return {
            custom: []
        }
    },

    computed: {
        items() { return this.$store.state.items },
        categories() { return this.$store.state.categories },
        properties() { return this.$store.state.properties }
    },

    async created() {
        const query = `
            MATCH (i:Item)-[r:HAS {custom: true}]->(p:Property)
            RETURN id(r) AS id,
                    [ (c:Category)-[:CONTAINS]->(i) | c.name ] AS categories,
                    i.name AS item, 
                    p.name AS property
            ORDER BY item
        `

        const session = this.$root.$driver.session()

        const res = await session.run(query)
            
        if (res.records) {
            res.records.forEach(record => {
                this.custom.push({
                    id: record.get("id"),
                    categories: record.get("categories"),
                    item: record.get("item"),
                    property: record.get("property")
                })
            })
      }

      await session.close()
    }
}
</script>

<style>

</style>