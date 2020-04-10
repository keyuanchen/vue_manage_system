<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树形结构区域 -->
      <zk-table
        :expand-type="false"
        :selection-type="false"
        ref="cateTreeTableRef"
        index-text="●"
        :data="categoryList"
        :columns="categoryTableColumns"
        show-index
        border
      >
        <template slot="cat_name"></template>
        <template slot="cat_deleted" slot-scope="scope">
          <i v-if="scope.row.cat_deleted" class="el-icon-circle-check"></i>
          <i v-else class="el-icon-circle-check" style="color: lightgreen;"></i>
        </template>
        <template slot="cat_level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 0" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="info">三级</el-tag>
        </template>
        <template slot="operation">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="warning" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </zk-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCateInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryCateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed"
      width="50%"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            class="addCateCascader"
            :options="parentCateList"
            :props="cascadarProps"
            clearable
            v-model="selectKeys"
            @change="parentCateChanged"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addCategoryInfo } from 'network/category'

export default {
  components: {},
  data() {
    return {
      // 查询分类数据
      queryCateInfo: {
        type: '',
        pagenum: 1,
        pagesize: 10
      },
      // 分类商品总条数
      total: 0,
      // 分类商品数据
      categoryList: [],
      // 表格各列的配置
      categoryTableColumns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '200px',
          type: 'template',
          template: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'cat_deleted',
          width: '100px'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'cat_level',
          width: '100px'
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'template',
          template: 'operation',
          width: '150px'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascadarProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data } = await getCategoryList(this.queryCateInfo)
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg)
      }
      this.categoryList = data.data.result
      // console.log(this.categoryList)
      this.total = data.data.total
    },
    handleSizeChange(newSize) {
      this.queryCateInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryCateInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data } = await getCategoryList({ type: 2 })
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg)
      }
      this.parentCateList = data.data
    },
    parentCateChanged() {
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      // 恢复初始值
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击添加分类确认按钮
    async addCategoryConfirm() {
      // 发送请求添加分类
      const { data: res } = await addCategoryInfo(this.addCateForm)
      console.log(res)
      if (res.meta.status !== 201)
        return this.$message.error('添加分类数据失败')
      // 添加成功
      this.$message.success('添加分类数据成功')
      // 重新获取分类数据
      this.getCateList()
      // 对话框关闭
      this.addCateDialogVisible = false
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.el-row {
  margin-bottom: 10px;
}
.addCateCascader {
  width: 100%;
}
</style>
