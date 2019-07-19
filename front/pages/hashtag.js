import PropTypes from 'prop-types';
import PostCard from '../components/PostCard';

const Hashtag = ({tag})=>{
    const mainPosts = [];
    return(
        <div>
            {mainPosts.map(c=>(
                <PostCard key={+c.createdAt} post={c}/>
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

export default Hashtag;