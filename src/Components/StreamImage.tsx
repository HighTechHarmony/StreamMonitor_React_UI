import React, {useState, useEffect } from 'react';
import { StreamReport_i, StreamImages_i, StreamImage_i, StreamConfigs_i, fetchStreamConfigs, fetchStreamReports, fetchStreamImages, fetchStreamImage } from './StreamFunctions';
import { FaImage } from 'react-icons/fa';



// A react component to display a single stream report image for given stream report
// Takes the title of the stream as a prop
interface StreamImageProps {
    streamTitle: string; 
}



const StreamImage_c: React.FC<StreamImageProps> = ({ streamTitle }) => {
    // const StreamImage_c: React.FC = () => {

    const [streamConfigs_s, setStreamConfigs] = useState<StreamConfigs_i[]>([]);    // Stateful stream configs array
    const [streamImages_s, setStreamImages] = useState<StreamImages_i[]>([]);    // Stateful array of all stream images 
    const [streamImage_s, setStreamImage] = useState<StreamImage_i>();    // State variable containing the stream image for this stream
    
    const [loadingStreamImages, setLoadingStreamImages] = useState(true);

    useEffect(() => {

        const fetchAndProcessData = async () => {
            setLoadingStreamImages(true);
            try {
                // Fetch image for this stream title
                // const images = await fetchStreamImages(enabledStreams);
                const image = await fetchStreamImage(streamTitle);
                setStreamImage(image);
                setLoadingStreamImages(false);


                // Call the processor to combine the reports and images
                //   const processedReports = processReportsAndImages(reports, images);

                // Update reports state and loading states
                //   setStreamReports(processedReports);
                //   setLoadingStreamReports(false);
                setLoadingStreamImages(false);
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
    
    setStreamImage({ _id: '', title: '', timestamp: '', data: '' });
  };




  return (
    <div className="stream-image">
      {streamImage_s && streamImage_s.data ? (
        <img src={`data:image/png;base64,${streamImage_s.data}`} alt="Stream" onError={handleImageError} />
      ) : (
        <div>
          <FaImage size={40} />
          <p>Image not available</p>
        </div>
      )}
    </div>
  );
};  // StreamImage component



export default StreamImage_c;
