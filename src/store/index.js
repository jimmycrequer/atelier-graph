import Vue from 'vue'
import Vuex from 'vuex'
import neo4j from 'neo4j-driver'

Vue.use(Vuex)

const driver = neo4j.driver(`bolt://${process.env.VUE_APP_NEO4J_HOST}`, neo4j.auth.basic(process.env.VUE_APP_NEO4J_USER, process.env.VUE_APP_NEO4J_PWD))

export default new Vuex.Store({
  state: {
    properties: [],
    items: [],
    categories: [],
    selectedProperties: [],
    components: []
  },
  getters: {
    propertiesTop: state => {
      return state.properties
    },

    craftableItems: state => {
      return state.items.filter(item => item.recipe.length > 0)
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
    },

    addComponents(state, components) {
      state.components = components
    },

    toggleSelectedProperty(state, property) {
      const idx = state.selectedProperties.map(p => p.name).indexOf(property.name)

      if (idx > -1) {
        state.selectedProperties.splice(idx, 1)
      }
      else if (state.selectedProperties.length < 3) {
        state.selectedProperties.push(property)
      }
    }
  },
  actions: {
    async loadItems(context) {
      const query = `
        MATCH (i:Item)
        RETURN
        id(i) AS id,
          i.name AS name,
          [(i)<-[:CONTAINS]-(c) | c.name] AS categories,
          [(i)-[:NEEDS]->(n) | n.name] AS recipe
        ORDER BY name ASC
      `

      const session = driver.session()
      const res = await session.run(query)

      const items = res.records.map(r => {
        return {
          id: r.get("id"),
          name: r.get("name"),
          categories: r.get("categories"),
          recipe: r.get("recipe")
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
        MATCH (p:Test)
        WHERE NOT EXISTS( (p)-[:TO]->(:Test) )
        MATCH path = (pp:Test)-[:TO*0..]->(p)
        WITH p, length(path) AS degree, collect(DISTINCT [nn in nodes(path) | nn.name][0]) AS nodesPerDegree
        ORDER BY degree DESC
        RETURN
        id(p) AS id,
        p.name AS name,
        p.description AS description,
        p.attack AS attack,
        p.heal AS heal,
        p.ornament AS ornament,
        p.armor AS armor,
        p.weapon AS weapon,
        sum(size(nodesPerDegree)) AS clusterSize,
        collect(nodesPerDegree) AS clusterNodes
        ORDER BY clusterSize DESC
      `

      const session = driver.session()

      const res = await session.run(query)

      if (res.records) {
        const properties = res.records.map(record => {
          return {
            id: record.get("id"),
            name: record.get("name"),
            description: record.get("description"),
            attack: record.get("attack"),
            heal: record.get("heal"),
            ornament: record.get("ornament"),
            armor: record.get("armor"),
            weapon: record.get("weapon"),
            clusterSize: record.get("clusterSize"),
            clusterNodes: record.get("clusterNodes")
          }
        })

        context.commit("addProperties", properties)
      }

      await session.close()
    },

    async findComponents({ commit, state }) {
      const query = `
        MATCH (p:Property)-[r:TO*0..]->(endp:Property)
        WHERE endp.name IN $props
        WITH DISTINCT p
        MATCH (i:Item)-[:HAS]->(p)
        RETURN
          [(c:Category)-[:CONTAINS]->(i) | c.name] as categories,
          i.name AS item,
          collect(p.name) AS props,
          [(i)-[:NEEDS]->(ii) | ii.name] as recipe
        ORDER BY length(props) DESC
      `
      const params = { props: state.selectedProperties.map(p => p.name) }

      const session = driver.session()

      const res = await session.run(query, params)

      if (res.records) {
        const components = res.records.map(record => {
          return {
            categories: record.get("categories"),
            item: record.get("item"),
            props: record.get("props"),
            recipe: record.get("recipe")
          }
        })

        commit("addComponents", components)
      }

      await session.close()
    },

    toggleProperty({ commit }, property) {
      commit("toggleSelectedProperty", property)
    },

    async saveCraft({ commit }, params) {
      const query = `
        CREATE (c:Custom {ingredients: $ingredients, properties: $properties})
        WITH c
        MATCH (i:Item {name: $item}), (p:Property)
        WHERE p.name IN $properties
        MERGE (c-[:HAS {custom: true}]->(p)
        MERGE (i)-[:CUSTOM]->(c)
      `

      const session = driver.session()

      const res = await session.run(query, params)
      console.log(res)

      commit("addCustomCraft", params)
    }
  },
  modules: {
  }
})
