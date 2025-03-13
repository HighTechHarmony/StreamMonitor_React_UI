import React, { useEffect, useState} from 'react';
import { StreamConfigs_i, fetchStreamConfigs, } from './StreamFunctions'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

// This component allows the user to review, add and delete streams, and edit stream configurations




/* StreamManager component */
const StreamManager_c: React.FC = () => {
  const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
  const [restartRequired, setRestartRequired] = useState<boolean>(false);
  const [loadingStreamConfigs, setLoadingStreamConfigs] = useState(true);
  const [streamsToDelete, setStreamsToDelete] = useState<string[]>([]);
  const [newStreamRowAdded, setNewStreamRowAdded] = useState<boolean>(false);  
  

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


  }, []);  // End of useEffect


  if (loadingStreamConfigs) {
    return <p>Loading stream configs...</p>;
  }

  // Check to see that streamConfigs_s is populated and valid
  if (!streamConfigs_s) {
    return <p>Stream configs not found</p>;
  }




  // Removes the row from the UI and adds the stream ID to the streamsToDelete state variable
  const handleDeleteStream = async (streamId: string) => {   
 
    let newConfigs = streamConfigs_s.filter((c) => c.streamId !== streamId);
    setStreamConfigs(newConfigs);

    // If the stream ID contains something valid, add it to the streamsToDelete state variable
    if (streamId) {
      setStreamsToDelete([...streamsToDelete, streamId]);
    }

  }

  const handleAddNewStream = () => {
    // console.log("handleAddNewStream called");
    if (newStreamRowAdded === true) {
      // console.log("New stream row already added");
      return;
    }

    setStreamConfigs([...streamConfigs_s, {
      _id: '',
      title: '',
      uri: '',
      audio: '0',
      enabled: '1',
      streamId: Date.now().toString(), // Generate a unique ID for the new stream
    }]);

    setNewStreamRowAdded(true);
  }

  const handleTitleChange = (index: number, title: string) => {
    let newConfigs = streamConfigs_s.map((c, i) => {
      if (i === index) {
        return { ...c, title };
      }
      return c;
    });

    setRestartRequired(true);
    setStreamConfigs(newConfigs);
  }

  const saveStreamConfigs = async () => {
    try {   
    
      const response = await fetch('/protected/api/update_stream_configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(streamConfigs_s)
      });

      if (response.ok) {
        console.log("Stream configs updated successfully");
        // alert("If any stream titles were changed, please initiate a restart under global settings!");

        // Make a secondary API call to delete streams
        await Promise.all(streamsToDelete.map(async (stream) => {
          console.log(`Deleting stream ${stream}`);
          const deleteResponse = await fetch('/protected/api/delete_stream', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ streamId: stream })
          });
          if (!deleteResponse.ok) {
          alert(`Failed to delete stream ${stream}`);
          }
          console.log(`Deleted stream ${stream}`);
      }));

      // If restartRequired is true, update the restart_due field in global_configs
      if (restartRequired) {
        console.log("Stream config changes require a restart of the system, initiating...");
        const updateResponse = await fetch('/protected/api/update_global_settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ restart_due: "1" })
        });

        if (!updateResponse.ok) {
          console.error("Failed to update global config");
        } else {
          console.log("Global config updated successfully");
        }
      }


        navigate('/'); // Navigate to the dashboard view
      } else {
        console.error("Failed to update stream configs");        
      }
    } catch (error) {
      console.error('Error updating stream configs', error);
    }
  }


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
            {Array.isArray(streamConfigs_s) && streamConfigs_s.map((config) => (
              <tr key={config.streamId}>
                 <td id="StreamManagerTitleTD">
                    <input
                      id="StreamTitleInput"
                      type="text"
                      value={config.title}
                      onChange={(e) => handleTitleChange(streamConfigs_s.indexOf(config), e.target.value)}
                      placeholder="Enter title"
                    />
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

                        // Call the delete function
                        handleDeleteStream(config.streamId);

                    }}>Delete</button>
                    
                </td>
                </tr>

            ))}
            </tbody>
        </table>

        {/* Button to add a blank row for a new stream */}
        <div className="StreamManagerAddNewStreamButton">
          <button onClick={handleAddNewStream}>Add Stream</button>
        </div>


        <p></p>

        {/* Button to apply any changes */}
        <div className="StreamManagerApplyChangesButton">
          <button onClick={saveStreamConfigs}>Apply Changes</button>
        </div>



        </div>}
    </div>
    );
}  // End of StreamManager component

export default StreamManager_c;

