import React, { useCallback, useContext } from 'react';
import { Button, List, Card, Icon } from 'antd';
import NicknameEditForm from '../components/NicknameEditForm';
import { MobXProviderContext, observer } from 'mobx-react';

const  Profile= () =>{
    const {userStore}= useContext(MobXProviderContext);
    const {user,followingList,followerList,followingCount,followerCount} =userStore;

    const onClickUnFollower = useCallback((userId)=>()=>{
        userStore.removeFollower(userId);
    },[]);

    const onClickUnFollowing = useCallback((userId)=>()=>{
        userStore.removeFollowing(userId);
    },[]);

    const onClickLoadMoreFollowers = useCallback(()=>{
        userStore.loadFollowers(user.id,followerList.length);
    },[user && user.id]);

    const onClickLoadMoreFollowings = useCallback(()=>{
        userStore.loadFollowings(user.id,followingList.length);
    },[user && user.id]);

    console.log(`test`)
    
    return (
        <div>
            <NicknameEditForm/>
            <List
                style={{marginBottom:'20px'}}
                grid={{gutter:4, xs:2, md:3}}
                size="small"
                header={<div>팔로워 목록</div>}
                loadMore={(followerCount> followerList.length)&& <Button style={{width:'100%'}} onClick={onClickLoadMoreFollowers} >더 보기</Button>}
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
                loadMore={(followingCount > followingList.length) && <Button style={{width:'100%'}} onClick={onClickLoadMoreFollowings}>더 보기</Button>}
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

Profile.getInitialProps=async(context)=>{
    const {user} = context.store.userStore;
    await context.store.userStore.loadFollowings(user.id);
    await context.store.userStore.loadFollowers(user.id);    
}

export default observer(Profile);