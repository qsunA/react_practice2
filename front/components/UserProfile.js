import React, { useContext, useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import RootStore from '../stores/RootStore';
import { inject, observer } from 'mobx-react';

const UserProfile = ({userStore})=>{

    const {user} = userStore;

    const onLogout = useCallback(()=>{
        userStore.logout();
    },[]);

    return(
        <div>
            {user&& <Card
            actions={[
                <div key="twit">짹짹<br/>{user.Posts.length}</div>,
                <div key="following">팔로잉<br/>{user.Followings.length}</div>,
                <div key="follower">팔로워<br/>{user.Followers.length}</div>,
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{user.nickname[0]}</Avatar>}
                title={user.nickname}
            />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>}
        </div>
        
    );
}

export default inject(({store})=>({
    userStore:store.userStore
}))(observer(UserProfile));