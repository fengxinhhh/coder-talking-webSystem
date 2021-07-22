const path = require('path')
const newsDb = require('../dbs/news.js')    //引入数据库模型

//获取所有文章
function getAllNews(callback){
    newsDb.news1.find((err,result)=>{
        if(err){
            callback(err)
        }else{
            callback(result)
        }
    })
}
//根据用户名获取所有文章
function getAllNewsByLoginuser(loginUser,callback){
    newsDb.news1.find({nickname:loginUser})
    .then(result=>{
        callback(result)
    })
}
//更新所有文章
function updateAllNews(updateNews,callback){
    for(var i = 0;i < updateNews.length;i++){   //循环遍历每一条文章
        newsDb.news1.updateOne({"_id":updateNews[i]._id}, //如果id相同
        {
           $set: { //更新字段
               nickname: updateNews[i].nickname,    
               comment:updateNews[i].comment
           }
       }, {
           "multi": true
       },(err,result)=>{
           if(err){
               callback(err)
           }else{
               callback(result)
           }
       });
    }
    
}
//获取文章总数
function getNewsNum(callback){
    newsDb.news1.find()
    .then(result=>{
        callback(result.length)
    })
}
//根据页码获取文章
function getNewsByPageNum(pageSize,pageNum,nickname,callback){
    if(pageSize && pageNum){        //如果有页码
        newsDb.news1.find((err,result)=>{
            if(err){
                callback(err)
            }else{
                pageSize = Number(pageSize);
                pageNum = Number(pageNum)
                result.sort((x,y)=>{
                    return y.isTop - x.isTop
                })
                var returnNews = result.slice(pageSize * (pageNum - 1),pageSize * (pageNum - 1) + pageSize);
                callback(returnNews)
            }
        })
    }else if(nickname){     //如果没有页码，只有用户名，获取该用户发表的文章
        newsDb.news1.find({nickname:nickname})
        .then(result=>{
            result.sort((x,y)=>{
                return y.isTop - x.isTop
            })
            callback(result)
        })
    }else{
        newsDb.news1.find()
        .then(result=>{
            result.sort((x,y)=>{
                return y.isTop - x.isTop
            })
            callback(result)
        })
    }
    
}
//修改头像
function onloadPic(imgSrc,nickname,callback){
    newsDb.news1.updateMany({nickname:nickname},{avatar:imgSrc})
    .then(result=>{
        callback("success")
    })
}
//根据用户名获取文章
function getNewsById(id,callback){
    newsDb.news1.findOne({_id:id},(err,result)=>{
        if(err){
            callback(err)
        }else{
            callback(result)
        }
    })
}
//根据作者的用户名获取所有文章
function getAllNewsByNickname(nickname,callback){
    newsDb.news1.find({nickname:nickname})
    .then(result=>{
        callback(result)
    })
}
//查询指定分类文章
function getMenuNews(option,nickname,pageSize,pageNum,callback){
    if(nickname){       //如果通过用户名判断
        newsDb.news1.find({option:option,nickname:nickname},(err,result)=>{
            if(err){
                callback(err)
            }else{
                result.sort((x,y)=>{
                    return y.isTop - x.isTop
                })
                callback(result)
            }
        })
    }else{      //如果有页码判断
        newsDb.news1.find({option:option},(err,result)=>{
            if(err){
                callback(err)
            }else{
                pageSize = Number(pageSize);
                pageNum = Number(pageNum)
                result.sort((x,y)=>{
                    return y.isTop - x.isTop
                })
                var returnNews = result.slice(pageSize * (pageNum - 1),pageSize * (pageNum - 1) + pageSize);
                callback(returnNews)
            }
        })
    }
    
}
//新增文章
function addNews(parse,callback){     //获取发布文章的用户信息
    new newsDb.news1(parse).save((err,result)=>{
        if(err){
            callback('error')
        }else{
            callback('success')
        }
    })
}
//修改文章
function updateNews(newsInfo,callback){     
    newsDb.news1.updateOne({_id:newsInfo.newsId},newsInfo)
    .then(result=>{
        callback(result)
    })
    .catch(err=>{
        callback(err)
    })
}
//删除文章
function delNewsById(newsId,callback){
    newsDb.news1.deleteOne({_id:newsId})
    .then(result=>{
        callback(result)
    })
}
//根据作者名获取文章
function getAvatarNews(newsId,callback){
    newsDb.news1.findOne({_id:newsId})
    .then(result=>{
        return result.nickname
    })
    .then(avatar=>{
        newsDb.news1.find({nickname:avatar})
        .then(result=>{
            var index = result.findIndex(item=>{
                return item._id == newsId
            })
            result.splice(index,1)
            callback(result)
        })
    })
}
//修改访问量
function updateReadNum(id,callback){
    newsDb.news1.findOne({_id:id},(err,result)=>{
        if(err){
            callback(err)
        }else{
            return result
        }
    })
    .then(result=>{
        var num = result.readNum
        newsDb.news1.findByIdAndUpdate(id,{readNum:num+1},(err,result)=>{
            if(err){
                callback(err)
            }else{
                callback("success")
            }
        })
    })
}
//添加评论
function addComment(id,commentUser,avatar,comment,callback){
    newsDb.news1.findOne({_id:id},(err,result)=>{
        if(err){
            callback(err)
        }else{
            return result
        }
    }).then(result=>{
        var dt = new Date();
        var time = `${dt.getFullYear()}-${dt.getMonth() < 9?"0"+(dt.getMonth() + 1):dt.getMonth() + 1}-${dt.getDate()<10?"0"+dt.getDate():dt.getDate()}`
        result.comment.push({nickname:commentUser,avatar:avatar,text:comment,time:time})   //新数组
        var newArr = result.comment;
        newsDb.news1.findByIdAndUpdate(id,{comment:newArr},(err,res)=>{ //更新字段中的数组
            if(err){
                callback(err)
            }else{
                callback(newArr)
            }
        })
    })
}
//获取无人评论的文章
function getNoCommentNews(callback){
    newsDb.news1.find({comment:[]},(err,result)=>{
        if(err){
            callback(err)
        }else{
            callback(result)
        }
    })
}
//排序前100浏览量文章
function getSortNews(callback){
    newsDb.news1.find({})
        .sort({readNum:-1})
        .exec()
        .then((result)=>{
            callback(result)
        })
        .catch((err)=>{
            callback(err)
        })
}
//获取当前文章所有点赞用户
function getNewsGooder(newsId,callback){
    newsDb.news1.find({_id:newsId})
    .then(result=>{
        callback(result[0].good)
    })
}


module.exports = {
    addNews,
    updateNews,
    getNewsNum,
    getAllNewsByLoginuser,
    getAllNewsByNickname,
    updateAllNews,
    onloadPic,
    delNewsById,
    getAvatarNews,
    getNewsById,
    getNewsByPageNum,
    getMenuNews,
    updateReadNum,
    addComment,
    getAllNews,
    getNoCommentNews,
    getSortNews,
    getNewsGooder,
}