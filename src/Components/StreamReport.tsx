import React, { useEffect, useState} from 'react';
import { StreamReport_i, StreamConfigs_i, StreamImages_i, fetchStreamConfigs, fetchStreamImages, fetchStreamReports } from './StreamFunctions'; 
// import { Stream } from 'stream';
import StreamImage_c from "./StreamImage"
import StreamReportStatus_c from "./StreamReportStatus"

const console_debug_level = 2;




/* StreamReport component */
// A nice display of the latest info reported by the stream, as well as its latest screen image
const StreamReport_c: React.FC = () => {
  const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful stream reports array  
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
    // Using await for each step because external data retrieval occurs
    const fetchAndProcessData = async () => {
      setLoadingStreamImages(true);
      try {
        // First determine the enabled streams
        const configs = await fetchStreamConfigs();
        const enabledStreams = configs.filter((config: StreamConfigs_i) => config.enabled === "1");        
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


  }, []);  // End of useEffect for StreamReport component



    if (loadingStreamReports || loadingStreamConfigs || loadingStreamImages) {
      return <div>Loading Stream Reports...</div>;
    }

    const convertStatusMessage = (status: string) => {
      // Creates a map containing regexes to match against the status message
      // and the replacement message and color 
      const statusMap = [
        { regex: /ffmpeg error/im, message: "Error occurred: ", color: "red" },
        { regex: /got frame/im, message: "OK: Analyzing stream", color: "green" },
        { regex: /queue empty/im, message: "OK: Queue refilling", color: "green" },
        { regex: /Running framegrab:/im, message: "OK: Updating thumbnail", color: "green" },
        { regex: /request: GET/im, message: "OK: Requesting more data", color: "green" },
        // Add more status mappings as needed
      ];
  
      for (const { regex, message, color } of statusMap) {
        if (regex.test(status)) {
          return { message, color };
        }
      }
  
      // Default is the uninterpretted message and color is black
      return { message: status, color: "black" };
    };
  

    return (
      <div id="StreamReport">
        <h2>Stream Reports</h2>
        <table width="80%" id="StreamReportTable">
          <thead>
            <tr>
              <th>Screen Image</th>
              {/* <th>ID</th> */}
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {streamReports_s.map((streamReport) => {
              const { message, color } = convertStatusMessage(streamReport.status);
              return (
                <tr key={streamReport._id}>
                  <td id="streamReportImageTD"> 
                    {/* {streamReport.image_bin ? <img src={`data:jpeg;base64,${streamReport.image_bin}`} alt={streamReport.title} height="200" /> : <div>No Image</div>} */}
                    {/* <div className="StreamImageThumbDiv"><StreamImage_c streamReport={streamReport} streamReportFunction={setStreamReports} /></div> */}
                    <div className="StreamImageThumbDiv"><StreamImage_c streamTitle={streamReport.title} /></div>
                  </td>
                  {/* <td id="streamReportIDTD">{streamReport._id}</td> */}
                  <td id="streamReportTitleTD">{streamReport.title}</td>
                  <td id="streamReportStatusTD">
                    <div className="streamReportStatusDiv" style={{color}}>
                      {/* {streamReport.status} */}
                      {message}
                    </div>
                  </td>
                </tr>
              );
            })}
          
          </tbody>
        </table>

        {/* The stream image component:
      <StreamImage_c streamReport={streamReports_s[0]} /> */}
      </div>

      
    );
  };  // End of StreamReport component




// A new component that displays the reports, with images, timestamp, etc. as several subcomponents  
// const StreamReportFramed_c: React.FC = () => {
//   const [streamReports_s, setStreamReports] = useState<StreamReport_i[]>([]);    // Stateful stream reports array
//   const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
//   const [loadingStreamReportImage, setLoadingStreamReports] = useState(true);




export default StreamReport_c;




