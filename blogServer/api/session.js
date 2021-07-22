


const usersDb = require('../dbs/users.js')  //引入user数据库模型
const newsDb = require('../dbs/news.js')    //引入新闻数据库模型
const adminDb = require('../dbs/admin.js')

//注册业务实现，新增数据库参数
function register(newDB,callback){
    var user = new usersDb.userinfo(newDB)
    usersDb.userinfo.findOne({$or:
        [
            {nickname:newDB.nickname},
            {email:newDB.email}
        ]
    })     //判断用户名是否存在
    .then(data=>{
        if(data){   //数据相同的情况
            if(data.nickname == newDB.nickname){
                 callback('用户已存在！');
            }else if(data.email == newDB.email){
                 callback('邮箱已存在！');
            }
        }else{
            return
        }
    }).catch(err=>{
        return callback('服务器错误')
    })
    .then(()=>{
        adminDb.admininfo.findOne({$or:
            [
                {nickname:newDB.nickname},
                {email:newDB.email}
            ]
        })
        .then(data=>{
            console.log(data)
            if(data){
                if(data.nickname == newDB.nickname){
                    callback('用户已存在！');
                }else if(data.email == newDB.email){
                    callback('邮箱已存在！');
                }
            }
            return user
        })
        .then(user=>{
            console.log(user)
           user.save((err,result)=>{
               if(err){
                    callback('服务器错误');
               }else{
                    callback('注册成功');
               }
           })
        })
    })
    
}
//登录业务实现
function login(user,callback){
    usersDb.userinfo.findOne({email:user.email,password:user.password},(err,result)=>{
        if(result){         //查找到用户表中有存在用户
            callback(result)
        }else{              //若没查到找，查找管理员用户
            adminDb.admininfo.findOne({email:user.email,password:user.password},(err,result)=>{
                console.log(result)
                if(result){
                    callback(result)
                }else{
                    callback(null)
                }
            })
        }
    })
}
//个人信息业务实现
function getUserInfo(id,callback){
    usersDb.userinfo.findOne({_id:id})
    .then(result=>{
        if(result){
            callback(result)
        }else{
            return 
        }
    })
    .then(()=>{
        adminDb.admininfo.findOne({_id:id})
        .then(result=>{
            callback(result)
        })
    })
}
//获取所有用户列表
function getAllUserInfo(callback){
    usersDb.userinfo.find({isAdmin:false})
    .then(result=>{
        callback(result)
    })
}
//根据用户名获取信息
function getUserInfoByNickname(nickname,callback){
    usersDb.userinfo.findOne({nickname:nickname})
    .then(result=>{
        callback(result)
    })
}
//更新个人信息
function loadUserInfo(user,callback){
    usersDb.userinfo.findByIdAndUpdate(user._id,user,{new:true},(err,result)=>{
        if(err){
            callback('保存失败')
        }else{
            callback(result)
        }
    })
}
//修改头像
function onloadPic(imgSrc,userId,callback){
    usersDb.userinfo.findByIdAndUpdate(userId,{avatar:imgSrc},{new:true})
    .then(result=>{
        callback("success")
    })
}
//获取个人收藏夹列表
function getStarList(id,callback){
    usersDb.userinfo.findOne({_id:id},(err,result)=>{
        if(err){
            callback(err)
        }else{
            callback(result)
        }
    })
}
//查看是否被收藏
function decideStar(userId,newsId,callback){
    usersDb.userinfo.findOne({_id:userId})
    .then(result=>{
        return result
    })
    .then(result=>{
        for(var i = 0;i < result.star.length;i++){
            for(var j = 0;j < result.star[i].content.length;j++){
                if(result.star[i].content[j].newsId == newsId){
                    callback(false)
                    break;
                }
            }
        }
    })
}
//新增个人收藏夹
function addStar(id,starName,callback){
    usersDb.userinfo.findOne({_id:id})  
    .then(result=>{
        return result
    })
    .catch(err=>{
        callback(err)
    })
    .then(result=>{
        var newStarList = result.star;
        if(newStarList.indexOf(starName) !== -1){
            callback("收藏夹已存在！");
        }else{
            newStarList.push({name:starName,content:[]})
            usersDb.userinfo.findByIdAndUpdate(id,{star:newStarList})
            .then(result=>{
                return result
            })
            .catch(err=>{
                callback(err)
            })
            .then(()=>{
                usersDb.userinfo.findOne({_id:id})  
                .then(result=>{
                    callback(result)
                })
                .catch(err=>{
                    callback(err)
                })
            })
        }
    })
}
//添加到收藏夹
function postStarNews(userId,newsId,starName,newsName,callback){
    usersDb.userinfo.findOne({_id:userId})
    .then(result=>{
        return result
    })
    .catch(err=>{
        callback(err)
    })
    .then(result=>{
        var arrStarIndex = result.star.findIndex(item=>{
            return item.name == starName
        })
        result.star[arrStarIndex].content.push({
            newsName:newsName,
            newsId:newsId
        })
        return result.star
    })
    .then(result=>{
        usersDb.userinfo.findByIdAndUpdate(userId,{star:result})
        .then(result=>{
            callback(result)
        })
        .catch(err=>{
            callback(result)
        })
    })
}
//取消收藏
function deleteStarNews(userId,newsId,starName,callback){
    usersDb.userinfo.findOne({_id:userId})
    .then(result=>{
        return result
    })
    .catch(err=>{
        callback(err)
    })
    .then(result=>{
        for(var i = 0;i < result.star.length;i++){
            for(var j = 0;j < result.star[i].content.length;j++){
                if(result.star[i].content[j].newsId == newsId){
                    result.star[i].content.splice(j,1);
                    return result.star
                }
            }
        }
    })
    .then(result=>{
        usersDb.userinfo.findByIdAndUpdate(userId,{star:result})
        .then(result=>{
            callback(result)
        })
        .catch(err=>{
            callback(result)
        })
    })
}
//关注      (已完成粉丝，改变被关注者locknum)
function lockUser(avatar,loginUser,callback){
    usersDb.userinfo.find({nickname:avatar})    //为作者添加粉丝
    .then(result=>{
        result[0].lockNum.push(loginUser);
        var newLockNum = result[0]
        return newLockNum
    })
    .then(result=>{
        usersDb.userinfo.update({_id:result._id},result)
        .then(()=>{
            return
        })
        .then(()=>{
            usersDb.userinfo.find({nickname:loginUser})    //为登录用户添加关注
            .then(result=>{
                result[0].activedNum.push(avatar)
                return result[0] 
            })
            .then(result=>{
                usersDb.userinfo.update({_id:result._id},result)
                .then(result=>{
                    callback("success")
                })
            })
        })
    })
    
    
}
//判断当前文章作者是否被关注
function decideIsLocked(avatar,nickname,callback){
    var lockResult = [];
    if(typeof avatar == "string"){  //如果只有一个用户需要判断
        usersDb.userinfo.find({nickname:avatar})   //判断当前文章作者是否已被关注 
        .then(result=>{
            avatarLockList = result[0].lockNum
            var isLocked = avatarLockList.find((item)=>{    //遍历判断
                return item == nickname
            })
            callback(isLocked)
        })
    }else{
        
        for(let i = 0;i < avatar.length;i++){
            usersDb.userinfo.find({nickname:avatar[i]})   //判断当前文章作者是否已被关注 
            .then(result=>{
                var isLocked = result[0].lockNum.find((item)=>{    //遍历判断
                    return item == nickname
                })
                lockResult.push(Boolean(isLocked))
                if(i == avatar.length - 1){
                    console.log(lockResult)
                    callback(lockResult)
                }
            })
        }
    }

    
}
//取关作者
function cancelLockUser(avatar,loginUser,callback){
    usersDb.userinfo.find({nickname:avatar})
    .then(result=>{         //去除作者的粉丝
        var index = result[0].lockNum.findIndex(item=>{
            return item == loginUser
        })
        result[0].lockNum.splice(index,1)
        return result[0]
    })
    .then(result=>{
        usersDb.userinfo.update({_id:result._id},result)
        .then(result=>{
            return
        })
    })
    .then(()=>{     //去除当前用户的关注
        usersDb.userinfo.find({nickname:loginUser})
        .then(result=>{
            var index = result[0].activedNum.findIndex(item=>{
                return item == avatar
            })
            result[0].activedNum.splice(index,1)
            return result[0]
        })
        .then(result=>{
            usersDb.userinfo.update({_id:result._id},result)
            .then(result=>{
                callback("success")
            })
        })
    })
}
//获取所有关注
function getAllActive(id,callback){
    usersDb.userinfo.findOne({_id:id})
    .then(result=>{
        callback(result.activedNum)
    })
}
//获取所有粉丝
function getAllLock(id,callback){
    usersDb.userinfo.findOne({_id:id})
    .then(result=>{
        callback(result.lockNum)
    })
}
//判断文章已被登录用户赞过
function decideIsGooded(newsId,nickname,callback){
    newsDb.news1.findOne({_id:newsId})
    .then(result=>{
        console.log((307,result))
        return result
    })
    .then(result=>{     //判断当前用户是否已经点赞
        console.log(311,nickname)
        var isGood = result.good.find(item=>{
            return item.nickname == nickname
        })
        callback(Boolean(isGood))
    })
    
}
//点赞文章
function goodNews(newsId,user,avatar,callback){
    newsDb.news1.findOne({_id:newsId})
    .then(result=>{
        return result
    })
    .then(result=>{     //判断当前用户是否已经点赞
        result.good.push({
            nickname:user,
            avatar:avatar
        })
        return result
    })
    .then(newData=>{
        newsDb.news1.updateOne({_id:newsId},newData)
        .then(()=>{
            callback("点赞成功",newData.good)
        })
        .catch(()=>{
            callback("点赞失败")
        })
    })
}
//取消点赞文章
function cancelGoodNews(newsId,user,callback){
    newsDb.news1.findOne({_id:newsId})
    .then(result=>{
        return result
    })
    .then(result=>{     //从点赞列表删除该用户
        var index = result.good.findIndex(item=>{
            return item == user
        })
        result.good.splice(index,1)
        return result
    })
    .then(newData=>{
        newsDb.news1.updateOne({_id:newsId},newData)
        .then(()=>{
            callback("取消成功")
        })
        .catch(()=>{
            callback("取消失败")
        })
    })
}


module.exports = {
    register,
    login,
    getAllUserInfo,
    getUserInfo,
    getUserInfoByNickname,
    loadUserInfo,
    getStarList,
    addStar,
    postStarNews,
    onloadPic,
    decideStar,
    deleteStarNews,
    lockUser,
    decideIsLocked,
    cancelLockUser,
    getAllActive,
    getAllLock,
    decideIsGooded,
    goodNews,
    cancelGoodNews
}