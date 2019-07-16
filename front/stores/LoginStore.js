import { observable, action } from "mobx";


export default class LoginStore{
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
        console.log(`this.isLoggedIn 상태 : ${this.isLoggedIn}`);
    }

    @action logout(){

    }
}
