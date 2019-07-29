import React, { useEffect, useCallback } from 'react';
import { Form, Input, Button, List, Card, Icon } from 'antd';
import NicknameEditForm from '../components/NicknameEditForm';
import { inject, observer } from 'mobx-react';

const  Profile= ({userStore}) =>{
    const {user,followingList,followerList} =userStore;

    useEffect(()=>{
        if(user){
            userStore.loadFollowings(user.id);
            userStore.loadFollowers(user.id);
        }
    },[user && user.id]);

    const onClickUnFollower = useCallback((userId)=>()=>{
        userStore.removeFollower(userId);
    },[]);

    const onClickUnFollowing = useCallback((userId)=>()=>{
        userStore.removeFollowing(userId);
    },[]);
    
    return (
        <div>
            <NicknameEditForm/>
            <List
                style={{marginBottom:'20px'}}
                grid={{gutter:4, xs:2, md:3}}
                size="small"
                header={<div>팔로워 목록</div>}
                loadMore={<Button style={{width:'100%'}}>더 보기</Button>}
                bordered
                dataSource={followerList}
                renderItem = {item=>(
                    <List.Item style={{marginTop:'20px'}}>
                        <Card actions={[<Icon key="stop" type="stop" onClick={onClickUnFollower(item.id)}/>]}><Card.Meta description={item.nickname}/></Card>
                    </List.Item>
                )}
            />
            <List
                style={{marginBottom:'20px'}}
                grid={{gutter:4, xs:2, md:3}}
                size="small"
                header={<div>팔로잉 목록</div>}
                loadMore={<Button style={{width:'100%'}}>더 보기</Button>}
                bordered
                dataSource={followingList}
                renderItem = {item=>(
                    <List.Item style={{marginTop:'20px'}}>
                        <Card actions={[<Icon key="stop" type="stop" onClick={onClickUnFollowing(item.id)}/>]}><Card.Meta description={item.nickname}/></Card>
                    </List.Item>
                )}
            />
        </div> 
    );     
};

export default inject(({store})=>({
    userStore:store.userStore
}))(observer(Profile));