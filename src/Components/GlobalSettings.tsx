import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This is a component which allows the user to view and change global settings

interface GlobalSettings_i {
    restart_due: string;
}

const GlobalSettings_c: React.FC = () => {
    const [globalSettings, setGlobalSettings] = useState<GlobalSettings_i>({ restart_due: "0" });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchGlobalSettings = async () => {

            try {
                const response = await fetch('/protected/api/global_settings');
                let settings: GlobalSettings_i = await response.json();
                console.log("Got the global settings: ", settings);

                setGlobalSettings(settings);
                setLoading(false);

            }
            catch (error) {
                console.error('Error fetching global settings', error);
            };

        };  // End of fetchGlobalSettings function

        fetchGlobalSettings();

    }, []);  // End of useEffect

    return (
        <div>
            <h1>Global Settings</h1>
            {loading ? <p>Loading...</p> : <div>
                {/* If restart_due is "1", show the switch on */}
                <label>
                    <input type="checkbox" checked={globalSettings.restart_due === "1"} onChange={(e) => {
                        let newSettings = { ...globalSettings };
                        newSettings.restart_due = e.target.checked ? "1" : "0";
                        setGlobalSettings(newSettings);
                    }} />
                    Restart Due<p></p>
                </label>

                <button onClick={async () => {
                    try {
                        const response = await fetch('/protected/api/update_global_settings', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(globalSettings)
                        });

                        if (response.ok) {
                            alert('Settings submitted successfully!');                            
                            <div className="throbber"></div>
                            console.log("Global settings updated successfully");
                            setTimeout(() => {
                                navigate('/'); // Redirect to / page after 2 seconds
                              }, 2000); 
                        }
                        else {
                            console.error("Failed to update global settings");
                        }

                    }
                    catch (error) {
                        console.error('Error updating global settings', error);
                    };

                }}>Apply</button>
            </div>}
        </div>
    );
};

export default GlobalSettings_c;
