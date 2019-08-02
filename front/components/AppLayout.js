import React, { useEffect, useContext } from 'react';
import {Menu, Input, Button, Row, Col, Card, Avatar} from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { observer, inject, MobXProviderContext } from 'mobx-react';
import Router  from 'next/router';

const AppLayout = ({children})=>{

    const {userStore}= useContext(MobXProviderContext);
    const {user} = userStore;

    // 전체적으로 내 정보가 있는지 확인하고 없으면 내 정보를 불러오는 로직을 작성 해줘야한다. 

    // useEffect(()=>{
    //     if(!user){
    //         userStore.loadUser();
    //     }
    // },[]);

    const onSearch = (value) =>{
        Router.push({pathname:'/hashtag',query:{tag:value}},`/hashtag/${value}`);
    }

    return(
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile" prefetch><a>프로필</a></Link></Menu.Item> 
                <Menu.Item key="mail">
                    <Input.Search 
                        enterButton 
                        style={{verticalAlign : 'middle'}}
                        onSearch={onSearch}
                    />
                </Menu.Item>
            </Menu>
            <Row  gutter={8}>
                <Col xs={24} md={6}>
                    {user?
                        <UserProfile/> :
                        <LoginForm/>
                    }
                </Col>
                <Col xs={24} md={12}>{children}</Col>
                <Col xs={24} md={6}></Col>
            </Row>
            
        </div>
    )
}

AppLayout.propTypes = {
    children : PropTypes.node
}

export default observer(AppLayout);