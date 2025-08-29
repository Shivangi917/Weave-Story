import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { loginUser } from '../../Utils/api';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try { 
      const { user, token } = await loginUser({ email, password });
      
      login(user, token);
      
      navigate('/');
    } catch (error) {
      alert("Invalid user credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 text-green-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col pb-2">
          <input
            className="p-3 border border-green-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex'>
            <input
              className="p-3 border border-green-300 rounded-md w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 f"
              placeholder="Enter password"
              type={type}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span class="flex justify-around items-center mb-3" onClick={handleToggle}>
              <Icon class="absolute mr-10" icon={icon} size={25}/>
            </span>
          </div>
          
          <button type="submit" className="bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition">
            Submit
          </button>
        </form>
        <Link to="/signup" className='mx-10'>Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};

export default Login;