<template>
<el-card class="box-card">
  <my-bread level1="商品管理" level2="分类参数"></my-bread>
  <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="error" center show-icon>
  </el-alert>

  <!-- 商品分类 -->
  <el-form class="form">
    <el-form-item label="请选择商品分类">
      <el-cascader clearable expand-trigger="hover" :options="options" :props="defaultprop" v-model="selectedOptions" @change="handleChange">
      </el-cascader>
    </el-form-item>
  </el-form>

  <!-- 选项卡 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="1">
      <el-row>
        <el-col :span='24'>
          <el-button @click="showDiaAddDyParams()" :disabled="btndisabled" type="success">设置动态参数</el-button>
        </el-col>
      </el-row>

      <el-dialog title="添加分类参数" :visible.sync="dialogFormVisibleadd">
        <el-form :model="form">
          <el-form-item label="参数名称">
            <el-input v-model="form.attr_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input placeholder="多个值以,分隔" v-model="form.attr_vals" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDyparams()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 表格 -->
      <el-table :data="list" height="250" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row.attr_vals,scope.row,tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row)" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="100">
        </el-table-column>
        <el-table-column prop="attr_name" label="属性名称" width="180">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.prevent="showEditBox(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.prevent="showDeleBox(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态参数" name="2">
      <!-- 表格 -->
      <el-table :data="staticlist" height="250" border style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column type="index" label="#" width="100">
        </el-table-column>
        <el-table-column prop="attr_name" label="属性名称" width="180">
        </el-table-column>
        <el-table-column prop="attr_vals" label="属性值" width="180">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.prevent="showEditBox(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.prevent="showDeleBox(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

</el-card>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1',
      // 级联选择器的数据
      options: [],
      selectedOptions: [],
      defaultprop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      list: [],
      inputVisible: false,
      inputValue: '',
      // 添加参数按钮的响应
      btndisabled: true,
      // 添加参数的对话框的表单数据
      // attr_name	参数名称	不能为空
      // attr_sel	[only,many]	不能为空
      // attr_vals	如果是 many 就需要填写值的选项，以逗号分隔
      form: {
        attr_name: '',
        attr_sel: 'many',
        attr_vals: ''
      },
      dialogFormVisibleadd: false,
      // 静态资源
      staticlist:[]
    }
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 获取三级分类
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`)
      this.options = res.data.data
      // console.log(this.options)
    },
    // 级联选择器改变时会触发下面的方法
    handleChange() {
      this.getDyParams()
      this.btndisabled = false
    },

    // 关联动态参数的数据
    async getDyParams() {
      const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
      // 获取动态参数
      // console.log(res)
      this.list = res.data.data
      console.log(this.list)
      this.list.forEach(item => {
        item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.split(',')
      })
      // // 获取静态参数
      // this.staticParams = res.data.data
    },
    // tab切换就触发
    async handleClick() {
      if(this.activeName === '2') {
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        this.staticlist = res.data.data
        console.log(this.staticlist)
      }
    },
    // el-tag 关闭
    async handleClose(attr_vals, item, tag) {
      // console.log(attr_vals.indexOf(tag))
      // 从当前的attr_vals数组中移除当前的元素
      // 发送请求put   categories/:id/attributes/:attrId
      attr_vals.splice(attr_vals.indexOf(tag), 1)
      const putData = {
        attr_name: item.attr_name,
        attr_sel: 'many',
        attr_vals: attr_vals.join(',')
      }
      // console.log(this.selectedOptions[2])
      // console.log(item.attr_id)
      const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, putData)
      // console.log(res)
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(attr_vals, item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr_vals.push(inputValue);
        // 发送请求
        const putData = {
          attr_name: item.attr_name,
          attr_sel: 'many',
          attr_vals: attr_vals.join(',')
        }
        // console.log(this.selectedOptions[2])
        // console.log(item.attr_id)
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${item.attr_id}`, putData)
        // console.log(res)
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 点击对话框确定按钮   并发送请求
    async addDyparams() {
      this.dialogFormVisibleadd = false
      const res = await this.$http.post(`categories/${this.selectedOptions[2]}/attributes`, this.form)
      console.log(res)
      this.getDyParams()
    },
    // 点击按钮，显示对话框
    async showDiaAddDyParams() {
      this.dialogFormVisibleadd = true
    }
  }
}
</script>

<style>
.alert {
  margin-top: 20px;
}

.form {
  padding-top: 10px;
}
</style>
