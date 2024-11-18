import React, { useEffect, useState} from 'react';

const console_debug_level = 2;

// Interfaces



// StreamConfigs_i objects have the config info for a single stream
interface StreamConfigs_i {
  title: string;
  _id: string;
  uri: string;
  audio: string;
  enabled: string;
}

// Stream image has image data stored as base64 encoded string, along with some basic metadata
interface StreamImage_i {
  _id: string;
  title: string;
  data: string;
  timestamp: string;
}

// StreamImages_i objects are dictionaries of StreamImage_i objects, with the key being
// the stream title.  This is largely required because of the way the data is returned from the server
// (It would be preferable to have an array of StreamImage_i objects, but that's not how it's returned)
interface StreamImages_i {
  [key: string]: StreamImage_i;
}

// A StreamReport consists of all of the up-to-date information about a stream.
interface StreamReport_i {
  _id: string;
  title: string;
  status: string;
  image_bin: string;
  image_timestamp?: string;
}


/* StreamReport component */
// A nice display of the latest info reported by the stream, as well as its latest screen image
const StreamReport_c: React.FC = () => {
  const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful stream reports array
  const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
  const [loadingStreamReports, setLoadingStreamReports] = useState(true);
  const [loadingStreamConfigs, setLoadingStreamConfigs] = useState(true);
  const [loadingStreamImages, setLoadingStreamImages] = useState(true);

  useEffect(() => {
    // Function to fetch stream configurations
    const fetchStreamConfigs = async (): Promise<StreamConfigs_i[]> => {
      try {
        const response = await fetch('/api/stream_configs');
        const configs: StreamConfigs_i[] = await response.json();
        setStreamConfigs(configs);
        setLoadingStreamConfigs(false);
        console.log("Got the stream configs: ", configs);
        return configs;
      } catch (error) {
        console.error('Error fetching stream configs', error);
        throw error;
      }
    };

    // Function to fetch stream images
    const fetchStreamImages = async (enabledStreams: StreamConfigs_i[]): Promise<StreamImages_i> => {
      try {
        const response = await fetch('/api/stream_images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stream_titles: enabledStreams.map(stream => stream.title) })
        });
        const images: StreamImages_i = await response.json();
        console.log("Got the images: ", images);
        return images;
      } catch (error) {
        console.error('Error fetching stream images', error);
        throw error;
      }
    };

    // Function to fetch stream reports
    const fetchStreamReports = async (enabledStreams: StreamConfigs_i[]): Promise<StreamReport_i[]> => {
      try {
        const response = await fetch('/api/stream_reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stream_titles: enabledStreams.map(stream => stream.title) })
        });
        const reports: StreamReport_i[] = await response.json();
        console.log("Got the stream reports: ", reports);
        return reports;
      } catch (error) {
        console.error('Error fetching stream reports', error);
        throw error;
      }
    };

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
      try {
        // First determine the enabled streams
        const configs = await fetchStreamConfigs();
        const enabledStreams = configs.filter((config: StreamConfigs_i) => config.enabled === "1");

        // Fetch reports for these streams
        const reports = await fetchStreamReports(enabledStreams);
        // Fetch images for these streams
        const images = await fetchStreamImages(enabledStreams);

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
