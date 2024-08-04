import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    
    <div style={{ textAlign: 'center', backgroundColor: '#ffeb3b', height: '100vh' }}>
      <div style={{ padding: '20px' }}>
        <img src={require('./images/logo_wv.png')} alt="Wing Vision" style={{ width: '100px' }} />
      </div>
      <h1>WING VISION</h1>
      <p>Easily upload and detect petrel images (Adults, chicks and eggs) with our AI-powered tool</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
        <div>
          <img src={require("./images/ai_powered.png")} alt="AI-Powered" style={{ width: '300px', height: '200px' }} />
          <p>AI-Powered</p>
        </div>
        <div>
          <img src={require("./images/hpc.jpeg")} alt="Fast Processing" style={{ width: '300px', height: '200px' }} />
          <p>Fast Processing using HPC</p>
        </div>
        <div>
          <img src={require("./images/secure.jpg")} alt="Secure Uploads" style={{ width: '300px', height: '200px' }} />
          <p>Secure and Safe Uploads</p>
        </div>
      </div>
      <Link to="/upload">
        <button class="btn btn-dark" style={{ padding: '10px 20px', fontSize: '16px' }}>GET STARTED</button>
      </Link>
    </div>
  );
}

export default Home;
