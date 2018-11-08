<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="searchInput" v-model="searchVal">
          <el-button slot="append" icon="el-icon-search" @click.prevent="checkUser()"></el-button>
        </el-input>
        <el-button type="success" @click="AddGoods()">添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      height="400px"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="100">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建日期"
        width="160">
        <template slot-scope="scope">
          {{scope.row.add_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button size='mini' plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size='mini' plain type="danger" icon="el-icon-delete" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list:[],
      loading:false,
      // 分页相关变量
      pagenum:1,
      pagesize:4,
      total:0,
      // 查询关键字
      searchVal:''
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    async loadTableData() {
      this.loading = true
      const res = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      console.log(res)
      this.list = res.data.data.goods
      this.total = res.data.data.total
    },
    // 分页相关的方法
      handleSizeChange(val) {
      this.pagesize = val
      this.loadTableData()
      // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
      this.pagenum = val
      this.loadTableData()
      this.pagenum = 1
      // console.log(`当前页: ${val}`);
    },
    // 显示添加商品的组件
    AddGoods() {
      this.$router.push({name:'addgoods'})
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
