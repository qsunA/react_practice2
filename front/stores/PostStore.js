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

    @computed get posts() {
        console.log(posts);
        return this.postList.values();
    }

    // constructor(root){
    //     this.root = root;
    //     this.postList.clear();
    //     this.postList = [
    //         {img:"https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
    //         content:"첫번째 게시글 #안녕",
    //         Comments : [], id:1,
    //         User : {id:1, nickname:'귤귤'}},
    //         {img:"https://i.pinimg.com/originals/b5/32/8b/b5328badff604de88cd397df700d1c3a.jpg",
    //         content:"두번째 게시글 #tag #좋아요",
    //         Comments : [], id:2,
    //         User : {id:2, nickname:'Ruby'}}
    //     ];
    // }

    // @action createPost(post){
    //     try{
    //         const me = this;
    //         axios.post('/post',post,{
    //             withCredentials:true
    //         }).then(res=>{
    //             me.postList = [res.data, ...me.postList];
    //             me.imgPaths = [];
    //         });
    //     }catch(e){
    //         console.error(e);
    //     }        
    // }

    @asyncAction 
    async *createPost(post){
        const {data,status} = yield postRepository.createPost(post);
        this.imgPaths = [];
        this.loadMainPosts();
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
    async *loadMainPosts(lastId){
        this.postList = lastId ===0?[]:this.postList;
        this.hasMorePost = lastId ? this.hasMorePost : true;
        console.log(`********* lastId확인하기 ${lastId} ::: ${this.postList.length}`)
        
        const {data,status} = yield  postRepository.loadMainPosts(lastId);
        // data.forEach((val)=>{
        //     this.postList.push(data);
        // });
        this.postList = data;
        this.hasMorePost = data.length --
    }

    @asyncAction 
    async *loadUserPosts(id){
        const {data, status} = yield postRepository.loadUserPosts(id);
        this.postList = data;
        var me = this;
        console.log(`me 확인해보기 ${me}`)
    }

    // @action loadUserPosts(id){
    //     try{
    //         var me = this;
    //         console.log(`test`);
    //         axios.get(`/user/${id}/posts`).then(res=>{
    //             me.postList = res.data;
    //         });
    //     }catch(e){
    //         log.error(e);            
    //     }
    // }

    @asyncAction 
    async *loadHashtagMainPosts(tag){
        const {data,status} = yield postRepository.loadHashtagMainPosts(tag);
        this.postList = data;
    }

    // @action loadHashtagMainPosts(tag){
    //     console.log(`loadHashtag 테스트`)
    //     try{
    //         var me = this;
    //         axios.get(`/hashtag/${tag}`).then(res=>{
    //             me.postList = res.data;
    //         });
    //     }catch(e){
    //         log.error(e);
    //     }
    // }

    // @action loadComments(postId){
    //     try{
    //         var me = this;
    //         axios.get(`/post/${postId}/comments`).then(res=>{
    //             me.comments = res.data;
    //             me.postId = postId;
    //         });
    //     }catch(e){
    //         log.error(e);
    //     }
    // }

    @asyncAction
    async *loadComments(postId){
        const {data,status} = yield postRepository.loadComments(postId);
        this.comments = data;
        this.postId = postId;
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