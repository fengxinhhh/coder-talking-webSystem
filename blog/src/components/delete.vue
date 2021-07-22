<template>
    <div>
        <el-table
            :data="userList"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            width="80">
            </el-table-column>
             <el-table-column
            prop="nickname"
            label="用户名"
            width="280">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱"
            width="280">
            </el-table-column>
           <el-table-column
            prop="nickname"
            label="详情"
            width="180"
            type="expand">
            <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="头像" style="font-weight:bold;">
                        <img :src="scope.row.avatar" width="50" height="50">
                    </el-form-item>
                    <el-form-item label="密码" style="font-weight:bold;">
                        <span>{{ scope.row.password }}</span>
                    </el-form-item>
                    <el-form-item label="用户 ID" style="font-weight:bold;">
                        <span>{{ scope.row._id }}</span>
                    </el-form-item>
                    <el-form-item label="创建日期" style="font-weight:bold;">
                        <span>{{ scope.row.created_time | timeFillter }}</span>
                    </el-form-item>
                    
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="操作"
            width="180">
                <template slot-scope="scope">
                    <el-button type="danger" @click="delUser(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    export default {
        mounted () {
            this.getUserList();
        },
        data() {
            return {
                userList: [],   //用户列表
            }
        },
        methods: {
            async getUserList() {   //获取用户列表
                await this.$http.get('/getAllUserInfo')
                .then(({data:res}) =>{
                    if(res.success){
                        this.userList = res.returnData
                    }
                })
            },
            delUser(data){    //删除用户
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(async() => {
                    await this.$http.post(`/delUser`,data)
                    .then(({data:res})=>{
                        if(res.success){
                            this.$message.success(res.returnText)
                            this.getUserList();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },
    }
</script>

<style scoped>
.el-form-item{
    width:500px;
}

</style>