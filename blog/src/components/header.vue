<template>
  <div>
    <nav class="navbar navbar-default" style="background-color: #444;">
      <div class="container">
        <div class="navbar-header">
            <el-button type="success" plain @click="toIndex">返回首页</el-button>
          <a class="navbar-brand" href="/">

          </a>
        </div>
        
        <div id="bs-example-navbar-collapse-1" style="display: flex;">
            <el-select v-model="selectVal">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
            <div class="form-group">
              <el-input type="text"  placeholder="Search" @keyup.enter.native="getSearchNews" v-model="searchText"></el-input>
            </div>
            <ul class="nav navbar-nav navbar-right" style="flex-direction: row;">
              <img width="35" height="35" :src="userInfo.avatar" alt="" @click="dialogVisible=true" v-if="loginState"> 
              <a class="writeNews" @click="toNew" v-if="loginState"><i class="el-icon-edit"></i>创作中心</a>
              <li class="dropdown" v-if="loginState">
                  
                  <span @click="showInfo">用户中心</span>
                
                <ul class="dropdown-menu" style="position:absolute;" ref = "userBox">
                  <li class="dropdown-current-user">
                    当前登录用户: <h5>{{loginUser}}</h5>
                  </li>
                  <li role="separator" class="divider"></li>
                  <div class="userCard">
                    <el-button type = "primary" size="mini" @click.prevent="toProfile">个人主页</el-button>
                    <el-button type = "primary" size="mini" @click.prevent="tofileManage">文章管理</el-button>
                    <el-button type = "primary" size="mini" @click.prevent="toStar">我的收藏</el-button>
                    <el-button type = "primary" size="mini" @click.prevent="toActive">我的关注</el-button>
                    <el-button type = "primary" size="mini" @click.prevent="toLock">我的粉丝</el-button>
                    <el-button type = "primary" size="mini" @click.prevent="toUserReport">我的举报</el-button>
                  </div>
                  <li><el-button type="danger" class="exit" @click="toExit">退出</el-button></li>
                </ul>
              </li>
              <el-button type="primary" plain @click="toLogin" v-if="!loginState">登录</el-button>
              <el-button type="success" @click="toRegister" v-if="!loginState">注册</el-button>
            </ul>
        </div>
      </div>
    </nav>
    <!--  修改头像弹出框 -->
    <el-dialog  
      title="更改头像"
      :visible.sync="dialogVisible"
      width="30%">
      <input type="file" class="file" id="file" ref="file" @change="uploadFile" value="选择图片">
        <img :src="userInfo.avatar" width="200" height="200" v-if="loginState">
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserAvatar">上 传</el-button>
      </span>
    </el-dialog>
    <!--  搜索用户结果弹出框 -->
    <el-dialog
      title="搜索结果"
      :visible.sync="searchDialogVisible"
      width="30%"
      class="searchDialog">
        <ul>
          <li v-for="item in searchUserList" :key="item._id">
            <div>
              <img :src = "item.avatar" width="50" height="50" @click="toUserInfo(item.nickname)">
              <span>{{item.nickname}}</span>
            </div>
            <el-button type="danger" v-if="!item.isLocked" @click="lockUser(item.nickname)" size="mini" round>关注</el-button>
            <el-button type="danger" v-else @click="cancelLockUser(item.nickname)" size="mini" round>取关</el-button>
          </li>
        </ul>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    
    data() {
      return {
        loginState: window.localStorage.getItem('login'),  //登录状态
        userInfo:{},    //登录用户信息
        loginUser:'',  //登录的用户
        searchText:'',    //搜索框文本
        searchNews:[],    //搜索后的新闻列表
        options:[
          {
            value:"1",
            label:"文章",
          },
          {
            value:"2",
            label:"用户"
          },
          {
            value:"3",
            label:"查找用户"
          }
        ],
        selectVal:'文章',  //搜索选项
        oldAvatar:'',     //更新前的头像
        dialogVisible:false,  //上传图片弹出框状态
        searchDialogVisible:false,  //搜索用户结果弹出框状态
        searchUserList:[],        //搜索用户结果
        isLocked:false,     //是否已被关注
      }
    },
    mounted () {
      this.getUsername()
      this.getUserInfo()
      this.oldAvatar = this.userInfo.avatar
    },
    methods: {
      async getUsername(){
        if(window.localStorage.getItem('login')){
          const {data:res} = await this.$http.get(`/getUserInfo`);
          this.loginUser = res.returnData.nickname;
        }
      },
      async getUserInfo(){
        const {data:res} = await this.$http.get(`/getUserInfo`)
        if(res.success){
          this.userInfo = res.returnData
        }
      },  
      toIndex(){
          this.$router.push('index')
      },
      toLogin() {
          this.$router.push('login')
      },
      toRegister(){
          this.$router.push('register')
      },
      toExit(){
          this.$http.get('/logout').then(data=>{
            if(data.data.status == 200){
              this.$message.success('注销成功')
              this.$router.push('index')
              this.loginState = false;
              window.localStorage.removeItem('login')
              window.localStorage.removeItem('token')
              window.localStorage.removeItem('isAdmin')
            }
          });
      },
      toNew(){
        this.$router.push('new')
      },
      toProfile(){
        this.$router.push('profile')
      },
      tofileManage(){
        this.$router.push('filemanage')
      },
      toStar(){
        this.$router.push('star')
      },
      toActive(){
        this.$router.push('active')
      },
      toLock(){
        this.$router.push('lock')
      },
      toUserReport(){
        this.$router.push('userreport')
      },
      showInfo(){
        // this.infoState = !this.infoState
        console.log(this.$refs.userBox.style.opacity)
        if(this.$refs.userBox.style.opacity == "1"){
          console.log(1)
          this.$refs.userBox.style.opacity = "0"
          this.$refs.userBox.style.width = "0px"
          this.$refs.userBox.style.height = "0px"
        }else{
          this.$refs.userBox.style.opacity = "1"
          this.$refs.userBox.style.width = "250px"
          this.$refs.userBox.style.height = "270px"
        }
        
      },
      async getSearchNews(){   //搜索业务
        if(this.searchText == ""){
          this.$message.error('请输入内容！')
        }else if(this.selectVal == "1" || this.selectVal == "2"){
          const {data:res} = await this.$http.get('/showNews');
          if(res.success){
            if(this.selectVal == "1" || this.selectVal == "文章"){      //根据文章名筛选文章
              this.searchNews = res.returnData.filter((item)=>{
                return item.title.includes(this.searchText)
              })
            }else if(this.selectVal == "2"){    //根据用户名筛选文章
              this.searchNews = res.returnData.filter((item)=>{
                return item.nickname.includes(this.searchText)
              })
            }
            this.$emit('sendSearchNews',this.searchNews)
          }
        }else if(this.selectVal == "3"){      //搜索用户
              const {data:res} = await this.$http.get('/getAllUserInfo')
              if(res.success){
                var filterRes = res.returnData.filter(item=>{   //筛选出符合的用户
                  return item.nickname.includes(this.searchText)
                })
                var index = filterRes.findIndex(item=>{   //删除搜索结果中的自己
                  return item.nickname == this.loginUser
                })
                if(index !== -1){    
                  filterRes.splice(index,1)
                }
                this.searchUserList = filterRes
                this.decideIsLocked()     //刷新关注状态
                this.searchDialogVisible = true;
              }
          }
      },
      uploadFile(){   //选择图片修改
        var file = this.$refs.file.files[0];
        this.userInfo.avatar = URL.createObjectURL(file)
      },
      async saveUserAvatar(){
        var formdata = new FormData()
        formdata.append('avatar',this.$refs.file.files[0])
        this.userInfo.avatar = formdata
        //修改头像
        let config = {
          headers:{'Content-Type':'multipart/form-data'}
        }   //dataform请求头
        const {data:res} = await this.$http.post(`/changeUserAvatar`,this.userInfo.avatar,config)
        if(res.success){
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.getUserInfo()
          this.$router.push('/')
        }
      },
      toUserInfo(user){   //用户主页跳转
        var editUrl = this.$router.resolve({path:'userinfo',query:{  //传参
            avatar:user
        }});
        window.open(editUrl.href, '_blank');
      },
      async decideIsLocked(){ //判断当前作者是否被当前用户关注
          var postAvatar = [];
          this.searchUserList.forEach(item=>{
            postAvatar.push(item.nickname)
          })
          const {data:res} = await this.$http.post('/decideIsLocked',{
              avatar:postAvatar,
          })
          if(res.success){
            this.searchUserList.forEach((item,index)=>{
              this.$set(item, 'isLocked', res.isLocked[index])
            })
            // for(var i = 0;i < this.searchUserList.length;i++){
            //   this.$set(this.searchUserList[i], 'isLocked', res.isLocked[i])
            // }
          }
      },
      async lockUser(nickname){     //关注作者
          if(window.localStorage.getItem('token')){
          const {data:res} = await this.$http.post('/lockUser',{  //添加当前用户为作者粉丝
              avatar:nickname,
          })
          if(res.success){
              this.$message.success("关注成功！")
              this.decideIsLocked()
          }
          }else{
          this.$router.push('login')
          }
          
      },
      async cancelLockUser(nickname){   //取关作者
          const {data:res} = await this.$http.post('/cancelLockUser',{
              avatar:nickname,
          })

          if(res.success){
              this.$message.success("取关成功！")
              this.decideIsLocked()
          }
      },
    },
  }
