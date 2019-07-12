import React from 'react';
import {Button, Card, Icon, Avatar } from 'antd';
import PropTypes from 'prop-types';

const PostCard = ({post})=>{
    console.log(post);
    return(
        <Card
            key={+post.createAt}
            cover={post.img && <img alt="example" src={post.img}/>}
            actions={[
            <Icon type="retweet" key="retweet"/>,
            <Icon type="heart" key="heart"/>,
            <Icon type="message" key="message"/>,
            <Icon type="ellipsis" key="ellipsis"/>,
            ]}
            extra={<Button>팔로우</Button>}
        >
            <Card.Meta
            avatar={<Avatar>{post.user.nickname[0]}</Avatar>}
            title={post.user.nickname}
            description={post.content}
            />
      </Card>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        user:PropTypes.object,
        content:PropTypes.string,
        img:PropTypes.string,
        createdAt:PropTypes.object
    })
}

export default PostCard;