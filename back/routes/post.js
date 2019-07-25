const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

const upload = multer({
    storage : multer.diskStorage({// 어느 부분에 저장할것인지 설정
        destination(req,file,done){ 
            done(null,'uploads');
        },
        filename(req,file,done){
            const ext = path.extname(file.originalname); // 확장자 추출
            const basename = path.basename(file.originalname, ext); //확장자 제외한 이름 추출
            done(null,basename+new Date().valueOf()+ext);
        },
    }),
    limits : {fileSize:20*1024*1024},//파일 사이즈, 개수 등으로 제한을 둘 수 있음.
});// multer관련 설정을 해야함 

router.post('/', isLoggedIn,upload.none(), async (req, res, next) => { // POST /api/post
    try{
        console.log(`createPost222확인해보기 ${req.body.content}`)
        const hashtags = req.body.content.match(/#[^\s]+/g); // 정규표현식으로 해시태그 뽑아냄
        const newPost = await db.Post.create({
            content:req.body.content,
            UserId : req.user.id
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
        if(req.body.image){
            if(Array.isArray(req.body.image)){
                const images = await Promise.all(req.body.image.map((image)=>{
                    return db.Image.create({src:image});
                }));
                await newPost.addImages(images);
            }else{
                const image = await db.Image.create({src:req.body.image});
                await newPost.addImage(image);
            }
        }

        const fullPost = await db.Post.findOne({
            where:{id:newPost.id},
            include:[{
                model:db.User,
            },{
                model: db.Image,
            }],
        });
        res.json(fullPost);
    }catch(e){
        console.error(e);
        next(e);
    }
});


router.post('/images',upload.array('image'), (req, res) => {//이미지 업로드
    console.log(req.files);
    res.json(req.files.map(v=>v.filename));
});

router.post('/:id/comment',isLoggedIn ,async(req,res,next)=>{
    try{    
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId:post.id,
            UserId:req.user.id,
            content: req.body.content,
        });
        await post.addComment(newComment.id);
        const comment = await db.Comment.findOne({
            where:{
                id:newComment.id,
            },
            include:[{
                model:db.User,
                attributes:['id','nickname']
            }],
        });
        return res.json(comment);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.get('/:id/comments',async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        console.log(`postComment확인해보기 ${post}`);
        const comments = await db.Comment.findAll({
            where:{
                PostId:req.params.id
            },
            order : [['createdAt','ASC']],
            include:[{
                model:db.User,
                attributes:['id','nickname'],
            }],
        });
        res.json(comments);
    }catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;