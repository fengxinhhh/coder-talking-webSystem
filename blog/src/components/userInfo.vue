<template>
    <div>
        <Header></Header>
        <div class="title">
            <div class="bgc">
                <span>{{userInfo.nickname}}的博客</span>
            </div>
            <div class="info">
                <img :src="userInfo.avatar" width="130" height="130">
                <div class="nickname">
                    <h3>{{userInfo.nickname}}</h3>
                    <span><i class="el-icon-loading"></i>码龄{{userInfo.created_time | codeAge}}天</span>
                </div>
                <span class="bio">{{userInfo.bio}}</span>
            </div>
            <div class="btn">
                <el-button type="danger" v-if="!isLoginUser&&!isLocked" @click="lockUser">关注</el-button>
                <el-button type="danger" v-if="!isLoginUser&&isLocked" @click="cancelLockUser">已关注</el-button>
                <el-button type="primary" v-if="isLoginUser" @click.prevent="toProfile">编辑</el-button>
            </div>
            <ul class="roundInfo">
                <li>
                    <h4>{{readNum}}</h4>
                    <span>被访问量</span>
                </li>
                <li>
                    <h4>{{newsNum}}</h4>
                    <span>原创文章</span>
                </li>
                <li>
                    <h4>{{userRound}}</h4>
                    <span>作者排名</span>
                </li>
                <li>
                    <h4>{{lockNum}}</h4>
                    <span>粉丝数量</span>
                </li>
            </ul>
        </div>
        <div class="news">
            <div class="left-info">
                <div class="getGoods">
                    <span><b>昵称：</b>{{userInfo.nickname}}</span>
                    <span><b>性别：</b>{{userInfo.gender}}</span>
                    <span><b>于</b> {{userInfo.created_time | timeFillter}} 加入冯老心编码论坛</span>
                    <span></span>
                </div>
                <div class="userIntro">
                    <span class="top">
                        获得成就
                    </span>
                    <p>
                       <i class="el-icon-sunny"></i> 获得 <b>{{goodNum}}</b> 次赞
                    </p>
                    <p>
                        <i class="el-icon-s-data"></i>文章获得 <b>{{commentNum}}</b> 次评论
                    </p>
                    <p>
                        <i class="el-icon-s-claim"></i>收割 <b>{{lockNum}}</b> 名粉丝
                    </p>
                </div>
            </div>
            <div class="newsList">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">全部</el-menu-item>
                    <el-menu-item index="2">精华</el-menu-item>
                    <el-menu-item index="3">分享</el-menu-item>
                    <el-menu-item index="4">回答</el-menu-item>
                    <el-menu-item index="5">招聘</el-menu-item>
                    <el-menu-item index="6">客户端测试</el-menu-item>
                    <el-menu-item index="7">前端</el-menu-item>
                </el-menu>
                <ul>
                    <li v-for="(item) in newsList" :key="item._id">
                        <h4 @click="readNews(item._id)">{{item.title}}</h4>
                        <p @click="readNews(item._id)" v-html = "formatAllHtmlTag(item.news)"></p>
                        <div class="tabs">
                            <div class="comment">
                                <el-tag :type="item.option=='精华'?'success':'danger'" @click="readNews(item._id)">{{item.option}}</el-tag>
                                <span @click="readNews(item._id)"><i class="el-icon-view"></i> {{item.readNum}} 阅读</span>
                                <span @click="readNews(item._id)"><i class="el-icon-chat-dot-round"></i> {{item.comment.length}} 评论</span>
                                <span @click="readNews(item._id)"><i class="el-icon-goblet-square-full"></i> {{item.good.length}} 点赞</span>
                            </div>
                            <span class="time">发布于 {{item.create_time | newsCreateTime}} </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './header'
