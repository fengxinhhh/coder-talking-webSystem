<template>
    <div>
        <div class="right-box">
            <div class="loginBox">
            <span>
                开发者专业论坛
            </span>
            <span>
                你可以<a href="#" @click.prevent="toLogin">登录</a> 或 <a href="#" @click.prevent="toRegister">注册</a>,也可以
            </span>
            <el-button type="primary" width="60px" height="30" @click="toLogin">通过 E-mail 登录</el-button>
            </div>
            <div class="chat">
            <div class="title">
                无人评论的文章
            </div>
            <ul>
                <el-tooltip class="item" v-for="(item) in noCommentsNews" :key="item._id" effect="dark" :content="item.title" placement="top-start" :open-delay="500">
                    <li @click="readNews(item._id)">{{item.title}}</li>
                </el-tooltip>
            </ul>
            </div>
            <div class="topRound">
                <div class="title">
                    浏览量最多 <span @click="toReadNumRound">TOP 100 >></span>
                </div>
                <ul>
                    <el-tooltip class="item"  v-for="item in sortNewsList" :key="item._id" effect="dark" :content="item.title" placement="top-start" :open-delay="500">
                        <li>
                            <b @click="readNews(item._id)">{{item.title}}</b>
                            <span>{{item.readNum}}</span>
                        </li>
                    </el-tooltip>
                </ul>
            </div>
      </div>
    </div>
</template>

<script>
    export default {
        mounted () {
            this.getNoCommentNews();
            this.sortNews()
        },
        data() {
            return {
                noCommentsNews:[],  //无人评论的文章列表
                sortNewsList:[],    //前一百浏览量排序
            }
        },
        methods: {
            toLogin(){    //登录跳转
                this.$router.push('login');
            },
            toRegister(){    //注册跳转
                this.$router.push('register');
            },
            toReadNumRound(){   //100排行榜跳转
                this.$router.push("readnumround");
            },
            async getNoCommentNews(){   //获取无人评论的文章
                const {data:res} = await this.$http.get('/getNoCommentNews');
                if(res.success){
                    this.noCommentsNews = res.returnData
                }
            },
            async sortNews(){       //排序前100浏览量文章
                const {data:res} = await this.$http.get('/getSortNews');
                if(res.success){
                    this.sortNewsList = res.returnData
                    console.log(res.returnData)
                }
            },
            readNews(index){    //查看新闻
                var editUrl = this.$router.resolve({path:'show',query:{  //传参
                    newsId:index
                }});
                window.open(editUrl.href, '_blank');
                this.newsId = this.$route.query.newsId;
            },
        },
    }
</script>

<style scoped>
.right-box{
    width:250px;
    margin-top:20px;
    margin-left:20px;
}
.loginBox{
  padding:10px 10px;
  display: flex;
  flex-direction: column;
  width:250px;
  height:160px;
  font-size:14px;
  background: #fff;
}
.loginBox span{
  margin:5px 0;
}
.loginBox .el-button{
  margin-top:20px;
}
.chat{
  font-size:14px;
  margin-top:30px;
  width:250px;
  height:260px;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.chat .title{
  background: rgb(84, 92, 100);
  height:40px;
  line-height:40px;
  padding-left:10px;
  color:#fff;
}
.chat ul{
  margin:15px 0 0 -15px;
}
.chat li{
  width:220px;
  height:21px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 12px 0;
}
.chat li:hover{
  cursor: pointer;
}
.topRound{
  margin-top:30px;
  width:250px;
  height:370px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow:hidden;
}
.topRound .title{
  background: rgb(84, 92, 100);
  height:40px;
  line-height:40px;
  padding-left:10px;
  color:#fff;
}
.topRound li{
  margin:12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width:200px;
  height:20px;
  margin-left:-24px;
  font-size:13px;
  display: flex;
  justify-content: space-between;
}
.topRound li:hover{
  cursor: pointer;
}
.topRound .title span{
    cursor: pointer;
}
</style>