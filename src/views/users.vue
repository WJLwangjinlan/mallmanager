<template>
<el-card class="box-card">
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索框 -->
  <el-row class="searchArea">
    <el-col :span="24">
      <el-input placeholder="请输入内容" class="searchInput" v-model="searchVal">
        <el-button slot="append" icon="el-icon-search" @click.prevent="checkUser()"></el-button>
      </el-input>
      <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
    </el-col>
  </el-row>

  <!-- 表格 -->
  <el-table  v-loading="loading" height="300" :data="list" style="width: 100%">
    <el-table-column type="index" prop="date" label="#" width="100">
    </el-table-column>
    <el-table-column prop="username" label="姓名" width="100">
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="140">
    </el-table-column>
    <el-table-column prop="mobile" label="电话" width="100">
    </el-table-column>
    <el-table-column label="创建日期" width="180">
      <template slot-scope="scope">
        <!-- man.js里面定义的fmtDate -->
        {{scope.row.create_time | fmtDate}}
      </template>
    </el-table-column>
    <el-table-column label="用户状态" width="120">
    <!-- 开关 -->
    <!-- 单元格的内容不是字符串时，若果是其他的组件比如开关，需要在组件的外面加上一个容器
    scope就是list
    scope.row 就是list中的每一个元素 ，在这里是对象{}
    scope.row 是当前行的内容
    -->
      <template slot-scope="scope">
        <el-switch @change="changeSwitchMgstate(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="140">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.prevent="showEditBox(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.prevent="showDeleBox(scope.row.id)"></el-button>
        <el-button type="success" icon="el-icon-check" size="mini" circle @click.prevent="showRoleBox(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
        <el-button type="primary" @click.prevent="EditUser()">确 定</el-button>
      </div>
    </el-dialog>
    
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleSetrole">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- el-select的v-model绑定的值如果和el-option的value的值一样就显示当前el-option的label -->
          <el-select v-model="currRoleId">
            <!-- 请选择 -->
            <el-option disabled label="请选择" :value="-1">

            </el-option>
            <!-- 遍历数组 -->
            <el-option
              v-for="(item,index) in roles"
              :label="item.roleName"
              :key="index"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSetrole = false">取 消</el-button>
        <el-button type="primary" @click.prevent="setRole()">确 定</el-button>
      </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      // tableData: [],
      list: [],
      // 加载动画
      loading: true,
      // 分页相关的变量:
      currentPage: 1, // 当前页数
      // 总量
      total:0,
      pagesize:2, // 每页几条数
      pagenum:1,
      // 搜索框查询的关键字
      searchVal: '',
      // 添加对话框的属性
      dialogFormVisibleAdduser: false,
      // 对话框input的宽度
      formLabelWidth: '70px',
      // 表单数据
      formData:{
        name:''
      },
      // 编辑对话用户框属性
      dialogFormVisibleEdituser: false,
      // 分配权限对话用户框属性
      dialogFormVisibleSetrole: false,
      // 当前的用户名
      currUserName: '',
      // 当亲角色名
      currRoleId: -1,
      // 所有的角色
      roles: [],
      // 用户id
      currUserId: -1
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    // 分页相关的方法
    handleSizeChange(val) {
      this.pagesize = val
      this.loadTableData()
      console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
      this.pagenum = val
      this.loadTableData()
      console.log(`当前页: ${val}`);
    },
    
    
    async loadTableData() {
      this.loading = true
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      // console.log(res)
      const {
        data: {
          users,
          total
        },
        meta: {
          msg,
          status
        }
      } = res.data
      this.total = total
      // 判断 如果这个状等于200
      if (status === 200) {
        this.loading = false
        this.list = users

        this.pagenum=1
        this.pagesize=2
        this.currentPage=1
        // console.log(this.list)
      }
    },

    // 查询用户
    checkUser() {
      // 调用
      this.loadTableData()
    },

    // 改变用户状态
    async changeSwitchMgstate(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res)
      const {meta:{status,msg}} =res.data
      if (status === 200) {
        // 提示框
        this.$message.success(msg)
      } else {
        
      }
    },

    // 显示删除提示框
    async showDeleBox(userId) {
      this.$confirm('Sure?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then( async () => {

          const res = await this.$http.delete(`users/${userId}`)
          const {meta:{msg,status}} = res.data
          if (status === 200) {
            // 刷新数据
            this.loadTableData()
            // 提示框
            this.$message({
            type: 'success',
            message: msg
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: msg
          })
        })
    },

    // 显示添加的对话框
    async showAddUserDia() {
      this.dialogFormVisibleAdduser = true
    },

    // 添加用户
    async addUser() {
      // 关闭对话框
      this.dialogFormVisibleAdduser = false
      // 发送请求
      const res = await this.$http.post('users',this.formData)
      // console.log(res)
      const {meta:{msg,status}} = res.data
      //  提示框 
      this.$message.success(msg)
      // 清空表单
      // this.formData = {}  //第一种写法
      // 第二种写法
      for (const key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          this.formData[key] = ''
        }
      }


    },

    // 编辑用户
    async showEditBox(userId) {
      // 显示对话框
      this.dialogFormVisibleEdituser = true
      // 发送请求
      const res = await this.$http.get(`users/${userId}`)
      // console.log(res)
      this.formData = res.data.data
      // 提示框
    },

    // 正式编辑用户信息，发送请求
    async EditUser() {
      // 关闭对话框
      this.dialogFormVisibleEdituser = false
      const res = await this.$http.put(`users/${this.formData.id}`,this.formData)
      // console.log(res)
      const {meta:{msg,status}} = res.data
      // 提示框
      this.loadTableData()
      this.$message.success(res.data.meta.msg)
      

    },

    // 分配权限 显示对话框
    async showRoleBox(user) {
      // 分配角色时 url用的userid 
      this.currUserId = user.id
      this.currUserName = user.username
      this.dialogFormVisibleSetrole = true
      const res = await this.$http.get('roles')
      // console.log(res)
      const res2 = await this.$http.get(`users/${user.id}`)
      console.log(res2)
      this.currRoleId = res2.data.data.rid
      this.roles = res.data.data
      // console.log(this.roles)
    },

    // 分配权限 发送请求
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`,{
        rid: this.currRoleId
      })
      // console.log(res)
      const {meta:{status,msg}} = res.data
      // 提示框
      this.$message.success(msg)
      // 关闭对话框
      this.dialogFormVisibleSetrole = false
      // 重置
      this.currRoleId = -1

    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>
