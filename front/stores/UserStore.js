import { observable, action } from "mobx";


export default class UserStore{
    @observable isLoggedIn =false; // 로그인 여부
    @observable user = {
        userId:'',
        password:''
    };
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

    @action login(){ 
        try{
            this.isLoggingIn = true;
            this.user.userId = 'test';
            console.log(`this.isLoggedIn 상태 : ${this.isLoggedIn}`);
            var me = this;
            setTimeout(()=>{
                console.log(`setTimeOut 3000`);
                me.isLoggingIn =false;
                me.isLoggedIn = true;
            },3000);
        }catch(e){
            console.error(e);
            logInErrorReason = e;
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
            console.log(`signup :${user.id}`);
            var me = this;
            setTimeout(()=>{
                me.isSignedUp = true;
                me.isSigningUp = false;
            },3000);
        }catch(e){
            console.error(e);
            this.signUpErrorReason = e;
        }        
    }
}
