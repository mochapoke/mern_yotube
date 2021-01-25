import React, { useEffect, useState } from 'react';

import SingleComment from './SingleComment';
import key from 'weak-key';

const ReplyComment = (props) => {
  const [childCommentQuantity, setChildCommentQuantity] = useState(0);
  const [toggleReplyComment, setToggleReplyComment] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentList.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
      return commentNumber;
    });
    setChildCommentQuantity(commentNumber);
    // eslint-disable-next-line
  }, [props.commentList]);

  const renderReplyComment = (parentCommentId) =>
    props.commentList.map((comment, idx) => (
      <div>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={comment}
              videoID={props.videoID}
              key={key(comment)}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              parentCommentId={comment._id}
              commentList={props.commentList}
              videoID={props.videoID}
              key={idx}
            />
          </div>
        )}
      </div>
    ));

  const onHandleChange = () => {
    setToggleReplyComment(!toggleReplyComment);
  };

  return (
    <div>
      {childCommentQuantity > 0 && (
        <p
          style={{ fontSize: '14px', margin: 0, color: 'gray' }}
          onClick={onHandleChange}
        >
          {childCommentQuantity}개의 댓글 더 보기
        </p>
      )}

      {toggleReplyComment && renderReplyComment(props.parentCommentId)}
    </div>
  );
};

export default ReplyComment;
