const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/:tag',async(req,res,next)=>{
    try{
        const posts = await db.Post.findAll({
            include:[{
                model:db.Hashtag,
                where : {name: decodeURIComponent(req.params.tag)}, // 한글과 특수문자가 주소로 올때는 인코딩되서 온다 .
            },{
                model:db.User,
                attributes:['id','nickname'],
            },{
                model: db.Image,
            }],
        });
        res.json(posts);
    }catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;