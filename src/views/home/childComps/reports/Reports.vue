<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <!-- 使用echarts渲染 图标区域 -->
    <el-card>
      <!-- 准备容器展示echarts处理过的数据 -->
      <div id="main" style="width: 900px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

import { getReportsData } from 'network/reports'

export default {
  components: {},
  data() {
    return {
      // 报告数据
      reportsData: {}
    }
  },
  created() {},
  async mounted() {
    // 获取到报告数据
    const { data: res } = await getReportsData()
    if (res.meta.status !== 200) return this.$message.error('获取报告数据失败')
    // 获取成功，保存到data中
    // console.log(res)
    this.reportsData = res.data
    // 在这个生命周期钩子中处理
    var myChart = echarts.init(document.getElementById('main'))
    // 指定图表的配置项和数据
    // 此处直接赋值是错误的，没有鼠标跟随等效果
    // 使用lodash的marge方法，将两个对象合并为一个对象，再赋值给option
    const options = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
    const reportInfo = _.merge(this.reportsData, options)
    var option = reportInfo

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  computed: {},
  methods: {},
  watch: {}
}
</script>
<style scoped lang="less"></style>
