import React, { useEffect, useState } from 'react';

const Login_c = ({ setToken }: { setToken: (token: string) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const[loading, setLoading] = useState(true);
    // const [token, setToken] = useState();

    const check_login = async () => {
        try {
            const response = await fetch('/api/login_status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setIsLoggedIn(data.isLoggedIn);
            setUsername(data.username);
        } catch (error) {
            console.error('Error checking login', error);        
        } finally {
            setLoading(false); // Set loading to false after the check
        }
    };

    const login = async () => {
        try {
            console.log('Logging in');
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (data.token) {
                console.log("Got token: ", data.token);
                setToken(data.token); // Store the token
                setIsLoggedIn(true);
                setUsername(data.username);
            } else {
                console.error('Login failed');
            }

            console.log('Login status: ', isLoggedIn);
        } catch (error) {
            console.error('Error logging in', error);
        }
    };



    useEffect(() => {
        console.log('Checking login');
        check_login();
        console.log('Login status: ', isLoggedIn);

    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
        
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => { e.preventDefault(); login(); }}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        className="form-control"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        className="form-control"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn" type="submit">Login</button>
            </form>
        </div>
            

            {/* {!isLoggedIn && (
                <div className="login-container">
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); login(); }}>
                        <h2>Login</h2>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                id="username"
                                className="form-control"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn" type="submit">Login</button>
                    </form>
                </div>
            )} */}
            {/* {isLoggedIn && <p className="welcome-message">Welcome, {username}!</p>} */}
        </>
    );
};

export default Login_c;