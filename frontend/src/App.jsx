import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import Contributor from './pages/Contributor';
import QrcodeReader from './pages/QrcodeReader';
import RouteResultPage from './pages/RouteResultPage';
import NotFound from './pages/NotFound';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/contributor" element={<Contributor />} />
        <Route path="/route" element={<RouteResultPage />} />
        <Route path="/qrcodereader" element={<QrcodeReader />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App;