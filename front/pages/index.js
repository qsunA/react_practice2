import React from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { inject, observer } from 'mobx-react';

const Home = ({post,userStore}) => {
  const {postList} = post;
  const {isLoggedIn,user} = userStore;
  console.log(`user.isLoggedIn 상태 변화 감지 가능? ${isLoggedIn}`);
  return (
    <div>
      {user?<div>로그인 했습니다. </div>:<div>로그아웃했습니다.</div>}
      {isLoggedIn&&<PostForm/>}
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