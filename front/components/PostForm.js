import React, { useCallback, useState, useContext, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import RootStore from '../stores/RootStore';
import { inject, observer } from 'mobx-react';

const PostForm =({postStore})=>{
  const [text,setText] = useState('');
  const imageInput = useRef();
  const {imgPaths} = postStore;
  const onSubmitForm = useCallback((e)=>{
    e.preventDefault();
    if(!text||!text.trim()){
      return alert('게시글을 작성하세요.')
    }

    const formData = new FormData();
    imgPaths.forEach((i)=>{
      formData.append('image',i);      
    });
    formData.append('content',text);
    postStore.createPost(formData);
  },[text,imgPaths]);

  const onChangeText = useCallback((e) => {
      setText(e.target.value);
    },[]);

  const onClickImageUpload = useCallback(()=>{
    imageInput.current.click();// ref로 잡은 imageInput을 클릭한 효과
  },[imageInput.current]);

  const onChangeImage = useCallback((e)=>{
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files,(f)=>{
      imageFormData.append('image',f);
    });
    postStore.uploadImages(imageFormData);
  },[]);

  const onRemoveImage= useCallback(idx=>()=>{
    postStore.removeImage(idx);
  });
  console.log(`imgPath 확인하기 비었는지 안비었는지 ${imgPaths}`);
  return(
        <Form style={{margin:'10px 0 20px 0'}} encType="multipart/form-data" onSubmit={onSubmitForm}>
            <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 생겼나요?" value={text} onChange={onChangeText}/>
            <div>
            <input type="file" multiple hidden ref={imageInput} onChange={onChangeImage}/>
            <Button onClick={onClickImageUpload}>이미지 업로드</Button>
            <Button type="primary" style={{float: "right"}} htmlType="submit">짹짹</Button>
            </div>
            <div>
              {imgPaths.map((v,i)=>{
                  return(
                  <div key={i} style={{display:'inline-block'}}>
                      <img src={`http://localhost:3065/${v}`} style={{width:'200px'}} alt={v}/>
                      <div>
                      <Button onClick={onRemoveImage(i)}>제거</Button>
                      </div>
                  </div>
                  )
              })}
            </div>
      </Form>
    )
}

export default inject(({store})=>({
  postStore : store.postStore
}))(observer(PostForm));