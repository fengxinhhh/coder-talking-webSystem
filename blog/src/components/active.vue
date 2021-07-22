<template>
    <div>
        <Header></Header>
        <h1>我的关注</h1>
        <div class="content">
           <p v-for="(item,index) in activeList" :key="index"  @click = "toUserInfo(item)">
               {{item}}
           </p>
            
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
            this.getAllActive();
        },
        data() {
            return {
                activeList: [],   //所有关注

            }
        },
        methods: {
            async getAllActive() {
                const {data:res} = await this.$http.get(`/getAllActive`)
                if(res.success){
                    this.activeList = res.returnData
                }
            },
            toUserInfo(user){   //用户主页跳转
                var editUrl = this.$router.resolve({path:'userinfo',query:{  //传参
                    avatar:user
                }});
                window.open(editUrl.href, '_blank');
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
        
       
        components:{
            Header,
            Footer
        }
    }
</script>

<style scoped>
.content{
    height:700px;
    overflow:auto;
}
.content p{
    background: #fff;
    height:80px;
    line-height:80px;
    cursor: pointer;
    font-size:18px;
}
.content p:hover{
    color:red;
}
</style>