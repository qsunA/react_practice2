import {observable, computed, action} from 'mobx';
import axios from 'axios';

export default class PostStore{
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

    @computed get posts() {
        console.log(posts);
        return this.postList.values();
    }

    constructor(root){
        this.root = root;
        this.postList.clear();
        this.postList = [
            {img:"https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
            content:"첫번째 게시글 #안녕",
            Comments : [], id:1,
            User : {id:1, nickname:'귤귤'}},
            {img:"https://i.pinimg.com/originals/b5/32/8b/b5328badff604de88cd397df700d1c3a.jpg",
            content:"두번째 게시글 #tag #좋아요",
            Comments : [], id:2,
            User : {id:2, nickname:'Ruby'}}
        ];
    }

    @action createPost(post){
        try{
            const me = this;
            axios.post('/post',post,{
                withCredentials:true
            }).then(res=>{
                me.postList = [res.data, ...me.postList];
                me.imgPaths = [];
            });
        }catch(e){
            console.error(e);
        }        
    }

    @action updatePost(post){

    }

    @action deletePost(post){

    }

    @action createComment(data){
        try{
            axios.post(`/post/${data.postId}/comment`,{
                content:data.content
            },{
                withCredentials:true
            });
        }catch(e){
            log.error(e);
        }
    }

    @action updateComment(comment){

    }

    @action deleteComment(comment){

    }

    @action loadMainPosts(){
        try{
            var me = this;
            axios.get('/posts').then(res=>{
                me.postList = res.data;
            }); 
        }catch(e){
            log.error(e);
        }        
    }

    @action loadUserPosts(id){
        try{
            var me = this;
            console.log(`test`);
            axios.get(`/user/${id}/posts`).then(res=>{
                me.postList = res.data;
            });
        }catch(e){
            log.error(e);
            
        }
    }

    @action loadHashtagMainPosts(tag){
        try{
            var me = this;
            axios.get(`/hashtag/${tag}`).then(res=>{
                me.postList = res.data;
            });
        }catch(e){
            log.error(e);
        }
    }

    @action loadComments(postId){
        try{
            var me = this;
            axios.get(`/post/${postId}/comments`).then(res=>{
                me.comments = res.data;
                me.postId = postId;
            });
        }catch(e){
            log.error(e);
        }
    }

    @action uploadImages(formData){
        const me = this;
        axios.post('/post/images',formData,{
            withCredentials:true
        }).then(res=>{
            me.imgPaths = [...me.imgPaths, ...res.data];
        });
    }

    @action removeImage(idx){
        const me = this;
        me.imgPaths= me.imgPaths.filter((v,i)=>i!==idx);
    }

    @action addLike(postId){
        const me = this;
        axios.post(`/post/${postId}/like`,{},{
            withCredentials:true
        }).then(res=>{
            const postIdx = me.postList.findIndex(v=>v.id===postId);
            const post = me.postList[postIdx];
            const Likers = [{id:res.data.userId}, ...post.Likers];
            const mainPosts = [...me.postList];
            mainPosts[postIdx] = {...post,Likers};
            me.postList = mainPosts;
        });
    }

    @action removeLike(postId){
        const me = this;
        axios.delete(`/post/${postId}/like`,{
            withCredentials:true
        }).then(res=>{
            const postIdx = me.postList.findIndex(v=>v.id===postId);
            const post = me.postList[postIdx];
            const Likers= post.Likers.filter(v=>v.id!==res.data.userId);
            const mainPosts = [...me.postList];
            mainPosts[postIdx] = {...post, Likers};
            me.postList = mainPosts;
        });
    }

    @action addRetweet(postId){
        const me = this;
        axios.post(`/post/${postId}/retweet`,{},{
            withCredentials:true,
        }).then(res=>{
            me.postList = [res.data, ...me.postList];
        })
    }
}