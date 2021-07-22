<template>
    <div>
        <Header></Header>
        <div class="content">
            <el-tabs :tab-position="tabPosition" style="height: 700px;overflow:auto;">
                <el-tab-pane v-for="(item,index) in starList" :key="index" :label="item.name">
                <div class="starList" v-for="(item2,index2) in item.content" :key="index2">
                    <p @click="readNews(item2.newsId)">{{item2.newsName}}</p><br>
                    <i class="el-icon-star-on"  @click="deleteNewsStar(item.name,item2.newsId)"></i>   
                </div>    
                </el-tab-pane>
            </el-tabs>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './header'
import Footer from './footer'
    export default {
        mounted () {
            this.getStar();
            
        },
        data() {
            return {
                tabPosition: 'left',
                starList:[],        //收藏夹
            }
        },
        methods: {
            async getStar() {   //获取该用户收藏夹
                const {data:res} = await this.$http.get('/getStar',{
                    params:{
                        id:window.localStorage.getItem('id')
                    }
                })
                if(res.success){
                    this.starList = res.returnArr.star
                }
                console.log(this.starList)
            },
            readNews(index){    //查看新闻
                console.log(index)
                this.$router.push({path:'show',query:{  //传参
                    newsId:index
                }});
            },
            async deleteNewsStar(star,newsId){   //取消收藏
                const {data:res} = await this.$http.post('/deleteStarNews',{
                    userId:window.localStorage.getItem('id'),
                    newsId:newsId,
                    star:star,
                })
                if(res.success){
                    this.$message.error("取消收藏成功")
                    this.getStar();
                }
            },

        
        },
        components:{
            Header,
            Footer
        }
    }
</script>

<style scoped>
.content{
    background: #fff;
    width:1200px;
    height:900px;
    margin:0 auto;
    padding:100px;
}
.starList{
    height:50px;
    line-height:50px;
    border:1px solid #ccc;
    padding-left:20px;
    margin:10px 10px;
    display: flex;
    justify-content: space-between;
}
.el-tabs{
    height:900px;
}
.el-tabs-pane{
    height:900px;
}
.starList i{
    line-height: 50px;
    margin-right:50px;
    font-size:20px;
    color:red;
}
.content .starList:hover{
    color:red;
    cursor: pointer;
    box-shadow: 10px 5px 5px #ccc;
}
</style>