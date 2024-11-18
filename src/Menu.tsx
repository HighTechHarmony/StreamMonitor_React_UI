import React from "react";

// React functional component
const Menu_c: React.FC = () => {
    return (
        <div id="Menu">
            <ul>
                <li><a href="/">Dashboard</a></li>
                <li><a href="/streams">Modify Streams</a></li>
                <li><a href="/users">Modify Users</a></li>
                <li><a href="/alerts">Alert History</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </div>
    )

    
}  //Menu


export default Menu_c;