const usersDb = require('../dbs/users.js')  //引入user数据库模型
const newsDb = require('../dbs/news.js')    //引入新闻数据库模型
const reportDb = require('../dbs/report.js')    //引入举报数据库模型
const adminDb = require('../dbs/admin.js')  //引入admin数据库模型


//冻结用户
function djUser(data,callback){      
    var status = data.status == 0?1:0
    var id = data._id;
    // var report = new reportDb.report1({
    //     reportUser:"fxSB",
    //     newsId:"60b8f44dfff3ed31e470b914",
    //     newsTitle:"Javascript常用方法封装",
    //     newsAvatar:"冯广宁",
    //     create_time:"2021-06-03T23:25:01+08:00",
    //     isTop:true,
    //     reportType:['黄色','抄袭'],
    //     reportComment:'抄袭了王杰的文章，请审核查封，谢谢'
    // })
    // report.save()
    // .then(result=>{
    //     console.log(19,result)
    // })
    usersDb.userinfo.findByIdAndUpdate(id,{status:status},{new:true})
    .then(result=>{
        if(result.status == 1){
            callback("冻结成功")
        }else{
            callback("解冻成功")
        }
    })
}
//删除用户并更新每个用户的粉丝、每篇文章的点赞、评论列表
function delUser(data,callback){            
    usersDb.userinfo.deleteOne({_id:data._id})      //删除用户表中的用户
    .then(res=>{
        return
    })
    .then(()=>{             //更新每个用户中的粉丝列表
        usersDb.userinfo.find()
        .then(res=>{
            return res
        })
        .then(res=>{        //删除粉丝中的用户
            res.forEach(item=>{
                for(var i = 0;i < item.lockNum.length;i++){
                    if(item.lockNum[i] == data.nickname){
                        item.lockNum.splice(i,1)
                        i--
                    }
                }
                var lockNum = item.lockNum
                usersDb.userinfo.findByIdAndUpdate(item._id,{lockNum:lockNum},{new:true})
                .then(res=>{
                    console.log(res)
                })
            })
            
        })
    })
    .then(()=>{             //删除文章表中的评论、点赞信息
        newsDb.news1.deleteMany({nickname:data.nickname})
        .then(res=>{
            console.log(47,res)
            return
        })
        .then(()=>{
            newsDb.news1.find()
            .then(res=>{
                return res
            })
            .then(res=>{
                res.forEach(item=>{     //遍历每条新闻，更新新闻中评论、点赞数组中的用户
                    var good = [];
                    var comment = [];
                    for(var i = 0;i < item.good.length;i++){ //删除评论里的用户
                        if(item.good[i].nickname == data.nickname){
                            item.good.splice(i,1)
                            i--
                        }
                    }
                    for(var j = 0;j < item.comment.length;j++){ //删除评论里的用户
                        if(item.comment[j].nickname == data.nickname){
                            item.comment.splice(j,1)
                            j--
                        }
                    }
                    good = item.good;
                    comment = item.comment
                    newsDb.news1.findByIdAndUpdate(item._id,{comment:comment,good:good},{new:true})
                    .then(()=>{
                        return
                    })
                })
            })    
        })  
    })
    .then(()=>{                 //删除举报表中的举报内容
        reportDb.report1.deleteMany({reportUser:data.nickname})
        .then(result=>{
            callback(result)
        })
    })
    
}
//改变文章置顶状态
function changeNewsTopState(newsId,isTopState,callback){       
    newsDb.news1.findByIdAndUpdate(newsId,{isTop:!isTopState},{new:true})
    .then(result=>{
        callback(result)
    })
}
//提交举报
function postReport(data,callback){
    reportDb.report1.findOne({newsTitle:data.newsTitle,reportUser:data.reportUser})
    .then(result=>{
        console.log(result)
        if(result && result.result == false){       //如果该篇文章已被此用户举报且举报未处理
            callback("您已提交过举报信息，请耐心等待")
        }else{
            new reportDb.report1(data).save()
            .then(result=>{
                if(result){
                    callback(result)
                }
            })
        }
    })
    
}
//获取所有举报内容
function getReportList(callback){
    reportDb.report1.find()
    .then(result=>{
        callback(result)
    })
}
//根据用户名获取举报内容
function getReportListByNickname(reportUser,callback){
    reportDb.report1.find({reportUser:reportUser})
    .then(result=>{
        callback(result)
    })
}
//处理举报
function resolveReport(id,callback){
    reportDb.report1.findByIdAndUpdate(id,{result:true},{new:true})
    .then(result=>{
        callback(result)
    })
}
//获取所有管理员列表
function getAllAdminInfo(callback){
    adminDb.admininfo.find()
    .then(result=>{
        callback(result)
    })
}
//添加管理员
function addAdmin(adminData,callback){
    var admin = new adminDb.admininfo(adminData)
    adminDb.admininfo.findOne({$or:
        [
            {nickname:adminData.nickname},
            {email:adminData.email}
        ]
    })     //判断用户名是否存在
    .then(data=>{
        if(data){   //数据相同的情况
            console.log(data)
            if(data.nickname == adminData.nickname){
                 callback('用户已存在');
            }else if(data.email == adminData.email){
                 callback('邮箱已存在');
            }
        }else{
            return admin
        }
    }).catch(err=>{
        return callback('服务器错误')
    })
    .then(admin=>{
        admin.save((err,result)=>{
           if(err){
                callback('服务器错误');
           }else{
                callback('注册成功');
           }
       })
    })
}
//删除管理员
function delAdmin(id,callback){
    adminDb.admininfo.deleteOne({_id:id})
    .then(result=>{
        callback(result)
    })
}
//修改管理员权限
function updateAdminRole(id,role,callback){
    adminDb.admininfo.findByIdAndUpdate({_id:id},{role},{new:true})
    .then(result=>{
        callback(result)
    })
}
//获取管理员权限
function getAdminRole(id,callback){
    console.log(id)
    adminDb.admininfo.findOne({_id:id})
    .then(result=>{
        console.log(result)
        callback(result)
    })
}

module.exports = {
    djUser,
    delUser,
    changeNewsTopState,
    postReport,
    getReportList,
    getReportListByNickname,
    resolveReport,
    getAllAdminInfo,
    addAdmin,
    delAdmin,
    updateAdminRole,
    getAdminRole
}