import React, {useState, useEffect } from 'react';
import { StreamReport_i, StreamConfigs_i, fetchStreamConfigs, fetchStreamReports, } from './StreamFunctions';
import { report } from 'process';

// A react component to display the status of a single stream report
// Takes the title of the stream as a prop
interface StreamReportStatusProps {
    streamTitle: string; 
}

const StreamReportStatus_c: React.FC<StreamReportStatusProps> = ({ streamTitle }) => {
    const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
    const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful array of all stream reports 
    const [loadingStreamReports, setLoadingStreamReports] = useState(true);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            setLoadingStreamReports(true);

            const streamToFetch: StreamConfigs_i[] = [{title: streamTitle, enabled: "1", _id: "0", uri: "", audio: "0"}];

            try {
                // Fetch reports for this stream title
                const reports = await fetchStreamReports(streamToFetch);
                setStreamReports(reports);
                setLoadingStreamReports(false);
            } catch (error) {
                console.error('Error fetching and processing data', error);
            }
        };

        fetchAndProcessData();

        // Cause the component to refresh the reports every 5 seconds
        const interval = setInterval(() => {
            fetchAndProcessData();
        }, 5000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);


    }  
    , []);  // useEffect

    return (
        <div>
            {/* <h2>{streamTitle}</h2>
            <ul>
                {streamReports_s.map((report) => (
                    <li key={report._id}>
                        {report.status}
                    </li>
                ))}
            </ul> */}
            {streamReports_s.map((report) => (
                <div className="stream-report-status" key={report._id}>{report.status}</div>
            ))}
            
        </div>
    );
};

export default StreamReportStatus_c;

