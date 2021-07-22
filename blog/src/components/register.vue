<template>
  <div>
    <Header></Header>
    <div class="main">
        <div class="header">
          <h1>用户注册</h1>
        </div>
        <el-form :model="registerForm" :rules="ruleRegisterForm" ref="ruleRegisterForm">
          <el-form-item prop="email">
            <el-input type="text" placeholder="请输入邮箱"  v-model="registerForm.email"></el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input type="text" placeholder="请输入用户名"  v-model="registerForm.nickname"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码"  v-model="registerForm.password"></el-input>
          </el-form-item>
        </el-form>
          <el-button type="primary" @click.prevent="toRegister">注册</el-button>
        <div class="message">
          <p>已有账号? <a href="/login#/login">点击登录</a>.</p>
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
        registerForm:{  //注册表单
          email: '',
          nickname:'',
          password:''
        },
        ruleRegisterForm:{
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: "email",message: '请输入正确的邮箱地址', trigger: ['blur']}
          ],
          nickname:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, message: '密码长度需大于 5 位', trigger: 'blur' }
          ],
        }   //注册校验表单
        
      }
    },
    
    methods: {
      async toRegister() {
        this.$refs.ruleRegisterForm.validate(async(valid) => {
          if (valid) {    //如果校验通过
            const {data:res} = await this.$http.post("/register",{
              email:this.registerForm.email,
              nickname:this.registerForm.nickname,
              password:this.registerForm.password
            });
            if(res.err_code == 0){
              this.$message.success("注册成功")
              this.$router.push('login')
            }else if(res.err_code == 1){
              this.$message.error("邮箱已存在")
            }else if(res.err_code == 2){
              this.$message.error("用户名已存在")
            }else{
              this.$message.error("注册失败")
            }
          }else{
            this.$message.error("请输入注册信息")
            return false
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