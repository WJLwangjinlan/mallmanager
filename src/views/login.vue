<template>
<div class="login-wrap">
  <el-form class="login-form" label-position="top" label-width="80px">
    <h2>用户登录</h2>
    <el-form-item label="用户名">
      <el-input v-model="formdata.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="formdata.password"></el-input>
    </el-form-item>
    <el-button class="login-button" type="primary" @click.prevent="handleLogin()">登录</el-button>
  </el-form>

</div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      // console.log(this.formdata)
      const res = await this.$http.post('login', this.formdata)
      console.log(res)
      const {
        meta
      } = res.data
      // 判断是否登录成功
      if (meta.status === 200) {
        // 登录成功
        window.sessionStorage.setItem('token',res.data.data.token)
        this.$message.success(meta.msg)
        this.$router.push('/')
      } else {
        // 登录失败
        this.$message.warning(meta.msg)
      }
    }
  }
}

// handleLogin () {
//   this.$http.post('login', this.formdata)
//     .then((res) => {
//       const {meta} = res.data
// // 提示框
//       if (meta.status === 200) {
// // 登录成功
//         this.$message.success(meta.msg)
//       } else {
// // 登录失败
//         this.$message.warning(meta.msg)
//       }
//     })
// }
// }
// }
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-button {
  width: 100%;
}
</style>
