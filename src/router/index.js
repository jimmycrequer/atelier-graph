import Vue from 'vue'
import VueRouter from 'vue-router'
import CraftsLibrary from '../views/CraftsLibrary.vue'
import PropertiesExplorer from '../views/PropertiesExplorer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/explorer'
  },
  {
    path: '/explorer',
    name: 'PropertiesExplorer',
    component: PropertiesExplorer
  },
  {
    path: '/library',
    name: 'CraftsLibrary',
    component: CraftsLibrary
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
