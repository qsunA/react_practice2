import React from 'react';
import { Card, Avatar } from 'antd';

const UserInfoCom = ({userInfo})=>{
    console.log(`userInfoCom 에서 정보확인:  ${userInfo.Posts}`);
    return(
        <Card
                    actions={[
                        <div key="twit">짹짹<br/>{userInfo.Posts}</div>,
                        <div key="following">팔로잉<br/>{userInfo.Followings}</div>,
                        <div key="follower">짹짹<br/>{userInfo.Followers}</div>,
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
                </Card>
    );
}

export default UserInfoCom;