import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header.js';
import Footer from './components/Layout/Footer.js';
import Home from './pages/Home.js';
import Artists from './pages/Artists.js';
import ArtistDetail from './pages/ArtistDetail.js';
import AlbumDetail from './pages/AlbumDetail.js';
import Albums from './pages/Albums.js';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/albums/:id" element={<AlbumDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;