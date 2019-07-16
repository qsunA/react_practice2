import {observable} from 'mobx';

export default class PostStore{
    @observable img="";
    @observable content = "";
    @observable user ={
        id:0,
        nickname:""
    };

    constructor(root){
        this.root = root;
        this.img = "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726";
        this.content = "게시글 게시글";
        this.user = {
            id : 1,
            nickname : '루비'
        }       
    }
}