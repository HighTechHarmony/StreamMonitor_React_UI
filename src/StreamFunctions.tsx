
// Interfaces required for Stream management and reports

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



  // Function to fetch stream configurations
  const fetchStreamConfigs = async (): Promise<StreamConfigs_i[]> => {
    try {
      const response = await fetch('/api/stream_configs');
      const configs: StreamConfigs_i[] = await response.json();      
      console.log("Got the stream configs: ", configs);
      return configs;
    } catch (error) {
      console.error('Error fetching stream configs', error);
      throw error;
    }
  };

  // Function to fetch all the stream images given a list of enabled streams
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

 /* Fetch a single stream image for a given stream title */
const fetchStreamImage = async (streamTitle: string): Promise<StreamImage_i> => {
  try {
    const response = await fetch('/api/stream_images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_titles: [streamTitle] }) // Send an array with a single stream title
    });
    const images: StreamImages_i = await response.json();
    console.log("Got the images: ", images);

    // Decode and return the image 
    return images[streamTitle]; 
  } catch (error) {
    console.error('Error fetching stream image for ' + streamTitle, error);
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

export { fetchStreamConfigs, fetchStreamImages, fetchStreamImage, fetchStreamReports}
export type {StreamConfigs_i, StreamImages_i, StreamImage_i, StreamReport_i };