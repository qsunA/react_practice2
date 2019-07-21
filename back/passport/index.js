const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    
    passport.serializeUser((user,done)=>{ // 서버는 로그인할때의 id와 쿠키정보만 가지고 있음.  프론트에는 쿠키를 보내줌
        return done(null,user.id);
    });
    passport.deserializeUser(async(id,done)=>{ // 프론트의 쿠키를 가지고 연결된 id를 확인, id를 가지고 db에서 사용자 정보를 확인한다. (userId가 아닌 db가 부여한 id)
        try{
            const user = await db.User.findOne({
                where: { id },
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
                });
            return done(null,user); //req.user에 저장됨 
        }catch(e){
            console.error(e);
            return done(e);
        }
    });

    local();
};