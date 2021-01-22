import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Typography, Button, Form, Input, Icon } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const CategoryOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Auto & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

const VideoUploadPage = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setdescription] = useState('');
  const [isprivate, setIsPrivate] = useState(0);
  const [category, setCategory] = useState('Film & ANimation');

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescriptionChange = (e) => {
    setdescription(e.target.value);
  };
  const onPrivateChange = (e) => {
    setIsPrivate(e.currentTarget.value);
  };
  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
    console.log(e.currentTarget.value);
  };
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    axios.post('/api/video/uploadfiles', formData, config).then((res) => {
      if (res.data.success) {
        console.log(res.data);
      } else {
        alert('비디오 업로드 실패');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onsbumit>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone onDrop={onDrop} multiple>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type='plus' style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>
          <div>
            <img src alt='uploaded thumbnail' />
          </div>
        </div>
        <br />
        <br />

        <label>Title</label>
        <Input onChange={onTitleChange} value={videoTitle} />
        <br />
        <br />

        <label>description</label>
        <TextArea onChange={onDescriptionChange} value={description} />
        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type='primary' size='large' onClick>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default VideoUploadPage;
