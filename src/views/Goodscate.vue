<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row class="searchArea">
      <el-col :span="24">
        <el-button type="success" @click="showAddGoodDia()">添加商品</el-button>
      </el-col>
    </el-row>


    <!-- 表格 -->
    <el-table
      :data="list"
      height="400"
      style="width: 100%">

      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        width="180"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid>


      <el-table-column
        prop="cat_level"
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button size='mini' plain type="primary" icon="el-icon-edit" circle @click="showEditBox(scope.row)"></el-button>
            <el-button size='mini' plain type="danger" icon="el-icon-delete" circle @click="showDeleteBox(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{selectedOptions}}
          <el-cascader
            change-on-select
            clearable
            expand-trigger="hover"
            :options="casList"
            :props="defaultProp"
            v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addGoodCate()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
        <el-dialog title="编辑分类" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="addGoodCate()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
// 引入第三方el-table扩展表格的插件
const ElTreeGrid = require('element-tree-grid');
export default {
  components:{
    // 当前是局部注册事件ElTreeGrid 组件名el-tree-grid
    ElTreeGrid
  },
  data() {
    return{
      list:[],
      dialogFormVisibleAdd:false,
      dialogFormVisibleEdit:false,
      formLabelWidth:'100px',
      form: {
       cat_pid: -1,
       cat_name: '',
       cat_level: -1
      },
      // 级联选择器要用的数据
      casList:[],
      selectedOptions:[],
      defaultProp:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      }
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    async loadTableData () {
      const res = await this.$http.get(`categories?type=3`)
      // console.log(res)
      this.list = res.data.data
    },
    // 添加分类
    async showAddGoodDia() {
      this.dialogFormVisibleAdd = true
      // 获取两级的数据
      const res = await this.$http.get(`categories?type=2`)
      // console.log(res)
      this.casList = res.data.data
    },
    // 添加分类  发送请求
    async addGoodCate() {
      if (this.selectedOptions.length === 0) {
        this.form.cat_level = 0
        this.form.cat_pid = 0
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_level = 1
        this.form.cat_pid = this.selectedOptions[0]
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_level = 2
        this.form.cat_pid = this.selectedOptions[1]
      }
      const res = await this.$http.post(`categories`,this.form)
      // console.log(res)
      const {meta:{status,msg}} = res.data
      if (status === 201) {
        this.dialogFormVisibleAdd = false
        this.loadTableData()
        this.$message.success(msg)
      }
    },

    // 编辑分类
    async showEditBox(cat) {
      this.form.cat_name = cat.cat_name
      this.form.cat_id = cat.cat_id
      // console.log(this.form.cat_name)
      this.dialogFormVisibleEdit = true
    }, 
    // 编辑分类 发送请求
    async editGoodCate() {
      // console.log(this.form.cat_name)
      const res = await this.$http.put(`categories/${this.form.cat_id}`,{
        cat_name:this.form.cat_name
      })
      // console.log(res)
      const {meta:{status,msg}} = res.data
      if (status === 200){
        this.dialogFormVisibleEdit = false
        this.$message.success(msg)
        this.loadTableData()
      }
    },
    // 删除分类
    async showDeleteBox(cat) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`categories/${cat.cat_id}`)
          if (res.data.meta.status === 200){
            this.$message({
              type:'success',
              message: res.data.meta.msg
            })
            this.loadTableData()
          }
          // console.log(res)

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
