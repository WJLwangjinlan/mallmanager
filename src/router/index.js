import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/users'
Vue.use(Router)
export default new Router({
  routes: [{
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: User
      },{
        name: 'user',
        path: '/users',
        component: User
      }
    ]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }
  ]
})
