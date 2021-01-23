import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';

const VideoDetailPage = (props) => {
  const videoID = props.match.params.videoID;
  const variable = { videoID: videoID };
  const [videoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert('비디오 정보 가져오기 실패');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (videoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          MAIN VIDEO
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item actions>
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />
            </List.Item>
          </div>
        </Col>
        <Col lg={6} xs={24}>
          SIDE VIDEO
        </Col>
      </Row>
    );
  } else {
    return <div>loading</div>;
  }
};

export default VideoDetailPage;
