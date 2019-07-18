import React,{useCallback} from 'react';
import {useInput} from '../pages/signup';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import { inject, observer } from 'mobx-react';

const LoginForm=({userStore}) =>{
    const {isLoggedIn,user,isLoggingIn} = userStore;
    console.log(isLoggedIn);
    const [id,onChangeId] = useInput('');
    const [password,onChangePassword] = useInput('');
    const onSubmitForm = useCallback((e) =>{
        e.preventDefault();
        userStore.login();
    },[id,password]);// 자식 컴포넌트에 넘긴다면 useCallback으로 넘겨준다
    
    return(
        <Form onSubmit={onSubmitForm} style={{padding:'10px'}}> 
            <div>
                <label htmlFor="user-id">아이디</label>
                <br/>
                <Input name="user-id" value={id} onChange={onChangeId} required/>
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br/>
                <Input name="user-password" type="password" value={password} onChange={onChangePassword} required/>
            </div>
            <div style={{marginTop:'10px'}}>
                <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
                <Link href="/signup"><Button>회원가입</Button></Link>
            </div>
        </Form>        
    );
}

export default inject(({store}) =>({
    userStore: store.userStore
}))(observer(LoginForm));