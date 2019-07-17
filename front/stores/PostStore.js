import {observable, computed, action} from 'mobx';

export default class PostStore{
    @observable postList = [];
    @observable imgPath = [];

    @computed get posts() {
        console.log(posts);
        return this.postList.values();
    }

    constructor(root){
        this.root = root;
        this.postList.clear();
        this.postList = [
            {img:"https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
            content:"첫번째 게시글",
            User : {id:1, nickname:'귤귤'}},
            {img:"https://i.pinimg.com/originals/b5/32/8b/b5328badff604de88cd397df700d1c3a.jpg",
            content:"두번째 게시글",
            User : {id:2, nickname:'Ruby'}}
        ];
    }

    @action createPost(post){

    }

    @action updatePost(post){

    }

    @action deletePost(post){

    }

}