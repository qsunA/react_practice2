import PropTypes from 'prop-types';
import { useContext } from 'react';
import { MobXProviderContext, observer } from 'mobx-react';
import Helmet from 'react-helmet';

const Post =({id})=>{
    const {postStore} = useContext(MobXProviderContext);
    const {post} = postStore;
    return(
        <>
            <Helmet 
                title={`${post.User.nickname}님의 글`}
                description = {post.content}
                meta={[{
                    name:'description', content : post.content,
                },{
                    property:'og:title', content:`${post.User.nickname}님의 게시글`
                },{
                    property:'og.description', content:post.content
                },{
                    property:'og:image', content:post.Images[0] && `http://localhost:3065/${post.Images[0].src}`
                },{
                    property:'og:url',content:`http://localhost:3001/post/${id}`,
                }]}
            />
            <div itemScope="content">{post.content}</div>
            <div itemScope="author">{post.User.nickname}</div>
            <div>
                {post.Images[0] && <img src={`http://localhost:3065/${post.Images[0].src}`} />}
            </div>
        </>
    )
}

Post.getInitialProps= async (context) =>{
    await context.store.postStore.loadPost(context.query.id);
    return {id:parseInt(context.query.id,10)}
}

Post.propTypes = {
    id:PropTypes.number.isRequired
}

export default observer(Post);