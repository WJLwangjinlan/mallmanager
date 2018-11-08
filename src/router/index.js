import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import User from '@/views/users'
import Rights from '@/views/Rights'
import Role from '@/views/Role'
import Cateparams from '@/views/Cateparams'
import Goodscate from '@/views/goodscate'
import Goodslist from '@/views/goodslist'
import GoodsAdd from '@/views/goodsadd'

Vue.use(Router)

const router = new Router({
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
      },{
        name: 'rights',
        path: '/rights',
        component: Rights
      },{
        name: 'role',
        path: '/roles',
        component: Role
      },{
        name: 'params',
        path: '/params',
        component: Cateparams
      },{
        name: 'categories',
        path: '/categories',
        component: Goodscate
      },{
        name: 'goods',
        path: '/goods',
        component: Goodslist
      },{
        name: 'addgoods',
        path: '/goods/add',
        component: GoodsAdd
      },
    ]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }
  ]
})

// 导航守卫，跳出时会触发
router.beforeEach((to, from, next) => {
  // console.log(to,from)
  if(to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    // 判断token是否存在 不存在去登录页面 存在去home页面
      if (!token) {
        // 返回登录页面
        router.push('/login')
        Message.success('请先登录')
      } else {
        // 否则到home页面
        // Message.warning('进入到Home页面')
        // router.push('/')
        next()
      }
  }

  // const token = sessionStorage.getItem('token')
  // // 判断token是否存在 不存在去登录页面 存在去home页面
  //   if (!token) {
  //     // 返回登录页面
  //     this.$router.push('/login')
  //     this.$message.warning('请先登录')
  //   } else {
  //     // 否则到home页面
  //     this.$message.warning('进入到Home页面')
  //     this.$router.push('/')
  //   }

  next()

})

// 导出router
export default router


