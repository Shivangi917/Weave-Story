import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log({ name, email, password });

    try {
      await axios.post('http://localhost:3000/api/signup', {
        name,
        email,
        password,
      });

      alert('Signup successful!');
    } catch (error) {
      console.log('Error signing up: ', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          placeholder="Enter name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
