import React, { useState, useEffect } from 'react';
  
  
  // A user consists of a username, password, enabled status, pushover id, and pushover token
  interface User {
    _id?: string;
    userId: string;
    username: string;
    enabled: string;
    pushover_id: string;
    pushover_token: string;
    password?: string;
  }

  // The user management component
  // Define this object as a type of React functional component
  const UserManagement_c: React.FC = () => {
        // Here we are creating a state variable for the users array (an array of User objects)
        const [Users_s, setUsers] = useState<User[]>([]);
        const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
        const [confirmPasswords, setConfirmPasswords] = useState<{ [key: string]: string }>({});
        const [passwordChanged, setPasswordChanged] = useState<{ [key: string]: boolean }>({});
        const [newUserRow, setNewUserRow] = useState<boolean>(false);
        const [usersToDelete, setUsersToDelete] = useState<User[]>([]);
        const [loading, setLoading] = useState(true);
    
        // This useEffect hook is called when the component is mounted
        useEffect(() => {
            // This function fetches the users from the backend
            const fetchUsers = async () => {
                try {
                    // Fetch the users
                    const response = await fetch('/protected/api/users');
                    let data = await response.json();
                    let users: User[] = Array.isArray(data) ? data : [];
                    setUsers(users);

                    // Extract passwords and store them in the passwords state variable
                    const passwords = users.reduce((acc, user) => {
                        if (user.password) {
                            acc[user.userId] = user.password;
                            // eliminate the password field from the user object
                            delete user.password;
                        } else {
                            acc[user.userId] = '';
                        }
                        return acc;
                    }, {} as { [key: string]: string });
  
                    setPasswords(passwords);
                    setLoading(false);
                } catch (error) {
                    // Log an error if there is one
                    console.error('Error fetching users', error);
                }
            };
    
            // Call the fetchUsers function
            fetchUsers();
    
        }, []);  // End of useEffect

        // Stores the new passwords and user data in state variables
        const handlePasswordChange = (userId: string, value: string) => {
            setPasswords({ ...passwords, [userId]: value });
            setPasswordChanged({ ...passwordChanged, [userId]: true });
            console.log ("handlePasswordChange(): userId: ", userId, " value: ", value);
            // setUsers(Users_s.map(u => u._id === userId ? { ...u, password: value } : u));
          };
        
        
        // Stores the new confirm passwords in state variables
        const handleConfirmPasswordChange = (userId: string, value: string) => {
        setConfirmPasswords({ ...confirmPasswords, [userId]: value });
        };
    
        const isPasswordValid = (userId: string) => {            
            for (const password in passwords) {
                if (passwords[password] === confirmPasswords[userId]) {
                    // console.log("isPasswordValid(): Passwords match");
                }
            }
            return passwords[userId] === confirmPasswords[userId];
        };

        const validateAllPasswords = () => {
            // Return a single boolean indicating whether all changed passwords are valid
            if (Users_s.every(user => !passwordChanged[user.userId] || isPasswordValid(user.userId)))
            {
                // console.log("validateAllPasswords(): All changed passwords are valid");
                return true;
            }
            else
            { 
                // console.log("validateAllPasswords(): Not all changed passwords are valid");
                return false;}
            
        };



        // Function to add a new user
        const handleAddUser = () => {
            if (newUserRow) {
                return;
            }
            const newUser: User = {
            userId: Date.now().toString(), // Generate a unique ID for the new user
            username: '',
            enabled: '0',
            pushover_id: '',
            pushover_token: '',
            };
            setUsers([...Users_s, newUser]);
            setPasswords({ ...passwords, [newUser.userId]: '' });
            setConfirmPasswords({ ...confirmPasswords, [newUser.userId]: '' });
            setPasswordChanged({ ...passwordChanged, [newUser.userId]: false });
            setNewUserRow(true);
        };

        // Function adds the user to the usersToDelete state array
        const handleDeleteUser = (user: User) => {
            setUsers(Users_s.filter(u => u.userId !== user.userId));
            delete passwords[user.userId];
            delete confirmPasswords[user.userId];
            delete passwordChanged[user.userId];
            setUsersToDelete([...usersToDelete, user]);
        };

        // This function saves the users on the backend from the state variable
        const saveUsers = async () => {
            try {
              // Create a new array of users where the password field is included only if it has been changed
              const modifiedUsers = Users_s.map(user => {
                if (passwordChanged[user.userId]) {
                    console.log("saveUsers(): Password changed for user: ", user.userId);
                    return { ...user, password: passwords[user.userId] };
                }                
                return user;
              });

            //   console.log("saveUsers(): modifiedUsers: ", modifiedUsers);
        
              // Send a POST request to the backend with the modified users
              const response = await fetch('/protected/api/update_users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(modifiedUsers)
              });
              if (!response.ok) {
                alert("Failed to update users");
              }  
              console.log(response);

              // Make a secondary API call to delete users
            await Promise.all(usersToDelete.map(async (user) => {
                const deleteResponse = await fetch('/protected/api/delete_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user.userId })
                });
                if (!deleteResponse.ok) {
                alert(`Failed to delete user ${user.username}`);
                }
                console.log(`Deleted user ${user.username}`);
            }));

            } catch (error) {
              alert("Failed to update users");
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
                                <th>Row Actions</th>
                                <th>Username</th>
                                <th>Enabled</th>
                                <th>Pushover ID</th>
                                <th>Pushover Token</th>
                                <th>Password</th>
                                <th>Confirm (New) Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Users_s.map((user) => (
                                <tr key={user.userId}>
                                    {/*  Each one of these constructs a temp user object, copies the appropriate new value into it, 
                                    and then updates the state variable  */}
                                    <td id="actionTD">
                                        {/* <button onClick={() => deleteUser(user)}>Delete</button> */}
                                        <button onClick={() => handleDeleteUser(user)} >Delete</button>
                                    </td>
                                    <td id="usernameTD"><input type="text" value={user.username} onChange={(e) => {
                                        // update the state variable with the new username
                                        let newUser = { ...user };
                                        newUser.username = e.target.value;
                                        setUsers(Users_s.map(u => u.userId === user.userId ? newUser : u));
                                    }} /></td>
                                    <td id="enabledTD"><input type="checkbox" checked={user.enabled === '1'} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.enabled = e.target.checked ? '1' : '0';
                                        setUsers(Users_s.map(u => u.userId === user.userId ? newUser : u));
                                    }} /></td>
                                    <td id="pushover_idTD"><input type="text" value={user.pushover_id} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.pushover_id = e.target.value;
                                        setUsers(Users_s.map(u => u.userId === user.userId ? newUser : u));
                                    }} /></td>
                                    <td id="pushover_tokenTD"><input type="text" value={user.pushover_token} onChange={(e) => {
                                        let newUser = { ...user };
                                        newUser.pushover_token = e.target.value;
                                        setUsers(Users_s.map(u => u._id === user._id ? newUser : u));
                                    }} 
                                    />
                                    </td>
                                    <td id="passwordTD">
                                        <input 
                                        type="password"
                                        value={passwords[user.userId] || ''}
                                        onChange={(e) => handlePasswordChange(user.userId, e.target.value)}
                                        style={{ borderColor: passwordChanged[user.userId] && !isPasswordValid(user.userId) ? 'red' : '' }}
                                    />
                                    </td>
                                    <td id="confirmPasswordTD">
                                    <input
                                        type="password"
                                        value={confirmPasswords[user.userId] || ''}
                                        onChange={(e) => handleConfirmPasswordChange(user.userId, e.target.value)}
                                        style={{ borderColor: passwordChanged[user.userId] && !isPasswordValid(user.userId) ? 'red' : '' }}
                                    />
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <button  onClick={handleAddUser} >Add User</button>
                    <p> </p>
                    <button disabled={!validateAllPasswords()} onClick={saveUsers}>Apply</button>
                </div>}
            </div>
        );
    }

  export default UserManagement_c;