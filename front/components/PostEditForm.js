import React, { useState, useCallback, useContext, useRef } from 'react';
import { observer, MobXProviderContext } from 'mobx-react';
import { Form, Input, Button, Card } from 'antd';

const PostEditForm = ({post,clickEvent})=>{
    const {postStore} = useContext(MobXProviderContext);
    const [editText, setEditText] = useState(post.content);
    const imageInput = useRef();
    const {imgPaths} = postStore;

    const onChangeEditText = useCallback((e)=>{
        setEditText(e.target.value);
    },[]);

    const onEditSubmitForm = useCallback((e) => {
        e.preventDefault();
        if(!editText||!editText.trim()){
            return alert('게시글을 작성하세요.')
        }
        const formData = new FormData();
        formData.append('content',editText);
        formData.append('postId',post.id);
        postStore.updatePost(formData, post.id);
        console.log(`clickEventclickEventclickEventclickEvent** `)
        clickEvent();
    },[editText]);

    const onClickImageUpload = useCallback(()=>{
        imageInput.current.click();
    },[imageInput.current]);

    const onChangeImage = useCallback((e)=>{
        const imageFormData = new FormData();
        [].forEach.call(e.target.files,(f)=>{
            imageFormData.append('image',f);
        });
        postStore.uploadImages(imageFormData);
    },[]);

    const onRemoveImage = useCallback(idx=>()=>{
        postStore.removeImage(idx);
    });


    return(
        <Card key={+post.createAt}>
            <Form onSubmit={onEditSubmitForm}>
                <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 생겼나요?" value={editText} onChange={onChangeEditText}/>
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
        </Card>
    );
}

export default observer(PostEditForm);