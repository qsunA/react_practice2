import PropTypes from 'prop-types';
import { Avatar,Card } from 'antd';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import PostCard from '../components/PostCard';
import UserInfoCom from '../components/UserInfoCom';

const User = ({id,userStore,postStore})=>{

    const {userInfo} = userStore;
    const {postList} = postStore;

    console.log(`user확인 : ${Boolean(userInfo)}`);
    useEffect(()=>{
        userStore.loadOtherUser(id);
        postStore.loadUserPosts(id);
    },[]);

    return(
        <div>
            {
                userInfo? 
                <UserInfoCom userInfo={userInfo}/>
                :null
            }
            {postList.map((c, idx)=>(
                <PostCard key={idx} post={c}/>
            ))}
        </div>
    );
};

User.propTypes = {
    id: PropTypes.number.isRequired
}

User.getInitialProps= async(context)=>{// ssr인 경우 getInitialProps에서 필요한 데이터를 미리 넣어준다. 
    console.log('User getInitialProps',context.query.id);  // 서버로부터 넣어진 값 
    return {
        id: parseInt(context.query.id,10)
    }
};

export default inject(({store})=>({
    userStore : store.userStore,
    postStore : store.postStore
})) (observer(User));