<template>
  <div class="role-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色区域 -->
      <el-row>
        <el-col :span="8">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色table区域 -->
      <el-table :data="rolesList" stripe border style="width: 100%">
        <el-table-column type="expand" width="60">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="6">
                <el-tag closable @close="removeRightsById(item.id, scope.row)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="[indey === 0 ? '' : 'bttop']"
                  v-for="(iten, indey) in item.children"
                  :key="iten.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightsById(iten.id, scope.row)"
                      closable
                      type="success"
                    >{{ iten.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="iteo in iten.children"
                      :key="iteo.id"
                      @close="removeRightsById(iteo.id, scope.row)"
                    >{{ iteo.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作" width="500">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="allotRole(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配角色对话框 -->
    <el-dialog
      @close="allotRightsDialogClosed"
      title="分配权限"
      :visible.sync="allotRoleDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <!-- default-expand-all: 默认展开所有节点
            default-expanded-keys: 默认选中节点的key组成的数组
            show-checkbox: 节点是否可被选择
      -->
      <el-tree
        ref="rightsTreeRef"
        default-expand-all
        :data="rightsTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedIds"
        :props="allotRightsProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRightsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, removeRightsById, getAllRightsTree, allotRights } from 'network/roles'

export default {
  name: '',
  components: {},
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 分配角色对话框显示与隐藏
      allotRoleDialogVisible: false,
      // 权限数据树
      rightsTree: [],
      // 指定权限树渲染配置
      allotRightsProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点数组
      selectedIds: [],
      // 当前操作角色的id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  mounted () { },
  computed: {},
  methods: {
    // 获取角色列表数据信息
    async getRolesList () {
      const { data: res } = await getRolesList()
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表数据失败')
      // 获取角色列表数据成功
      console.log(res.data)
      // 保存到data中
      this.rolesList = res.data
    },
    // 删除权限
    async removeRightsById (rightId, role) {
      // 弹框提示
      const confirm = await this.$confirm('此操作将永久删除该j角色下的权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') return this.$message.error('您取消了删除')
      // 点击了确认删除
      // 发送请求删除该角色下的权限
      const { data: res } = await removeRightsById(rightId, role)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      // 删除权限成功
      // 返回的最新的权限列表
      role.children = res.data
      //
    },
    // 分配角色
    async allotRole (row) {
      // 保存roleid
      this.roleId = row.id
      // 获取所有的权限数据
      const { data: res } = await getAllRightsTree()
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
      // 获取数据成功
      this.rightsTree = res.data
      // 获取当前row的所有最后一级节点id 赋值给指定数组
      this.getAllSelectedId(row, this.selectedIds)
      // 弹出对话框
      this.allotRoleDialogVisible = true
    },
    // 迭代函数拿到确定节点的所有的三级节点的id保存到指定的数组中
    getAllSelectedId (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果不是最后一级节点
      node.children.forEach(i => {
        this.getAllSelectedId(i, arr)
      })
    },
    // 分配权限对话框关闭
    allotRightsDialogClosed () {
      // 保存该行所有最后一级节点的id数组赋空
      this.selectedIds = []
    },
    // 确认分配权限
    async  allotRightsConfirm () {
      // 获取选中的节点和半节点的id
      const checkedKeys = this.$refs.rightsTreeRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.rightsTreeRef.getHalfCheckedKeys()
      const selectedIdStr = [...checkedKeys, ...halfCheckedKeys].join(',')
      // console.log(selectedIdStr)
      // 发送请求分配权限,同步到服务器
      const { data: res } = await allotRights(this.roleId, selectedIdStr)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 分配权限成功
      this.$message.success('分配权限成功！')
      // 刷新角色列表
      this.getRolesList()
      // 对话框关闭
      this.allotRoleDialogVisible = false
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.breadcrumb-container {
  margin-bottom: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.el-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
