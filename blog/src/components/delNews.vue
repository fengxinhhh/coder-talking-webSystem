<template>
    <div>
        <el-table
            :data="newsList"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            width="80">
            </el-table-column>
             <el-table-column
            prop="title"
            label="标题"
            width="280">
            </el-table-column>
            <el-table-column
            prop="option"
            label="分类"
            width="200">
            </el-table-column>
            <el-table-column
            prop="nickname"
            label="作者"
            width="200">
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteNews(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.getNewsList();
        },
        data() {
            return {
                newsList: [],   //所有文章列表
            }
        },
        methods: {
            async getNewsList() {         //获取文章列表
                this.$http.get('/showNews')
                .then(({data:res})=>{
                    if(res.success){
                        this.newsList = res.returnData
                    }
                })
            },
            async deleteNews(id){       //删除文章
                this.$http.post(`/delNewsById`,{
                    newsId:id
                })
                .then(({data:res})=>{
                    if(res.success){
                        this.$message.success(res.returnText)
                        this.getNewsList()
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>