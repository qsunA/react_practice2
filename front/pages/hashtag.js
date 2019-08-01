import PropTypes from 'prop-types';
import PostCard from '../components/PostCard';
import { useEffect, useContext } from 'react';
import { MobXProviderContext, observer } from 'mobx-react';

const Hashtag = ({tag})=>{
    const {postStore}= useContext(MobXProviderContext);
    const {postList} = postStore;
    // useEffect(()=>{        
    //     postStore.loadHashtagMainPosts(tag);
    // },[tag]);
    return(
        <div>
            {postList.map((c,idx)=>(
                <PostCard key={idx} post={c}/>
            ))}
        </div>
    );
};

Hashtag.propTypes = {
    tag: PropTypes.string.isRequired
}

Hashtag.getInitialProps= async(context)=>{// ssr인 경우 getInitialProps에서 필요한 데이터를 미리 넣어준다. 
    const tag= context.query.tag;
    console.log('hashtag getInitialProps',tag);  // 서버로부터 넣어진 값 
    await context.store.postStore.loadHashtagMainPosts(tag);

    return {tag:context.query.tag};
};

export default observer(Hashtag);