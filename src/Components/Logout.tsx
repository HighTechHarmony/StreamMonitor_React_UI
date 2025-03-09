import React, {useEffect} from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout_c: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        // alert('Logged out');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after seconds
        }, 2000); 
      } catch (error) {
        alert('Failed to log out');
      }
    };

    handleLogout();
  }, [logout, navigate]);


  // return (
  //   <button onClick={handleLogout}>Logout</button>
  // );
  return (
    <div className="logout-done">
      You have been logged out
      <div className="throbber"></div>
    </div>
  );

};

export default Logout_c;
