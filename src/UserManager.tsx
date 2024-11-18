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
        const [users, setUsers] = useState<User[]>([]);
        // and a loading state variable
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const response = await fetch('/api/users'); 
                    // The type of the data returned by the fetch is an array of User 
                    const data:User[] = await response.json();
                    setUsers(data);   // Store the fetched users data in the users state variable
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching users', error);
                }
            };
    
            fetchUsers();
        }, []);
    
        if (loading) {
            return <div>Loading...</div>;
        }
    
        return (
            <div id="UserManager">
                <h2>User Management</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Enabled</th>
                            <th>Pushover ID</th>
                            <th>Pushover Token</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                {/* <td>{user.password}</td> */}
                                <td>********</td>
                                <td>{user.enabled}</td>
                                <td>{user.pushover_id}</td>
                                <td>{user.pushover_token}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    
  }  // End of UserManagement component

  export default UserManagement_c;