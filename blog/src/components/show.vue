<template>
  <div>
    <Header></Header>
    <div class="content">
      <div class="left-content">
          <section>
            <div class="title">
              <div class="newsInfo">
                <img :src = "news.avatar" width="40" height="40" @click="toUserInfo(news.nickname)">
                <h3 style="text-align: left;">{{news.title}}</h3>
              </div>
              <div class="titleBtn"> 
                <span class="report" @click="reportNews">举报</span>
                <span class="chooseAll" v-if="!(isStared&&isLocked&&isGood)" @click="chooseAll">一键三连</span>
                <i class="el-icon-star-on"  @click="deleteNewsStar" v-if="isStared"></i>   <!--已经收藏 -->
                <i class="el-icon-star-off"  @click="addNewsStar" v-else></i>         <!--未收藏 -->
                <span class="lock" v-if="!isLocked" @click="lockUser">关注</span>
                <span class="lock cancel" @click="cancelLockUser" v-else>已关注</span>
                <span class="good" v-if="!isGood" @click="goodUser">点赞</span>
                <span class="good cancel" @click="cancelGoodUser" v-else>已赞{{goodNum}}</span>
              </div>
            </div>
            <div class="info">
              • 发布于 {{news.create_time | timeFillter}} • 作者 {{news.nickname}} • {{news.readNum}} 次浏览 • 来自 {{news.option}}
            </div>
            <div class="newsContent" v-html="news.news"></div>
            <div class="comment">
              <div class="title">
                <h3>热门评论</h3>
                <span class="goodTitle" @click="goodUserListState = !goodUserListState">赞过的人</span>
                <el-card v-if="goodUserListState">
                  <ul>
                    <li v-for="(item,index) in goodUserList" :key="index">
                      <img :src="item.avatar" width="40" height="40">
                      <span>{{item.nickname}}</span>
                    </li>
                  </ul>
                </el-card>
              </div>
              <span class="commentNum">{{commentNum}} 条评论</span>
              <div class="addComment" v-if="loginState">
                <h4 style="margin-top:50px;">发表评论</h4>
                <textarea class="commentIpt" v-model="comment" wrap="hard"></textarea>
                <div class="commentBtn">
                  <span>还可以输入{{10000-Number(comment.length)}}字</span>
                  <el-button type="danger" @click="addComment">发表评论</el-button>
                </div>
              </div>
            </div>
            <ul class="commentList" v-for="(item,index) in news.comment" :key="index">
              <li :style="lastComment(news.comment.length,index)">
                <img :src="item.avatar" width="40" height="40" @click="toUserInfo(item.nickname)">
                <b >{{item.nickname}}</b>
                <el-tag type="success" v-if="item.nickname == news.nickname" size="mini">作者</el-tag>
                <span>{{item.time}}</span>
                <p v-html="item.text" style="margin-left:45px;"></p>
              </li>
            </ul>
            
          </section>
          <div class="otherNews" v-if="otherNews.length">
            <h3>相关推荐</h3>
            <ul>
              <li v-for="item in otherNews" :key="item._id">
                <div class="news">
                  <span class="title" @click="readNews(item._id)">{{item.title}}</span>
                  <span class="content" v-html = "formatAllHtmlTag(item.news)"></span>
                </div>
                <span class="time">{{item.create_time | timeFillter}}</span>
              </li>
            </ul>
          </div>
        </div>
        
          <IndexRight></IndexRight>
          <!-- 收藏弹出框 -->
          <el-dialog        
          title="收藏文章"
          :visible.sync="dialogVisible"
          width="415px">
            <el-select v-model="starValue" placeholder="请选择收藏夹">
              <el-option
                v-for="(item,index) in starList"
                :key="index"
                :value="item.name">
              </el-option>
            </el-select>
            <div class="createStar">
              <el-input v-model="newStar" placeholder="新建收藏夹" ></el-input>
              <el-button @click="addStar">新建</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="postStarNews">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 举报弹出框 -->
        <el-dialog        
            title="收藏文章"
            :visible.sync="reportDialogVisible"
            width="415px">
              <el-checkbox-group v-model="reportCheckList">
                <el-checkbox label="黄色"></el-checkbox>
                <el-checkbox label="暴力"></el-checkbox>
                <el-checkbox label="抄袭"></el-checkbox>
                <el-checkbox label="低俗"></el-checkbox>
                <el-checkbox label="恶意评论"></el-checkbox>
              </el-checkbox-group>
                <el-input v-model="reportComment" placeholder="请输入举报备注信息"></el-input>
              <span slot="footer" class="dialog-footer">
                <el-button @click="reportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="postReport">确 定</el-button>
              </span>
          </el-dialog>
    </div>
    
    <Footer></Footer>
  </div>
  
