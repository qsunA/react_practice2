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
        console.log(`newPost ${newPost}`)
        console.log(`newPost.id ${newPost.id}`)
        const fullPost = await db.Post.findOne({
            where:{id:newPost.id},
            include:[{
                model:db.User,
                attributes:['id','nickname']
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

router.patch('/',isLoggedIn,upload.none(),async(req,res,next)=>{
    try{
        const hashtags = req.body.content.match(/#[^\s]+/g);
        console.log(`hashtag ${hashtags}`)
        console.log(`id ${req.body.postId}`)
        await db.Post.update({
            content:req.body.content,    
        },{
            where:{id:req.body.postId}
        });

        const editPost =  await db.Post.findOne({where:{id:req.body.postId}});
        console.log(`editPost ${editPost}`)
        if(hashtags){
            const result = await Promise.all(hashtags.map(tag=>db.Hashtag.findOrCreate({
                where:{
                    name:tag.slice(1).toLowerCase()
                },
            })));
           // console.log(`************************ ******editPost ::; ${result[0]}`)
            await editPost.addHashtags(result.map(r=>r[0]));
        }
        console.log(`editPost.id ${editPost.id}`)
        const fullPost = await db.Post.findOne({
            where:{id:req.body.postId},
            include:[{
                model:db.User,
                attributes:['id','nickname']
            },{
                model: db.Image,
            }],
        });
        res.json(fullPost);
    }catch(e){
        console.error(e);
        next(e);
    }
})


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

router.post('/:id/like',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.addLiker(req.user.id);
        res.json({userId:req.user.id});
    }catch(e){
        console.error(e);
        next(e);       
    }
});

router.delete('/:id/like',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.removeLiker(req.user.id);
        res.json({userId:req.user.id});
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.post('/:id/retweet',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        if(req.user.id=== post.UserId){
            return res.status(403).send('자신의 글은 리트윗 할 수 없습니다. ');
        }

        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await db.Post.findOne({
            where:{
                UserId: req.user.id,
                RetweetId:retweetTargetId,
            },
        });
        if(exPost){
            return res.status(403).send('이미 리트윗했습니다.');
        }
        const retweet = await db.Post.create({
            UserId:req.user.id,
            RetweetId:retweetTargetId,
            content:'retweet'
        });
        const retweetWithPrevPost = await db.Post.findOne({
            where:{id:retweet.id},
            include:[{
                model:db.User,
                attributes:['id','nickname'],
            },{
                model:db.Post,
                as: 'Retweet',
                include:[{
                    model:db.User,
                    attributes:['id','nickname'],
                },{
                    model:db.Image
                }]
            }]
        });
        res.json(retweetWithPrevPost);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.delete('/:id',isLoggedIn,async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({where:{id:req.params.id}});
        if(!post){
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await db.Post.destroy({where : {id:req.params.id}});
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.get('/:id',async(req,res,next)=>{
    try{
        const post = await db.Post.findOne({
            where:{id:req.params.id},
            include:[{
                model:db.User,
                attributes:['id','nickname'],
            },{
                model:db.Image,
            }]
        });
        res.json(post);
    }catch(e){
        console.error(e);
        next(e);
    }
});

module.exports = router;