const express = require('express');
const path = require('path');
const app = express();
const MongoStore = require('connect-mongo')
const router = require('./router');
const fs = require('fs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const session = require('express-session');
app.use(session({
    secret: "dfjdlfajdfafdafadfadfaf",
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
    saveUninitialized: true,
    store:MongoStore.create({       //防止服务器刷新丢失session
        mongoUrl:'mongodb://localhost/userinfo'
    })
}))

//设置跨域请求
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header("X-Powered-By",' 3.2.1')
//     next();
// });
 
  
app.use(router);
app.use('/public/',express.static(path.join(__dirname,'/public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'/node_modules/')))



app.listen(4000,()=>{
    console.log('listen.......................');
})