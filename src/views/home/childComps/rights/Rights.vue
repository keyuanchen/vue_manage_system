<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- table区域 -->
      <el-table :data="rightsList" style="width: 100%">
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="300"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="280">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllRights } from 'network/rights'

export default {
  components: {},
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    this.getAllRights()
  },
  mounted () { },
  computed: {},
  methods: {
    // 获取所有的权限数据
    async getAllRights () {
      const { data: res } = await getAllRights()
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表数据失败')
      // 获取数据成功
      this.rightsList = res.data
    }
  },
  watch: {}
}
</script>
<style scoped lang='less'>
</style>
