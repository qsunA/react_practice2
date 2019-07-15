const express = require('express');
const db = require('./models');

const app = express();
db.sequelize.sync();

const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
app.get('/', (req,res)=>{
    res.send('Hello, server');
}); //main 페이지에 접속

app.get('/about',(req,res)=>{
    res.send('hello about');
});

app.use('/api/user',userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(3056, ()=>{
    console.log('server is running on http://localhost:3056');
});