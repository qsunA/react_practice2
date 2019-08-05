import React, { useEffect, useContext, useCallback, useRef } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { observer, MobXProviderContext } from 'mobx-react';

const Home = () => {
   const {userStore,postStore} = useContext(MobXProviderContext);
   const {postList,hasMorePost} = postStore;
   const {user} = userStore;
   const countRef = useRef([]);

   useEffect(() => {
    window.addEventListener('scroll',onScroll);
     return () => {
      window.removeEventListener('scroll',onScroll)  
     };
   }, [postList.length]);

   const onScroll = useCallback(() =>{
    //console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
    if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight -100){
      if(hasMorePost){
        const lastId = postList[postList.length-1].id;
        if(!countRef.current.includes(lastId)){
          postStore.loadMainPosts(lastId);
        }        
        countRef.current.push(lastId);//lastId를 기억해놓게 하고, lastId가 같으면 요청이 계속 가지 않도록
      }
    }
  },[hasMorePost,postList.length]);
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
  await context.store.postStore.loadMainPosts();  
};

export default observer(Home);