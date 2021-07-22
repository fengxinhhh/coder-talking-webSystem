// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/bootstrap.min.css'
import './assets/css/main.css'
import './assets/css/login.css'
import './assets/css/settings.css'
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios"   
import store from './store/index.js'
import VueLazyload from 'vue-lazyload'
import { Pagination,Menu,MenuItem,Tag, Tooltip, Button, Select,Option, Table, TableColumn, RadioGroup, RadioButton, Tabs, TabPane, Dialog, Input, Message, Upload, Card, Row, Form, FormItem, Breadcrumb, BreadcrumbItem, Submenu, MessageBox, Checkbox, CheckboxGroup, Tree, Loading } from 'element-ui';
Vue.use(Pagination)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Tag)
Vue.use(Tooltip)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.component(Message.name, Message)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Input)
Vue.use(Row)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Submenu)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Tree)
Vue.use(Loading)
Vue.use(VueLazyload)
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$confirm = MessageBox
Vue.prototype.$message = Message
Vue.prototype.$http = axios
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false
axios.defaults.baseURL = "/api"
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem("token")) {
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
//时间过滤器
Vue.filter('timeFillter',(value)=>{
  var dt = new Date(value)
  var str = `${dt.getFullYear()}-${dt.getMonth() < 9?"0"+(dt.getMonth() + 1):dt.getMonth() + 1}-${dt.getDate()<10?"0"+dt.getDate():dt.getDate()}`;
  return str
})
//路由拦截
router.beforeEach((to, from, next) => {
  if(to.fullPath.startsWith('/admin')){     //用户无法进入管理员界面
    if(JSON.parse(window.localStorage.getItem('isAdmin'))){
      next()
    }else{
      next({
        path: '/index', 
        redirect:  '/index' 
        });
    }
  }else{
    next()
  }

})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
