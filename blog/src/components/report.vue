<template>
    <div>
        <el-table
            :data="reportList"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            width="80">
            </el-table-column>
             <el-table-column
            prop="reportUser"
            label="举报者"
            width="280">
            </el-table-column>
            <el-table-column
            prop="newsTitle"
            label="文章标题"
            width="280">
            </el-table-column>
           <el-table-column
            prop="newsAvatar"
            label="作者"
            width="180">
            </el-table-column>
            <el-table-column
            label="发布日期"
            width="180">
            <template slot-scope="scope">
                {{scope.row.create_time | timeFillter}}
            </template>
            
            </el-table-column>
            <el-table-column
            prop="reportType"
            label="举报类型"
            width="180">
            </el-table-column>
            <el-table-column
            prop="reportComment"
            label="备注"
            width="180">
            </el-table-column>
            <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
                <el-button type="danger" @click="resolveReport(scope.row)" :disabled="scope.row.result?true:false">{{scope.row.result?"已处理" : "处理"}}</el-button>
            </template>  
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.getReportList();
            
        },
        data() {
            return {
                reportList: [],   //用户列表
            }
        },
        methods: {
            async getReportList() {       //获取举报列表
                await this.$http.get('/getReportList')
                .then(({data:res}) =>{
                    if(res.success){
                        this.reportList = res.returnData
                    }
                })
            },      
            async resolveReport(data){      //处理举报
                this.$http.post(`/resolveReport`,{
                    id:data._id
                })
                .then(({data:res})=>{
                    if(res.success){
                        this.$message.success(res.returnText)
                        this.getReportList()
                    }
                })
            }
           
        },
    }
</script>

<style scoped>
.el-form-item{
    width:500px;
}


</style>