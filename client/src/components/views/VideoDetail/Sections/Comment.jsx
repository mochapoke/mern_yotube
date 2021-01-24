import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const Comment = (props) => {
  const user = useSelector((state) => state.user);
  const [commentValue, setCommentValue] = useState('');

  const handleClick = (e) => {
    setCommentValue(e.target.value);
  };

  const onSubmitEvent = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      videoID: props.videoID,
    };

    axios.post('/api/comment/saveComment', variables).then((res) => {
      if (res.data.success) {
        props.refreshFunction(res.data.result);
        setCommentValue('');
      } else {
        alert('코멘트 저장에 실패');
      }
    });
  };

  return (
    <div>
      <br />
      <p>댓글</p>
      <hr />

      {props.commentList &&
        props.commentList.map(
          (comment, idx) =>
            !comment.responseTo && (
              <React.Fragment>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  videoID={props.videoID}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                  commentList={props.commentList}
                  videoID={props.videoID}
                />
              </React.Fragment>
            )
        )}

      {localStorage.getItem('userId') && (
        <form style={{ display: 'flex' }} onSubmit={onSubmitEvent}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={handleClick}
            value={commentValue}
            placeholder='댓글 추가...'
          />
          <button type='submit'>submit</button>
        </form>
      )}
    </div>
  );
};

export default Comment;
