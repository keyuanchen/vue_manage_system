<template>
  <div class="users-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="breadcrumb-container" separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入搜索内容"
          v-model="queryinfo.query"
          clearable
          @clear="getUsersList"
        >
          <el-button
            @click="searchUser"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <!-- 表格 -->
    <el-card>
      <el-table stripe border :data="usersList" style="width: 100%">
        <el-table-column type="index" width="40"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editUserInfo(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserInfo(scope.row.id)"
            ></el-button>
            <!-- 文字提示 -->
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
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
        :page-sizes="[2, 3, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="addUserDialogClosed"
    >
      <el-form
        ref="addUserFormRef"
        :rules="addUserRules"
        :model="addUserForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="50%"
      @close="edtiUserFormClosed"
    >
      <el-form
        :rules="editUserFormRules"
        ref="editUserFormRef"
        :model="editUserForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserFormConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersList,
  addUserInfo,
  getUserInfoById,
  editUserInfo,
  removeUserById
} from 'network/users'

export default {
  name: '',
  components: {},
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!regEmail.test(value)) {
        callback(new Error('请填写合法的邮箱!'))
      }
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!regMobile.test(value)) {
        callback(new Error('请填写合法的手机号!'))
      }
      callback()
    }
    return {
      // 请求参数
      queryinfo: {
        query: '',
        pagesize: 6,
        pagenum: 1
      },
      // 用保存用户列表数据表格数据源
      usersList: [],
      // 用户总个数
      total: 0,
      // 添加用户对话框是否显示
      addUserDialogVisible: false,
      // 添加用户信息表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },
      // 编辑用户信息对话框
      editUserDialogVisible: false,
      editUserForm: {},
      editUserFormRules: {
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUsersList()
  },
  mounted() {},
  computed: {},
  methods: {
    async getUsersList() {
      const { data: res } = await getUsersList(this.queryinfo)
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户数据失败！')
      // 请求数据成功
      this.usersList = res.data.users
      this.total = parseInt(res.data.total)
    },
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getUsersList()
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage
      this.getUsersList()
    },
    // 搜索用户
    searchUser() {
      this.getUsersList()
    },
    // 添加用户
    addUser() {
      this.addUserDialogVisible = true
    },
    // 点击添加用户对话框确认按钮
    addUserConfirm() {
      // 进行表单合法性验证
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入符合规则的信息')
        // 验证成功
        // 发送请求添加用户
        const { data: res } = await addUserInfo(this.addUserForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        // 添加用户成功
        // 更新用户列表
        this.getUsersList()
        // 关闭对话框
        this.addUserDialogVisible = false
      })
    },
    // 添加用户对话框关闭
    addUserDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击编辑用户按钮
    async editUserInfo(userId) {
      // 根据用户id查询用户信息，发送请求获取
      const { data: res } = await getUserInfoById(userId)
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户信息失败')
      // 请求成功
      this.editUserForm = res.data
      // 显示编辑用户对话框
      this.editUserDialogVisible = true
    },
    // 编辑用户信息对话框关闭
    edtiUserFormClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 点击编辑用户对话框确认按钮
    editUserFormConfirm() {
      // 进行表单合法性检验
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写符合规则的表单数据')
        // 验证成功，发送修改用户请求
        // 发送修改用户信息请求
        const { data: res } = await editUserInfo(this.editUserForm)
        // console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('编辑用户信息失败')
        // 修改成功,更新用户列表数据
        this.getUsersList()
        // 隐藏对话框
        this.editUserDialogVisible = false
      })
    },
    // 点击删除用户的按钮
    async removeUserInfo(userId) {
      console.log(userId)
      // 弹框确认提示
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(res)
      if (res !== 'confirm') return this.$message.error('您取消了删除')
      // 发送请求删除用户
      const { data: result } = await removeUserById(userId)
      if (result.meta.status !== 200) return this.$message.error('删除用户失败')
      // 删除成功
      this.$message.success('删除用户成功')
      // 刷新用户列表
      this.getUsersList()
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.users-container {
  .breadcrumb-container {
    margin-bottom: 20px;
  }
}
.el-card {
  margin-top: 10px;
}
</style>
