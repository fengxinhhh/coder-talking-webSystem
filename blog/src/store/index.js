import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//Vuex
export default new Vuex.Store({
	state: {      //变量
        adminPath:'/admin/user',
        adminPathName:'用户管理', 
    },
    mutations:{     //同步方法
        changeAdminPathName(state,newPathName){   //改变管理员路径菜单名
            state.adminPathName = newPathName
        },
    } 
})