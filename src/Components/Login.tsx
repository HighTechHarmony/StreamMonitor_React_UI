import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login_c: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      // alert('Logged in');
      setLoginSuccess(true);
      const from = (location.state as { from?: string })?.from || '/';
      setTimeout(() => {
        navigate(from);
      }
      , 2000);
      
    } catch (error) {
      // What was the response?
      alert('Login failed');
    }
  };

  // const handleRegister = () => {
  //   navigate('/register');
  // };

  return (
    <>

    <h2>Login</h2>

    {loginSuccess ? (
      <div className="logout-done">
      You have been logged in
      <div className="throbber"></div>
      </div>
    ) : (
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    )}

  </>
  );
};

export default Login_c;
