const newsDb = require('../dbs/news.js')    //引入数据库模型

function showPage(callback){
    newsDb.news1.find((err,result)=>{
        if(err){
            callback(err)
        }else{
            var returnRes = result
            callback(returnRes)
        }
    })
}


module.exports = {
    showPage
}
