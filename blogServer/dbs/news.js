
    const mongoose = require('mongoose');   //数据库配置
    mongoose.connect('mongodb://localhost/news',{useNewUrlParser: true ,useUnifiedTopology: true}).catch((error) => {
        throw error
      });    //连接数据库
      var newsSchema = new mongoose.Schema({
        nickname:{
            type:String,
            require:true,
        },
        avatar:{
            type:String,
            default:'http://192.168.1.157:4000/public/img/avatar-default.png'
        },
        option:{
            type:String,
            default:'分享',
        },
        title:{
            type:String,
            default:'',
        },
        news:{
            type:String,
            default:'',
        },
        create_time:{
            type:Date,
            default: Date.now
        },
        returnNum:{
            type:Number,
            default:0,
        },
        lockNum:{
            type:Number,
            default:0
        },
        readNum:{
            type:Number,
            default:0
        },
        comment:{
            type:Array,
            default:[]
        },
        good:{
            type:Array,
            default:[],
        },
        isTop:{
            type:Boolean,
            default:false
        }
    })
      var news1 = mongoose.model('news',newsSchema); 
        module.exports = {
            news1
        }

