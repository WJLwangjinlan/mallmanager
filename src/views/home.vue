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
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="/users">
            <i class="el-icon-menu"></i>
            用户列表</el-menu-item>
      </el-submenu>
      <!-- 权限管理 -->
            <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
          <el-menu-item index="roles">
            <i class="el-icon-menu"></i>
            角色列表</el-menu-item>
          <el-menu-item index="rights">
            <i class="el-icon-menu"></i>
            权限列表</el-menu-item>
      </el-submenu>
      <!-- 商品管理 -->
            <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
          <el-menu-item index="3-1">
            <i class="el-icon-menu"></i>
            商品列表</el-menu-item>
            <el-menu-item index="3-2">
            <i class="el-icon-menu"></i>
            分类参数</el-menu-item>
            <el-menu-item index="3-3">
            <i class="el-icon-menu"></i>
            商品分类</el-menu-item>
      </el-submenu>
      <!-- 订单管理 -->
            <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
          <el-menu-item index="4-1">
            <i class="el-icon-menu"></i>
            订单列表</el-menu-item>
      </el-submenu>
      <!-- 数据统计 -->
            <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
          <el-menu-item index="5-1">
            <i class="el-icon-menu"></i>
            数据报表</el-menu-item>
      </el-submenu>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  beforeCreate () {
    // 从session中获取token。判断是否有token
    // token 渲染组件
    const token = sessionStorage.getItem('token')
    if (!token) {
      // 返回登录页面
      this.$router.push('/login')
      this.$message.warning('请先登录')
    } else {
      // 否则到home页面
      this.$message.warning('进入到Home页面')
      this.$router.push('/')
    }
  },
  methods: {
    loginout () {
      // 1 清除session中token
      sessionStorage.clear()
      // 2 跳转页面
      this.$router.push({name: 'login'})
      // 3 提示
      this.$message.success('退出成功')
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
