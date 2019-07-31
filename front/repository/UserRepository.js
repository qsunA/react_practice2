import axios from 'axios';

class UserRepository{
    URL ="/user";

    constructor(attr){
        Object.assign(this,attr);
    }

    login(user){
        console.log(`login user확인해보기 :: ${this.user}`);
        return axios.post( `${this.URL}/login`,user,{
            withCredentials:true
        });
    }

    logout(){
        return axios.post(`${this.URL}/logout/`,{},{
            withCredentials:true
        })
    }

    signup(user){
        return axios.post(this.URL,{
            userId:user.userId,
            nickname:user.nickname,
            hashedPassword : user.password
        });
    }

    loadUser(){
        return axios.get(this.URL,{
            withCredentials:true
        });
    }

    loadOtherUser(userId){
        return axios.get(`${this.URL}/${userId}`,{
            withCredentials:true
        });
    }

    addFollow(userId){
        return axios.post(`${this.URL}/${userId}/follow`,{},{
            withCredentials:true
        });
    }

    removeFollow(userId){
        return axios.delete(`${this.URL}/${userId}/follow`,{
            withCredentials:true
        });
    }

    loadFollowings(userId){
        return axios.get(`${this.URL}/${userId}/followings`,{
            withCredentials:true
        });
    }

    loadFollowers(userId){
        return axios.get(`${this.URL}/${userId}/followers`,{
            withCredentials:true
        });
    }

    removeFollower(userId){
        return axios.delete(`${this.URL}/${userId}/followers`,{
            withCredentials:true
        });
    }

    updateNickName(userNickName){
        console.log(`userNickname 확인 ${userNickName}`)
        return axios.patch(`${this.URL}/nickname`,{userNickName},{
            withCredentials:true
        });
    }
}

export default new UserRepository();