const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const app = express();
db.sequelize.sync();

app.use(morgan('dev'));
app.use(express.json()); // json형식의 본문
app.use(express.urlencoded({extended:true})); // form으로 나온 것을 처리 
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave:false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false, //https를 쓸 때 true
    }
}));

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);


app.listen(3056, ()=>{
    console.log('server is running on http://localhost:3056');
});