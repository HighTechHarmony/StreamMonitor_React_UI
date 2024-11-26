import React, { useState, useEffect } from 'react';
  
  
  // A user consists of a username, password, enabled status, pushover id, and pushover token
  interface User {
    _id: string;
    username: string;
    enabled: string;
    pushover_id: string;
    pushover_token: string;
    password: string;    
  }






  // The user management component
  // Define this object as a type of React functional component
  const UserManagement_c: React.FC = () => {
        // Here we are creating a state variable for the users array (an array of User objects)
        const [Users_s, setUsers] = useState<User[]>([]);
        // and a loading state variable
        const [loading, setLoading] = useState(true);
    
        // This useEffect hook is called when the component is mounted
        useEffect(() => {
            // This function fetches the users from the backend
            const fetchUsers = async () => {
                try {
                    // Fetch the users
                    const response = await fetch('/api/users');
                    // Parse the response as JSON
                    let users: User[] = await response.json();
                    // Set the users state variable
                    setUsers(users);
                    // Set the loading state variable to false
                    setLoading(false);
                } catch (error) {
                    // Log an error if there is one
                    console.error('Error fetching users', error);
                }
            };
    
            // Call the fetchUsers function
            fetchUsers();
    
        }, []);  // End of useEffect


        // This function saves the users on the backend from the state variable
        const saveUsers = async () => {
            try {
                // Send a POST request to the backend with the users
                const response = await fetch('/api/update_users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Users_s)
                });
                // Log the response
                console.log(response);
            } catch (error) {
                // Log an error if there is one
                console.error('Error updating users', error);
            }
        };



        // Return the JSX for the UserManagement component
        return (
            <div>
                <h1>User Management</h1>
                {loading ? <p>Loading...</p> : <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Enabled</th>
                                <th>Pushover ID</th>
                                <th>Pushover Token</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Users_s.map((user) => (
                                <tr key={user._id}>
                                    {/*  Each one of these constructs a temp user object, copies the appropriate new value into it, 
                                    and then updates the state variable  */}
                                    <td id="usernameTD"><input type="text" value={user.username} onChange={(e) => {
                                        // update the state variable with the new username
                                        let newUser = { ...user };
                                        newUser.username = e.target.value;
                                        setUsers(Users_s.map(u => u._id === user._id ? newUser : u));
                                    }} /></td>
                                    <td id="enabledTD"><input type="checkbox" checked={user.enabled === '1'} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.enabled = e.target.checked ? '1' : '0';
                                        setUsers(Users_s.map(u => u._id === user._id ? newUser : u));
                                    }} /></td>
                                    <td id="pushover_idTD"><input type="text" value={user.pushover_id} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.pushover_id = e.target.value;
                                        setUsers(Users_s.map(u => u._id === user._id ? newUser : u));
                                    }} /></td>
                                    <td id="pushover_tokenTD"><input type="text" value={user.pushover_token} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.pushover_token = e.target.value;
                                        setUsers(Users_s.map(u => u._id === user._id ? newUser : u));
                                    }} /></td>
                                    <td id="passwordTD"><input type="text" value={user.password} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.password = "******";
                                        setUsers(Users_s.map(u => u._id === user._id ? newUser : u));
                                    }} /></td>
                                    <td id="actionTD">
                                        {/* <button onClick={() => deleteUser(user)}>Delete</button> */}
                                        <button >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* <button onClick={addUser}>Add User</button> */}
                    <button >Add User</button>
                    <p> </p>
                    <button onClick={saveUsers}>Apply</button>
                </div>}
            </div>
        );
    }

  export default UserManagement_c;