<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="10">
          <el-input
            clearable
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="queryinfo.query"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格区域 -->
      <el-table :data="ordersList" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="240">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditOrdersDialog(scope.row)"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-location-information"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑订单对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="showEditOrdersDialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditOrdersDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="showEditOrdersDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList } from 'network/orders'

export default {
  components: {},
  data() {
    return {
      // 定义查询对象
      queryinfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      // 订单列表数据
      ordersList: [],
      // 订单总条数
      total: 0,
      // 编辑订单对话框显示与隐藏
      showEditOrdersDialogVisible: false
    }
  },
  created() {
    this.getOrdersList()
  },
  mounted() {},
  computed: {},
  methods: {
    // 获取订单列表数据
    async getOrdersList() {
      const { data: res } = await getOrdersList(this.queryinfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表数据失败')
      // 订单列表数据获取成功
      this.$message.success('订单列表数据获取成功')
      this.ordersList = res.data.goods
      console.log(this.ordersList)
      this.total = res.data.total
    },
    // 点击编辑订单对话框
    showEditOrdersDialog(row) {
      console.log(111)

      // 显示编辑对话框
      this.showEditOrdersDialogVisible = true
    },
    // 页面显示条数变化
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getOrdersList()
    },
    // 换页触发
    handleCurrentChange(newnum) {
      this.queryinfo.pagenum = newnum
      this.getOrdersList()
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.el-row {
  margin-bottom: 20px;
}
</style>
