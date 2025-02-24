import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedIn, loggedIn, setLoggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try { 
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });

      alert('Log in successful');

      const user = response.data.user;
      setLoggedIn(true);
      setLoggedInUser(user);
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      navigate('/');
    } catch (error) {
      console.log("Error logging in: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
