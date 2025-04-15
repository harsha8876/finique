import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // <-- Add error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset previous error

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const data = response.data;

      if (data && data.email && data.firstName !== undefined && data.balance !== undefined) {
        Cookies.set('email', data.email, { expires: 7, path: '/', secure: false, sameSite: 'Lax' });
        Cookies.set('firstName', data.firstName, { expires: 7, path: '/', secure: false, sameSite: 'Lax' });
        Cookies.set('balance', data.balance, { expires: 7, path: '/', secure: false, sameSite: 'Lax' });
        
        navigate('/dashboard');
      } else {
        console.error('Incomplete data from server:', data);
        setError('Login succeeded but user data is incomplete');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
