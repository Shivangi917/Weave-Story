import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { signupUser } from '../../Utils/api';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordType, setPasswordType] = useState('password');
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [confirmType, setConfirmType] = useState('password');
  const [confirmIcon, setConfirmIcon] = useState(eyeOff);

  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      setPasswordIcon(eye);
    } else {
      setPasswordType('password');
      setPasswordIcon(eyeOff);
    }
  };

  const toggleConfirmPassword = () => {
    if (confirmType === 'password') {
      setConfirmType('text');
      setConfirmIcon(eye);
    } else {
      setConfirmType('password');
      setConfirmIcon(eyeOff);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (confirmPassword !== password) {
        alert("Passwords do not match!");
        return;
      }
      const { user, token } = await signupUser({ name, email, password });
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

          <div className="relative mb-3">
            <input
              className="p-3 border border-green-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter password"
              type={passwordType}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={togglePassword}
            >
              <Icon icon={passwordIcon} size={20} />
            </span>
          </div>

          <div className="relative mb-3">
            <input
              className="p-3 border border-green-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm password"
              type={confirmType}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={toggleConfirmPassword}
            >
              <Icon icon={confirmIcon} size={20} />
            </span>
          </div>

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
