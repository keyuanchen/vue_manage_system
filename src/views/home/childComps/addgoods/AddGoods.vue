<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert
        :closable="false"
        show-icon
        center
        title="添加商品信息"
        type="info"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        align-center
        class="stops-container"
        :space="200"
        :active="activeKey - 0"
        finish-status="success"
      >
        <!--active内容需要是数字  -->
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="w完成"></el-step>
      </el-steps>
      <!-- tab标签页区域 -->
      <!-- 大表单 -->
      <el-form
        :model="addForm"
        label-position="top"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-tabs
          tab-position="left"
          v-model="activeKey"
          :before-leave="handleTabPane"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="selectedIds"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  class="checkbox-item"
                  border
                  :label="iten"
                  v-for="(iten, indey) in item.attr_vals"
                  :key="indey"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="2">
            <el-form-item
              v-for="item in onlyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传区域 -->
            <el-upload
              class="upload-demo"
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="configHeaders"
              :on-success="handleSuccessUpload"
            >
              <el-button type="primary" size="small">点击上传图片</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              class="quill-editor-content"
              v-model="addForm.goods_introduce"
            ></quill-editor>
            <el-button class="addGoods" type="primary" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img class="previewImg" :src="abPicUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  getManyData,
  getOnlyData,
  addGoodsRequest
} from 'network/addgoods'
// 引入lodash包
import _ from 'lodash'

export default {
  components: {},
  data() {
    return {
      // 步骤条标识
      activeKey: '0',
      // 添加商品表单数据
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 添加表单的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      cateList: [],
      // 级联选择器选中的分类id组成的数组
      selectedIds: [],
      // 配置级联展示的数据
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 商品参数数据
      manyData: [],
      // 商品属性数据
      onlyData: [],
      // 上传图片添加token  header
      configHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 保存上传的图片的绝对路径
      abPicUrl: '',
      // 图片预览对话框是否显示
      previewDialogVisible: false
    }
  },
  created() {
    this.getCategoryList()
  },
  mounted() {},
  computed: {
    // 商品分类id
    cateId() {
      if (this.selectedIds.length === 3) {
        return this.selectedIds[2]
      }
      return null
    }
  },
  methods: {
    // 获取所有商品分类数据
    async getCategoryList() {
      const { data: res } = await getCategoryList()
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类数据失败')
      // 获取分类成功
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择改变
    handleChange(value) {
      // 如果未选择三级分类则无效
      // console.log(this.selectedIds)
      if (this.selectedIds.length !== 3) {
        this.selectedIds = []
        return
      }
      // console.log(this.addForm.goods_cat)
      this.addForm.goods_cat = this.selectedIds
    },
    // 离开当前标签页的检验
    handleTabPane(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.selectedIds.length !== 3) {
        // 提示需要选择三级分类商品
        this.$message.info('请先选择三级分类商品')
        return false
      }
    },
    // 点击切换标签触发
    async tabClick() {
      if (this.selectedIds.length !== 3) return
      // 发送请求获取商品参数的数据
      if (this.activeKey === '1') {
        const { data: res } = await getManyData(this.cateId)
        if (res.meta.status !== 200)
          return this.$message.error('获取商品参数失败')
        // 获取商品参数成功
        this.$message.success('获取商品参数成功')

        this.manyData = res.data
        // 遍历manyData,改造数据
        this.manyData.forEach(i => {
          i.attr_vals = i.attr_vals ? i.attr_vals.split(' ') : []
        })
        // console.log(this.manyData)
      } else if (this.activeKey === '2') {
        // 发送请求获取商品属性数据
        const { data: res } = await getOnlyData(this.cateId)
        if (res.meta.status !== 200)
          return this.$message.error('获取商品属性失败')
        // 获取成功
        this.$message.success('获取商品属性成功')
        this.onlyData = res.data
      }
    },
    // 点击图片预览触发
    handlePreview(file) {
      // console.log(file)
      // 弹出对话框
      this.previewDialogVisible = true
    },
    // 删除图片
    handleRemove(file) {
      // console.log(file)
      // 获取到要删除图片的临时路径地址
      const tmp_path = file.response.data.tmp_path
      // 遍历addForm的pics数组,拿到相同temp_url的索引
      const index = this.addForm.pics.findIndex(i => i.pic === tmp_path)
      // 使用数组的splice删除该索引的数据
      this.addForm.pics.splice(index, 1)
    },
    // 上传图片成功时触发
    handleSuccessUpload(res) {
      // 拿到图片的绝对路径地址,保存到data中
      this.abPicUrl = res.data.url
      // 构造pics数组
      // 新建一个对象
      const picObj = {}
      // 新建对象的pic属性指向上传图片成功后返回的临时路径地址
      picObj.pic = res.data.tmp_path
      // 将这个新对象添加到pics中
      this.addForm.pics.push(picObj)
    },
    // 添加商品
    addGoods() {
      // 先进行表单的预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.info('请输入必要的表单项')
        // 验证通过
        // 准备添加所需要的各种数据
        // 1.需要将goods_cat转为字符串形式
        // 2.由于前面级联选择器双向数据绑定着goods_cat,所以需要进行深拷贝后才能进行数据的改造
        // lodash插件
        const isokForm = _.cloneDeep(this.addForm)
        isokForm.goods_cat = isokForm.goods_cat.join(',')
        console.log(isokForm)

        // 达到attrs参数的要求
        // 先准备一个数组
        const attrs = []
        // 遍历manyData
        this.manyData.forEach(item => {
          const obj = {}
          obj.attr_id = item.attr_id
          obj.attr_value = item.attr_vals.join(' ')
          // 将该对象push到数组attrs中
          attrs.push(obj)
        })

        // 遍历onlyData
        this.onlyData.forEach(i => {
          const obj = {}
          obj.attr_id = i.attr_id
          obj.attr_value = i.attr_vals
          attrs.push(obj)
        })
        // console.log(attrs)
        isokForm.attrs = attrs
        // 发送请求添加商品
        const { data: res } = await addGoodsRequest(isokForm)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        // 添加商品成功
        this.$message.success('添加商品成功')
        // 跳抓到商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.stops-container {
  margin: 10px 0;
}
.checkbox-item {
  margin: 10px;
}
.previewImg {
  width: 100%;
}
.quill-editor-content {
  min-height: 300px !important;
}
</style>
