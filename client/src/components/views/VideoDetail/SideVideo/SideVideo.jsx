import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SideVideo = () => {
  const [sideVideos, setSideVideos] = useState([]);
  useEffect(() => {
    axios.get('/api/video/getVideos').then((res) => {
      if (res.data.success) {
        setSideVideos(res.data.videos);
      } else {
        alert('비디오 가져오기 실패');
      }
    });
  }, []);

  const renderCards = sideVideos.map((video, index) => {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        style={{
          display: 'flex',
          marginBottom: '1rem',
          padding: '0 2rem',
        }}
        key={index}
      >
        <div
          style={{ width: '40%', marginBottom: '1rem', marginRight: '1rem' }}
        >
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: '100%', height: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt='thumbnail'
            />
          </a>
        </div>
        <div
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            color: 'gray',
            lineHeight: '15px',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'black', marginTop: '0' }}>
            {video.title}
          </span>
          <span>{video.writer.name}</span>
          <span>{video.views} views</span>
          <span>
            {minutes} : {seconds}
          </span>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ marginTop: '3rem' }}>{renderCards}</div>
    </>
  );
};

export default SideVideo;
