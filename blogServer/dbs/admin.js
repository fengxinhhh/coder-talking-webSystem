const mongoose = require('mongoose');   //数据库配置
mongoose.connect('mongodb://localhost/userinfo',{useNewUrlParser: true ,useUnifiedTopology: true});    //连接数据库
const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
    },
    nickname:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    created_time:{
        type:Date,
        default:Date.now
    },
    last_modified_time:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type:String,
        default:'http://127.0.0.1:4000/public/img/avatar-default.png'
    },
    bio:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        enum:['男','女'],
        default:'男'
    },
    birthday:{
        type:Date
    },
    status:{
        type:Number,
        enum:[0,1,2],
        default:0
    },
    star:{          //所有的收藏
        type:Array,
        default:[],
    },
    lockNum:{       //所有粉丝
        type:Array,
        default:[]
    },
    activedNum:{      //所有关注
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:true
    },
    role:{
        type:Array,
        default:['/admin/user','/admin/delete','/admin/istop','/admin/delnews','/admin/report','/admin/addadmin','/admin/deladmin','/admin/rolelist','/admin/rolepost']
    }
})
var admininfo = mongoose.model('Admininfo',adminSchema);

module.exports = {
    admininfo
}