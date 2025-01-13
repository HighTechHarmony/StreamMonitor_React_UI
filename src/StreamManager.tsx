import React, { useEffect, useState} from 'react';
import { StreamConfigs_i, fetchStreamConfigs, } from './StreamFunctions'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

// This component allows the user to review, add and delete streams, and edit stream configurations


/* StreamManager component */
const StreamManager_c: React.FC = () => {
  const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
  const [loadingStreamConfigs, setLoadingStreamConfigs] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchAndProcessData = async () => {
      setLoadingStreamConfigs(true);
      try {
        // Fetch stream configs
        const configs = await fetchStreamConfigs();
        setStreamConfigs(configs);
        setLoadingStreamConfigs(false);
      } catch (error) {
        console.error('Error fetching stream configs', error);
      }
    };

    fetchAndProcessData();

    // Set an interval to make sure this component stays up to date
    // const interval = setInterval(() => {
    //   fetchAndProcessData();
    // }, 5000);

    // Clear the interval when the component is unmounted
    // return () => clearInterval(interval);


  }, []);  // End of useEffect






  return (
    <div id="StreamManager">
      <h1>Stream Manager</h1>
      {loadingStreamConfigs ? <p>Loading...</p> : <div>
        <table id="StreamManagerTable">
          <thead>
            <tr>
              <th>Stream Title</th>
              <th>URI</th>
              <th>Stream Type</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {streamConfigs_s.map((config) => (
              <tr key={config.title}>
                <td id="StreamManagerTitleTD">
                    {/* A textbox populated with the config.title */}
                    {/* If the contents is changed, it replaces the value in the StreamConfigs state variable */}
                    {/* <input id="StreamTitleInput" type="text" value={config.title} onChange={(e) => {
                        let newConfigs = streamConfigs_s.map((c) => {
                        if (c.title === config.title) {
                            return { ...c, title: e.target.value };
                        } else {
                            return c;
                        }
                        });
                        setStreamConfigs(newConfigs);
                    }} /> */}
                    {config.title}
                </td>

                <td id="StreamManagerURITD">
                    {/* A textbox populated with the config.uri */}
                    {/* If the contents is changed, it replaces the value in the StreamConfigs state variable */}
                    <input id="StreamURIInput" type="text" value={config.uri} onChange={(e) => {
                        let newConfigs = streamConfigs_s.map((c) => {
                          if (c.title === config.title) {
                            return { ...c, uri: e.target.value };
                          } else {
                            return c;
                          }
                        });
                        setStreamConfigs(newConfigs);
                      }} />
                </td>

                <td id="StreamManagerTypeTD">
                    <div id="StreamTypeSelect">
                        {/* Show a slide switch for audio vs video */}
                        <img id="IconLabel" src="video_icon.png" alt="Video" height="25"/>   
                        <label className="AudioVideoSwitch">
                        
                        <input id="TypeSelector" type="checkbox" checked={config.audio === "1"} onChange={(e) => {
                            let newConfigs = streamConfigs_s.map((c) => {
                            if (c.title === config.title) {
                                return { ...c, audio: e.target.checked ? "1" : "0" };
                            } else {
                                return c;
                            }
                            });
                            setStreamConfigs(newConfigs);
                        }} />
                        <span className="slider round"></span>
                        
                        </label>
                        
                        <img id="IconLabel" src="audio_icon.png" alt="Audio" height="25"/>   

                    </div>
                </td>

                <td id="StreamManagerEnabledTD">
                    {/* Show a slide switch for enabled/disabled */}
                    <label className="EnabledSwitch">
                    <input id="EnabledSelector" type="checkbox" checked={config.enabled === "1"} onChange={(e) => {
                        let newConfigs = streamConfigs_s.map((c) => {
                          if (c.title === config.title) {
                            return { ...c, enabled: e.target.checked ? "1" : "0" };
                          } else {
                            return c;
                          }
                        });
                        setStreamConfigs(newConfigs);
                      }} />
                    <span className="slider round"></span>
                    </label>
                    </td>

                <td id="StreamManagerActionsTD">
                    {/* Show a delete button */}
                    <button onClick={async () => {
                        let newConfigs = streamConfigs_s.filter((c) => c.title !== config.title);
                        setStreamConfigs(newConfigs);
                    }}>Delete</button>

                    
                </td>
                </tr>

                
                
                
                

            ))}
            </tbody>
        </table>

        {/* Button to add a blank row for a new stream */}
        <button onClick={() => {
          setStreamConfigs([...streamConfigs_s, {
            _id: '',
            title: '',
            uri: '',
            audio: '0',
            enabled: '1'
          }]);
        }}>Add Stream</button>


        <p></p>

        {/* Button to apply any changes */}
        <button onClick={async () => {
        try {
          const response = await fetch('/api/update_stream_configs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(streamConfigs_s)
          });

          if (response.ok) {
            console.log("Stream configs updated successfully");
            navigate('/'); // Navigate to the dashboard view
          } else {
            console.error("Failed to update stream configs");
          }
        } catch (error) {
          console.error('Error updating stream configs', error);
        }
      }}>Apply Changes</button>



        </div>}
    </div>
    );
}  // End of StreamManager component

export default StreamManager_c;

