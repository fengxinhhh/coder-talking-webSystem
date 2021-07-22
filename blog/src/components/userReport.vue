<template>
    <div>
        <Header></Header>
            <h1>我的举报</h1>
            <el-table
            :data="reportList"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            width="80">
            </el-table-column>
            <el-table-column
            prop="newsTitle"
            label="文章标题"
            width="220">
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
            label="是否被授理"
            width="180">
            <template slot-scope="scope">
                <label>{{scope.row.result?"是" : "否"}}</label>
            </template>  
            </el-table-column>
        </el-table>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './header.vue'
import Footer from './footer.vue'
    export default {
        mounted () {
            this.getReportList();
        },
        data() {
            return {
                reportList: [],     //举报列表
            }
        },
        methods: {
            async getReportList() {       //获取用户个人举报列表
                await this.$http.get('/getReportListByNickname')
                .then(({data:res}) =>{
                    if(res.success){
                        this.reportList = res.returnData
                    }
                })
            }, 
        },
        components:{
            Header,
            Footer
        }
    }
</script>

<style scoped>
.el-table{
    height:600px;
}
</style>