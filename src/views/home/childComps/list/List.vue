<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            clearable
            @clear="getGoodsList"
            placeholder="请输入商品名称"
            v-model="queryinfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goToSearchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="goToAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表table区域 -->
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="450">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量(元)" width="150">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200">
          <template v-slot="scope">
            {{ scope.row.add_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditGoodsDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-delete"
              @click="showRemoveGoodByIdMessageBox(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑商品的对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editGoodsDialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, removeGoodById } from 'network/list'

export default {
  components: {},
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 商品总条数
      total: 0,
      // 编辑商品对话框的显示与隐藏
      editGoodsDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  mounted() {},
  computed: {},
  methods: {
    async getGoodsList() {
      const { data: res } = await getGoodsList(this.queryinfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表数据失败')
      // 获取数据成功
      this.$message.success('获取商品列表数据成功')
      // 保存到data中
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 搜索商品
    goToSearchGoods() {
      if (this.queryinfo.query.trim().length === 0) {
        return this.$message.error('请输入想要搜索的商品名称或描述')
      }
      // 输入有效
      this.getGoodsList()
    },
    // 页面商品条数变化时触发
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryinfo.pagesize = newsize
      this.getGoodsList()
    },
    // 翻页触发
    handleCurrentChange(newnum) {
      console.log(newnum)
      this.queryinfo.pagenum = newnum
      this.getGoodsList()
    },
    // 删除商品
    async showRemoveGoodByIdMessageBox(id) {
      // 确认验证
      const confirm = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirm !== 'confirm') return this.$message.error('您点击了取消删除')
      // 确认删除，发送请求
      const { data: res } = await removeGoodById(id)
      if (res.meta.status !== 200)
        return this.$message.error('删除商品数据失败')
      this.$message.success('删除商品数据成功')
      // 刷新商品列表
      this.getGoodsList()
    },
    // 点击添加商品按钮
    goToAddGoods() {
      // 跳转到AddGoods页面
      this.$router.push('/goods/add')
    },
    // 编辑商品对话框显示
    showEditGoodsDialog(id) {
      this.editGoodsDialogVisible = true
    }
  },
  watch: {}
}
</script>
<style scoped lang="less"></style>
