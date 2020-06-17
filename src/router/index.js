import Vue from 'vue'
import VueRouter from 'vue-router'
import PropertyList from '../views/PropertyList.vue'
import CustomProperties from '../views/CustomProperties.vue'
import Candidates from '../views/Candidates.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/properties'
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/properties',
    name: 'Properties',
    component: PropertyList
  },
  {
    path: '/custom',
    name: 'Custom',
    component: CustomProperties
  },
  {
    path: '/candidates',
    name: 'Candidates',
    component: Candidates
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
