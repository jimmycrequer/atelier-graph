<template>
    <div>
        <template v-if="properties">
          <div class="container" v-for="(p, k) in properties" :key="k">
            <div>{{ p.clusterNodes.join(" - ") }}</div>
            <!-- <div class="propertiesGroup" v-for="(pp, i) in selectedPropTmp.lowerP" :key="i">
              <div v-for="(p, j) in pp" :key="j">
                {{ p }}
              </div>
            </div> -->
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
    </div>
</template>

<script>
export default {
  computed: {
    properties() {
      return this.$store.state.selectedProperties
    },

    components() {
      return this.$store.state.components
    }
  },

  created() {
    this.$store.dispatch("findComponents")
  }
}
</script>

<style>

</style>
