import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Market from '@/components/Market'
import LightRoom from '@/components/LightRoom'
import Favorites from '@/components/Favorites'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/LightRoom',
      name: 'LightRoom',
      component: LightRoom
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Market',
      name: 'Market',
      component: Market
    },
    {
      path: '/Favorites',
      name: 'Favorites',
      component: Favorites
    }
  ]
})
