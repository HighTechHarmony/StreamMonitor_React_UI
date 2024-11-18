import React, { useState, useEffect } from 'react';

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
        const fetchStreamAlerts = async () => {
            const body_to_send = JSON.stringify({ stream_titles: streamIds.map(stream => stream.title), limit: 10 });
           
        };

        fetchStreamAlerts();
    }, []);

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
                            <td>{streamAlert.image}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StreamAlerts_c;
