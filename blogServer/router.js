const express = require('express');
const path = require('path')
const router = express.Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
var multer  = require('multer')
const md5 = require("blueimp-md5");
const { Console } = require('console');
const sessionApi = require(path.join(__dirname,'/api/session'))
const newsApi = require(path.join(__dirname,'/api/news'))
const adminApi = require(path.join(__dirname,'/api/admin'))
var userInfo = {};
var newsInfo = [];
var nowNewsInfo = [];
var showNews = {};
var comments = [];



	
//token中间件
function getToken(req,res,next){
	var token= req.headers.authorization || req.query.token;
	if(token){
		jwt.verify(token,"Fizz",(err,decode)=>{
			if(err){
				res.send({
					code:1404//登录失效的值
				})
			}else{
				req.userId=decode.userId;
				next()
			}
		})
	}else{
		res.json({
			code:404
		})
	}
}
//注册业务实现
router.post('/register',(req,res)=>{
    sessionApi.register(req.body,data=>{
        if(data == "用户已存在！"){
            return res.status(200).json({
                err_code:2,
                text:"用户已存在",
                status:'error'
            })
        }else if(data == "邮箱已存在！"){
            return res.status(200).json({
                err_code:1,
                text:"邮箱已存在",
                status:'error'
            })
        }else if(data == "服务器错误"){
            return res.status(200).json({
                err_code:500,
                text:"注册失败",
                status:'error'
            })
        }else{
            return res.status(200).json({
                err_code:0,
                text:"注册成功",
                status:'success'
            })
        }
    })
})

