import PropTypes from 'prop-types';
import PostCard from '../components/PostCard';
import { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

const Hashtag = ({tag,postStore})=>{
    const {postList} = postStore;
    useEffect(()=>{        
        postStore.loadHashtagMainPosts(tag);
    },[tag]);
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
    console.log('hashtag getInitialProps',context.query.tag);  // 서버로부터 넣어진 값 
    return {tag:context.query.tag};
};

export default inject(({store})=>({
    postStore : store.postStore
})) (observer(Hashtag));