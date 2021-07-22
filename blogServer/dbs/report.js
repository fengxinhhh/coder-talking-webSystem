const mongoose = require('mongoose');   //数据库配置
mongoose.connect('mongodb://localhost/report',{useNewUrlParser: true ,useUnifiedTopology: true}).catch((error) => {
    throw error
  });    //连接数据库
  var newsSchema = new mongoose.Schema({
        reportUser:{
            type:String,
            require:true,
        },
        newsId:{
            type:String,
            default:'',
        },
        newsTitle:{
            type:String,
            default:'',
        },
        newsAvatar:{
            type:String,
            default:'',
        },
        create_time:{
            type:Date,
            default:''
        },
        isTop:{
            type:Boolean,
            default:false,
        },
        reportType:{
            type:Array,
            default:[]
        },
        reportComment:{
            type:String,
            default:''
        },
        result:{
            type:Boolean,
            default:false,
        }
  })

var report1 = mongoose.model('report',newsSchema)
module.exports = {
    report1
}