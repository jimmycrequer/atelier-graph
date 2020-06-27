<template>
    <div>
        <div id="btn-bar" class="row">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#chooseProperties">
            Choose properties
          </button>
        </div>

        <template v-if="properties">
          <div class="propertyContainer" v-for="(p, k) in properties" :key="k">
            <div class="propertiesGroup" v-for="(c, i) in p.clusterNodes" :key="i">
              <div v-for="(n, j) in c" :key="j">
                {{ n }}
              </div>
            </div>
          </div>
        </template>

        <table>
          <thead>
            <tr>
              <th>Categories</th>
              <th>Item Name</th>
              <th>Properties</th>
              <th>Item Recipe</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in components" :key="i">
              <td>{{ c.categories.join(" - ") }}</td>
              <td>{{ c.item }}</td>
              <td>{{ c.props.join(" - ") }}</td>
              <td>{{ c.recipe.join(" - ") }}</td>
            </tr>
          </tbody>
        </table>

        <div class="modal fade" id="chooseProperties" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Choose Properties</h5>
              </div>

              <div class="modal-body">
                <property-list></property-list>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

    </div>
</template>

<script>
import PropertyList from "../components/PropertyList"

export default {
  components: {
    PropertyList
  },
  computed: {
    properties() {
      return this.$store.state.selectedProperties
    },

    components() {
      return this.$store.state.components
    }
  }
}
</script>

<style>

</style>
