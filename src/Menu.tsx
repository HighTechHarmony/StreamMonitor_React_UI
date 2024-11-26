import React, { useState } from 'react';

// React functional component
// Takes the isCollapsed state variable and the setIsCollapsed function as props
interface MenuProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

// Menu component
const Menu_c: React.FC<MenuProps> = ({ isCollapsed, setIsCollapsed }) => {

    // We need a function that will toggle the menu when the menu button is clicked
    function toggleMenu() {
        const sidebar: HTMLElement | null = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
            setIsCollapsed(!isCollapsed);
        }
      }

      
    return (
        
            // <div className="sidebar" id="sidebar">
            <div id="sidebar" className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="menu-button" onClick={() => toggleMenu()}>☰</div>
                <ul className="menu">
                <li className="menu-item"><a href="/">Dashboard</a></li>
                <li className="menu-item"><a href="/streams">Modify Streams</a></li>
                <li className="menu-item"><a href="/users">Modify Users</a></li>
                <li className="menu-item"><a href="/alerts">Alert History</a></li>
                <li className="menu-item"><a href="/settings">System Settings</a></li>
                <li className="menu-item"><a href="/logout">Logout</a></li>
                </ul>
            </div>

        

    )

    
}  //Menu


export default Menu_c;