import React, { useState, useCallback } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { inject, observer } from 'mobx-react';

export const useInput = (initValue = null) =>{
    const [value, setter] = useState(initValue);
    const handler = useCallback(
        (e) => {
            setter(e.target.value);
        },[]); 

    return [value, handler];
}

const  Signup= ({userStore}) =>{
    const [id,setId] = useState('');
    const [nick,setNick] = useState('');
    const [password,setPassword] = useState('');
    const [passwordChk,setPasswordChk] = useState('');
    const [term,setTerm] = useState(false);
    const [passwordError, setPasswordError]= useState(false);
    const [termError, setTermError]= useState(false);
    const {isSigningUp} = userStore;

    const onSubmit= useCallback((e)=>{
        e.preventDefault();
        if(password!==passwordChk){
            return setPasswordError(true);
        }
        if(!term){
            return setTermError(true);
        }
        const data = {
            userId: id,
            password:password,
            nickname:nick
        }
        userStore.signUp(data);
        console.log({
            id,
            password,
            passwordChk,
            nick,
            term
        });
    },[id,nick,password,passwordChk,term]);
    
    const onChangeId=(e)=>{
        setId(e.target.value);
    };
    
    const onChangeNick=(e)=>{
        setNick(e.target.value);
    };
    
    const onChangePassword=(e)=>{
        setPassword(e.target.value);
    };
    
    const onChangePasswordChk= useCallback((e)=>{
        setPasswordError(e.target.value !==password);
        setPasswordChk(e.target.value);
    },[password]);
    
    const onChangeTerm=useCallback((e)=>{
        setTermError(false);
        setTerm(e.target.checked);
    },[]);
    
    return (
        <>
            <Form onSubmit={onSubmit} style={{padding:10}}>
                <div>
                    <label htmlFor="user-id">아이디</label>
                    <br/>
                    <Input name="user-id" value={id} required onChange={onChangeId}/>
                </div>
                <div>
                    <label htmlFor="user-nick">닉네임</label>
                    <br/>
                    <Input name="user-nick" value={nick} required onChange={onChangeNick}/>
                </div>
                <div>
                    <label htmlFor="user-pass">비밀번호</label>
                    <br/>
                    <Input name="user-pass" value={password} type="password" required onChange={onChangePassword}/>                        
                </div>
                <div>
                    <label htmlFor="user-pass-chk">비밀번호체크</label>
                    <br/>
                    <Input name="user-pass-chk" value={passwordChk} type="password" required onChange={onChangePasswordChk}/>                        
                    {passwordError && <div style={{color:'red'}}>비밀번호가 일치하지 않습니다.</div>}
                </div>
                <div>
                    <Checkbox name="user-term" value={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
                    {termError && <div style={{color:'red'}}>약관에 동의하셔야합니다.</div>}
                </div>
                <div style={{marginTop:10}}>
                    <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
                </div>
            </Form>
        </>  
    );     
};

export default inject(({store})=>({
    userStore : store.userStore
}))(observer(Signup));