import React, { useContext } from 'react';
import { Card, Avatar } from 'antd';
import RootStore from '../stores/RootStore';
import { inject, observer } from 'mobx-react';

const dummy = {
    nickname:'ruby',
    Post :[],
    Followings:[],
    Follwers:[],
    isLoggedIn: false
 }

const UserProfile = ({userStore})=>{

    console.log(` store 확인 : ${userStore}`);
    const me = userStore.user;
    return(
        <Card
            actions={[
                <div key="twit">짹짹<br/>{me.Post.length}</div>,
                <div key="following">팔로잉<br/>{me.Followings.length}</div>,
                <div key="follower">짹짹<br/>{me.Follwers.length}</div>,
            ]}
        >
            <Card.Meta
                avatar={<Avatar>{me.nickname[0]}</Avatar>}
                title={me.nickname}
            />
        </Card>
    );
}

export default inject(({store})=>({
    userStore:store.userStore
}))(observer(UserProfile));