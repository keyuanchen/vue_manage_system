import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childComps/welcome/Welcome')
const Users = () => import('views/home/childComps/users/Users')
const Roles = () => import('views/home/childComps/roles/Roles')
const Rights = () => import('views/home/childComps/rights/Rights')
const Category = () => import('views/home/childComps/category/Category')
const Params = () => import('views/home/childComps/params/Params')
const List = () => import('views/home/childComps/list/List')
const AddGoods = () => import('views/home/childComps/addgoods/AddGoods')
const Orders = () => import('views/home/childComps/orders/Orders')

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Category
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: AddGoods
      },
      {
        path: '/orders',
        component: Orders
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path.indexOf('/login') !== -1) return next()
  // 获取本地额token
  const token = window.sessionStorage.getItem('token')
  // 如果token为空 则不跳转
  if (!token) {
    console.log(111)
    return next('/login')
  }
  // 否则进行跳转
  next()
})

export default router
