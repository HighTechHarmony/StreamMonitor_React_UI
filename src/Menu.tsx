import React from "react";

// React functional component
const Menu_c: React.FC = () => {

    // We need a function that will toggle the menu when the menu button is clicked
    function toggleMenu() {
        const sidebar: HTMLElement | null = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
      }

      
    return (
        // <div id="Menu">
        //     <ul>
        //         <li><a href="/">Dashboard</a></li>
        //         <li><a href="/streams">Modify Streams</a></li>
        //         <li><a href="/users">Modify Users</a></li>
        //         <li><a href="/alerts">Alert History</a></li>
        //         <li><a href="/logout">Logout</a></li>
        //     </ul>
        // </div>


        
            <div className="sidebar" id="sidebar">
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