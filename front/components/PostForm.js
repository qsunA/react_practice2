import React from 'react';
import { Form, Input, Button } from 'antd';

const dummy = {
    isLoggedIn : true,
    imagePath:[],
    mainPosts:[{
      User:{
        id:1,
        nickname:'루비',      
      },
      content:'첫번째 게시글',
      img: '',
    }]
  }

const PostForm =()=>{
    return(
        <Form style={{margin:'10px 0 20px 0'}} encType="multipart/form-data">
            <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 생겼나요?"/>
            <div>
            <input type="file" multiple hidden/>
            <Button>이미지 업로드</Button>
            <Button type="primary" style={{float: "right"}} htmlType="submit">짹짹</Button>
            </div>
            <div>
            {dummy.imagePath.map((v,i)=>{
                return(
                <div key={i} style={{display:'inline-block'}}>
                    <img src={`http://localhost:3065${v}`} style={{width:'200px'}} alt={v}/>
                    <div>
                    <Button>제거</Button>
                    </div>
                </div>
                )
            })}
            </div>
      </Form>
    )
}

export default PostForm;