import Footer from './footer'
    export default {
        mounted () {
            this.getData()
            this.getUserInfoByNickname()
            this.getUserNews()
            
            
            this.getMenuNews(this.activeIndex);
        },
        data() {
            return {
                userInfo: {},    //用户信息
                userNews:[],        //用户发布的文章
                readNum:0,          //用户文章总浏览量
                userRound:0,        //用户排名
                lockNum:0,       //粉丝量
                newsNum:0,           //文章数量
                commentNum:0,       //总评论数量
                goodNum:0,          //赞数量
                activeIndex: '1',    //分类选中的选项卡下标
                newsList:[],    //当前文章列表
                totalNews:0,    //当前列表文章数量
                isLoginUser:true,   //判断主页是否为登录用户
                isLocked:false,   //当前作者是否被关注
            }
        },
        methods: {
            async getUserInfoByNickname() {     //根据用户名获取基本个人信息
                const {data:res} = await this.$http.get(`/getUserInfoByNickname`,{
                    params:{
                        nickname:this.$route.query.avatar
                    }
                })
                if(res.success){
                    this.userInfo = res.returnData
                    this.lockNum = this.userInfo.lockNum.length
                    this.decideIsLocked()
                    this.decideLoginUser()
                    this.getUserRound()
                }
            },
            async getUserNews(){        //获取用户所发布过的所有文章
                const {data:res} = await this.$http.get(`/getAllNewsByNickname`,{
                    params:{
                        nickname:this.$route.query.avatar
                    }
                })
                if(res.success){
                    this.userNews = res.returnData
                    this.newsNum = this.userNews.length;
                    this.userNews.forEach(item => {
                        this.goodNum += item.good.length
                        this.commentNum += item.comment.length
                        this.readNum += item.readNum
                    });
                    this.userRound = this
                    
                }
            },
            async getUserRound(){
                const {data:res} = await this.$http.get(`/getAllUserInfo`);
                if(res.success){
                    var userList = res.returnData;
                    userList.sort((x,y)=>{
                        return x.lockNum.length - y.lockNum.length;
                    })
                    this.userRound =  userList.findIndex(item=>{
                        return item.nickname == this.userInfo.nickname
                    })
                }
            },
            async decideLoginUser(){    //判断主页是否为登录用户
                await this.$http.get(`/getUserInfo`)
                .then(({data:result})=>{
                    if(result.success){
                        if(result.returnData.nickname == this.userInfo.nickname){
                            this.isLoginUser = true
                        }else{
                            this.isLoginUser = false
                        }
                    }
                })
            },
            toProfile(){
                this.$router.push('profile')
            },
            handleSelect(key) {   //选项卡切换
                this.activeIndex = key
                this.getMenuNews(this.activeIndex)
            },
            async getMenuNews(menuIndex){    //获取菜单的筛选文章
                switch(menuIndex){
                    case "1":var res = await this.$http.get(`/showNews?nickname=${this.$route.query.avatar}`);
                            break;
                    case "2":var res = await this.$http.get(`/showMenu2News?nickname=${this.$route.query.avatar}`);
                            break;
                    case "3":var res = await this.$http.get(`/showMenu3News?nickname=${this.$route.query.avatar}`);
                            break;
                    case "4":var res = await this.$http.get(`/showMenu4News?nickname=${this.$route.query.avatar}`);
                            break;
                    case "5":var res = await this.$http.get(`/showMenu5News?nickname=${this.$route.query.avatar}`);
                            break;
                    case "6":var res = await this.$http.get(`/showMenu6News?nickname=${this.$route.query.avatar}`);
                            break;
                    case "7":var res = await this.$http.get(`/showMenu7News?nickname=${this.$route.query.avatar}`);
                            break;
                }
                if(res.data.success){
                    this.newsList = res.data.returnData
                    this.totalNews = res.data.returnData.length
                }
            },
            readNews(index){    //查看新闻
                var editUrl = this.$router.resolve({path:'show',query:{  //传参
                    newsId:index
                }});
                window.open(editUrl.href, '_blank');
                this.newsId = this.$route.query.newsId;
            },
            async lockUser(){     //关注作者
                if(window.localStorage.getItem('token')){
                const {data:res} = await this.$http.post('/lockUser',{  //添加当前用户为作者粉丝
                    avatar:this.userInfo.nickname,
                })
                if(res.success){
                    this.$message.success("关注成功！")
                    this.decideIsLocked()
                }
                }else{
                this.$router.push('login')
                }
                
            },
            async decideIsLocked(){ //判断当前作者是否被当前用户关注
                const {data:res} = await this.$http.post('/decideIsLocked',{
                    avatar:this.userInfo.nickname,

                })
                this.isLocked = res.isLocked
            },
            async cancelLockUser(){   //取关作者
                const {data:res} = await this.$http.post('/cancelLockUser',{
                    avatar:this.userInfo.nickname,
                })

                if(res.success){
                    this.$message.success("取关成功！")
                    this.decideIsLocked()
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
        filters: {
            codeAge: function(createTime) {     //码龄过滤器
                var dt1 = new Date(createTime)
                var dt2 = new Date();
                var day = dt2.getTime()- dt1.getTime();
                return parseInt(day / (1000 * 60 * 60 * 24))
            },
            newsCreateTime:function(createTime) {     //文章发布日期过滤器
                var dt1 = new Date(createTime)
                var dt2 = new Date();
                var day = dt2.getTime()- dt1.getTime();
                if(parseInt(day / (1000 * 60 * 60 * 24)) < 1){
                    return "今天"
                }
                return parseInt(day / (1000 * 60 * 60 * 24)) + " 天前"
            }
        },
        computed: {
            formatAllHtmlTag(){     //过滤所有html标签用于展现相关文章文本
                return (str) =>{
                let reg=/<\/?.+?\/?>/g
                str = str.replace('&nbsp','')
                return str.replace(reg,'')
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
.title{
    width:100%;
    min-width:1300px;
    height:400px;
    background: #fff;
    margin:0 auto;
    position: relative;
}
.title .bgc{
    background:linear-gradient(rgb(8, 8, 8),rgb(34, 34, 34),rgb(8, 8, 8));
    height:100px;
}
.title .bgc span{
    height:50px;
    font-size:15px;
    color:#fff;
    margin:100px 0 0 100px;
}
.title .btn{
    margin-right:100px;
    display: flex;
    justify-content:flex-end
}
.title .info{
    display:flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top:50px;
    left:45%;
}
.title .info img{
    border-radius: 50%;
    border:5px solid #fff;
}
.title .info .nickname{
    display: flex;
    align-items: center;
}
.title .info .nickname span{
    margin-left:20px;
}
.title .info .bio{
    font-size:12px;
}
.title .info .nickname span{
    font-size:13px;
    background-color: rgb(250, 180, 31);
    border-radius: 15px;
    color:#fff;
    padding:2px 5px;
}
.title .roundInfo{
    display: flex;
    margin:150px auto 0;
    justify-content: center;
}
.title .roundInfo li{
    width:200px;
    height:50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right:1px solid #ccc;
}
.title .roundInfo li:last-of-type{
    border-right:none;
}
.news{
    margin-left:20px;
    margin-top:20px;
    width:100%;
    display: flex;
}
.news .getGoods{
    width:400px;
    min-width: 280px;
    height:130px;
    background: #fff;
    display: flex;
    flex-direction: column;
    font-size:13px;
    justify-content: center;
}
.news .getGoods span{
    margin:5px 0 5px 20px;
}
.news .userIntro{
    width:400px;
    height:180px;
    margin-top:20px;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding:0 20px;
    box-sizing: border-box;
}
.news .userIntro .top{
    border-bottom:1px solid #ccc; 
    padding:10px 0;
}
.news .userIntro p{
    margin:7px 0;
    font-size:14px;
}
.news .userIntro i{
    font-size:20px;
    margin-right:15px;
}
.news .userIntro .el-icon-sunny{
    color:crimson;
}
.news .userIntro .el-icon-s-data{
    color:rgb(54, 35, 221);
}
.news .userIntro .el-icon-s-claim{
    color:rgb(217, 230, 44);
}
.news .newsList{
    margin:0 30px;
    width:100%;
    background: #fff;
}
.news .el-menu{
    padding:10px 20px;
}
.newsList ul li{
    display: flex;
    flex-direction: column;
    margin:10px 30px 10px 0;
    padding-bottom:20px;
    border-bottom:1px solid #ccc
}
.newsList ul li h4{
    font-size:18px;
    width:400px;
}
.newsList ul li h4:hover{
    color:red;
    cursor: pointer;
}
.newsList ul li p{
    height:45px;
    width:750px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-size:14px;
    color:rgb(167, 167, 167);
    cursor: pointer;
}
.newsList ul li .tabs{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.newsList ul li .tabs .time{
    font-size:14px;
}
.newsList .comment{
    display: flex;
    justify-content: space-between;
    font-size:12px;
    align-items: center;
}
.newsList .comment .el-tag{
    margin-left:0;
}
.newsList .comment span{
    margin-left:40px;
    cursor: pointer;
}
</style>