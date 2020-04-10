<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告提示框 -->
      <el-alert
        title="注意：这里只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <div>
        选择商品分类：
        <el-cascader
          clearable
          class="cascader-container"
          v-model="selectedIds"
          :options="categoryList"
          :props="cascaderProps"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- tab标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnDisabled" type="primary" @click="addParams"
            >添加参数</el-button
          >
          <el-table :data="paramsData" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  type="success"
                  @close="removeParamsInfo(scope.row, i)"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="200">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="240">
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisabled" type="primary" @click="addParams"
            >添加属性</el-button
          >
          <el-table :data="propertyData" style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  type="success"
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  >{{ item }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="200">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="240">
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      @close="addParamsDialogClosed"
      :title="'添加' + dialogTitleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="dialogTitleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      @close="editParamsDialogClosed"
      :title="'编辑' + dialogTitleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="dialogTitleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  getParamsData,
  removeParamsById,
  addParamsInfo,
  getParamsInfoByCateId,
  editParams,
  removeParamsRequest,
  saveParams
} from 'network/params'

export default {
  components: {},
  data() {
    return {
      // 选中的级联选择器的id数组
      selectedIds: [],
      // 商品分类数据
      categoryList: [],
      // 级联选择器展示配置项
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 当前激活的标签页
      activeName: 'many',
      // 动态参数数据
      paramsData: [],
      // 静态属性数据
      propertyData: [],
      // 添加参数对话框
      addParamsDialogVisible: false,
      // 添加参数表单数据
      addParamsForm: {},
      // 添加参数表单验证规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ]
      },
      // 编辑对话康的显示与隐藏
      editParamsDialogVisible: false,
      // 编辑对话框表单数据
      editParamsForm: {
        attr_name: ''
      },
      // 编辑对话框表单验证规则
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCategoryList()
  },
  mounted() {},
  computed: {
    categoryId() {
      if (this.selectedIds.length > 0) {
        return this.selectedIds[this.selectedIds.length - 1]
      }
      return null
    },
    isBtnDisabled() {
      if (this.selectedIds.length === 0) {
        return true
      }
      return false
    },
    // 添加参数对话框标题文本
    dialogTitleText() {
      if (this.activeName === 'only') {
        return '静态属性'
      } else {
        return '动态参数'
      }
    }
  },
  methods: {
    // 获取商品分类数据
    async getCategoryList() {
      const { data: res } = await getCategoryList({ type: 3 })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类数据失败')
      // console.log(res)
      // 获取数据成功
      this.$message.success('获取商品分类数据成功')
      this.categoryList = res.data
    },
    // 当级联选择器选中项改变的时候触发
    handleChange(v) {
      // console.log(v)
      // 我们这里必须选到三级分类才有效，需要做下判断
      // 如果选择的不是三级，重置selectedIds这个数组
      if (this.selectedIds.length !== 3) {
        this.selectedIds = []
        // 将动态参数和静态属性数据赋空
        this.paramsData = []
        this.propertyData = []
        return
      }
      // 选中的是三级分类
      this.getParamsOrPropertyData()
    },
    // 点击切换标签
    handleClick() {
      // 如果此时selectedIds数组为空
      // 弹框提示
      if (this.selectedIds.length === 0) {
        return this.$message.error('请选择三级分类商品')
      }
      // 选择了三级分类商品
      // 获取对应的列表数据
      this.getParamsOrPropertyData()
    },
    // 获取参数或者属性列表
    async getParamsOrPropertyData() {
      // 发送请求获取参数
      if (this.activeName === 'many') {
        const { data: res } = await getParamsData(this.categoryId, 'many')
        if (res.meta.status !== 200)
          return this.$message.error('获取参数数据失败')
        // 获取成功
        this.$message.success('获取参数数据成功')
        // console.log(res.data)
        this.paramsData = res.data
        // console.log(this.paramsData)
        // 改造原数据，将字符串类型改为数组
        this.paramsData.forEach(i => {
          // 判断是否是空串
          i.attr_vals = i.attr_vals ? i.attr_vals.split(' ') : []
          // 为每一行参数添加自定义属性
          // i.inputVisible = false
          // i.inputValue = ''
        })
      } else {
        const { data: res } = await getParamsData(this.categoryId, 'only')
        if (res.meta.status !== 200)
          return this.$message.error('获取参数数据失败')
        // 获取成功
        this.$message.success('获取参数数据成功')
        this.propertyData = res.data
        // 改造原数据，将字符串类型改为数组
        this.propertyData.forEach(i => {
          i.attr_vals = i.attr_vals ? i.attr_vals.split(' ') : []
          // 为每一行参数添加自定义属性
          // i.inputVisible = false
          // i.inputValue = ''
        })
      }
    },
    // 添加参数
    addParams() {
      // 对话框显示
      this.addParamsDialogVisible = true
    },
    // 添加参数确认
    addParamsConfirm() {
      // 进行表单的预校验
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写正确的参数名称')
        // 校验成功
        // 发送请求添加参数
        const { data: res } = await addParamsInfo(this.categoryId, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        // 添加成功
        this.$message.success('添加参数成功')
        // 刷新参数列表
        this.getParamsOrPropertyData()
        // 对话框关闭
        this.addParamsDialogVisible = false
      })
    },
    // 添加参数对话框关闭
    addParamsDialogClosed() {
      // 重置表单数据
      this.$refs.addParamsFormRef.resetFields()
    },
    // 显示编辑对话框
    async showEditParamsDialog(row) {
      // 发送请求获取到该分类的参数信息
      const { data: res } = await getParamsInfoByCateId(
        this.categoryId,
        row.attr_id,
        this.activeName
      )
      if (res.meta.status !== 200)
        return this.$message.error('获取参数数据失败')
      // 获取成功
      // 保存获取到的data
      this.editParamsForm = res.data
      this.editParamsDialogVisible = true
    },
    // 确认修改参数
    editParamsConfirm() {
      // 进行表单预校验
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写正确的参数名称')
        // 校验成功
        // 发送请求修改参数
        const { data: res } = await editParams(
          this.categoryId,
          this.editParamsForm.attr_id,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200)
          return this.$message.error('修改参数信息失败')
        // 修改成功
        this.$message.success('修改参数数据成功')
        // 获取参数列表
        this.getParamsOrPropertyData()
        // 对话框关闭
        this.editParamsDialogVisible = false
      })
    },
    // 修改参数对话框关闭
    editParamsDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 删除参数
    async removeParams(row) {
      const confirm = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirm !== 'confirm') return this.$message.error('您取消了删除')
      // 确认删除
      // 发送请求删除参数
      const { data: res } = await removeParamsRequest(
        this.categoryId,
        row.attr_id
      )

      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      this.$message.success('删除参数成功')
      // 刷新参数列表
      this.getParamsOrPropertyData()
    },
    // input输入框失去焦点或者enter抬起触发
    handleInputConfirm(row) {
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return
      }
      // input有值
      row.attr_vals.push(this.inputValue.trim())
      this.inputVisible = false
      this.inputValue = ''
      // 保存参数
      this.saveParams(row)
    },
    showInput() {
      this.inputVisible = true
      // this.$set(r, 'inputVisible', true)
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除参数
    removeParamsInfo(r, i) {
      r.attr_vals.splice(i, 1)
      this.saveParams(r)
    },
    // 保存编辑的参数数据
    async saveParams(row) {
      // 发送请求同步参数服务器
      const attrid = row.attr_id
      const id = row.cat_id
      const { data: res } = await saveParams(id, attrid, row)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败')
      // 删除成功
      this.$message.success('删除参数成功')
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.cascader-container {
  margin: 10px 0;
}
.el-tag {
  margin: 10px 20px;
}
.input-new-tag {
  width: 90px;
}
</style>