</script>

<style scoped>
.dropdown-toggle img{
  margin-top:5px;
}
.dropdown-menu{
  width:0px;
  height:0px;
  display: flex;
  flex-direction: column;
  position: absolute;
  right:-80px;
  opacity: 0;
  border-radius: 15px;
  transition:.2s linear;
}
.dropdown-menu .userCard{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.dropdown-menu .userCard .el-button{
  width:30%;
  margin:5px 10px;
}
.btn{
  margin-left:10px;
}
.el-select{
  width:105px;
}
.dropdown-menu li{
  text-align: center;
}
.dropdown-menu li a{
  font-size:14px;
  color:black;
  cursor: pointer;
}
.writeNews{
  color:#fff;
  text-decoration: none;
  line-height: 40px;
  margin:0 10px;
  padding:0 10px;
  background: rgb(252, 75, 75);
  border-radius: 5px;
  cursor: pointer;
  font-size:13px;
}
.dropdown span{
  color:#fff;
  display: inline-block;
  line-height:40px;
  height:40px;
  cursor: pointer;
  font-size:13px;
}
.form-group{
  margin-right:100px;
}
.form-group .el-input{
  width:300px;
}
img{
  border-radius: 20px;
  cursor: pointer;
}
.searchDialog li{
  margin:10px 0;
  display: flex;
  justify-content: space-between;
}

.searchDialog li span{
  margin-left:20px;
}

</style>