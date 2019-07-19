import {observable, computed, action} from 'mobx';

export default class PostStore{
    @observable postList = [];
    @observable imgPath = [];
    @observable addPostErrorReason = ''; //포스트 업로드 실패 사유
    @observable isAddingPost = false; // 포스트 업로드 중 
    @observable postAdded= false;//포스트 업로드 성공
    @observable isAddingComment = false;
    @observable addCommentErrorReason = '';
    @observable commentAdded = false; 

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

    }

    @action updatePost(post){

    }

    @action deletePost(post){

    }

    @action createComment(comment){

    }

    @action updateComment(comment){

    }

    @action deleteComment(comment){

    }

    @action loadMainPosts(){

    }

}