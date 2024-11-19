import './App.css';
import StreamReport_c from './StreamReport';
import UserManagement_c from './UserManager';
import Menu_c from './Menu';
import StreamAlerts_c from './StreamAlerts';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

  /* Template to return for the App component */
  return (
    
      

      <div className="container">
        <div className="header">
          <h1>Stream Monitor</h1>
        </div>

        <div className="content">

          {/* UI routes */}
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
                <Route path="/users" element={
                  <>
                    <UserManagement_c />
                    <Menu_c />
                  </>
                  }>
                </Route>


                {/* Alert History */}
                <Route path="/alerts" element={
                  <>
                    <StreamAlerts_c />
                    <Menu_c />
                  </>
                  }> 
                </Route> 
            </Routes>
          </Router>
        {/* The end of the content div */}
        </div>  
      
      
    {/* The end of the container div */}
    </div>
    
  )
}  //App

// export this
export default App;
