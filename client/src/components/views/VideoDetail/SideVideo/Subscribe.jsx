import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Subscribe = (props) => {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const variable = { userTo: props.userTo };

    axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
      if (response.data.success) {
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert('구독자 수 정보 가져오기 실패');
      }
    });

    const subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    axios.post('/api/subscribe/subscribed', subscribedVariable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert('정보 받기 실패');
      }
    });
    // eslint-disable-next-line
  }, []);

  const onSubscribe = () => {
    let variable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    if (subscribed) {
      axios.post('/api/subscribe/unsubscribe', variable).then((res) => {
        if (res.data.success) {
          setSubscribeNumber(subscribeNumber - 1);
          setSubscribed(!subscribed);
        } else {
          alert('구독 취소에 실패');
        }
      });
    } else {
      axios.post('/api/subscribe/subscribe', variable).then((res) => {
        if (res.data.success) {
          setSubscribeNumber(subscribeNumber + 1);
          setSubscribed(!subscribed);
        } else {
          alert('구독에 실패');
        }
      });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${subscribed ? '#aaaaaa' : '#cc0000'}`,
          borderRadius: '4px',
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
          border: '0',
        }}
        onClick={onSubscribe}
      >
        {subscribeNumber} {subscribed ? '구독 중' : '구독'}
      </button>
    </div>
  );
};

export default Subscribe;