</template>

<script>
  import Header from './header'
  import Footer from './footer'
  import IndexRight from './indexRight'
  export default {
    mounted () {
        this.getData()
        this.newsId = this.$route.query.newsId; 
        this.getNews()
        this.addHistoryReadNum()
        this.getOtherNews()
        this.getStarList()
        
        this.getOtherNews()
        this.getNewsGooder()
    }, 
    data() {
      return {
        loginState:window.localStorage.getItem('login'),
        newsId:'',    //新闻id
        news: {},  //新闻参数
        comment:'',  //新增评论内容
        otherNews:[],
        commentNum:0,
        dialogVisible:false, //收藏文章弹出框
        starList:[],
        starValue:'',   //选中的收藏夹
        newStar:'',    //新增收藏夹数据
        isStared:false,   //当前文章是否被收藏
        isLocked:false,   //当前作者是否被关注
        isGood:false,   //当前文章是否被赞
        goodNum:'',   //文章点赞数
        otherNews:[], //相关推荐文章
        goodUserList:[],  //点赞用户列表
        goodUserListState:false, //点赞用户列表框显示
        reportDialogVisible:false,    //举报弹出框
        reportCheckList:[],   //举报选项
        reportComment:'',     //举报备注信息
        reportInfo:{          //举报提交信息
          newsId:'',
          newsTitle:'',
          newsAvatar:'',
          create_time:'',
          isTop:false,
          reportType:[],
          reportComment:'',
          reportUser:'',
        }
      }					
    },  			
    methods: {
      async getStarList(){      //获取收藏列表
        if(this.loginState){
          const {data:res} = await this.$http.get(`/getStar`)
          if(res.success){
            this.starList = res.returnArr.star
          }
        }
      },
      async addHistoryReadNum(){    //增加浏览历史
        const {data:res} = await this.$http.get(`/addHistory?id=${this.newsId}`)
      },
      async addComment(){     //添加评论
        if(this.comment == ""){
          this.$message.error("请输入内容！");
          
        }else if(!this.loginState){
          this.$message.error("请先登录！");
        }else{
          const res = await this.$http.post(`/addComment`,{
            id:this.newsId,
            comment:this.comment
          })
          if(res.status == 200 && res.data.success){
            this.$message.success("评论成功！")
            this.getNews();     //添加完评论立刻更新
          }
        }
        this.comment = ""
      },
      async getNews(){      //查询指定文章
        const {data:res} = await this.$http.get(`/getNewsInfo?id=${this.newsId}`)
        if(res.success){
          console.log("获取新闻")
          this.news = res.returnData
          this.news.news = this.changeText(this.news.news)
          for(var i = 0;i < this.news.comment.length;i++){
            this.news.comment[i].text = this.changeText(this.news.comment[i].text)
          }
          this.commentNum = this.news.comment.length
          this.decideIsLocked()
          this.decideIsStared()
          this.decideIsGooded()
        }
      },
	    async decideIsStared(){	//判断当前文章是否被当前用户收藏
      const {data:res} = await this.$http.post('/decideStar',{
        newsId:this.newsId
      })
      if(res){
        this.isStared = res.isStared
      }
	  },
      async addStar(){    //新建收藏夹
          if(this.newStar == ""){
            this.$message.error('请输入收藏夹名称')
          }else{  
            const {data:res} = await this.$http.post('/addStar',{
              starName:this.newStar
            })
            if(res.success){
              this.starList = res.returnData.star;
              this.newStar = "";
            }
          }
      },
      async postStarNews(){     //添加收藏文章业务逻辑
       if(window.localStorage.getItem('token')){
          if(this.starValue == ""){
            this.$message.error("请选择收藏夹")
          }else{
            const {data:res} = await this.$http.post('/postStarNews',{
              newsId:this.newsId,
              star:this.starValue,
              newsName:this.news.title,
            })
            if(res.success){
              this.$message.success("收藏成功")
              this.dialogVisible = false
              this.decideIsStared()   //刷新收藏状态
            }
          }
       }else{
         this.$router.push('login')
       }
      },
      addNewsStar(){    //弹出收藏框
        this.dialogVisible = true
      },
      async deleteNewsStar(){   //取消收藏
        const {data:res} = await this.$http.post('/deleteStarNews',{
            newsId:this.newsId,
            star:this.starValue,
        })
        if(res.success){
          this.$message.success("取消收藏成功")
          this.isStared = res.isStared
          this.decideIsStared()   //刷新收藏状态
        }
      },
      async lockUser(){     //关注作者
        if(window.localStorage.getItem('token')){
          const {data:res} = await this.$http.post('/lockUser',{  //添加当前用户为作者粉丝
            avatar:this.news.nickname,
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
            avatar:this.news.nickname,

        })
        this.isLocked = res.isLocked
      },
      async cancelLockUser(){   //取关作者
        const {data:res} = await this.$http.post('/cancelLockUser',{
          avatar:this.news.nickname,
        })

        if(res.success){
          this.$message.success("取关成功！")
          this.decideIsLocked()
        }
      },
      async decideIsGooded(){   //判断文章已被登录用户赞过
        const {data:res} = await this.$http.get('/decideIsGooded',{
          params:{
            newsId:this.newsId,
          }
        })
        if(res.success){
          console.log(1)
          this.isGood = res.result
          console.log(this.isGood)
        }
      },
      async goodUser(){   //点赞文章
        if(window.localStorage.getItem('token')){
          const {data:res} = await this.$http.post(`/goodNews`,{
            newsId:this.newsId,
          })
          if(res.success){
            this.$message.success(res.returnText)
            this.goodNum = res.returnData.length
            this.isGood = !this.isGood
            this.getNewsGooder()
          }else{
            this.$message.error(this.returnText)
          }
        }else{
          this.$router.push('login')
        }
        
      },
      async cancelGoodUser(){   //取消点赞文章
        const {data:res} = await this.$http.post(`/cancelGoodNews`,{
          newsId:this.newsId,
        })
        if(res.success){
          this.$message.success(res.returnText)
          this.isGood = !this.isGood
          this.getNewsGooder()
        }else{
          this.$message.error(this.returnText)
        }
      },
      async chooseAll(){    //一键三连
        if(window.localStorage.getItem('token')){
          if(!this.isStared){   //如果未收藏
            this.dialogVisible = true
          }
          if(!this.isLocked){
            this.lockUser()
          }
          if(!this.isGood){
            this.goodUser()
          }
        }else{
          this.$message.error('请先登录')
        }
      },
      async getOtherNews(){   //获取相关推荐文章
        const {data:res} = await this.$http.get('/getAvatarNews',{
          params:{
            newsId:this.newsId
          }
        })
        if(res.success){
          this.otherNews = res.returnData
        }
      },
      readNews(index){    //从相关推荐查看文章
          var editUrl = this.$router.resolve({path:'show',query:{  //传参
              newsId:index
          }});
          window.open(editUrl.href, '_blank');
          this.newsId = this.$route.query.newsId; 
      },
      async getNewsGooder(){    //获取当前文章所有点赞用户
        const {data:res} = await this.$http.get('/getNewsGooder',{
          params:{
            newsId:this.newsId
          }
        })
        if(res.success){
          this.goodUserList = res.returnData
          this.goodNum = this.goodUserList.length
        }
      },
      toUserInfo(user){   //用户主页跳转
        var editUrl = this.$router.resolve({path:'userinfo',query:{  //传参
            avatar:user
        }});
        window.open(editUrl.href, '_blank');
      },
      reportNews(){     //举报弹框显示
        this.reportDialogVisible = true
      },
      postReport(){     //提交举报内容
        if(this.reportComment == "" || this.reportCheckList.length == 0){
          this.$message.error("请填写举报备注信息，以便于我们审核");
        }else{
          this.reportInfo = {
          newsId:this.newsId,
          newsTitle:this.news.title,
          newsAvatar:this.news.nickname,
          create_time:this.news.create_time,
          isTop:this.news.isTop,
          reportType:this.reportCheckList,
          reportComment:this.reportComment,
          reportUser:'',
        }
          this.$http.post(`/postReport`,this.reportInfo)
          .then(({data:res})=>{
            if(res){
              this.$message.success(res.returnText)
              this.reportDialogVisible = false;
            }
          })
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
    computed: {
      changeText(){     //正则表达式转换文本
        return function(text){
          return text.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
        }
      },
      lastComment(){    //判断最后一条评论，去除下划线
        return function(dataLength,index){
          if(dataLength - 1 == index){
            return "border-bottom:none"
          }
        }
      },
      formatAllHtmlTag(){     //过滤所有html标签用于展现相关文章文本
        return (str) =>{
          let reg=/<\/?.+?\/?>/g
          str = str.replace('&nbsp','')
          return str.replace(reg,'')
        }
       
      }
    },
    watch: {    //监听展示新闻界面参数变化，解决路由不改变、界面可以反复渲染的问题
      "$route.query"(newValue, oldValue) {
        this.newsId = newValue.newsId;
        this.getNews()
        this.decideIsStared()
      }
    },
    
    components: { Header,Footer,IndexRight},
  }
</script>

<style scoped>
.content{
  display: flex;
  width:1200px;
  margin:0 auto;
}
img{
  border-radius: 20px;
}
.titleBtn .report{
  font-size:13px;
  margin-right:10px;
  cursor: pointer;
}
.titleBtn .report:hover{
  color:red;
}
.title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title .newsInfo{
  display: flex;
}
.title h3{
  margin-left:10px;
}
.title i{
  font-size:25px;
  cursor: pointer;
  margin-left:10px;
  color:red;
}
.newsContent{
  text-align: left;
  margin-top:20px;
}
section{
  width:950px;
  background: #fff;
  margin-top:20px;
  padding:20px;
}
.el-card{
  position:absolute;
  right:-20px;
  bottom:40px;
  height:200px;
  padding:0;
}
.el-card li span{
  color:black;
}

h3{
  font-weight: 700;
  font-size:22px;
}
.info{
  color:#838383;
  font-size:12px;
  padding:10px 0;
  border-bottom:1px solid #cccbcb;
}
.comment .title .goodTitle{
  color:red;
  cursor: pointer;
  font-weight: bold;
  opacity: 0.6;
}
.comment{
  margin-top:170px;
}
.comment .title{
  display: flex;
  position: relative;
}
.comment .title span{
  cursor: pointer;
  font-size:13px;
    
}
.comment .title li{
  margin:5px 0;
}
.commentNum{
  background:#f6f6f6;
  display: inline-block;
  width:100%;
  height:40px;
  line-height:40px;
}

.commentList li{
  border-bottom:1px solid #cccbcb;
  list-style:none;
  font-size:14px;
}
.commentList{
  margin-top:30px;
}
.comment .commentIpt{
  width:900px;
  height:30px;
  border:1px solid #ccc;
  outline: none;
  transition:0.3s linear;
}
.comment .commentIpt:hover{
  border-color:rgb(157, 157, 245);
  height:60px;
}
.commentBtn{
  display: flex;
  margin:20px 0 0 700px;
  align-items: center;
}
.commentBtn button{
  border-radius: 15px;
  padding:5px;
}
.commentBtn span{
  margin-right:10px;
  font-size:12px;
  color:rgb(138, 138, 138);
}
.el-input{
  margin-top:50px;
  width:300px;
}
.lock{
  display: inline-block;
  width:55px;
  height:26px;
  font-size:13px;
  text-align:center;
  line-height:26px;
  color:#6cbd45;
  border:1px solid #6cbd45;
  margin-left:10px;
  cursor: pointer;
}
.cancel{
  border:1px solid red;
  color:red;
}
.good{
  border:1px solid red;
  color:red;
  font-size:13px;
  margin-left:10px;
  height:26px;
  line-height: 26px;
  padding:0 10px;
  cursor: pointer;
}
.titleBtn{
  display: flex;
  align-items: center;
}
.titleBtn span{
  border-radius: 15px;
}
.chooseAll{
  width:65px;
  height:26px;
  border-radius:15px;
  text-align:center;
  line-height:26px;
  color:#fff;
  background: red;
  font-size:13px;
  cursor: pointer;
}
.left-content{
  display: flex;
  flex-direction: column;
}
.otherNews{
  width:950px;

  background: #fff;
  margin-top:20px;
  padding:20px;

}
.otherNews ul{
  margin-top:20px;
}
.otherNews ul li{
  padding:10px 0;
  border-top:1px solid rgb(223, 221, 221);
  display: flex;
  align-items: center;
}
.otherNews ul li .news{
  width:800px;
}
.otherNews ul li .time{
  font-size:13px;
}
.otherNews ul .title{
  font-size:16px;
  width:600px;
  display: inline-block;
}
.otherNews ul .title:hover{
  cursor: pointer;
  color:red;
}
.otherNews ul .content{
  display: inline-block;
  font-size:13px;
  color:rgb(139, 139, 139);
  width:700px;
  height:19px;
  overflow:hidden;
}
</style>