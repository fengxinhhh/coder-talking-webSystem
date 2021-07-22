<template>
  <div>
    <Header></Header>
    <section class="container">

      <el-row>
        <el-form :model="newsForm" :rules="ruleNewsForm" ref="ruleNewsForm">
          <div class="submitBox">
            <el-form-item prop="option">
              <el-select v-model="newsForm.option" placeholder="请选择文章板块">
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
              <el-button type="danger" @click="addNews" v-if="addOrSave">上传文章</el-button>
              <el-button type="primary" @click="saveNews" v-else>保存更改</el-button>
          </div>
          <el-form-item prop="title">
            <el-input type="text" placeholder="请输入文章标题" maxlength="20" v-model="newsForm.title" show-word-limit></el-input>
          </el-form-item>
          <!-- <el-form-item prop="news">
            <el-input type="textarea" placeholder="请输入文章内容" maxlength="1000"  v-model="newsForm.news"  show-word-limit ></el-input>
          </el-form-item> -->
          <el-form-item prop="news">
          <quill-editor 
            class = "richText"
            v-model="newsForm.news" 
            :options="editorOption"
            ref="myQuillEditor" 
            @change="onEditorChange($event)"/>
          </el-form-item>
          

        </el-form>
          
      </el-row>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from './header'
  import Footer from './footer'
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    mounted () {
      if(this.$route.query.data){   //修改文章
        this.addOrSave = false;
        this.newsForm = this.$route.query.data
      }else{            //新增文章
        this.addOrSave = true
      }
      
    },
    data() {
      return {
        options:["精华","分享","回答","招聘","客户端测试","前端"],
        newsForm:{
          newsId:'',
          nickname:'',
          option:'',
          title: '',
          news:''
        },    //表单内容
        ruleNewsForm:{
          option:[
            { required: true, message: '请选择文章板块', trigger: 'change' },
          ],
          title:[
            { required: true, message: '请选择文章标题', trigger: 'blur' },
            { min: 5, message: '文章标题需大于 5 个字', trigger: 'blur' }
          ],
          news:[
            { required: true, message: '请选择文章内容', trigger: 'blur' },
            { min: 5, message: '文章内容需大于 5 个字', trigger: 'blur' }
          ],
        },     //表单校验内容
        addOrSave:true,   //编辑还是发布文章
        richContent:'',   //富文本编辑内容
        editorOption:{    //富文本配置选项
          modules:{
            toolbar:[
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
              ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
              [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
              [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
              [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
              [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
              [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
              [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
              [{ font: [] }], // 字体种类-----[{ font: [] }]
              [{ align: [] }], // 对齐方式-----[{ align: [] }]
              ["clean"], // 清除文本格式-----['clean']
              ["image", "video"] // 链接、图片、视频-----['link', 'image', 'video']
            ],
          },
          theme: "snow",
          placeholder: "请输入文章内容"
        }
        
      }
    },
    methods: {
      addNews() {     //新增文章
        this.$refs.ruleNewsForm.validate(async(valid) => {
          if (valid) {    //如果校验通过
            const {data:res} = await this.$http.post(`/new`,{
              nickname:this.newsForm.nickname,
              option:this.newsForm.option,
              title:this.newsForm.title,
              news:this.newsForm.news
            });
            console.log(this.newsForm)
            if(res.success){
              this.$message.success("发布成功！");
              this.$router.push('/')
            }
          } else {
            return false;
          }
        });
       
      },
      async saveNews(){     //修改文章
        if(this.title == ""){
          this.$message.error("请输入文章标题！")
        }else if(this.newsText == ""){
          this.$message.error("请输入文章内容！")
        }else{
          console.log(this.newsForm)
          const {data:res} = await this.$http.post(`/updateNews`,{
            newsId:this.newsForm._id,
            nickname:this.newsForm.nickname,
            option:this.newsForm.option,
            title:this.newsForm.title,
            news:this.newsForm.news
          });
          if(res.success){
            this.$message.success(res.returnText)
            this.$router.push('/fileManage')
          }
        }
      },
      onEditorChange(e){
        console.log(e)
      }
    },
  components: { Header,Footer,quillEditor },
    
  }
</script>

<style scoped>
.el-row{
  margin:0 50px;
}
.container{
  background: #fff;
  padding-top:30px;
  height:730px;
}
.el-input{
  width:500px;
}
.el-button{
  width:100px;
  height:50px;
  margin-left:100px;
}
.el-textarea{
  margin-top:30px;
  width:500px;
}
.submitBox{
  display: flex;
  justify-content: space-between;
}
.richText{
  height:400px;
}


</style>