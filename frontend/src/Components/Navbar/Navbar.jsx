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
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-white">StoryNest</Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-pink-300 transition">Home</Link>
          </li>
          {loggedIn ? (
            <>
              <li>
                <Link to="/account" className="hover:text-pink-300 transition">Account</Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-pink-300 transition">Create</Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-pink-300 transition">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-pink-300 transition">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;