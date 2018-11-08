<template>
<el-card class="box-card">
  <my-bread level1="订单管理" level2="订单列表"></my-bread>
  <!-- 表格 -->
  <el-table :data="list" style="width: 100%">
    <el-table-column type="index" label="#" width="80">
    </el-table-column>
    <el-table-column prop="order_number" label="订单编号" width="200">
    </el-table-column>
    <el-table-column prop="order_price" label="订单价格" width="160">
    </el-table-column>
    <el-table-column prop="order_pay" label="是否付款" width="140">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.order_pay==='0'" type="success">已付款</el-tag>
        <el-tag v-if="scope.row.order_pay==='1'" type="danger">未付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="is_send" label="是否发货" width="140">
    </el-table-column>
    <el-table-column label="下单时间" width="180">
      <template slot-scope="scope">
        <!-- man.js里面定义的fmtDate -->
        {{scope.row.create_time | fmtDate}}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" plain circle @click="dialogFormVisible=true"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框 -->
  <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="省市区">
        <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</el-card>
</template>

<script>
import options from '@/assets/city_data2017_element.js'

export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      form: {
        address: ''
      },
      options: [],
      selectedOptions: []
    }
  },
  created() {
    this.options = options
    this.getData()
  },
  methods: {
    async getData() {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=10`)
      // console.log(res)
      this.list = res.data.data.goods
      // console.log(this.list)
    },
    // 
    async handleChange() {

    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
</style>
