import {observable, computed, action, when} from 'mobx';
import axios from 'axios';
import { BaseStore, getOrCreateStore } from 'next-mobx-wrapper';
import { asyncAction } from 'mobx-utils';
import postRepository from '../repository/PostRepository';

class PostStore extends BaseStore{
    @observable postList = [];
    @observable imgPaths = [];
    @observable addPostErrorReason = ''; //포스트 업로드 실패 사유
    @observable isAddingPost = false; // 포스트 업로드 중 
    @observable postAdded= false;//포스트 업로드 성공
    @observable isAddingComment = false;
    @observable addCommentErrorReason = '';
    @observable commentAdded = false; 
    @observable comments = [];
    @observable postId = null;
    @observable hasMorePost = true;
    @observable numberRequest=0;
    @observable post = null;

    @computed get posts() {
        console.log(posts);
        return this.postList.values();
    }

    @asyncAction 
    async *createPost(post){
        this.postAdded = false;
        const {data,status} = yield postRepository.createPost(post);
        if(status ===200){
            this.imgPaths = [];
            this.loadMainPosts();
            this.postAdded = true
        }        
    }

    @asyncAction
    async *removePost(postId){
        const {data,status} = yield postRepository.removePost(postId);
        this.loadMainPosts();
    }

    @asyncAction 
    async *createComment(comment){
        const {data,status} = yield postRepository.createComment(comment);
        
    }

    @action updateComment(comment){

    }

    @action deleteComment(comment){

    }

    @asyncAction
    async *loadMainPosts(lastId=0 ){
        var me = this;
        this.postList = lastId ===0?[]:this.postList;
        this.hasMorePost = lastId ? this.hasMorePost : true;
        
        const {data,status} = yield  postRepository.loadMainPosts(lastId);
        this.postList = [...this.postList, ...data];
        this.hasMorePost = data.length ===10;
    }

    @asyncAction 
    async *loadUserPosts(id){
        const {data, status} = yield postRepository.loadUserPosts(id);
        this.postList = data;
        var me = this;
    }

    @asyncAction 
    async *loadHashtagMainPosts(tag){
        const {data,status} = yield postRepository.loadHashtagMainPosts(tag);
        this.postList = data;
    }

    @asyncAction
    async *loadComments(postId){
        var me = this;
        
        const {data,status} = yield postRepository.loadComments(postId);
        this.comments = data;
        this.postId = postId;

        const post = this.postList.find(v=>v.id===postId);
        const idx = this.postList.indexOf(post);
        const Comments = [...this.comments,...post.Comments];
        const mainPosts = [...this.postList];
        mainPosts[idx] = {...post,Comments};
        this.postList = mainPosts;

        console.log(`댓글 확인`)
    }

    @asyncAction 
    async *uploadImages(formData){
        const {data,status} = yield postRepository.uploadImages(formData);
        this.imgPaths = [...data, ...this.imgPaths];
    }
    
    @action removeImage(idx){
        const me = this;
        me.imgPaths= me.imgPaths.filter((v,i)=>i!==idx);
    }

    @asyncAction
    async *addLike(postId){
        const me = this;
        const {data,status} = yield postRepository.addLike(postId);
        const postIdx = me.postList.findIndex(v=>v.id===postId);
        const post = me.postList[postIdx];
        const Likers = [{id: data.userId}, ...post.Likers];
        const mainPosts = [...me.postList];
        mainPosts[postIdx] = {...post,Likers};
        me.postList = mainPosts;
    }

    @asyncAction
    async *removeLike(postId){
        const me = this;
        const {data,status} = yield postRepository.removeLike(postId);
        const postIdx = me.postList.findIndex(v=>v.id===postId);
        const post = me.postList[postIdx];
        const Likers= post.Likers.filter(v=>v.id!==data.userId);
        const mainPosts = [...me.postList];
        mainPosts[postIdx] = {...post, Likers};
        me.postList = mainPosts;
    }

    @asyncAction
    async *addRetweet(postId){        
        const {data,status} = yield postRepository.addRetweet(postId);
        this.loadMainPosts();
    }

    @asyncAction
    async *loadPost(postId){
        const {data,status} = yield postRepository.loadPost(postId);
        this.post = data;
    }

    // @action addLike(postId){
    //     const me = this;
    //     axios.post(`/post/${postId}/like`,{},{
    //         withCredentials:true
    //     }).then(res=>{
    //         const postIdx = me.postList.findIndex(v=>v.id===postId);
    //         const post = me.postList[postIdx];
    //         const Likers = [{id:res.data.userId}, ...post.Likers];
    //         const mainPosts = [...me.postList];
    //         mainPosts[postIdx] = {...post,Likers};
    //         me.postList = mainPosts;
    //     });
    // }

    // @action removeLike(postId){
    //     const me = this;
    //     axios.delete(`/post/${postId}/like`,{
    //         withCredentials:true
    //     }).then(res=>{
    //         const postIdx = me.postList.findIndex(v=>v.id===postId);
    //         const post = me.postList[postIdx];
    //         const Likers= post.Likers.filter(v=>v.id!==res.data.userId);
    //         const mainPosts = [...me.postList];
    //         mainPosts[postIdx] = {...post, Likers};
    //         me.postList = mainPosts;
    //     });
    // }

    // @action addRetweet(postId){
    //     const me = this;
    //     axios.post(`/post/${postId}/retweet`,{},{
    //         withCredentials:true,
    //     }).then(res=>{
    //         me.postList = [res.data, ...me.postList];
    //     })
    // }
}

export const getPostStore = getOrCreateStore('postStore',PostStore);