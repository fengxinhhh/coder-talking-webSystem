<template>
    <div>
        <el-menu
        class="el-menu-vertical-demo"
            :default-active="$route.pash"
            background-color="black"
            text-color="#fff"
            active-text-color="#ccc"
            :collapse-transition="false"
            router
            >
            <el-submenu v-for = "item in newPathList" :key = "item.index" :index = "item.index">
                <template slot = "title">
                    <i :class = "item.icon"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item :index = "item2.path" v-for = "(item2) in item.children" :key = "item2.path" >{{item2.name}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.getAdminRole();
        },
        data() {
            return {
                adminsRole:['/admin/user','/admin/delete','/admin/istop','/admin/delnews','/admin/report','/admin/addadmin','/admin/deladmin','/admin/rolelist','/admin/rolepost'],//管理员拥有的权限
                
                pathList:[
                    {
                        index:"1",
                        name:'用户管理',
                        icon:'el-icon-user-solid',
                        children:[
                            {
                                name:'冻结用户',
                                path:'/admin/user'
                            },
                            {
                                name:'删除用户',
                                path:'/admin/delete'
                            },
                        ]
                    },
                    {
                        index:"2",
                        name:'文章管理',
                        icon:'el-icon-folder-opened',
                        children:[
                            {
                                name:'置顶文章',
                                path:'/admin/istop'
                            },
                            {
                                name:'删除文章',
                                path:'/admin/delnews'
                            },
                        ]
                    },
                    {
                        index:"3",
                        name:'请求处理',
                        icon:'el-icon-message-solid',
                        children:[
                            {
                                name:'举报处理',
                                path:'/admin/report'
                            },
                        ]
                    },
                    {
                        index:"4",
                        name:'添加管理',
                        icon:'el-icon-folder-add',
                        children:[
                            {
                                name:'添加管理员',
                                path:'/admin/addadmin'
                            },
                            {
                                name:'删除用户',
                                path:'/admin/deladmin'
                            },
                        ]
                    },
                    {
                        index:"5",
                        name:'权限管理',
                        icon:'el-icon-s-operation',
                        children:[
                            {
                                name:'权限列表',
                                path:'/admin/rolelist'
                            },
                            {
                                name:'权限分配',
                                path:'/admin/rolepost'
                            },
                        ]
                    },
                ],      //所有权限列表
            }
        },
        methods: {
           async getAdminRole(){
               const {data:res} = await this.$http.get('/getAdminRole')
               if(res.success){
                   this.adminsRole = res.roleList
               }
           }

        },
        computed: {
            newPathList() {         //根据已有权限展示出对应权限列表
                this.pathList.forEach(item=>{
                    item.children = item.children.filter(childItem=>{
                        return this.adminsRole.indexOf(childItem.path) !== -1
                    })
                })
                this.pathList = this.pathList.filter(item=>{
                    return item.children.length !== 0
                })
                return this.pathList
            }
        }
    }
</script>

<style scoped>
.el-menu-vertical-demo{
    height:800px;
}
.el-menu{
    border-right-width: 0;
    width:200px;
}
.el-menu-item{
    padding-right:5px;
}

</style>