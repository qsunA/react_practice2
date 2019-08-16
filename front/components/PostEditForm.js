import React, { useState, useCallback, useContext } from 'react';
import { observer, MobXProviderContext } from 'mobx-react';
import { Form, Input, Button, Card } from 'antd';

const PostEditForm = ({post,clickEvent})=>{
    const {postStore} = useContext(MobXProviderContext);
    const [editText, setEditText] = useState(post.content);

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
        postStore.updatePost(formData);
        console.log(`clickEventclickEventclickEventclickEvent** `)
        clickEvent(post.id);
    },[editText]);


    return(
        <Card key={+post.createAt}>
            <Form onSubmit={onEditSubmitForm}>
                <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 생겼나요?" value={editText} onChange={onChangeEditText}/>
                <div>
                <input type="file" multiple hidden />
                <Button >이미지 업로드</Button>
                <Button type="primary" style={{float: "right"}} htmlType="submit">짹짹</Button>
                </div>
                <div>
                {/* {imgPaths.map((v,i)=>{
                    return(
                    <div key={i} style={{display:'inline-block'}}>
                        <img src={`http://localhost:3065/${v}`} style={{width:'200px'}} alt={v}/>
                        <div>
                        <Button onClick={onRemoveImage(i)}>제거</Button>
                        </div>
                    </div>
                    )
                })} */}
                </div>
            </Form>
        </Card>
    );
}

export default observer(PostEditForm);