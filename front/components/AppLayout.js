import React from 'react';
import {Menu, Input, Button, Row, Col, Card, Avatar} from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { observer, inject } from 'mobx-react';

const AppLayout = ({children,user})=>{
    const {isLoggedIn} = user;
    return(
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
                <Menu.Item key="mail">
                    <Input.Search enterButton style={{verticalAlign : 'middle'}}/>
                </Menu.Item>
            </Menu>
            <Row  gutter={8}>
                <Col xs={24} md={6}>
                    {isLoggedIn?
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

export default inject(({store})=>({
    user:store.userStore
}))(observer(AppLayout));