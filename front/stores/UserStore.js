import { observable, action } from "mobx";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3065/api';

export default class UserStore{
    @observable isLoggedIn =false; // 로그인 여부
    @observable user = null;
    @observable isLoggingOut = false;  // 로그아웃 시도중
    @observable isLoggingIn = false; // 로그인 시도중 
    @observable logInErrorReason = ''// 로그인 실패사유
    @observable isSignedUp = false; // 회원가입 성공
    @observable isSigningUp = false; // 회원가입 시도중
    @observable signUpErrorReason = ''; // 회원가입 실패 사유
    @observable followingList = []; // 팔로잉 리스트 
    @observable followerList = []; // 팔로워 리스트 
    @observable userInfo = null // 남의 정보

    constructor(root){
        this.root = root;
    }

    @action login(user){ 
        try{
            this.isLoggingIn = true;
            console.log(`this.isLoggedIn 상태 : ${this.isLoggedIn}`);
            var me = this;
            axios.post('/user/login', user,{
                withCredentials:true
            }).then(res=>{
                console.log(`응답받음 : ${res.userId}`);
                me.isLoggingIn =false;
                me.isLoggedIn = true;
                me.user = res.data;
            });
        }catch(e){
            console.error(e);
            //this.logInErrorReason = e;
        }           
    }

    @action logout(){
        try{
            this.isLoggedIn = false;
        }catch(e){
            console.error(e);
        }        
    }

    @action signUp(user){
        try{
            this.isSigningUp = true;

            var me = this;
            axios.post('/user/',{
                nickname: user.nickname,
                userId : user.userId,
                hashedPassword : user.password, // 비밀번호가 post에서 바로 노출되기 때문에 노출되지 않는 방법 확인 
            }).then(res=>{
                me.isSignedUp = true;
                me.isSigningUp = false;
                // 그 다음 액션에 관한게 없어서 그 후 액션 어떻게 되는지 구현 
            }).catch((err)=>console.error(err));

            // var me = this;
            // setTimeout(()=>{
            //     me.isSignedUp = true;
            //     me.isSigningUp = false;
            // },3000);
        }catch(e){
            console.error(e);
            this.signUpErrorReason = e;
        }        
    }

    @action loadUser(user){
        
    }
}