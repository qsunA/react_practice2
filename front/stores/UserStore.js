import { observable, action } from "mobx";
import axios from 'axios';
import {asyncAction} from "mobx-utils";
import userRepository from "../repository/UserRepository";

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

    @asyncAction
    async *login(user){
        const {data, status} = yield userRepository.login(user);
        // isLoggingIn/ isLoggedIn 
        this.user = data;
    }

    @asyncAction
    async *logout(){
        const {data,status} = yield userRepository.logout();
        this.user = null;
    }

    @asyncAction
    async *signUp(user){
        const {data,status} = yield userRepository.signup(user);
        this.isSignedUp = true;
        this.isSigningUp = false;
    }

    @asyncAction
    async *loadUser(){
        const {data,status} = yield userRepository.loadUser();
        this.user = data;
    }

    @asyncAction
    async *loadOtherUser(userId){
        const {data,status} = yield userRepository.loadOtherUser();
        this.userInfo = data;
    }

    @asyncAction
    async *addFollow(userId){
        const {data,status} = yield userRepository.addFollow(userId);
        yield this.loadUser();
    }

    @asyncAction *removeFollow(userId){
        const {data,status} = yield userRepository.removeFollow(userId);
        yield this.loadUser();
    }   

    @asyncAction *loadFollowings(userId){
        const {data,status} = yield userRepository.loadFollowings(userId);
        this.followingList = data;
    }

    @asyncAction *loadFollowers(userId){
        const {data,status} = yield userRepository.loadFollowers(userId);
        this.followerList = data;
    }

    @asyncAction *removeFollower(userId){
        const {data,status} = yield userRepository.removeFollower(userId);
        this.loadFollowers(userId);
    }

    @asyncAction *removeFollowing(userId){
        const {data,status} = yield userRepository.removeFollow(userId);
        this.loadFollowings(userId);
    }

    // @action addFollow(userId){
    //     try{
    //         const me = this;
    //         axios.post(`/user/${userId}/follow`,{},{
    //             withCredentials:true,
    //         }).then(res=>{
    //            // const followingList = me.user.Followings;
    //            // me.user.Followings = [{id:res.data}, ...followingList];
    //         });
    //     }catch(e){
    //         console.error(e);
    //     }
    // }

    // @action removeFollow(userId){
    //     try{
    //         const me = this;

    //         axios.delete(`/user/${userId}/follow`,{
    //             withCredentials:true
    //         }).then(res=>{                
    //            // const followingList = me.user.Followings;
    //            // me.user.Followings = followingList.filter(v=>v.id!==res.data);
    //         });
    //     }catch(e){
    //         console.error(e);
    //     }
    // }
}
