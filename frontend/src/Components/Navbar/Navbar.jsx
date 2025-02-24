import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn'); 
    navigate('/');
  };

  return (
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        {loggedIn ? (
          <>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/create">Create</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
