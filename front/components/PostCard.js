import React, { useState, useCallback, useEffect, useContext } from 'react';
import {Button, Card, Icon, Avatar, Form, Input, List, Comment, Popover } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { MobXProviderContext, observer } from 'mobx-react';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';

const PostCard = ({post})=>{
    const {userStore,postStore} = useContext(MobXProviderContext);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const {user} = userStore;
    const {commentAdded,isAddingComment} = postStore;
    const liked = user && post.Likers && post.Likers.find(v=>v.id===user.id);


    const onToggleComment = useCallback(()=>{
        setCommentFormOpened(prev=>!prev);
        if(!commentFormOpened){
            postStore.loadComments(post.id);
        }
    },[post&&post.id]);

    const onSubmitComment = useCallback((e)=>{
        if(!user){
            return alert('로그인이 필요합니다.');
        }
        e.preventDefault();
        postStore.createComment({postId:post.id, content : commentText});

    },[user && user.id, commentText]);

    const onChangeCommentText = useCallback((e)=>{
        setCommentText(e.target.value);
    },[]);

    const onToggleLike = useCallback(()=>{
        if(!user){
            return alert('로그인이 필요합니다.!');
        }
        if(liked){
            postStore.removeLike(post.id);
        }else{            
            postStore.addLike(post.id);
        }

    },[user&& user.id, post&& post.id, liked]);

    const onClickRetweet = useCallback(()=>{
        if(!user){
            return alert('로그인이 필요합니다.');
        }

        postStore.addRetweet(post.id);
    },[user&&user.id,post&& post.id]);

    const onClickFollowing = useCallback((userId) =>()=> {
        console.log(`follow test확인`);
        
        userStore.addFollow(userId);
    },[]);

    const onClickUnFollowing = useCallback((userId) => ()=> {        
        userStore.removeFollow(userId);   
    },[]);

    const onClickRemovePost = useCallback((postId)=>()=>{
        postStore.removePost(postId);
    },[]);

    useEffect(()=>{
        setCommentText('');
    },[commentAdded === true]);

    return(
        
        <div>
        <Card
            key={+post.createAt}
            title={post.RetweetId?`${post.User.nickname}님이 리트윗하셨습니다.`:null}
            cover={post.Images&& post.Images[0] && <PostImages images={post.Images}/>}
            actions={[
            <Icon type="retweet" key="retweet" onClick={onClickRetweet}/>,
            <Icon type="heart" key="heart" theme={liked ? 'twoTone' :'outlined'} onClick={onToggleLike}/>,
            <Icon type="message" key="message" onClick={onToggleComment}/>,
            <Popover 
                key="ellipsis" 
                content={(
                    <Button.Group>
                        {user && post.UserId === user.id ?(
                            <>
                                <Button>수정</Button>
                                <Button type="danger" onClick={onClickRemovePost(post.id)}>삭제</Button>
                            </>
                            )
                            :<Button>신고</Button>}
                    </Button.Group>
                )}
            >
                <Icon type="ellipsis" key="ellipsis"/>
            </Popover>,
            ]}
            extra={!user||user.id === post.User.id ? null :
                (
                    user.Followings && user.Followings.some(itm=>itm.id===post.User.id) ? 
                    <Button onClick={onClickUnFollowing(post.User.id)}>언팔로우</Button>
                    :<Button onClick={onClickFollowing(post.User.id)}>팔로우</Button>
                )
            }>
            {
                post.RetweetId && post.Retweet ? (
                    <Card
                        cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images}/>}
                    >
                        <Card.Meta
                        avatar={<Link href={{pathname:'/user',query:{id:post.Retweet.User.id}}} as={`/user/${post.Retweet.User.id}`} ><a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a></Link>}
                        title={post.Retweet.User.nickname}
                        description={<PostCardContent postData={post.Retweet.content}/>}
                        />
                    </Card>                     
                ):(
                    <Card.Meta
                    avatar={<Link href={{pathname:'/user',query:{id:post.User.id}}} as={`/user/${post.User.id}`} ><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content}/>}
                    /> 
                )
            }
            
      </Card>
      {
          commentFormOpened &&
          <>
            <Form onSubmit = {onSubmitComment}>
                <Form.Item>
                    <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText}/>
                </Form.Item>
                <Button htmlType="submit" type="primary" loading={isAddingComment}>쨱</Button>
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

export default observer(PostCard);