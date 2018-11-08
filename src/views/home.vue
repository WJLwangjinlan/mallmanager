<template>
<el-container class="container">
  <el-header class="header">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../assets/css/logo.png" alt="">
        </div>
      </el-col>
      <el-col :span="19" class="middle">
        <h2>电商后台管理系统</h2>
      </el-col>
      <el-col :span="1" class="loginout">
        <a href="#" class="loginout" @click="loginout()">退出</a>
      </el-col>
  </el-header>
  <el-container>
    <el-aside width="200px" class="aside">
      <el-menu
      :unique-opened = "true"
      default-active="1"
      :router = "true"
      class="el-menu-vertical-demo menu">

      <!-- 用户管理 -->
      <el-submenu :index="index + ''" v-for="(item1,index) in menus" :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item1.authName}}</span>
        </template>
          <el-menu-item :index="'/' + item2.path" v-for="(item2,index) in item1.children" :key="index">
            <i class="el-icon-menu"></i>
            {{item2.authName}}</el-menu-item>
      </el-submenu>

      </el-menu>
    </el-aside>

    <el-main class="container">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return{
      menus:[]
    }
  },
  beforeCreate () {
    // 从session中获取token。判断是否有token
    // token 渲染组件
    // const token = sessionStorage.getItem('token')
    // if (!token) {
    //   // 返回登录页面
    //   this.$router.push('/login')
    //   this.$message.warning('请先登录')
    // } else {
    //   // 否则到home页面
    //   this.$message.warning('进入到Home页面')
    //   this.$router.push('/')
    // }
  },
  // 调用getMenus方法
  created() {
      this.getMenus()
  },
  methods: {
    loginout () {
      // 1 清除session中token
      sessionStorage.clear()
      // 2 跳转页面
      this.$router.push({name: 'login'})
      // 3 提示
      this.$message.success('退出成功')
    },

    // 获取左侧动态的菜单
    async getMenus() {
      const res = await this.$http.get(`menus`)
      // console.log(res)
      this.menus = res.data.data
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
  height: 100%;
}
.header .middle {
  line-height: 60px;
  color: #fff;
  text-align: center;
}

.header .loginout {
  line-height: 60px;
  text-decoration: none;
}
.aside .menu {
  height: 100%;
}
</style>
