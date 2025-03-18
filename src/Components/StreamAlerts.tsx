import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { StreamConfigs_i, fetchStreamConfigs } from './StreamFunctions'; // Adjust the import path as necessary

interface StreamAlerts_i {
    timestamp: string;
    stream: string;
    alert: string;
    image: string;
    streamId: string;    
}

// Adjust this for the desired (default) number of alerts to be displayed
const limit: number = 10; 


const StreamAlerts_c: React.FC = () => {
    const [streamAlerts, setStreamAlerts] = useState<StreamAlerts_i[]>([]);
    const [loading, setLoading] = useState(true);

    const [alerts, setAlerts] = useState<StreamAlerts_i[]>([]);
    const [numAlerts, setNumAlerts] = useState(10);
    const [matchFragment, setMatchFragment] = useState('');
    const [fragmentInput, setFragmentInput] = useState('');

    const fetchStreamAlerts = async () => {
        try {
            // First determine the enabled streams
            const configs = await fetchStreamConfigs();
            
            // POST version
            // const response = await fetch('/protected/api/stream_alerts', {
            //     method: '{POST}',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         num_alerts: numAlerts,
            //         match_fragment: matchFragment,
            //         stream_titles: configs.map(stream => stream.title)
            //     }),
            // });

            // GET version
            const response = await fetch(`/protected/api/stream_alerts?num_alerts=${numAlerts}&match_fragment=${matchFragment}&stream_titles=${configs.map(stream => stream.title)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
                console.log("Got the stream alerts: ", alerts);

                // Do some massaging of the alert content   
                data.forEach((alert: StreamAlerts_i) => {
                        if (alert.image) {
                            alert.image = atob(alert.image);
                        }
                        // Make links clickable
                        alert.alert = alert.alert.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
                    }
                );

            // Set the StreamAlerts state
            setStreamAlerts(data);

            // setStreamAlerts(alerts);
            setLoading(false);

        }
        catch (error) {
            console.error('Error fetching stream alerts', error);
        };
    
    };  // End of fetchStreamAlerts function


    // Fetch the stream alerts on component load
    useEffect(() => {
        fetchStreamAlerts();
    }, []);   // End of useEffect for StreamAlert component

    useEffect(() => {
        fetchStreamAlerts();
    }, [numAlerts, matchFragment]);

    let alert_row: number = 1;  // Initialize the alert row counter

    const handleNumAlertsClick = (num: number) => {
        setNumAlerts(num);
    };

    const handleFragmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMatchFragment(fragmentInput);
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div id="StreamAlerts">
            <div className="num-alerts-buttons"># of results: 
                <button onClick={() => handleNumAlertsClick(10)}>10</button>
                <button onClick={() => handleNumAlertsClick(25)}>25</button>
                <button onClick={() => handleNumAlertsClick(50)}>50</button>
                <button onClick={() => handleNumAlertsClick(100)}>100</button>
            </div>

            <form className="alerts_search_text" onSubmit={handleFragmentSubmit}>
                <input
                    type="text"
                    value={fragmentInput}
                    onChange={(e) => setFragmentInput(e.target.value)}
                    placeholder="Search fragment"
                />
                <button type="submit">Search</button>
            </form>


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

};

export default StreamAlerts_c;
