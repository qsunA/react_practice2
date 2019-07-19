import PropTypes from 'prop-types';
import { Avatar,Card } from 'antd';

const User = ({id})=>{
    const mainPosts = [];
    const userInfo = {};
    return(
        <div>
            {
                userInfo? 
                <Card
                    actions={[
                        <div key="twit">짹짹<br/>{userInfo.Post.length}</div>,
                        <div key="following">팔로잉<br/>{userInfo.Followings.length}</div>,
                        <div key="follower">짹짹<br/>{userInfo.Follwers.length}</div>,
                    ]}
                >
                    <Card.Meta
                        avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                        title={userInfo.nickname}
                    />
                </Card>
                : null
            }
            {mainPosts.map(c=>(
                <PostCard key={+c.createdAt} post={c}/>
            ))}
        </div>
    );
};

User.propTypes = {
    id: PropTypes.number.isRequired
}

User.getInitialProps= async(context)=>{// ssr인 경우 getInitialProps에서 필요한 데이터를 미리 넣어준다. 
    console.log('User getInitialProps',context.query.id);  // 서버로부터 넣어진 값 
    return {
        id: parseInt(context.query.id,10)
    }
};

export default User;