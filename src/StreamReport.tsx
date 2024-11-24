import React, { useEffect, useState} from 'react';
import { StreamReport_i, StreamConfigs_i, StreamImages_i, fetchStreamConfigs, fetchStreamImages, fetchStreamReports } from './StreamFunctions'; // Adjust the import path as necessary

const console_debug_level = 2;




/* StreamReport component */
// A nice display of the latest info reported by the stream, as well as its latest screen image
const StreamReport_c: React.FC = () => {
  const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful stream reports array
  const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
  const [loadingStreamReports, setLoadingStreamReports] = useState(true);
  const [loadingStreamConfigs, setLoadingStreamConfigs] = useState(true);
  const [loadingStreamImages, setLoadingStreamImages] = useState(true);

  useEffect(() => {
    

    // Function to process reports and images
    // Basically this decodes and inserts the images into the reports
    const processReportsAndImages = (reports: StreamReport_i[], images: StreamImages_i): StreamReport_i[] => {
      reports.forEach((report) => {
        Object.keys(images).forEach((streamName) => {
          const image = images[streamName];
          if (report.title === streamName) {
            report.image_bin = atob(image.data);
            report.image_timestamp = image.timestamp;
          }
        });
      });
      return reports;
    };

    // Main function to fetch and process all data in a synchronous manner
    // Using await for step because external data retrieval occurs
    const fetchAndProcessData = async () => {
      setLoadingStreamImages(true);
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
        

        // Fetch images for these streams
        const images = await fetchStreamImages(enabledStreams);
        setLoadingStreamImages(false);


        // Call the processor to combine the reports and images
        const processedReports = processReportsAndImages(reports, images);

        // Update reports state and loading states
        setStreamReports(processedReports);
        setLoadingStreamReports(false);
        setLoadingStreamImages(false);
      } catch (error) {
        console.error('Error fetching and processing data', error);
      }
    };

    fetchAndProcessData();

    // Set up an interval to fetch and process data every 5 seconds
    const interval = setInterval(() => {
      fetchAndProcessData();
    }, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);

  }, []);  // End of useEffect for StreamReport component



    if (loadingStreamReports || loadingStreamConfigs || loadingStreamImages) {
      return <div>Loading Stream Reports...</div>;
    }

    return (
      <div id="StreamReport">
        <h2>Stream Reports</h2>
        <table width="80%">
          <thead>
            <tr>
              <th>Screen Image</th>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              streamReports_s.map((streamReport) => (
                <tr key={streamReport._id}>
                  
                  <td> 
                    
                    {streamReport.image_bin ? <img src={`data:jpeg;base64,${streamReport.image_bin}`} alt={streamReport.title} height="200" /> : <div>No Image</div>}

                    
                  </td>
                  <td>{streamReport._id}</td>
                  <td>{streamReport.title}</td>
                  <td>{streamReport.status}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  };  // End of StreamReport component


export default StreamReport_c;
