exports.isLoggedIn = (req,res,next) =>{
  console.log(`로그인 req.isAuthenticated() 확인 : ${req.isAuthenticated()}`)
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(401).send('로그인이 필요합니다.');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
  };