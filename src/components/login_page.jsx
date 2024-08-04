import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://127.0.0.1:8000/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const token = response.data.access_token;
      login(token, username);
      // window.location.href = '/';
      navigate('/');
    } catch (error) {
      console.error('Error response:', error.response);
      setError('Invalid username or password');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <section class=" gradient-custom">
      <div class="container py-5 h-80">
        <div class="row d-flex justify-content-center align-items-center h-80">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card bg-warning text-black" style={{borderRadius: '5rem'}}>
              <div class="card-body p-5 text-center">
        
                <div class="mb-md-5 mt-md-4 pb-5">
        
                  <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                  <p class="text-black mb-5">Please enter your login and password!</p>
                  <form onSubmit={handleSubmit}>
                  <div data-mdb-input-init class="form-outline form-black mb-4">
                    <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" id="typeEmailX" class="form-control form-control-lg" />
                    <label class="form-label" for="typeEmailX">Email</label>
                  </div>
        
                  <div data-mdb-input-init class="form-outline form-black mb-4">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" id="typePasswordX" class="form-control form-control-lg" />
                    <label class="form-label" for="typePasswordX">Password</label>
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="btn btn-outline-light btn-sm position-absolute end-0 translate-middle-y"
                        style={{color: 'black', border: 'none' , top: '45%', right: '5%', transform: 'translateY(-50%)' }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                  </div>
        
                  <p class="small mb-5 pb-lg-2 text-black">Forgot password? - Contact Admin.</p>
                  {error && <div style={{ color: 'red' }}>{error}</div>}
                  <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5 text-black" type="submit">Login</button>
                  </form>
        
                </div>
        
                <div>
                  <p >Don't have an account? - Contact Admin.</p>
                </div>
        
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
  
 
  );
}

export default LoginPage;