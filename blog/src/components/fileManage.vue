<template>
    <div>
        <Header></Header>
        <h1>文章管理</h1>
        <el-table
        :data="news"
        style="width: 100%"
        border stripe>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="title" label="文章" width="400"></el-table-column>
            <el-table-column width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="updateNews(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column width="180">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteNews(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './header'
import Footer from './footer'
    export default {
        mounted () {
            this.getData()
            this.sendLoginUser();
            
        },

        data() {
            return {
                news: [],
            }
        },
        methods: {
            async sendLoginUser(data){      //接受用户名并请求文章列表
                const {data:res} = await this.$http.get(`/getAllNewsByLoginuser`)
                if(res.success){
                    this.news = res.returnData
                }
            },
            updateNews(data){       //编辑文章
                this.$router.push({
                    path:'new',
                    query:{
                        data:data
                    }
                })
            },
            async deleteNews(data){     //删除文章
                const {data:res} = await this.$http.post('/delNewsById',{
                    newsId:data._id
                })
                if(res.success){
                    this.$message.success(res.returnText)
                    this.sendLoginUser(this.loginUser)
                }
                
            },
            getData(){
                const loading = this.$loading({
                        lock: true,//lock的修改符--默认是false
                        text: 'Loading',//显示在加载图标下方的加载文案
                        spinner: 'el-icon-loading',//自定义加载图标类名
                        background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
                        target: document.querySelector('#table')//loadin覆盖的dom元素节点
                });
                loading.close()
            }
        },
        components:{
            Header,
            Footer
        }
    }
</script>

<style scoped>
.el-table{
    height:630px;
}
</style>