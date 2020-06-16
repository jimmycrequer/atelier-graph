<template>
  <div>
      <h1>Explore Properties</h1>

      <div class="container" v-if="selectedPropTmp">
        <div class="propertiesGroup" v-for="(pp, i) in selectedPropTmp.lowerP" :key="i">
          <div v-for="(p, j) in pp" :key="j">
            {{ p }}
          </div>
        </div>
      </div>

      <input type="text" v-model="q" />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in properties" :key="prop.id">
            <td>{{ prop.name }}</td>
            <td>{{ prop.description }}</td>
            <td><input type="checkbox" v-model="prop._selected"></td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      q: ""
    }
  },

  computed: {
    properties() { 
      let props = this.$store.getters.propertiesTop

      if (this.q) {
        props = props.filter(prop => {
          if (prop._selected)
            return true

          return prop.name.indexOf(this.q) > -1 
            || prop.description.indexOf(this.q) > -1
            || prop.lowerP.join(" ").indexOf(this.q) > 1
        })
      }

      return props
    },
    selectedPropTmp() {
      return {
        name: "究極の破壊力",
        lowerP: [
          ["破壊力", "破壊力＋", "破壊力＋＋"],
          ["大きな破壊力", "スーパー破壊力"],
          ["究極の破壊力"]
        ]
      }
    }
  },

  created() {
    this.$store.dispatch("loadProperties")
  }
}
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
  text-align: left;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

tr:nth-child(even) { background-color: #f2f2f2; }

tr:hover { background-color: #ddd; }

th {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: rgb(220, 199, 144);
  color: white;
}

input {
  display: block;
  padding: 8px;
}

.propertiesGroup {
  display: inline-block;
  width: 300px;
  background-color: antiquewhite;
}

.propertiesGroup div {
  background-color: aqua;
  margin: 10px;
}

.container {
  display: flex;
  align-items: center;
}
</style>