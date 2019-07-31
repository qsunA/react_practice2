import React, { useState, useCallback, useContext } from 'react';
import { Form, Input, Button } from 'antd';
import { MobXProviderContext, observer } from 'mobx-react';

const NicknameEditForm= ()=>{
    const {userStore}= useContext(MobXProviderContext);
    const [editedName, setEditedName]=useState('');
    const {user}= userStore;

    const onEditedNickname = useCallback((e)=>{        
        e.preventDefault();
        userStore.updateNickName(editedName);
    },[editedName]);

    const onChangeNickname = useCallback((e)=>{
        console.log(`${user}`)
        setEditedName(e.target.value);
    },[]);

    return(
        <Form onSubmit={onEditedNickname} 
            style={{marginBottom:'20px', marginTop:'10px', border:'1px solid #d9d9d9', padding:'20px'}}>
            <Input addonBefore="닉네임" value={editedName||(user&&user.nickname)} onChange={onChangeNickname}/>
            <Button type="primary" htmlType="submit">수정</Button>
        </Form>
    );
}

export default observer(NicknameEditForm);