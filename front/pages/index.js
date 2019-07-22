import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { inject, observer } from 'mobx-react';

const Home = ({post,userStore}) => {
  const {postList} = post;
  const {isLoggedIn,user} = userStore;
  
  useEffect(()=>{
    post.loadMainPosts();
  },[]);

  return (
    <div>
      {user?<div>로그인 했습니다. </div>:<div>로그아웃했습니다.</div>}
      {user&&<PostForm/>}
      {postList.map((val,idx)=>{
        return(
          <PostCard key={idx} post={val} />
        )
      })}
    </div>
  );
};

export default inject(({store})=>({
  post: store.postStore,
  userStore : store.userStore
}))(observer(Home));