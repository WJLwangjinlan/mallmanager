<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 封装之后的写法 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <!-- 表格 -->
    <el-table
      height="800"
      :data="list"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="140">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="140">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-else-if="scope.row.level==='1'">二级</span>
          <span v-else-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
export default {
  data() {
    return{
      list:[]
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    async loadTableData() {
      const res = await this.$http.get('rights/list')
      console.log(res)
      this.list = res.data.data
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
</style>
