import React, { useState, useCallback, useEffect } from 'react';
import {Button, Card, Icon, Avatar, Form, Input, List, Comment } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const PostCard = ({post,postStore, userStore})=>{
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const {user} = userStore;
    const {commentAdded,isAddingComment} = postStore;

    const onToggleComment = useCallback(()=>{
        setCommentFormOpened(prev=>!prev);
    },[]);

    const onSubmitComment = useCallback((e)=>{
        if(!user){
            return alert('로그인이 필요합니다.');
        }
        e.preventDefault();
    },[user && user.id]);

    const onChangeCommentText = useCallback((e)=>{
        setCommentText(e.target.value);
    },[]);

    useEffect(()=>{
        setCommentText('');
    },[commentAdded === true]);
    
    return(
        <div>
        <Card
            key={+post.createAt}
            cover={post.img && <img alt="example" src={post.img}/>}
            actions={[
            <Icon type="retweet" key="retweet"/>,
            <Icon type="heart" key="heart"/>,
            <Icon type="message" key="message" onClick={onToggleComment}/>,
            <Icon type="ellipsis" key="ellipsis"/>,
            ]}
            extra={<Button>팔로우</Button>}
        >
            <Card.Meta
            avatar={<Link href={{pathname:'/user',query:{id:post.User.id}}} as={`/user/${post.User.id}`} ><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
            title={post.User.nickname}
            description={(
                <div>
                    {post.content.split(/(#[^\s]+)/g).map((v,idx)=>{
                        if(v.match(/#[^\s]+/)){
                            return(
                                <Link href={{pathname:'/hashtag',query:{tag:v.slice(1)}}} as={`/hashtag/${v.slice(1)}`} key={v}>
                                    <a>{v}</a>
                                </Link>
                            );
                        }
                        return v;
                    })}
                </div>
                )}
            /> 
      </Card>
      {
          commentFormOpened &&
          <>
            <Form onSubmit = {onSubmitComment}>
                <Form.Item>
                    <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
                </Form.Item>
                <Button type="submit" type="primary" loading={isAddingComment}>쨱</Button>
            </Form>
            <List
                header = {`${post.Comments ? post.Comments.length : 0} 댓글`}
                itemLayout = 'horizontal'
                dataSource = {post.Comments || []}
                renderItem = {item =>(
                    <li>
                        <Comment
                            author = {item.User.nickname}
                            avatar = {<Link href={{pathname:'/user',query:{tag:item.User.id}}} as={`/user/${item.User.id}`}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                            content = {item.content}
                        />
                    </li>
                )}

            />
          </>
      }
      </div>
    )    
}

PostCard.propTypes = {
    post: PropTypes.shape({
        user:PropTypes.object,
        content:PropTypes.string,
        img:PropTypes.string,
        createdAt:PropTypes.string
    })
}

export default inject(({store})=>({
    userStore : store.userStore,
    postStore : store.postStore
})) (observer(PostCard));