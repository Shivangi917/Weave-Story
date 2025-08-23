import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Create from './Components/Create/Create';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Account />} path="/account" />
        <Route element={<Login />} path="/login" />
        <Route element={<Signup />} path="/signup" />
        <Route element={<Create />} path="/create" />
      </Routes>
    </Router>
  );
}

export default App;
