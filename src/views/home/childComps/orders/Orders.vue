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
            @clear="deleteInputValue"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchOrder"
            ></el-button>
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
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="添加收货地址"
              placement="top"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showAddressDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="查询物流信息"
              placement="top"
            >
              <el-button
                @click="showLogisticsDialog"
                type="warning"
                size="mini"
                icon="el-icon-location-information"
              ></el-button>
            </el-tooltip>
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
      title="添加地址"
      :visible.sync="showAddressDialogVisible"
      width="50%"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="addressa">
          <el-cascader
            v-model="editAddressForm.addressa"
            :options="cityData"
            :props="chooseAddressProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressb">
          <el-input v-model="editAddressForm.addressb"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
    <el-dialog
      title="查看物流"
      :visible.sync="showLogisticsDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in ligisticsInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList, getLogisticsInfo } from 'network/orders'

import cityData from './citydata'

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
      // 修改地址对话框显示与隐藏
      showAddressDialogVisible: false,
      // 修改地址表单
      editAddressForm: {
        addressa: [],
        addressb: ''
      },
      // 修改地址表单的验证规则
      editAddressFormRules: {
        addressa: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        addressb: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 配置级联选择器展示
      chooseAddressProps: {
        label: 'label',
        value: 'value',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 查看物流对话框是否显示
      showLogisticsDialogVisible: false,
      // 保存拿到的物流信息
      ligisticsInfo: []
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
    showAddressDialog(row) {
      console.log(111)

      // 显示编辑对话框
      this.showAddressDialogVisible = true
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
    },
    // 搜索订单信息
    searchOrder() {
      // 获取订单数据
      this.getOrdersList()
    },
    // 删除input框中的内容
    deleteInputValue() {
      this.getOrdersList()
    },
    // 弹出查看物流对话框
    async showLogisticsDialog() {
      // 发送请求获取到物流信息
      const { data: res } = await getLogisticsInfo('1106975712662')
      if (res.meta.status !== 200)
        return this.$message.error('获取物流信息数据失败')
      // 获取物流信息成功
      // 保存数据到data中
      this.ligisticsInfo = res.data
      // 弹出对话框
      this.showLogisticsDialogVisible = true
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
