import React, {useState, useEffect } from 'react';
import { StreamReport_i, StreamConfigs_i, fetchStreamConfigs, fetchStreamReports, } from './StreamFunctions';
import { report } from 'process';

// A react component to display the status of a single stream report
// For the given streamId
interface StreamReportStatusProps {
    streamId: string; 
}

const StreamReportStatus_c: React.FC<StreamReportStatusProps> = ({ streamId }) => {

    const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
    const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful stream reports array
    const [loadingStreamReports, setLoadingStreamReports] = useState(true);
    const [loadingStreamConfigs, setLoadingStreamConfigs] = useState(true);

    useEffect(() => {
        
        // Main function to fetch and process all data in a synchronous manner
        // Using await for each step because external data retrieval occurs
        const fetchAndProcessData = async () => {
            setLoadingStreamReports(true);
            try {
                // First determine the enabled streams
                const configs = await fetchStreamConfigs();
                const enabledStreams = configs.filter((config: StreamConfigs_i) => config.enabled === "1");
                setStreamConfigs(configs);
                setLoadingStreamConfigs(false);

                // Fetch reports for these streams
                const reports = await fetchStreamReports(enabledStreams);
                setStreamReports(reports);
                setLoadingStreamReports(false);
            } catch (error) {
                console.error('Error fetching and processing data', error);                
            }   
        };

        fetchAndProcessData();

        // Cause the component to refresh the image every 5 seconds
        const interval = setInterval(() => {
            fetchAndProcessData();
        }, 5000);

    }  
    , []);  // useEffect

    // Example function to handle image loading error
    const handleImageError = () => {
        console.error('Error loading image');
    };

    // Check to see that streamReports_s is populated and valid
    if (!streamReports_s) {
        return <p>Stream reports not found</p>;
    }

    // Find the stream report with the given streamId
    const report = streamReports_s.find((report) => report.streamId === streamId);

    // Check to see that the report is valid
    if (!report) {
        return <p>Stream report not found</p>;
    }

    return (
        <div>
          {loadingStreamReports ? (
            <p>Loading...</p>
          ) : (
            report ? (
              <div>
                {report.status}
              </div>
            ) : (
              <p>Stream report not found</p>
            )
          )}
        </div>
    );
};

export default StreamReportStatus_c;

