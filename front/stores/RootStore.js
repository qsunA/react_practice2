import LoginStore from "./LoginStore";
import PostStore from "./PostStore";

class RootStore{
    constructor(){
        this.loginStore = new LoginStore(this);
        this.postStore = new PostStore(this);
    }
}

export default RootStore;