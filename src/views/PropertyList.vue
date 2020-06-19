<template>
  <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cluster Size</th>
            <th>Attack</th>
            <th>Heal</th>
            <th>Ornament</th>
            <th>Armor</th>
            <th>Weapon</th>
          </tr>
          <tr>
            <th><input type="text" v-model="q.name" /></th>
            <th><input type="text" v-model="q.description" /></th>
            <th><input type="text" v-model="q.clusterSize" /></th>
            <th><input type="checkbox" v-model="q.attack" /></th>
            <th><input type="checkbox" v-model="q.heal" /></th>
            <th><input type="checkbox" v-model="q.ornament" /></th>
            <th><input type="checkbox" v-model="q.armor" /></th>
            <th><input type="checkbox" v-model="q.weapon" /></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in properties" :key="prop.id" @click="toggle(prop)" :class="{ 'selected' : prop._selected }">
            <td>{{ prop.name }}</td>
            <td>{{ prop.description }}</td>
            <td>{{ prop.clusterSize }}</td>
            <td><input type="checkbox" onclick="return false;" :checked="prop.attack" /></td>
            <td><input type="checkbox" onclick="return false;" :checked="prop.heal" /></td>
            <td><input type="checkbox" onclick="return false;" :checked="prop.ornament" /></td>
            <td><input type="checkbox" onclick="return false;" :checked="prop.armor" /></td>
            <td><input type="checkbox" onclick="return false;" :checked="prop.weapon" /></td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      q: {
        name: "",
        description: "",
        clusterSize: "",
        attack: false,
        heal: false,
        ornament: false,
        armor: false,
        weapon: false
      }
    }
  },

  computed: {
    selectedProperties() {
      return this.$store.state.selectedProperties
    },

    properties() {
      return this.$store.getters.propertiesTop.filter(prop => {
        prop._selected = this.selectedProperties.map(p => p.name).indexOf(prop.name) > -1

        if (prop._selected)
          return true

        return (!this.q.name || prop.name.indexOf(this.q.name) > -1)
          && (!this.q.description || prop.description.indexOf(this.q.description) > -1)
          && (!this.q.clusterSize || prop.clusterSize == +this.q.clusterSize)
          && (!this.q.attack || prop.attack == this.q.attack)
          && (!this.q.heal || prop.heal == this.q.heal)
          && (!this.q.ornament || prop.ornament == this.q.ornament)
          && (!this.q.armor || prop.armor == this.q.armor)
          && (!this.q.weapon || prop.weapon == this.q.weapon)
      })
    }
  },

  created() {
    this.$store.dispatch("loadProperties")
  },

  methods: {
    toggle(prop) {
      this.$store.dispatch("toggleProperty", prop)
    }
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
  width: 150px;
  background-color: antiquewhite;
}

.propertiesGroup div {
  background-color: aqua;
  margin: 10px;
}

.container {
  display: flex;
  align-items: center;
  float: left;
  padding: 20px;
}

tr.selected {
  background-color: red;
}
</style>
