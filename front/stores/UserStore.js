import { observable, action } from "mobx";


export default class UserStore{
    @observable isLoggedIn =false;
    @observable user = {
        userId:'',
        password:''
    };

    constructor(root){
        this.root = root;
    }

    @action login(){
        this.isLoggedIn = true;
        this.user.userId = 'test';
        console.log(`this.isLoggedIn 상태 : ${this.isLoggedIn}`);
    }

    @action logout(){
        this.isLoggedIn = false;
    }
}
