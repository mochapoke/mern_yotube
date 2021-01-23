import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import { Card, Avatar, Col, Typography, Row } from 'antd';

const { Title } = Typography;
const { Meta } = Card;

const SubscriptionPage = () => {
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const subscriptionVariables = {
      userFrom: localStorage.getItem('userId'),
    };

    axios
      .post('/api/video/getSubscriptionVideos', subscriptionVariables)
      .then((res) => {
        if (res.data.success) {
          setVideo(res.data.videos);
        } else {
          alert('비디오 가져오기 실패');
        }
      });
  }, []);

  const rederCards = video.map((video, index) => {
    let hours = Math.floor(video.duration / 60 / 60);
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div key={index}>
        <Col lg={6} md={8} xs={24}>
          <a href={`/video/${video._id}`}>
            <div style={{ position: 'relative' }}>
              <img
                style={{ width: '100%' }}
                src={`http://localhost:5000/${video.thumbnail}`}
                alt='thumbnail'
              />
              <div className='duration'>
                <span>
                  {hours >= 1 ? (
                    <span>
                      {hours}: {minutes} : {seconds}
                    </span>
                  ) : (
                    <span>
                      {minutes} : {seconds}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </a>
          <br />
          <Meta
            avatar={<Avatar src={video.writer.image} />}
            title={video.title}
            description=''
          />
          <span>{video.writer.name}</span>
          <span style={{ marginLeft: '3rem' }}>{video.views} views</span> -
          <span>{moment(video.createAt).format('MMM Do YY')} </span>
        </Col>
      </div>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title levle={2}> Recomended</Title>
      <hr />
      <Row gutter={[32, 16]}>{rederCards}</Row>
    </div>
  );
};

export default SubscriptionPage;
