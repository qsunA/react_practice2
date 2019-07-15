const express = require('express');
const db = require('./models');

const app = express();
db.sequelize.sync();

app.get('/', (req,res)=>{
    res.send('Hello, server');
}); //main 페이지에 접속

app.get('/about',(req,res)=>{
    res.send('hello about');
})

app.listen(3056, ()=>{
    console.log('server is running on http://localhost:3056');
});