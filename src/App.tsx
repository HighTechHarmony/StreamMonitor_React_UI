import './App.css';
import StreamReport_c from './StreamReport';
import StreamReportImage_c from './StreamReport';
import UserManagement_c from './UserManager';
import Menu_c from './Menu';
import StreamAlerts_c from './StreamAlerts';
import GlobalSettings_c from './GlobalSettings';
import StreamManager_c from './StreamManager';
import LoginLogout_c from './login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login_c from './login';
import Logout_c from './logout';


function App() {


  const [isCollapsed, setIsCollapsed] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  const handleSetToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    console.log("Token set to: ", newToken);
  };

  // When the app loads, check if there is a token in local storage
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setToken(token);
          console.log("Token found in local storage: ", token);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    checkToken();
  }, []);

  if (!token) {
    console.log("No token, rendering login component");
    return <LoginLogout_c setToken={handleSetToken} />;
  }



  /* Template to return for the App component */
  return (
    <div className="App">
      
    
      <div className={`container ${isCollapsed ? 'collapsed' : ''}`}>


        {/* The sidebar, pass the collapsed state variable and function to it */}
        <Menu_c isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* The main content */}


        {/* The header */}

        <div className="header">
              <h1>Stream Monitor</h1>              
        </div>

        <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>



          {/* UI routes */}
          <Router>
            <Routes>
                {/* Dashboard */}
                <Route path="/" element={
                  <>
                  <StreamReportImage_c />
                  {/* <StreamReport_c />                   */}
                  {/* <Menu_c /> */}
                  </>
                  }>
                </Route>


                {/* Stream Management */}
                <Route  path="/streams" element={
                  <>
                    <StreamManager_c />
                    {/* <Menu_c /> */}
                  </>
                  }>
                </Route>


                {/* User Management */}
                <Route path="/users" element={
                  <>
                    <UserManagement_c />
                    {/* <Menu_c /> */}
                  </>
                  }>
                </Route>


                {/* Alert History */}
                <Route path="/alerts" element={
                  <>
                    <StreamAlerts_c />
                    {/* <Menu_c /> */}
                  </>
                  }> 
                </Route> 


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
        {/* The end of the content div */}
        </div>  
      
      
    {/* The end of the container div */}
    </div>
    </div>
  )
}  //App

// export this
export default App;
