<template>
    <div>
        <Header></Header>
        <el-table
            :data="sortNewsList"
            style="width: 100%"
            stripe
            border
            v-loading="loading">
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                class="newsName"
                label="文章"
                width="450">
                <template slot-scope="scope">
                    <b @click="readNews(scope.row._id)">{{scope.row.title}}</b>
                </template>
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="作者"
                width="180">
            </el-table-column>
            <el-table-column
                prop="readNum"
                label="浏览量"
                width="180">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="发布日期"
                width="180">
                
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
            this.sortNews()
        },
        data() {
            return {
                sortNewsList: [],
            }
        },
        methods: {
            async sortNews(){       //排序前100浏览量文章
                const {data:res} = await this.$http.get('/getSortNews');
                if(res.success){
                    this.sortNewsList = res.returnData
                }
                this.sortNewsList.forEach(item => {
                    item.create_time = this.filterTime(item.create_time)
                });
                console.log(this.sortNewsList)
            },
            readNews(index){    //查看新闻
                this.$router.push({path:'show',query:{  //传参
                    newsId:index
                }});
            },
        },
        computed: {
            filterTime() {
                return function(data){
                    var dt = new Date(data)
                    var str = `${dt.getFullYear()}-${dt.getMonth() < 9?"0"+(dt.getMonth() + 1):dt.getMonth() + 1}-${dt.getDate()<10?"0"+dt.getDate():dt.getDate()}`;
                    return str
                }
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
    margin:0 auto;
}
</style>