const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /api/posts
    try{
        console.log(`posts확인 1 `)
        const posts = await db.Post.findAll({
            include:[{
                model:db.User,
                attributes:['id','nickname']
            },{
                model: db.Image,
            }],
            order:[['createdAt','DESC']]
        });
        res.json(posts);
    }catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;