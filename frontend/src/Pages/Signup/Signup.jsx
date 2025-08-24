import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        name,
        email,
        password
      });

      const { user, token } = response.data;
      login(user, token);

      navigate('/');
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 text-green-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col pb-2">
          <input
            className="p-3 border border-green-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="p-3 border border-green-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 border border-green-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition">
            Submit
          </button>
        </form>
        <Link to="/login" className="mx-10">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
