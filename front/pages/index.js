import React, { useEffect, useContext } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { observer, MobXProviderContext } from 'mobx-react';

const Home = () => {
   const {userStore,postStore} = useContext(MobXProviderContext);
   const {postList} = postStore;
   const {user} = userStore;
  
  // useEffect(()=>{
  //   postStore.loadMainPosts();
  //   console.log('test');
  // },[]);
  
  console.log(`***postList확인해보기 ${postList.length}`)
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

Home.getInitialProps = async(context)=>{
  context.store.postStore.loadMainPosts();
};

export default observer(Home);