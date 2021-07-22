<template>
    <div>
        <el-card>
            <h2>添加管理员</h2>
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
            <el-button type="primary" @click="toRegister">添 加</el-button>
        </el-card>
    </div>
</template>

<script>
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
            toRegister(){       //注册管理员
                this.$refs.ruleRegisterForm.validate(async(valid) => {
                    if (valid) {    //如果校验通过
                        const {data:res} = await this.$http.post("/addAdmin",{
                            email:this.registerForm.email,
                            nickname:this.registerForm.nickname,
                            password:this.registerForm.password,
                            isAdmin:true
                        });
                        if(res.err_code == 0){
                            this.$message.success("添加成功")
                            this.$refs.ruleRegisterForm.resetFields()
                            this.addDialogVisible = false
                        }else if(res.err_code == 1){
                            this.$message.error("邮箱已存在")
                        }else if(res.err_code == 2){
                            this.$message.error("用户名已存在")
                        }else if(res.err_code == 3){
                            this.$message.error("添加失败")
                        }
                    }else{
                        this.$message.error("请输入注册信息")
                        return false
                    }
                })
            }
        },
    }
</script>

<style lang="less" scoped>

</style>