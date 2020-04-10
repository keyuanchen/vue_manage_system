<template>
  <div class="wrapper">
    <div class="login-container">
      <div class="login-avatar">
        <img src="~assets/img/tiger.png" alt />
      </div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-yonghuming"
          ></el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <!-- 两个按钮 -->
        <el-form-item class="login-buttons">
          <el-button type="primary" @click="signIn">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { signIn } from 'network/login'

export default {
  name: '',
  components: {},
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    // 重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    signIn() {
      // 表单验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入合规的用户名和登录密码')
        }

        // 发送请求获取token
        const { data: res } = await signIn(this.loginForm)
        console.log(res.data)
        // 将token保存到本地
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转到home页面
        this.$router.push('/home')
      })
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.wrapper {
  background-color: #ddd;
  .login-container {
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    padding: 20px;
    .login-avatar {
      height: 100px;
      width: 100px;
      border-radius: 50%;
      padding: 20px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login-buttons {
      text-align: right;
    }
  }
}
</style>
