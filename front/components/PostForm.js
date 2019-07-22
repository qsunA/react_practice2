import React, { useCallback, useState, useContext } from 'react';
import { Form, Input, Button } from 'antd';
import RootStore from '../stores/RootStore';
import { inject, observer } from 'mobx-react';

const PostForm =({postStore})=>{
  const [text,setText] = useState('');
  const onSubmitForm = useCallback((e)=>{
    e.preventDefault();
    if(!text||!text.trim()){
      return alert('게시글을 작성하세요.')
    }
    postStore.createPost(text.trim());
  },[text]);

  const onChangeText = useCallback((e) => {
      setText(e.target.value);
    },[]);

    return(
        <Form style={{margin:'10px 0 20px 0'}} encType="multipart/form-data" onSubmit={onSubmitForm}>
            <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 생겼나요?" value={text} onChange={onChangeText}/>
            <div>
            <input type="file" multiple hidden/>
            <Button>이미지 업로드</Button>
            <Button type="primary" style={{float: "right"}} htmlType="submit">짹짹</Button>
            </div>
            <div>
            {/* {dummy.imagePath.map((v,i)=>{
                return(
                <div key={i} style={{display:'inline-block'}}>
                    <img src={`http://localhost:3065${v}`} style={{width:'200px'}} alt={v}/>
                    <div>
                    <Button>제거</Button>
                    </div>
                </div>
                )
            })} */}
            </div>
      </Form>
    )
}

export default inject(({store})=>({
  postStore : store.postStore
}))(observer(PostForm));