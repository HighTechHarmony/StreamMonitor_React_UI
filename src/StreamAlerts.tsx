import React, { useState, useEffect } from 'react';
import StreamReport_c from './StreamReport';
import { StreamConfigs_i, fetchStreamConfigs } from './StreamFunctions'; // Adjust the import path as necessary

interface StreamAlerts_i {
    timestamp: string;
    stream: string;
    alert: string;
    image: string;
}


const StreamAlerts_c: React.FC = () => {
    const [streamAlerts, setStreamAlerts] = useState<StreamAlerts_i[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchStreamAlerts = async (limit:number) => {


            // Determine enabled streams
            try {
                // First determine the enabled streams
                const configs = await fetchStreamConfigs();
                const enabledStreams = configs.filter((config: StreamConfigs_i) => config.enabled === "1");

                
                // The fetch stream alerts API call body needs an array of desired stream_titles, and a num_alerts integer (AKA limit)
                const body_to_send:string = JSON.stringify({ stream_titles: enabledStreams.map(stream => stream.title), num_alerts: limit });

                const response = await fetch('/api/stream_alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body_to_send
                });
                let alerts: StreamAlerts_i[] = await response.json();
                console.log("Got the stream alerts: ", alerts);

                // Convert each image from base64 to binary
                alerts.forEach((alert) => {
                    if (alert.image) {
                        alert.image = atob(alert.image);
                    }
                });


                setStreamAlerts(alerts);
                setLoading(false);
                

            }
            catch (error) {
                console.error('Error fetching stream alerts', error);
            };


        
        };  // End of fetchStreamAlerts function


        

        

        fetchStreamAlerts(10);
        
    }, []);   // End of useEffect for StreamAlert component

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div id="StreamAlerts">
            <h2>Stream Alerts</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Stream</th>
                        <th>Alert</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {streamAlerts.map((streamAlert: StreamAlerts_i) => (
                        <tr key={streamAlert.timestamp}>
                            <td>{streamAlert.timestamp}</td>
                            <td>{streamAlert.stream}</td>
                            <td>{streamAlert.alert}</td>
                            <td>
                            {streamAlert.image ? <img src={`data:jpeg;base64,${streamAlert.image}`} alt={streamAlert.alert} height="200" /> : <div>No Image</div>}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StreamAlerts_c;
