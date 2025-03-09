import React from 'react';
import './App.css';
// import StreamReport_c from './Components/StreamReport';
import StreamReport_c from './Components/StreamReport';
import UserManagement_c from './Components/UserManager';
import Menu_c from './Components/Menu';
import StreamAlerts_c from './Components/StreamAlerts';
import GlobalSettings_c from './Components/GlobalSettings';
import StreamManager_c from './Components/StreamManager';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext'
import Login_c from './Components/Login';
import Logout_c from './Components/Logout';
import Register_c from './Components/Register';


function App() {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  /* Template to return for the App component */
  return (
    <div className="App">
      <div className={`container ${isCollapsed ? 'collapsed' : ''}`}>

        {/* The sidebar, pass the collapsed state variable and function to it */}
        <Menu_c isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* The header */}

        <div className="header">
              <h1>Stream Monitor</h1>                            
        </div>

        <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>

          <AuthProvider>
            {/* UI routes */}
            <Router>
              <Routes>
                  
                 
                  {/* Dashboard */}
  
                  <Route path="/login" element={<Login_c />} />
                  {/* <Route path="/register" element={<Register_c />} /> */}
                  <Route path="/" element={<ProtectedRoute component={StreamReport_c} />} />
                  <Route path="/streams" element={<ProtectedRoute component={StreamManager_c} />} />
                  <Route path="/users" element={<ProtectedRoute component={UserManagement_c} />} />
                  <Route path="/alerts" element={<ProtectedRoute component={StreamAlerts_c} />} />
                  {/* Add other routes here */}
  
                  {/* Global Settings */}
                  <Route path="/settings" element={
                    <>
                      <GlobalSettings_c />
                      {/* <Menu_c /> */}
                    </>
                    }>
                  </Route>
  
                  {/* Logout */}
                  <Route path="/logout" element={
                    <>
                      <Logout_c />
                    </>
                  }>
                  </Route>
                  
                  
  
              </Routes>
            </Router>
          </AuthProvider>
        {/* The end of the content div */}
        </div>  
      
      
    {/* The end of the container div */}
    </div>
    </div>
  )
}  //App


const ProtectedRoute = ({ component: Component }: { component: React.FC }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading user data...</div>;
  }
  // console.log("ProtectedRoute user: ", user);
  return user ? <Component /> : <Navigate to="/login" />;
};


export default App;
