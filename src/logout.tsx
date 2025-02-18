import React, { useEffect, useState } from 'react';

const Logout_c = () => { 
    const logout = async () => {
        try {
            console.log('Logging out');
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (data.loggedOut) {
                console.log('Logged out');               
                
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    useEffect(() => {
        console.log('Logging out');
        logout();
    }, []);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout_c;
