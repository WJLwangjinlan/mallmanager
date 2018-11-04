<template>
  <el-card class="box-card">
    <!-- 表格 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row>
      <el-col :span="24">
        <el-button class="addBtn" type="primary">主要按钮</el-button>
      </el-col>
    </el-row>
    
    <!-- 表格 -->
    <el-table
    :data="roleList"
    style="width: 100%">
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row v-for="(item1,index) in scope.row.children" :key="index" >
            <el-col :span="4">
              <el-tag @close="deleteRole(scope.row.id,item1.id)" closable class="level1" type="primary">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row class="level2" v-for="(item2,index) in item1.children" :key="index">
                <el-col :span="4">
                  <el-tag @close="deleteRole(scope.row.id,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag @close="deleteRole(scope.row.id,item3.id)" closable v-for="(item3,index) in item2.children" :key="index" type="info">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <p style="text-align:center"><el-tag type="danger">当前角色未分配权限</el-tag></p>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="#"
        type="index"
        width="100">
      </el-table-column>

      <el-table-column
        label="角色名称"
        prop="roleName"
        width="180">
      </el-table-column>

      <el-table-column
        label="角色描述"
        prop="roleDesc"
        width="160">
      </el-table-column>

      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button>
          <el-button type="success" size="mini" icon="el-icon-check" circle @click="showSetRightDia(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
  </el-table>

  <!-- 分配权限的对话框 -->
  <el-dialog
    title="分配权限"
    :visible.sync="dialogVisible"
    width="80%">
    <template slot-scope="scope">
      <!-- 树形结构 -->
      <el-tree
        ref="tree"
        node-key='id' 
        :data="treeList" 
        :props="defaultProps" 
        show-checkbox
        :default-expanded-keys="expandedArr"
        :default-checked-keys="checkedArr">
      </el-tree>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setRight()">确 定</el-button>
    </span>
  </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      // 树形结构用的数据
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 展开节点的数组
      expandedArr:[],
      checkedArr:[]

    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    async loadTableData () {
      const res = await this.$http('roles')
      // console.log(res)
      this.roleList = res.data.data
    },

      // 删除权限
      // 请求路径：roles/:roleId/rights/:rightId
      // 请求方法：delete
      // :roleId	角色 ID	不能为空携带在url中
      // :rightId	权限 ID	不能为空携带在url中
      async deleteRole (roleId,rightId) {
        const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
        // console.log(res)
        // 刷新视图
        // this.loadTableData()
        // 删除成功，更新到当前的children
        // 返回响应的数据中有当前角色剩余的权限信息
        // 值更新当前的children的值
        role.children = res.data.data
      },

      // 显示分配权限的对话框、请求权限列表数据
      async showSetRightDia(role) {
        // console.log(role)
        // 给roleid赋值
        this.roleId = role.id
        this.dialogVisible = true
        const res = await this.$http.get('rights/tree')
        // console.log(res)
        this.treeList = res.data.data
        // expandedArr赋值
        const arr = []
        res.data.data.forEach(item1 => {
          // arr.push(item1.id)
          item1.children.forEach(item2 => {
            // arr.push(item2.id)
            item2.children.forEach(item3 => {
              arr.push(item3.id)
            })
          })
        })
        // console.log(arr)
        // 默认展开的数组
        this.expandedArr = arr
        // 默认选中的数组
        // 角色role
        // this.checkedArr = arr
        const arrcheck = []
        
        role.children.forEach(item1 => {
          // arrcheck.push(item1.id)
            item1.children.forEach(item2 => {
            // arrcheck.push(item2.id)
              item2.children.forEach(item3 => {
              arrcheck.push(item3.id)
            })
          })
        })
        this.checkedArr = arrcheck
        console.log(this.checkedArr)
      },

      // 修改权限,发送请求
      async setRight() {
        this.dialogVisible = false
        // :roleId	角色 ID	不能为空携带在url中
        // rids	权限 ID 列表	以 , 分割的权限 ID 列表
        // getCheckedKeys 获取选中的节点的id值
        // getHalfCheckedKeys 获取半选节点的id值
        // 树形结构el-tree
        // 获取tree的DOM元素，调用方法
        // arr1就是当前打钩的节点
        const arr1 = this.$refs.tree.getCheckedKeys()
        // 获取半选节点的数组
        const arr2 = this.$refs.tree.getHalfCheckedKeys()
        const arr = [...arr1,...arr2]
        console.log(arr)
        const res = await this.$http.post(`roles/${this.roleId}/rights`,{
          rids: arr.join(',')
        })
        const {meta:{status,msg}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          // 刷新页面
          this.loadTableData()
        }
      }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.addBtn {
  margin-top: 20px;
}
.level1 {
  margin-bottom: 20px;
}
.level2{
  margin-bottom: 20px;
}
</style>
