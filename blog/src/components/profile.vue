<template>
  <div>
    <Header></Header>
    <section class="container">
      <div class="col-md-5">
          <div class="form-group">
            <label for="exampleInputEmail1">账号</label>
            <p class="form-control-static">{{nowUserInfo.email}}</p>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">昵称</label>
            <input type="text" class="form-control nickname" id="exampleInputPassword1" v-model="nowUserInfo.nickname">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">介绍</label>
            <textarea class="form-control bio" rows="3" v-model="nowUserInfo.bio"></textarea>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">性别</label>
            <input type="text" class="form-control gender" id="exampleInputPassword1"  v-model="nowUserInfo.gender">
          </div>
          <button class="btn btn-success" @click="saveUserInfo">保存</button>
      </div>
        
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './header'
  import Footer from './footer'
  export default {
    mounted () {
      this.getNowUserInfo();
    },
    data() {
      return {
        beforeNickname:'',    //修改前的昵称
        nowUserInfo:{}, //当前用户信息
        picUrl:{},
      }
    },
    methods: {
      async getNowUserInfo() {    //初始化表单用户信息
        const {data:res} = await this.$http.get(`/getUserInfo`);
        this.nowUserInfo = res.returnData;
        this.beforeNickname = res.returnData.nickname;
      },
      async saveUserInfo(){     //修改用户信息
      console.log(this.nowUserInfo)
        const {data:res} = await this.$http.post(`/changeUserInfo`,{params:this.nowUserInfo})
        if(res.success){
          this.$message.success(res.returnText)
          this.$router.push('/')
        }
 
        //读取并修改文章数据库中所有的昵称
        var allNews;
        const {data:resNews} = await this.$http.get('/showAllNews');

        if(resNews.success){
          allNews = resNews.newsList;
        }
        for(var i = 0;i < allNews.length;i++){
          if(allNews[i].nickname == this.beforeNickname){   //如果这篇文章的作者昵称被修改
            allNews[i].nickname = this.nowUserInfo.nickname;    //重新赋值
          }
          for(var j = 0;j < allNews[i].comment.length;j++){     //对每篇文章中的评论进行遍历
            if(allNews[i].comment[j].nickname == this.beforeNickname){
              allNews[i].comment[j].nickname = this.nowUserInfo.nickname;
            }
          }
        }
        // //更新文章数据库
        this.$http.post('/updateAllNews',{
          updateNews:allNews
        });
      },
      
      
    },
  components: { Header,Footer },
    
  }
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>