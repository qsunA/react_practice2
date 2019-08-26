import React, { useContext, useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { MobXProviderContext, observer } from 'mobx-react';
import Link from 'next/link';

const UserProfile = ()=>{

    const {userStore}= useContext(MobXProviderContext);
    const {user} = userStore;
    const onLogout = useCallback(()=>{
        userStore.logout();
    },[]);

    return(
        <div>
            {user&& <Card
            actions={[
                <Link key="twit" href="/profile"><a><div>짹짹<br/>{user.Posts.length}</div></a></Link>,
                <Link href="/profile" key="following"><a><div>팔로잉<br/>{user.Followings.length}</div></a></Link>,
                <Link href="/profile" key="follower"><a><div>팔로워<br/>{user.Followers.length}</div></a></Link>
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

export default observer(UserProfile);