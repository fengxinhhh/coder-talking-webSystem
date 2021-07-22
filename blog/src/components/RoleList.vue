<template>
    <div>
        <el-table
        :data = "adminList"
        style = "width:100%"
        stripe border>
            <el-table-column
            prop="nickname"
            label="名称"
            width="180">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱">
            </el-table-column>
            <el-table-column
            label="详情"
            width="150"
            type="expand">
                <template slot-scope="scope">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="密码" style="font-weight:bold;">
                            <span>{{ scope.row.password }}</span>
                        </el-form-item><br>
                        <el-form-item label="管理员 ID" style="font-weight:bold;">
                            <span>{{ scope.row._id }}</span>
                        </el-form-item><br>
                        <el-form-item label="创建日期" style="font-weight:bold;">
                            <span>{{ scope.row.created_time | timeFillter }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center">
                <template slot-scope="scope">
                    <el-button type="danger" @click = "toUpdate(scope.row)">修改权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        {{defaultShowKey}}
        <el-dialog
        title="修改权限"
        :visible.sync="dialogVisible"
        width="30%"
        @close='closeDialog'>
            <el-tree
            :data="pathList"
            show-checkbox
            node-key="id"
            default-expand-all
            ref="tree"
            :props="defaultProps"
            :default-checked-keys = "defaultShowKey">
            </el-tree>
            <el-button type = "primary" @click = "updateRole">提交</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.getAdminList();
        },
        data() {
            return {
                adminList:[],       //管理员列表
                pathList:[
                    {
                        id:'1',
                        label:'用户管理',
                        icon:'el-icon-user-solid',
                        children:[
                            {
                                id:'2',
                                label:'冻结用户',
                                path:'/admin/user'
                            },
                            {
                                id:'3',
                                label:'删除用户',
                                path:'/admin/delete'
                            },
                        ]
                    },
                    {
                        id:"4",
                        label:'文章管理',
                        icon:'el-icon-folder-opened',
                        children:[
                            {
                                id:'5',
                                label:'置顶文章',
                                path:'/admin/istop'
                            },
                            {
                                id:'6',
                                label:'删除文章',
                                path:'/admin/delnews'
                            },
                        ]
                    },
                    {
                        id:"7",
                        label:'请求处理',
                        icon:'el-icon-message-solid',
                        children:[
                            {
                                id:'8',
                                label:'举报处理',
                                path:'/admin/report'
                            },
                        ]
                    },
                    {
                        id:"9",
                        label:'添加管理',
                        icon:'el-icon-folder-add',
                        children:[
                            {
                                id:'10',
                                label:'添加管理员',
                                path:'/admin/addadmin'
                            },
                            {
                                id:'11',
                                label:'删除用户',
                                path:'/admin/deladmin'
                            },
                        ]
                    },
                    {
                        id:"12",
                        label:'权限管理',
                        icon:'el-icon-s-operation',
                        children:[
                            {
                                id:'13',
                                label:'权限列表',
                                path:'/admin/rolelist'
                            },
                            {
                                id:'14',
                                label:'权限分配',
                                path:'/admin/rolepost'
                            },
                        ]
                    },
                ],              //所有权限列表 
                adminsRole:[],//管理员拥有的权限
                adminId:'',         //被修改管理员的id
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                defaultShowKey:[],          //树形结构默认显示的key
                dialogVisible:false,        //修改权限弹出框显示
            } 
        },
        methods: {
            async getAdminList(){           //获取管理员列表
                const {data:res} = await this.$http.get(`/getAllAdminInfo`)
                if(res.success){
                    this.adminList = res.returnData
                }
            },  
            toUpdate(data){         //显示修改权限弹窗并设置默认key值
                this.adminsRole = data.role
                this.adminId = data._id
                this.newPathList(this.adminsRole).forEach(item=>{
                    // this.$set(this.defaultShowKey,this.defaultShowKey.length,item.id)
                    this.defaultShowKey.push(item.id)
                    // this.defaultShowKey = [item.id,...this.defaultShowKey]
                    item.children.forEach(childItem=>{
                        // this.$set(this.defaultShowKey,this.defaultShowKey.length,childItem.id)
                        // this.defaultShowKey = [childItem.id,...this.defaultShowKey]
                        this.defaultShowKey.push(childItem.id)
                    })
                })
                console.log(this.defaultShowKey)
                this.dialogVisible = true
            },
            closeDialog(){  
                this.defaultShowKey.splice(0,this.defaultShowKey.length)
                console.log(this.defaultShowKey)
            },
            async updateRole() {           //修改管理员权限
                var updateRoleData = Object.assign(this.$refs.tree.getCheckedNodes())
                //过滤出一个干净的权限数组，无对象
                updateRoleData = updateRoleData.filter(item=>{
                    return !item.children
                })
                updateRoleData = updateRoleData.map(item=>{
                    return item.path
                })
                const {data:res} = await this.$http.post('/updateAdminRole',{
                    id:this.adminId,
                    role:updateRoleData
                })
                if(res.success){
                    this.$message.success(res.msg)
                    this.adminsRole = res.returnData.role
                    this.defaultShowKey.splice(0,this.defaultShowKey.length)
                    this.dialogVisible = false
                    this.getAdminList()
                }
            }
        },
        computed: {
            newPathList() {         //根据已有权限展示出对应权限列表
                return (adminsRole) =>{
                    var filterPathList = JSON.parse(JSON.stringify(this.pathList))
                    filterPathList.forEach(item=>{
                        item.children = item.children.filter(childItem=>{
                            return adminsRole.indexOf(childItem.path) !== -1
                        })
                    })
                    filterPathList = filterPathList.filter(item=>{
                        return item.children.length !== 0
                    })
                    return filterPathList
                }
            },
        }
    }
</script>

<style lang="less" scoped>

</style>