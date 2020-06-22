<template>
    <div>
        <h1>Manage Custom Properties</h1>

        <div class="row">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addForm">
            Add new craft
          </button>
        </div>

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

        <div class="modal fade" id="addForm" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add Form</h5>
              </div>

              <div class="modal-body">
                <form>
                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Item</label>
                    <div class="col-sm-10">
                      <autocomplete :source="craftableItems" results-property="name" results-display="name" @selected="chooseItem" />
                    </div>
                  </div>

                  <div class="form-group row" v-for="(r, i) in tempCraft.recipe" :key="i">
                    <label class="col-sm-2 col-form-label">{{ r }}</label>
                    <div class="col-sm-10">
                      <autocomplete ref="items" :source="itemsForCategory(r)" results-property="name" results-display="name" />
                    </div>
                  </div>

                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Property 1</label>
                    <div class="col-sm-10">
                      <autocomplete ref="props1" :source="properties" results-property="name" results-display="name" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Property 2</label>
                    <div class="col-sm-10">
                      <autocomplete ref="props2" :source="properties" results-property="name" results-display="name" />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Property 3</label>
                    <div class="col-sm-10">
                      <autocomplete ref="props3" :source="properties" results-property="name" results-display="name" />
                    </div>
                  </div>
                </form>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="saveCraft">Save</button>
              </div>
            </div>
          </div>
        </div>
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
            custom: [],

            tempCraft: {
              item: "",
              recipe: [],
              ingredients: [],
              properties: ["", "", ""]
            }
        }
    },

    computed: {
        items() { return this.$store.state.items },
        craftableItems() { return this.$store.getters.craftableItems },
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
    },

    methods: {
      chooseItem(item) {
        item = item.selectedObject
        console.log(item)
        this.tempCraft = {
          item: item.name,
          recipe: item.recipe,
          ingredients: []
        }
      },

      itemsForCategory(category) {
        return this.items.filter(item => {
          if (item.name == category)
            return true

          return item.categories.includes(category)
        })
      },

      saveCraft() {
        this.tempCraft.ingredients = this.$refs.items.map(n => n.selectedDisplay)
        this.tempCraft.properties = [
          this.$refs.props1.selectedDisplay,
          this.$refs.props2.selectedDisplay,
          this.$refs.props3.selectedDisplay
        ]

        this.$store.dispatch("saveCraft", this.tempCraft)
      }
    }
}
</script>

<style>

</style>
