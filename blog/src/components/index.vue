<template>
  <div>
    
    <Header v-on:sendSearchNews="sendSearchNews"></Header>

    <div class="content">
      <div class="left-box">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">全部</el-menu-item>
          <el-menu-item index="2">精华</el-menu-item>
          <el-menu-item index="3">分享</el-menu-item>
          <el-menu-item index="4">回答</el-menu-item>
          <el-menu-item index="5">招聘</el-menu-item>
          <el-menu-item index="6">客户端测试</el-menu-item>
          <el-menu-item index="7">前端</el-menu-item>
        </el-menu>
        
        <!-- 全部菜单 -->
        <ul class="media-list">
          <li v-for="(item) in newsList" :key="item.id">
            <div class="media-left">
              <a href="#">
                <el-tooltip class="item" effect="dark" :content="item.nickname" placement="top-start" :open-delay="500">
                  <img v-lazy="item.avatar" width="40" height="50" class="media-object" @click="toUserInfo(item)">
                </el-tooltip>
              </a>
            </div>
            <div class="media-body">
              <div class="newsTag">
                <el-tag type="warning" v-if="item.isTop">置顶</el-tag>
                <el-tag :type="item.option=='精华'?'success':'danger'">{{item.option}}</el-tag>
                <h4 class="media-heading"><span class="filePost"  style="margin-left:30px;" @click="readNews(item._id)">{{item.title}}</span><span class="fileIndex" style="display: none;"></span></h4>
              </div>
              
              <p>{{item.good.length}} 人点赞 • {{item.comment.length}} 个评论 • {{item.readNum}} 次浏览 </p>
            </div>
            <div class="createTime">
              <span>{{item.create_time | timeFillter}}</span>
            </div>
          </li>
        </ul>
        
        <!-- 精华菜单 -->
        
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[8, 12, 18, 24]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNews">
      </el-pagination>
      </div>
      
      <IndexRight></IndexRight>
    </div>
    
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './header'
import Footer from './footer'
import IndexRight from './indexRight'
// const myajax = require('ajax-after-promise')
import myajax from 'ajax-after-promise'
  export default {
    mounted () {
      this.getData()
      this.getNewsNum()       //获取总新闻数量
      this.getNewsList();       //获取当前页码的数据列表
    },
    
    data() {
      return {
        data1:[1,2,3,4],
        query:{   //页码参数
          pageSize:8,
          pageNum:1
        },
        totalNews:0,
        newsList: [],   //当前文章列表
        activeIndex:"1",  //选中的选项卡下标
        isLoading: false  //是否在加载数据
      }
    },
    methods: {
      toLogin(){    //登录跳转
        this.$router.push('login');
      },
      toRegister(){    //注册跳转
        this.$router.push('register');
      },
      toUserInfo(user){   //用户主页跳转
        var editUrl = this.$router.resolve({path:'userinfo',query:{  //传参
            avatar:user.nickname
        }});
        window.open(editUrl.href, '_blank');
      },

      async getNewsNum(){   //获取所有文章数量
        const {data:res} = await this.$http.get('/getNewsNum');
        if(res.success){
          this.totalNews = res.returnData
        }
      },
      async getNewsList() {     //获取所有文章
        // const {data:res} = await this.$http.get('/showNews',
        // {
        //   params:this.query
        // });
        myajax.afterAsyncAjax('get','/showNews',{
          params:this.query
        },data=>{
          this.newsList = data.returnData;
        })
        
      },
      async getMenuNews(menuIndex){    //获取菜单的筛选文章
        switch(menuIndex){
          case "2":var res = await this.$http.get(`/showMenu2News`,{
                    params:this.query
                  });
                  break;
          case "3":var res = await this.$http.get(`/showMenu3News`,{
                    params:this.query
                  });
                  break;
          case "4":var res = await this.$http.get(`/showMenu4News`,{
                    params:this.query
                  });
                  break;
          case "5":var res = await this.$http.get(`/showMenu5News`,{
                    params:this.query
                  });
                  break;
          case "6":var res = await this.$http.get(`/showMenu6News`,{
                    params:this.query
                  });
                  break;
          case "7":var res = await this.$http.get(`/showMenu7News`,{
                    params:this.query
                  });
                  break;
        }
        if(res.data.success){
            this.newsList = res.data.returnData
          }
      },
      readNews(index){    //查看新闻
        var editUrl = this.$router.resolve({path:'show',query:{  //传参
            newsId:index
        }});
        window.open(editUrl.href, '_blank');
        this.newsId = this.$route.query.newsId;
      },
      handleSizeChange(val) {     //切换每页条数后更新
        this.query.pageSize = val;
        if(this.activeIndex == "1"){
          this.getNewsList()
        }else{
          this.getMenuNews(this.activeIndex)
        }
      },
      handleCurrentChange(val) {    //切换当前页码后更新
        this.query.pageNum = val;
        if(this.activeIndex == "1"){
          this.getNewsList()
        }else{
          this.getMenuNews(this.activeIndex)
        }
        
      },
      async handleSelect(key) {    //选项卡切换重置显示新闻数据
        this.activeIndex = key
        switch(this.activeIndex){   //通过选项卡index判断请求体
          case "1":this.getNewsNum();
                this.getNewsList();
                break;
          default:this.getMenuNews(this.activeIndex);
                break;
        }
      },
      sendSearchNews(data){     //接受子组件传来的搜索结果
        this.newsList = data;
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
    
    components:{Header,Footer,IndexRight}
  }
</script>

<style lang="less" scoped>
.el-menu-demo{
  width:950px;
  border-radius: 5px;
}
.content{
  display: flex;
  width:1200px;
  height:850px;
  margin:20px auto 0;
}
.left-box{
  background: #fff;
  width:950px;
  border-radius: 5px;
}
.right-box{
  margin-left:20px;
  width:250px;
  border-radius: 5px;
}
.media-list{
  height:700px;
  overflow:auto;
}
img{
  border-radius:40px;
}
.media-list::-webkit-scrollbar{
  width:0;
  height:0;
}
.newsTag{
  display: flex;
  align-items: center;
}
.media-heading{
  margin-top:15px;
}
.media-list li{
  display: flex;
  height:75px;
  padding:20px 0;
  border-bottom:1px solid #ccc;
  align-items: center;
}
.media-list li:hover{
  background: #ccc;
}
.media-list li .media-heading{
  font-size:16px;
}
.media-list li .filePost{
  font-size:18px;
  font-size:16px;
  margin-left:0;
}
.media-list li .filePost:hover{
  cursor: pointer;
  text-decoration: underline;
}
.media-list li .media-body{
  font-size:14px;
  width:700px;
  margin-left:10px;
}
.createTime{
  font-size:12px;
}








</style>