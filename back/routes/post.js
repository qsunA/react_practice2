const express = require('express');
const db = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => { // POST /api/post
    try{
        const hashtags = req.body.content.match(/#[^\s]+/g); // 정규표현식으로 해시태그 뽑아냄
        const newPost = await db.Post.create({
            content:req.body.content,
            UserId : req.body.id
        });

        if(hashtags){
            const result = await Promise.all(hashtags.map(tag=>db.Hashtag.findOrCreate({
                where:{
                    name:tag.slice(1).toLowerCase()
                },
            })));
            console.log(result);
            await newPost.addHashtags(result.map(r=>r[0]));
        }
        const fullPost = await db.Post.findOne({
            where:{id:newPost.id},
            include:[{
                model:db.User,
            }],
        });
        res.json(fullPost);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.post('/images', (req, res) => {

});

module.exports = router;