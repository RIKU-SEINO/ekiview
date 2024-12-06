import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/greet');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <h1>Hello World, Frontend!</h1>
      
      {/* データがある場合に表示 */}
      {data ? (
        <div>
          <h2>Data from Backend:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading data...</p>
      )}

      {/* エラーが発生した場合に表示 */}
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
