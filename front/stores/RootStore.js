import UserStore from "./UserStore";
import PostStore from "./PostStore";

class RootStore{
    constructor(){
        this.userStore = new UserStore(this);
        this.postStore = new PostStore(this);
    }
}

export default RootStore;