import { observable, computed } from "mobx";
import axios from 'axios';
import {asyncAction} from "mobx-utils";
import userRepository from "../repository/UserRepository";
import {BaseStore, getOrCreateStore} from 'next-mobx-wrapper';

axios.defaults.baseURL = 'http://localhost:3065/api';

class UserStore extends BaseStore{
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
    @observable followingCount = 0;
    @observable followerCount = 0;

    @asyncAction
    async *login(usere){
        const {data, status} = yield userRepository.login(usere);
        // isLoggingIn/ isLoggedIn 
        this.user = data;        
        this.followingCount = this.user.Followings.length;
        this.followerCount = this.user.Followers.length;
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
        try{
            const {data,status} = yield userRepository.loadUser();
            var me = this;
            me.user = data;
            me.followingCount = me.user.Followings.length;
            me.followerCount = me.user.Followers.length;
        }catch(e){
            //console.error(e);
        }
        
    }

    @asyncAction
    async *loadOtherUser(userId){
        const {data,status} = yield userRepository.loadOtherUser(userId);
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

    @asyncAction *loadFollowings(userId, offset=0, limit){
        const me = this;
        me.followingList = offset===0 ? []:me.followingList;
        const {data,status} = yield userRepository.loadFollowings(userId,offset,limit);
        me.followingList.push(...data);
    }

    @asyncAction *loadFollowers(userId, offset=0, limit){
        const me = this;
        me.followerList = offset===0 ? []:me.followerList;
        const {data,status} = yield userRepository.loadFollowers(userId,offset,limit);
        me.followerList.push(...data);
    }

    @asyncAction *removeFollower(userId){
        const {data,status} = yield userRepository.removeFollower(userId);
        this.followerList = this.followerList.filter(v=>v.id!==data);
    }

    @asyncAction *removeFollowing(userId){
        const {data,status} = yield userRepository.removeFollow(userId);
        this.followingList = this.followingList.filter(v=>v.id!==data);
    }

    @asyncAction *updateNickName(userNickName){
        const {data,status} = yield userRepository.updateNickName(userNickName);
        this.user.nickname = data;
    }
}

export const getUserStore = getOrCreateStore('userStore',UserStore);