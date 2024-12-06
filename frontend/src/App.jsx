import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import Contributer from './pages/Contributer';

const App = () => {
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
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/contributer" element={<Contributer />} />
        <Route path="/"
          element={
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
          }
        />
      </Routes>
    </Router>
  )
}

export default App;
