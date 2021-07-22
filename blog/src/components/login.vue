<template>
  <div>
    <Header></Header>
    <div class="main">
        <div class="header">
          <h1>用户登录</h1>
        </div>
        <el-form :model="loginForm" :rules="ruleLoginForm" ref="ruleLoginForm">
          <el-form-item prop="email">
            <el-input type="email" placeholder="请输入邮箱"  v-model="loginForm.email"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码"  v-model="loginForm.password"></el-input>
          </el-form-item>
        </el-form>
          <el-button type="primary" @click.prevent="toLogin">登录</el-button>
        <div class="message">
          <p>没有账号? <a href="/register#/register">点击创建</a>.</p>
        </div>
    </div>
    <Footer></Footer>
  </div>
  
</template>

<script>
import Header from './header'
import Footer from './Footer'
  export default {
    data() {
      return {
        loginForm:{
          email: '',
          password:''
        },
        ruleLoginForm:{
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: "email",message: '请输入正确的邮箱地址', trigger: ['blur']}
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, message: '密码长度需大于 5 位', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      async toLogin() {
        this.$refs.ruleLoginForm.validate(async(valid) => {
          if (valid) {    //如果校验通过
            const {data:res} = await this.$http.post('/login',{
              email:this.loginForm.email,
              password:this.loginForm.password
            })
            if(res.success == true && res.token){     //登录成功
              this.$message.success('登陆成功');
              window.localStorage.setItem('token',res.token)
              window.localStorage.setItem('login',true);
              window.localStorage.setItem('isAdmin',res.isAdmin)
              if(window.localStorage.getItem('isAdmin')){
                this.$router.push('/admin');
              }else{
                this.$router.push('/');
              }
              
            }else if(res.success == true && !res.token){
              this.$message.error(res.returnData)
            }else if(res.success == false){
              this.$message.error('邮箱或密码错误！');
            }
          }else{
            this.$message.error("请输入信息！")
            return false;
          }
        })
      }
    },
  components: { Header,Footer },
    
  }
</script>

<style scoped>
.main{
  height:700px;
  width:900px;
  margin:0 auto;
  background: #fff;
  padding:0 200px;
}
.main .header{
  padding-top:70px;
}

.el-button{
  margin-left:20px;
}
.main .message{
  margin-left:10px;
  width:300px;
  border:none;
}
</style>