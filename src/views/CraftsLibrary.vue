<template>
    <div>
        <div id="btn-bar" class="row">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addForm">
            Add new craft
          </button>
          <button type="button" class="btn btn-danger" @click="deleteAllCustom">
            Clear all crafts
          </button>
        </div>

        <div class="row">
          <table>
              <thead>
              <tr>
                  <th>Item Categories</th>
                  <th>Item Name</th>
                  <th>Ingredients</th>
                  <th>Property</th>
              </tr>
              <tr>
                  <th><autocomplete :source="categories" results-property="name" results-display="name" /></th>
                  <th><autocomplete :source="items" results-property="name" results-display="name" /></th>
                  <th><autocomplete :source="items" results-property="name" results-display="name" /></th>
                  <th><autocomplete :source="properties" results-property="name" results-display="name" /></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="c in custom" :key="+c.id">
                  <td>{{ c.categories.join(" ") }}</td>
                  <td>{{ c.item }}</td>
                  <td>{{ c.ingredients.join(" | ") }}</td>
                  <td>{{ c.properties.join(" | ") }}</td>
              </tr>
              </tbody>
          </table>
        </div>

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
                      <autocomplete ref="item" :source="craftableItems" results-property="name" results-display="name" @selected="chooseItem" />
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
            tempCraft: {
              item: "",
              recipe: [],
              ingredients: [],
              properties: ["", "", ""]
            }
        }
    },

    computed: {
        custom() { return this.$store.state.customCrafts },
        items() { return this.$store.state.items },
        craftableItems() { return this.$store.getters.craftableItems },
        categories() { return this.$store.state.categories },
        properties() { return this.$store.state.allProperties }
    },

    methods: {
      chooseItem(item) {
        item = item.selectedObject

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
        if (!this.tempCraft.ingredients[0]) {
          this.tempCraft.ingredients = []
        }

        this.tempCraft.properties = []
        if (this.$refs.props1.selectedDisplay)
          this.tempCraft.properties.push(this.$refs.props1.selectedDisplay)
        if (this.$refs.props2.selectedDisplay)
          this.tempCraft.properties.push(this.$refs.props2.selectedDisplay)
        if (this.$refs.props3.selectedDisplay)
          this.tempCraft.properties.push(this.$refs.props3.selectedDisplay)

        this.$store.dispatch("saveCraft", this.tempCraft).then(() => {
          this.$refs.item.clear()
          this.$refs.items.forEach(i => i.clear())
          this.$refs.props1.clear()
          this.$refs.props2.clear()
          this.$refs.props3.clear()
        })
      },

      deleteAllCustom() {
        this.$store.dispatch("deleteAllCustom")
      }
    }
}
</script>

<style>
#btn-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

#btn-bar > button {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
