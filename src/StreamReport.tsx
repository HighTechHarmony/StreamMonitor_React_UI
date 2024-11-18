import React, { useEffect, useState} from 'react';

const console_debug_level = 2;

// Interfaces

  // A StreamReport consists of all of the up-to-date information about a stream
  interface StreamReport_i {
    _id: string;
    title: string;
    status: string;
    image_bin: string;
    image_timestamp?: string;
  }

  // StreamConfigs_i objects have the config info for a single stream
  interface StreamConfigs_i {
    title: string;
    _id: string;
    uri: string;
    audio: string;
    enabled: string;
  }

  interface StreamAlerts {
    timestamp: string;
    stream: string;
    alert: string;
    image: string;    
  }

  // Stream image has image data stored as base64 encoded string, along with some basic metadata
  interface StreamImage_i {
    _id: string;
    title: string;
    data: string;
    timestamp: string;
  }

  // StreamImages_i objects are dictionaries of StreamImage_i objects, with the key being
  // the stream title.  This is largely because of the way the data is returned from the server
  interface StreamImages_i {
    [key: string]: StreamImage_i;
  }



  // The StreamReport component, consists of the latest info reported by the stream, as well as its latest screen image
  const StreamReport_c: React.FC = () => {
    const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful stream reports array
    const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
    const [loadingStreamReports, setLoadingStreamReports] = useState(true);
    const [loadingStreamConfigs, setLoadingStreamConfigs] = useState(true);
    const [loadingStreamImages, setLoadingStreamImages] = useState(true);

    useEffect(() => {

        // fetchStreamReports
        // Takes streamIds and returns the stream reports for those streams        
        const fetchStreamReports = async (streamIds: StreamConfigs_i[]): Promise<StreamReport_i[]> => {
          
          const body_to_send = JSON.stringify({ stream_titles: streamIds.map(stream => stream.title) });
          if (console_debug_level>1) console.log ("Body to send: ", body_to_send);

          // Send the titles of the enabled streams to the server
          const response = await fetch('/api/stream_reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ stream_titles: streamIds.map(stream => stream.title) })
            body: body_to_send
            
          });

          
          return await response.json();
        }

        // festchStreamImages
        // Takes imageIds and returns the stream images for those streams
        // Returns a StreamImages_i object, which is a dictionary of StreamImage_i objects with a string key of the stream title
        const fetchStreamImages = async (streamIds: StreamConfigs_i[]): Promise<StreamImages_i> => {

          if (console_debug_level>1) console.log ("Getting stream images for streams: ", streamIds.map(stream => stream.title) );
          const response = await fetch('/api/stream_images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stream_titles: streamIds.map(stream => stream.title) })
          });
          const images_data: StreamImages_i = await response.json();
          
          if (console_debug_level>1) console.log("API response for images: ", images_data);
          return images_data;          
            
        };

        // fetchStreamConfigs
        // Fetch all of the stream configs, which will then call the fetchStreamReports and fetchStreamImages functions as needed
        const fetchStreamConfigs = async () => {
          try {

            const response = await fetch('/api/stream_configs');
            const configs: StreamConfigs_i[] = await response.json();
            setStreamConfigs(configs);
            setLoadingStreamConfigs(false);
            console.log("Got the stream configs: ", configs);


            // Determine enabled streams
            // For now we are using the configs object this way, because the streamConfigs_s state variable is not populated in time
            // const enabledStreams = streamConfigs_s.filter((config: StreamConfigs_i) => config.enabled === "1");
            const enabledStreams = configs.filter((config: StreamConfigs_i) => config.enabled === "1");


            // Fetch enabled streams reports
            // This is a POST request to the server to get the reports for the enabled streams
            let reports = await fetchStreamReports(enabledStreams);
            console.log("Got the stream reports: ", reports);


            // Once the reports are fetched, fetch the images for the enabled streams
            // Ensure the reports are fetched before the images
            
            const images:StreamImages_i = await fetchStreamImages(enabledStreams);
            console.log("Got the images: ", images);


            
            // Map over the reports, find the image for it, decode, and put it into the report's image property
            reports.map((report: StreamReport_i) => {
              Object.keys(images).forEach((key) => {

                Object.keys(images).forEach((streamName) => {
                  const image = images[streamName];
                  if (report.title === streamName) {

                    // Decode and store the image to the report object

                    // console.log("converting image data ", image.data.substring( 0, 10));
                    report.image_bin =  atob(image.data);
                    report.image_timestamp= image.timestamp;
              }})
            });
            });

            setStreamReports(reports);            
            setLoadingStreamReports(false);
            setLoadingStreamImages(false);

          }
          catch (error) {
            console.error('Error fetching stream configs', error);
          }
        }


        // Call fetchStreamConfigs immediately
        fetchStreamConfigs();
      
        // Also create an interval to refetch every 5 seconds
        const interval = setInterval(() => {
          fetchStreamConfigs();
        }, 5000);
  
}, []);

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
