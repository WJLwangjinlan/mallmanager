<template>
<el-card class="box-card">
  <my-bread level1="商品管理" level2="商品列表"></my-bread>
  <el-alert title="添加商品" type="success" center show-icon>
  </el-alert>
  <!-- 步骤条 -->
  <el-steps align-center class="steps" :space="200" :active="active*1" finish-status="success">
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品内容"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
  </el-steps>
  <!-- 侧边 -->
  <el-form :model="form" class="from">
    <el-tabs @tab-click="tabchange()" v-model="active" tab-position="left">
      <el-tab-pane name="1" label="基本信息">
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>

        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>

        <el-form-item label="商品重量">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>

        <el-form-item label="商品数量">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>

        <el-form-item label="商品分类">
          {{selectedOptions}}
          <el-cascader clearable expand-trigger="hover" :options="options" :props="defaultprop" v-model="selectedOptions" @change="handleChange">
          </el-cascader>
        </el-form-item>

      </el-tab-pane>

      <el-tab-pane name="2" label="商品参数">
        <el-form-item :label="item1.attr_name" v-for="item1 in dtParams" :key="item1.attr_id"><br>
          <el-checkbox-group v-model="item1.attr_vals">
            <el-checkbox border v-for="(item2,index) in item1.attr_vals" :key="index" :label="item2"></el-checkbox>
          </el-checkbox-group><br>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane name="3" label="商品属性">
        <el-form-item :label="item.attr_name" v-for="(item,index) in staticParams" :key="index">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="4" label="商品图片">
        <el-upload 
          :headers="headers" 
          action="http://localhost:8888/api/private/v1/upload" 
          :on-preview="handlePreview" 
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane name="5" label="商品内容">
        <el-button type="primary" @click="addGoods()">添加商品</el-button>
        <!-- 副文本 -->
        <quill-editor calss="puill" v-model="form.goods_introduce"></quill-editor>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: '1',
      form: {
        // goods_name	商品名称	不能为空
        // goods_cat	以为','分割的分类列表	不能为空
        // goods_price	价格	不能为空
        // goods_number	数量	不能为空
        // goods_weight	重量	不能为空
        // goods_introduce	介绍	可以为空
        // pics	上传的图片临时路径（对象）	可以为空
        // attrs	商品的参数（数组）

        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        // 长传图片的临时路径
        pics: [],
        // 商品的参数是个数组
        attrs: []
      },
      // 级联选择器的数据
      options: [],
      selectedOptions: [],
      defaultprop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 多选框数据
      // checkList:[],
      // 保存动态参数的数组
      dtParams: [],
      // 保存静态参数的数组
      staticParams: [],
      // 长传图片的头部设置
      headers:{
        'Authorization':sessionStorage.getItem('token')
      }
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
    async handleChange() {

    },
    // tab切换就触发
    async tabchange() {
      if (this.active === '2' || this.active === '3') {
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请先选择商品三级分类')
          return
        }
        const sel = this.active === '2' ? 'many' : 'only'
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`)
        // 获取动态参数
        // console.log(res)
        this.dtParams = res.data.data
        // console.log(this.dtParams)
        this.dtParams.forEach(item => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.split(',')
        })
        // 获取静态参数
        this.staticParams = res.data.data
      }
    },

    // 图片上传
    async handleSuccess(response) {
      console.log('handleSuccess')
      // console.log(response)
      this.form.pics.push({
        pic:response.data.tmp_path
      })
    },
    async handlePreview(file) {
      console.log('handlePreview')
      console.log(file)
    },
    async handleRemove(file) {
      console.log('handleRemove')
      // console.log(file)
      // findIndex()找到数组中复合return条件的的元素下标
      const Index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(Index,1)
      console.log(this.form.pics)
    },
    // 添加商品
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(',')
      const arr1 = this.dtParams.map((item) => {
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
      // console.log(arr1)
      const arr2 = this.staticParams.map((item) => {
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
        // Es6 ...展开操作符
      this.form.attrs = [...arr1,...arr2]
      // 发送请求
      const res = await this.$http.post(`goods`,this.form)
      // console.log(res)
      const {meta:{status,msg}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        // 回到商品数据列表
        this.$router.push({path:'/goods'})
      }else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
.box-card {
  height: 100%
}

.steps {
  margin-top: 20px;
}

.el-step__title {
  font-size: 12px;
}

.from {
  height: 450px;
  overflow: auto;
}
.puill{
  min-height: 300px;
}
</style>
