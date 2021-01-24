import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { Comment, Avatar, Button, Input } from 'antd';
const { TextArea } = Input;

const SingleCommnet = (props) => {
  const [openReply, setopenReply] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const user = useSelector((state) => state.user);

  const onClickReplyOpen = () => {
    setopenReply(!openReply);
  };
  const onHandleChange = (e) => {
    setCommentValue(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoID: props.videoID,
      responseTo: props.comment._id,
    };

    axios.post('/api/comment/saveComment', variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result);
        props.refreshFunction(res.data.result);
        setCommentValue('');
      } else {
        alert('코멘트 저장에 실패');
      }
    });
  };

  const actions = [
    <span onClick={onClickReplyOpen} key='comment-basic-reply-to'>
      답글하기
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt='user image' />}
        content={<p>{props.comment.content}</p>}
      />

      {localStorage.getItem('userId') && openReply && (
        <form
          style={{ display: 'flex', marginLeft: '40px' }}
          onSubmit={onSubmit}
        >
          <TextArea
            style={{ width: '100%', borderRadius: '5px', height: '52px' }}
            onChange={onHandleChange}
            value={commentValue}
            placeholder='공개 대댓글 추가...'
          />
          <br />
          <Button onClick={onSubmit} style={{ width: '20%', height: '52px' }}>
            답글
          </Button>
        </form>
      )}
    </div>
  );
};

export default SingleCommnet;
