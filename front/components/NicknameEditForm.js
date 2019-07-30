import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { inject, observer } from 'mobx-react';

const NicknameEditForm= ({userStore})=>{
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

export default inject(({store})=>({
    userStore:store.userStore
}))(observer(NicknameEditForm));