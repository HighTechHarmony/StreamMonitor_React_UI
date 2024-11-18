import React, { useEffect, useState} from 'react';
import './App.css';
import StreamReport_c from './StreamReport';
import UserManagement_c from './UserManager';
import Menu_c from './Menu';
import StreamAlerts_c from './StreamAlerts';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// React functional component
function App() {


  /* Hooks and interfaces go here */


  const console_debug_level = 2;

  
  




  

        
  /* Template to return for the App component */
  return (
    <div>
      <h1>Stream Monitor</h1>

      <Router>
        
      <Routes>

            {/* Dashboard */}
            <Route path="/" element={
              <>
              <StreamReport_c />
              <UserManagement_c />
              <Menu_c />
              </>
            }>
            </Route>

            {/* Stream Management */}
            <Route  path="/streams" element={
              <>
                <StreamReport_c />
                <Menu_c />
              </>
              }>
            
            </Route>

            {/* User Management */}
            <Route  path="/users" element={
              <>
                <UserManagement_c />
                <Menu_c />
              </>
              }>
            </Route>
        </Routes>

      </Router>
      
      

      


      
      
    
      
    </div>
  )
}  //App

// export this
export default App;
