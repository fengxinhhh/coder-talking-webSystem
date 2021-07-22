import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('../components/index')
const Login = () => import('../components/login')
const New = () => import('../components/new')
const Profile = () => import('../components/profile')
const Register = () => import('../components/register')
const Show = () => import('../components/show')
const ReadNumRound = () => import('../components/readNumRound')
const FileManage = () => import('../components/fileManage')
const Star = () => import('../components/star')
const Lock = () => import('../components/lock')
const UserReport = () => import('../components/userReport')
const Active = () => import('../components/active')
const UserInfo = () => import('../components/userInfo')
const Admin = () => import('../components/admin')
const User = () => import('../components/user')
const Delete = () => import('../components/delete')
const IsTop = () => import('../components/isTop')
const DelNews = () => import('../components/delNews')
const Report = () => import('../components/report')
const AddAdmin = () => import('../components/AddAdmin')
const DelAdmin = () => import('../components/DelAdmin')
const RoleList = () => import('../components/RoleList')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/index'
    },
    {
      path: '/index',
      component: Index,
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/new',
      component: New
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/show',
      component: Show
    },
    {
      path:'/readnumround',
      component:ReadNumRound
    },
    {
      path:'/filemanage',
      component:FileManage
    },
    {
      path:'/star',
      component:Star
    },
    {
      path:'/lock',
      component:Lock
    },
    {
      path:'/userreport',
      component:UserReport
    },
    {
      path:'/active',
      component:Active
    },
    {
      path:'/userinfo',
      component:UserInfo
    },
    {
      path:'/admin',
      redirect:'/admin/user'
    },
    {
      path:'/admin',
      component:Admin,
      children:[
        {
          path:'user',
          component:User,
        },
        {
          path:'delete',
          component:Delete,
        },
        {
          path:'istop',
          component:IsTop
        },
        {
          path:'delnews',
          component:DelNews
        },
        {
          path:'report',
          component:Report
        },
        {
          path:'addadmin',
          component:AddAdmin
        },
        {
          path:'deladmin',
          component:DelAdmin
        },
        {
          path:'rolelist',
          component:RoleList
        }
      ]
    }
   
  ]
})
