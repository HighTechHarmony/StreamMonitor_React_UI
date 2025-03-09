import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { StreamConfigs_i, fetchStreamConfigs } from './StreamFunctions'; // Adjust the import path as necessary

interface StreamAlerts_i {
    timestamp: string;
    stream: string;
    alert: string;
    image: string;    
}

// Adjust this for the desired number of alerts to be displayed
const limit: number = 10; 


const StreamAlerts_c: React.FC = () => {
    const [streamAlerts, setStreamAlerts] = useState<StreamAlerts_i[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchStreamAlerts = async (limit:number) => {

            try {
                // First determine the enabled streams
                const configs = await fetchStreamConfigs();
                const enabledStreams = configs.filter((config: StreamConfigs_i) => config.enabled === "1");

                
                // The fetch stream alerts API call body needs an array of desired stream_titles, and a num_alerts integer (AKA the limit)
                const body_to_send:string = JSON.stringify({ stream_titles: enabledStreams.map(stream => stream.title), num_alerts: limit });

                const response = await fetch('/protected/api/stream_alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body_to_send
                });
                let alerts: StreamAlerts_i[] = await response.json();
                console.log("Got the stream alerts: ", alerts);

                // Do some massaging of the alert content
                alerts.forEach((alert) => {
                    if (alert.image) {
                        alert.image = atob(alert.image);
                    }

                    // Make links clickable
                    alert.alert = alert.alert.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
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

    let alert_row: number = 1;  // Initialize the alert row counter

    return (
        
        <div id="StreamAlerts">
            <h2> Last {limit} Stream Alerts:</h2>
            
                {streamAlerts.map((streamAlert: StreamAlerts_i) => (
                    <div className="stream-row" key={streamAlert.timestamp}>
                        <div className="stream-image">                            
                            <span className="stream-alert-number">{alert_row++}</span>
                            {streamAlert.image ? <img src={`data:jpeg;base64,${streamAlert.image}`} alt={streamAlert.alert} height="200" /> : <div>No Image</div>}
                        </div>

                        <div className="stream-info">                            
                            <span className="timestamp">{streamAlert.timestamp}</span>
                            <span className="stream-name">{streamAlert.stream}</span>                            
                            <span className="alert-info" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(streamAlert.alert)}}></span>
                        </div>
                    </div>
                ))}

        </div>
    );
}

export default StreamAlerts_c;
