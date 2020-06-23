<template>
  <div id="app">
    <div id="nav">
      <router-link to="/properties">Properties</router-link> |
      <router-link to="/custom">Custom</router-link> |
      <router-link to="/candidates">Candidates</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("loadItems")
    this.$store.dispatch("loadCategories")
    this.$store.dispatch("loadProperties")
    this.$store.dispatch("loadCustomCrafts")
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
