<template>
    <div>
        <el-Card>
            <el-table
            :data="adminList"
            style="width: 100%"
            stripe border fit>
                <el-table-column
                    prop="nickname"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="邮箱">
                </el-table-column>
                <el-table-column
                    prop="nickname"
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
                        <el-button type="danger" @click = "delAdmin(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-Card>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.getAdminList()
        },
        data() {
            return {
                adminList: []
            }
        },
        methods: {
            async getAdminList() {          //获取所有管理员
                const {data:res} = await this.$http.get(`/getAllAdminInfo`)
                if(res.success){
                    this.adminList = res.returnData
                }
            },
            async delAdmin(data){
                console.log(data.row)
                const {data:res} = await this.$http.post('/delAdmin',{adminId:data.row._id})
                if(res.success){
                    this.$message.success(res.msg)
                    this.getAdminList()
                }
            }
        },
    }
</script>

<style lang="less" scoped>

</style>