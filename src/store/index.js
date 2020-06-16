import Vue from 'vue'
import Vuex from 'vuex'
import neo4j from 'neo4j-driver'

Vue.use(Vuex)

const driver = neo4j.driver(`bolt://${process.env.VUE_APP_NEO4J_HOST}`, neo4j.auth.basic(process.env.VUE_APP_NEO4J_USER, process.env.VUE_APP_NEO4J_PWD))

export default new Vuex.Store({
  state: {
    properties: [],
    items: [],
    categories: []
  },
  getters: {
    propertiesTop: state =>{
      return state.properties.filter(prop => prop.upperP.length == 0)
    }
  },
  mutations: {
    addProperties(state, properties) {
      state.properties = properties
    },

    addItems(state, items) {
      state.items = items
    },

    addCategories(state, categories) {
      state.categories = categories
    }
  },
  actions: {
    async loadItems(context) {
      const query = `
        MATCH (i:Item)
        RETURN id(i) AS id, i.name AS name
        ORDER BY name ASC
      `

      const session = driver.session()
      const res = await session.run(query)

      const items = res.records.map(r => {
        return {
          id: r.get("id"),
          name: r.get("name")
        }
      })

      await session.close()

      context.commit("addItems", items)
    },
    async loadCategories(context) {
      const query = `
        MATCH (c:Category)
        RETURN id(c) AS id, c.name AS name
        ORDER BY name ASC
      `

      const session = driver.session()
      const res = await session.run(query)

      const items = res.records.map(r => {
        return {
          id: r.get("id"),
          name: r.get("name")
        }
      })

      await session.close()

      context.commit("addCategories", items)
    },

    async loadProperties(context) {
      const query = `
        MATCH (p:Property)
        OPTIONAL MATCH (p)<-[:TO]-(lowerP:Property)
        OPTIONAL MATCH (p)-[:TO]->(upperP:Property)
        RETURN id(p) AS id, 
               p.name AS name, 
               p.description AS description, 
               collect(DISTINCT lowerP.name) AS lowerP,
               collect(DISTINCT upperP.name) AS upperP
      `

      const session = driver.session()

      const res = await session.run(query)
        
      if (res.records) {
        const properties = res.records.map(record => {
          return {
            id: record.get("id"),
            name: record.get("name"),
            description: record.get("description"),
            lowerP: record.get("lowerP"),
            upperP: record.get("upperP")
          }
        })

        context.commit("addProperties", properties)
      }

      await session.close()
    }
  },
  modules: {
  }
})
