import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Create from './Components/Create/Create';

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing loggedInUser:', error);
      return null;
    }
  });

  useEffect(() => {
    if (loggedInUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
}, [loggedInUser]);

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('loggedInUser');
    }
  }, [loggedInUser]);

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route element={<Home loggedIn={loggedIn} />} path='/' />
        <Route element={<Account />} path='/account' />
        <Route element={<Login setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser} />} path='/login' />
        <Route element={<Signup />} path='/signup' />
        <Route element={<Create loggedInUser={loggedInUser} />} path='/create' />
      </Routes>
    </Router>
  );
}

export default App;
