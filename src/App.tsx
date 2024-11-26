import './App.css';
import StreamReport_c from './StreamReport';
import StreamReportImage_c from './StreamReport';
import UserManagement_c from './UserManager';
import Menu_c from './Menu';
import StreamAlerts_c from './StreamAlerts';
import GlobalSettings_c from './GlobalSettings';
import StreamManager_c from './StreamManager';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';


function App() {


  const [isCollapsed, setIsCollapsed] = useState(false);


  /* Template to return for the App component */
  return (
    <div>
      
    
      <div className={`container ${isCollapsed ? 'collapsed' : ''}`}>


        {/* The sidebar, pass the collapsed state variable and function to it */}
        <Menu_c isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* The main content */}

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
