const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.get('/', (req, res) => { // /api/user/ 
    //loadUser
    if(req.user){
        return res.status(401).send('로그인이 필요합니다. ');
    }
    const user = Object.assign({},req.user.toJSON());
    delete user.password;
    return res.json(req.user);
});

router.post('/', async (req, res, next) => { // POST /api/user 회원가입
    try{
        if(req.body.userId){
            const exUser= await db.User.findOne({
                where : {
                    userId : req.body.userId
                },
            });
            if(exUser){
                return res.status(403).send('이미 사용중인 아이디입니다.');
            }
            const hashedPassword = await bcrypt.hash(req.body.hashedPassword, 12); // 비밀번호 암호화
            const newUser = await db.User.create({
                nickname: req.body.nickname,
                userId : req.body.userId,
                password : hashedPassword,
            });
            console.log(newUser);
            return res.status(200).json(newUser);
        }
        
    }catch(e){
        console.error(e);
        return next(e);
    }

});

router.get('/:id', async (req, res,next) => { // 남의 정보 가져오는 것 ex) /api/user/123
    try{
        const user = await db.User.findOne({
            where : {
                id : parseInt(req.params.id,10),
            },
            include:[{
                model:db.Post,
                as : 'Posts',
                attributes : ['id'],
            },{
                model:db.User,
                as : 'Followings',
                attributes : ['id'],
            },{
                model:db.User,
                as : 'Followers',
                attributes : ['id'],
            }],
            attributes: ['id','nickname']
        });
        const jsonUser = user.toJSON();
        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
        req.json(jsonUser);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.post('/logout', (req, res) => { // /api/user/logout
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

router.post('/login', (req, res, next) => { // POST /api/user/login
    console.log(`server: login 확인1 `);
    passport.authenticate('local', (err,user,info)=>{
        console.log(`server: login 확인2 ${user}`);
        if(err){
            console.error(err);
            return next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user,async(loginErr)=>{
            try{
                if(loginErr){
                    return next(loginErr);
                }
                console.log(`server: login3 ${user.id}`);
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname', 'userId'],
                });                
                console.log(fullUser);
                return res.json(fullUser);
            }catch(e){
                next(e);
            }
            
        })
    })(req,res,next);
});

router.get('/:id/follow', (req, res) => { // /api/user/:id/follow

});
router.post('/:id/follow', (req, res) => {

});

router.delete('/:id/follow', (req, res) => {

});

router.delete('/:id/follower', (req, res) => {

});

router.get('/:id/posts', async (req, res,next) => {
    try{
        const posts = await db.Post.findAll({
            where : {
                id : parseInt(req.params.id,10),
                RetweetId: null,
            },
            include:[{
                model:db.User,
                attributes : ['id','nickname'],
            }],
        });
        res.json(posts);
    }catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;
