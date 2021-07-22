<template>
    <div>
        <h2>开发者论坛后台管理</h2>
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin' }">后台管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{twoPathName}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <AdminLeftNav></AdminLeftNav>
            <el-card>
                <keep-alive> 
                    <router-view></router-view>
                </keep-alive>
               
            </el-card>
         </div>
    
    </div>
</template>

<script>
import AdminLeftNav from './adminLeftNav.vue'
    export default {
        data() {
            return {    
                twoPathName:this.$store.state.adminPathName,
            }
        },
        watch: {
            "$route.path"(newValue, oldValue) { //监听面包屑导航菜单名
                if(newValue.split('/')[2] == "user" || newValue.split('/')[2] == "delete"){
                    this.$store.commit('changeAdminPathName','用户管理');
                }else if(newValue.split('/')[2] == "istop" || newValue.split('/')[2] == "delNews"){
                    this.$store.commit('changeAdminPathName','文章管理');
                }else if(newValue.split('/')[2] == "report"){
                    this.$store.commit('changeAdminPathName','请求处理');
                }
                this.twoPathName = this.$store.state.adminPathName
               
            }
        },
        components:{
            AdminLeftNav,
        }

    }
</script>

<style scoped>
.el-breadcrumb{
    margin-top:20px;
}
.el-card{
    width:100%;

}
.content{
    margin-top:20px;
    display: flex;
}
</style>