<template>
  <el-container class="home-container">
    <el-header class="header-container">
      <div class="header-left">
        <img src="~assets/img/tiger.png" alt="" />
        <span>vue-ele后台管理系统</span>
      </div>
      <el-button type="primary" @click="signUp">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleMenu" @click="toggleCollapse">
          <i
            v-if="isCollapse"
            class="
              iconfont icon-youjiantou
            "
          ></i>
          <i v-else class="iconfont icon-zuojiantou"></i>
        </div>
        <el-menu
          background-color="#264a6b"
          text-color="#fff"
          unique-opened
          active-text-color="#0078b9"
          router
          :collapse="isCollapse"
          :default-active="activeKey"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont' + ' ' + iconList[index][item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + iten.path"
              @click="saveActiveKey('/' + iten.path)"
              v-for="iten in item.children"
              :key="iten.id"
            >
              <template slot="title">
                <i class="iconfont icon-caidan"></i>
                <span>{{ iten.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from 'network/home'

export default {
  name: '',
  components: {},
  data() {
    return {
      // 保存左侧列表数据
      menuList: [],
      // 保存左侧列表一级菜单图标
      iconList: [
        {
          125: 'icon-yonghu'
        },
        {
          103: 'icon-quanxian'
        },
        {
          101: 'icon-shangpin'
        },
        {
          102: 'icon-dingdan'
        },
        {
          145: 'icon-shujutongji'
        }
      ],
      // 左侧菜单是否折叠
      isCollapse: false,
      // 记录左侧菜单激活
      activeKey: ''
    }
  },
  created() {
    this.getMenus()
    // 获取本地保存的激活的选项
    const activeKey = window.sessionStorage.getItem('activeKey')
    this.activeKey = activeKey
  },
  mounted() {},
  computed: {},
  methods: {
    // 退出登录
    signUp() {
      // 清除本地token
      window.sessionStorage.clear()
      // 跳转到login页面
      this.$router.replace('/login')
    },
    // 获取左侧列表数据
    async getMenus() {
      const { data: res } = await getMenus()
      // console.log(res.data)
      if (res.meta.status !== 200)
        return this.$message.error('获取左侧列表失败')
      this.menuList = res.data
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前激活的二级菜单选项
    saveActiveKey(key) {
      window.sessionStorage.setItem('activeKey', key)
    }
  },
  watch: {}
}
</script>
<style scoped lang="less">
.home-container {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #264a6b;
    color: #fff;
    .header-left {
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 5px 10px;
      }
    }
  }
  .el-aside {
    background-color: #264a6b;
    .toggleMenu {
      text-align: center;
      i {
        display: inline-block;
        color: #fff;
        font-size: 20px;
        width: 30px;
        height: 20px;
      }
    }
    .el-menu {
      border: 0;
    }
    .iconfont {
      margin-right: 10px;
    }
  }
  .el-main {
    background-color: #e9edf1;
  }
}
</style>
