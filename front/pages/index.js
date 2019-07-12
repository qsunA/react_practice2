import React from 'react';
import { Form, Input, Button, Card, Icon, Avatar } from 'antd';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { inject, observer } from 'mobx-react';

const dummy = {
  isLoggedIn : true,
  imagePath:[],
  mainPosts:[{
    User:{
      id:1,
      nickname:'루비',      
    },
    content:'첫번째 게시글',
    img: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
  }]
}

const Home = ({post}) => {
  return (
    <div>
      {dummy.isLoggedIn&&<PostForm/>}
      {dummy.mainPosts.map((c)=>{
        return(
          <PostCard key={c} post={post} />
        )
      })}
    </div>
  );
};

export default inject(({store})=>({
  post: store
}))(observer(Home));