import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProtectedData: React.FC = () => {
  const [data1, setData1] = useState<string>('');
  const [data2, setData2] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:5000/protected/api/users', { withCredentials: true })
      .then((response: { data: string }) => setData1(response.data))
      .catch(() => setData1('Unauthorized'));

    axios.get('http://localhost:5000/protected/api/stream_configs', { withCredentials: true })
      .then((response: { data: string }) => setData2(response.data))
      .catch(() => setData2('Unauthorized'));
  }, []);

  return (
    <div>
      <h2>Protected Data 1</h2>
      <p>{data1}</p>
      <h2>Protected Data 2</h2>
      <p>{data2}</p>
    </div>
  );
};

export default ProtectedData;