//登录业务实现
router.post('/login',(req,res)=>{
    sessionApi.login(req.body,(data)=>{
        if(data && data.status == 0){
            req.session.user = data;
            var token = jwt.sign({id: req.session.user._id}, 'Fizz', {expiresIn: "1h"})
            res.status(200).json({
                success:true,
                token:token,
                isAdmin:data.isAdmin,
                returnData:data
            })
            
        }else if(data && data.status == 1){
            res.status(200).json({
                success:true,
                token:null,
                returnData:"您的账户已被冻结，暂时无法登录，请联系管理员"
            })
        }else{
            res.status(200).json({
                success:false
            })
        }
    })
})
//退出业务实现
router.get('/logout',(req,res)=>{
    req.session.user = "";
    return res.json({
        status:200,
        text:'注销成功'
    })
})
//获取所有用户列表
router.get(`/getAllUserInfo`,(req,res)=>{
    sessionApi.getAllUserInfo(data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//获取指定用户所有信息（头像、名称）
router.get('/getUserInfo',(req,res)=>{
    sessionApi.getUserInfo(req.session.user._id,data=>{
        userInfo = data
        res.status(200).json({
            success:true,
            returnData:userInfo
        })
    })
})
//根据用户名获取所有信息
router.get('/getUserInfoByNickname',(req,res)=>{
    sessionApi.getUserInfoByNickname(req.query.nickname,data=>{
        res.status(200).json({
            success:true,
            returnData:data
        })
    })
})
//保存个人信息业务实现
//先处理dataform格式，上传图片至服务器
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/img')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    }
})
var upload = multer({
    storage:storage,
    limits:{fileSize:1024*1024*10},
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else{
            cb(null,false)
        }
    }
}).single('avatar')
//修改头像
router.post('/changeUserAvatar',(req,res)=>{
    var imgSrc = "http://127.0.0.1:4000/"   //头像根路径url
    var userId = req.session.user._id
    var nickname = req.session.user.nickname
    upload(req,res,function(err){
        var fileName = req.session.user.avatar.split("img\\")[1];
        fs.readdir(path.join(__dirname,'/public/img'),(err,result)=>{       //删除老头像
            if(!err){
                result.forEach(item=>{
                    if(item == fileName){
                        fs.unlinkSync(path.join(__dirname,'/public/img/'+fileName),(err,result)=>{
                            console.log(result)
                        })
                    }
                })
            }
        })
        imgSrc += req.file.path;    //新头像名称处理
        imgSrc.replace('\\','/');
         //开始上传到数据库
        sessionApi.onloadPic(imgSrc,userId,data=>{
            if(data){
                req.session.user.avatar = imgSrc
                res.status(200).json({
                    success:true,
                })
            }
        })
        newsApi.onloadPic(imgSrc,nickname,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                })
            }
        })
    })
})
//修改个人信息
router.post('/changeUserInfo',(req,res)=>{
    sessionApi.loadUserInfo(req.body.params,data=>{
        if(data){
            req.session.user = data;
            res.status(200).json({
                success:true,
                returnText:'修改成功'
            })
        }
    })
})
//发布评论业务实现
router.get('/new',(req,res)=>{
    sessionApi.getUserInfo(req.session.user,data=>{
        userInfo = data
        res.render('new.html',{
            userInfo:userInfo,
            user:req.session.user
        });
    })
})
//添加文章
router.post('/new',(req,res)=>{
    req.body.nickname = req.session.user.nickname
    req.body.avatar = req.session.user.avatar
    newsApi.addNews(req.body,data=>{
        if(data == "success"){
            res.status(200).json({
                success:true
            })
        }else{
            res.status(500).json({
                success:false
            })
        }
    })
})
//修改文章
router.post('/updateNews',(req,res)=>{
    newsApi.updateNews(req.body,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:"修改成功"
            })
        }
    })
})
//删除文章
router.post('/delNewsById',(req,res)=>{
    newsApi.delNewsById(req.body.newsId,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:"删除成功"
            })
        }
    })
})
//根据登录的用户名获取所有文章
router.get('/getAllNewsByLoginuser',(req,res)=>{
    newsApi.getAllNewsByLoginuser(req.session.user.nickname,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//根据作者的用户名获取所有文章
router.get('/getAllNewsByNickname',(req,res)=>{
    newsApi.getAllNewsByNickname(req.query.nickname,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//更新所有文章
router.post('/updateAllNews',(req,res)=>{
    newsApi.updateAllNews(req.body.updateNews,data=>{
        console.log(data)
    })
})
//根据页码显示文章
router.get('/showNews',(req,res)=>{
    if(req.query.pageSize && req.query.pageNum){    //如果传参是页码
        newsApi.getNewsByPageNum(req.query.pageSize,req.query.pageNum,null,data=>{
            res.status(200).json({
                success:true,
                returnData:data
            })
        })
    }else if(req.query.nickname){       //如果传参是作者名
        newsApi.getNewsByPageNum(null,null,req.query.nickname,data=>{
            res.status(200).json({
                success:true,
                returnData:data
            })
        })
    }else{      //无传参，返回所有文章
        newsApi.getNewsByPageNum(null,null,null,data=>{
            res.status(200).json({
                success:true,
                returnData:data
            })
        })
    }
})
//获取所有文章总数量
router.get('/getNewsNum',(req,res)=>{
    newsApi.getNewsNum(data=>{    //返回全部文章
        res.status(200).json({
            success:true,
            returnData:data
        })
    })
})
//获取所有精华文章
router.get('/showMenu2News',(req,res)=>{
    if(req.query.nickname){     //如果有用户判断条件
        newsApi.getMenuNews("精华",req.query.nickname,null,null,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }else if(req.query.pageSize && req.query.pageNum){
        newsApi.getMenuNews("精华",null,req.query.pageSize,req.query.pageNum,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }
})
//获取所有分享文章
router.get('/showMenu3News',(req,res)=>{
    if(req.query.nickname){     //如果有用户判断条件
        newsApi.getMenuNews("分享",req.query.nickname,null,null,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }else{
        newsApi.getMenuNews("分享",null,req.query.pageSize,req.query.pageNum,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }
})
//获取所有回答文章
router.get('/showMenu4News',(req,res)=>{
    if(req.query.nickname){     //如果有用户判断条件
        newsApi.getMenuNews("回答",req.query.nickname,null,null,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }else{
        newsApi.getMenuNews("回答",null,req.query.pageSize,req.query.pageNum,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }
})
//获取所有招聘文章
router.get('/showMenu5News',(req,res)=>{
    if(req.query.nickname){     //如果有用户判断条件
        newsApi.getMenuNews("招聘",req.query.nickname,null,null,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }else{
        newsApi.getMenuNews("招聘",null,req.query.pageSize,req.query.pageNum,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }
})
//获取所有客户端测试文章
router.get('/showMenu6News',(req,res)=>{
    if(req.query.nickname){     //如果有用户判断条件
        newsApi.getMenuNews("客户端测试",req.query.nickname,null,null,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }else{
        newsApi.getMenuNews("客户端测试",null,req.query.pageSize,req.query.pageNum,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }
})
//获取所有前端文章
router.get('/showMenu7News',(req,res)=>{
    if(req.query.nickname){     //如果有用户判断条件
        newsApi.getMenuNews("前端",req.query.nickname,null,null,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }else{
        newsApi.getMenuNews("前端",null,req.query.pageSize,req.query.pageNum,data=>{
            if(data){
                res.status(200).json({
                    success:true,
                    returnData:data
                })
            }
        })
    }
})
//增加浏览量
router.get('/addHistory',(req,res)=>{
    newsApi.updateReadNum(req.query.id,data=>{
        if(data == "success"){
            res.status(200).json({
                success:true
            })
        }
    })
})
//发布评论
router.post('/addComment',(req,res)=>{
    console.log(337,req.session)
    newsApi.addComment(req.body.id,req.session.user.nickname,req.session.user.avatar,req.body.comment,data=>{
        comments = data;
        if(comments){
            res.status(200).json({
                success:true
            })
        }else{
            res.status(200).json({
                success:false
            })
        }
        
    })
})
//根据id查询文章参数
router.get('/getNewsInfo',(req,res)=>{
    newsApi.getNewsById(req.query.id,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//获取无人评论的文章
router.get('/getNoCommentNews',(req,res)=>{
    newsApi.getNoCommentNews(data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//排序前100浏览量文章
router.get('/getSortNews',(req,res)=>{
    newsApi.getSortNews(data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//获取收藏夹列表
router.get('/getStar',(req,res)=>{
    sessionApi.getStarList(req.session.user._id,data=>{
        res.status(200).json({
            success:true,
            returnArr:data
        })
    })
})      
//判断当前文章是否被收藏
router.post('/decideStar',(req,res)=>{
    sessionApi.decideStar(req.session.user._id,req.body.newsId,data=>{
        if(data){
            res.status(200).json({
                success:true,
                isStared:false
            })
        }else{
            res.status(200).json({
                success:true,
                isStared:true
            })
        }
    })
    
})
//新建收藏夹
router.post('/addStar',(req,res)=>{
    var starName = req.body.starName
    sessionApi.addStar(req.session.user._id,starName,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }else{
            res.status(500).json({
                success:false,
                returnData:"添加失败"
            })
        }
    })
})
//收藏文章
router.post('/postStarNews',(req,res)=>{
    sessionApi.postStarNews(req.session.user._id,req.body.newsId,req.body.star,req.body.newsName,data=>{
        if(data){
            res.status(200).json({
                success:true,
            })
        }
    })
})
//取消收藏文章
router.post('/deleteStarNews',(req,res)=>{
    sessionApi.deleteStarNews(req.session.user._id,req.body.newsId,req.body.star,data=>{
        if(data){
            res.status(200).json({
                success:true
            })
        }
    })
})
//关注作者
router.post('/lockUser',(req,res)=>{
    sessionApi.lockUser(req.body.avatar,req.session.user.nickname,data=>{
        if(data){
            res.status(200).json({
                success:true
            })
        }
    })
})
//判断当前文章作者是否已被关注
router.post('/decideIsLocked',(req,res)=>{
    sessionApi.decideIsLocked(req.body.avatar,req.session.user.nickname,data=>{
        res.status(200).json({
            success:true,
            isLocked:data
        })
    })
    
})
//取关作者
router.post('/cancelLockUser',(req,res)=>{
    sessionApi.cancelLockUser(req.body.avatar,req.session.user.nickname,data=>{    
        if(data){
            res.status(200).json({
                success:true
            })
        }
    })
})
//获取所有关注
router.get('/getAllActive',(req,res)=>{
    sessionApi.getAllActive(req.session.user._id,data=>{
        res.status(200).json({
            success:true,
            returnData:data
        })
    })
})
//获取所有粉丝
router.get('/getAllLock',(req,res)=>{
    sessionApi.getAllLock(req.session.user._id,data=>{
        res.status(200).json({
            success:true,
            returnData:data
        })
    })
})
//判断文章已被登录用户赞过
router.get('/decideIsGooded',(req,res)=>{
    sessionApi.decideIsGooded(req.query.newsId,req.session.user.nickname,data=>{
        console.log(497,data)
        if(data){
            res.status(200).json({
                success:true,
                result:true
            })
        }else{
            res.status(200).json({
                success:true,
                result:false
            })
        }
    })
})
//点赞文章
router.post('/goodNews',(req,res)=>{
    sessionApi.goodNews(req.body.newsId,req.session.user.nickname,req.session.user.avatar,(alertText,data)=>{
        if(alertText == "点赞成功"){
            res.status(200).json({
                success:true,
                returnText:alertText,
                returnData:data
            })
        }else if(alertText == "点赞失败"){
            res.status(200).json({
                success:false,
                returnText:alertText,
            })
        }
    })
})
//取消点赞文章
router.post('/cancelGoodNews',(req,res)=>{
    sessionApi.cancelGoodNews(req.body.newsId,req.session.user.nickname,alertText=>{
        if(alertText == "取消成功"){
            res.status(200).json({
                success:true,
                returnText:alertText,
            })
        }else if(data == "取消失败"){
            res.status(200).json({
                success:false,
                returnText:alertText
            })
        }
    })
})
//获取其他推荐文章
router.get('/getAvatarNews',(req,res)=>{
    newsApi.getAvatarNews(req.query.newsId,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//获取当前文章所有点赞用户
router.get('/getNewsGooder',(req,res)=>{
    newsApi.getNewsGooder(req.query.newsId,data=>{
        res.status(200).json({
            success:true,
            returnData:data
        })
    })
})

//冻结用户
router.post('/djUser',(req,res)=>{
    adminApi.djUser(req.body,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:data
            })
        }
    })
})
//删除用户
router.post('/delUser',(req,res)=>{
    adminApi.delUser(req.body,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:"删除成功"
            })
        }
    })
})
//改变文章置顶状态
router.post(`/changeNewsTopState`,(req,res)=>{
    adminApi.changeNewsTopState(req.body.newsId,req.body.changeState,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:req.body.changeState?"置顶成功":"取消置顶成功"
            })
        }
    })
})
//提交举报
router.post(`/postReport`,(req,res)=>{
    req.body.reportUser = req.session.user.nickname
    req.body.result = false
    adminApi.postReport(req.body,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:data=="您已提交过举报信息，请耐心等待"?data:'举报成功'
            })
        }
    })
})
//获取所有举报内容
router.get('/getReportList',(req,res)=>{
    adminApi.getReportList(data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//根据用户名获取举报内容
router.get('/getReportListByNickname',(req,res)=>{
    adminApi.getReportListByNickname(req.session.user.nickname,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//处理举报
router.post('/resolveReport',(req,res)=>{
    adminApi.resolveReport(req.body.id,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnText:"已处理"
            })
        }
    })
})
//获取所有管理员列表
router.get(`/getAllAdminInfo`,(req,res)=>{
    adminApi.getAllAdminInfo(data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data
            })
        }
    })
})
//添加管理员
router.post(`/addAdmin`,(req,res)=>{
    adminApi.addAdmin(req.body,data=>{
        console.log(data)
        var err_code = 0
        if(data == "邮箱已存在"){
            err_code = 1
        }else if(data == "用户已存在"){
            err_code = 2
        }else if(data == "服务器错误"){
            err_code = 3
        }
        res.status(200).json({
            success:true,
            err_code,
        })
    })
})
//删除管理员
router.post('/delAdmin',(req,res)=>{
    adminApi.delAdmin(req.body.adminId,data=>{
        if(data){
            res.status(200).json({
                success:true,
                msg:'删除成功'
            })
        }
    })
})
//修改管理员权限
router.post('/updateAdminRole',(req,res)=>{
    const {id,role} = req.body
    adminApi.updateAdminRole(id,role,data=>{
        if(data){
            res.status(200).json({
                success:true,
                returnData:data,
                msg:'修改成功'
            })
        }
    })
})
//获取管理员权限
router.get('/getAdminRole',(req,res)=>{
    const id = req.session.user._id
    adminApi.getAdminRole(id,data=>{
        if(data){
            res.status(200).json({
                success:true,
                roleList:data.role
            })
        }
    })
})

module.exports = router;