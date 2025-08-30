import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, verifyUser } from '../../Utils/api';
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
  const [validatePassword, setValidatePassword] = useState('');

  const [isSignedUp, setIsSignedUp] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const navigate = useNavigate();

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

      await signupUser({ name, email, password });
      setIsSignedUp(true);
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyUser({ verificationCode });

      alert("Verification successful! Redirecting to login...");
      navigate('/login');
    } catch (error) {
      console.error("Verification error:", error.response?.data || error);
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
              onClick={() => setValidatePassword("Password must include at least one uppercase, one lowercase, one number, and one special character")}
              onBlur={() => setValidatePassword('')}
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
            Sign Up
          </button>
          <p className='text-red-400 text-sm'>{validatePassword}</p>
        </form>

        {isSignedUp && (
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Enter verification code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition duration-200"
            >
              Verify Email
            </button>
          </form>
        )}
        <Link to="/login" className="mx-10">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
