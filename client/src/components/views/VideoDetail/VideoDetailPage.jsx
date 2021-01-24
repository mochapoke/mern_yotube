import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';

import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

const VideoDetailPage = (props) => {
  const [videoDetail, setVideoDetail] = useState([]);
  const [commentList, setCommentList] = useState([]);

  const videoID = props.match.params.videoID;
  const variable = { videoID: videoID };

  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert('비디오 정보 가져오기 실패');
      }
    });

    axios.post('/api/comment/getComments', variable).then((res) => {
      if (res.data.success) {
        setCommentList(res.data.comments);
      } else {
        alert('코멘트 정보 가져오기 실패');
      }
    });
    // eslint-disable-next-line
  }, []);

  const refreshFunction = (newComment) => {
    setCommentList(commentList.concat(newComment));
  };

  if (videoDetail.writer) {
    const subscribeButton = videoDetail.writer._id !==
      localStorage.getItem('userId') && (
      <Subscribe
        userTo={videoDetail.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item actions={[subscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />
            </List.Item>
            <Comment
              refreshFunction={refreshFunction}
              commentList={commentList}
              videoID={videoID}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>loading</div>;
  }
};

export default VideoDetailPage;
