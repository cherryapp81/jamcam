export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const LTA_API_URL = 'https://api.data.gov.sg/v1/transport/traffic-images';
  const LTA_API_KEY = process.env.LTA_KEY || process.env.LTA_API_KEY;
  
  // ONLY these 4 checkpoint cameras
  const CHECKPOINT_CAMERAS = ['2701', '2702', '2704', '4703'];
  
  if (!LTA_API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured in Vercel'
    });
  }
  
  try {
    const response = await fetch(LTA_API_URL, {
      method: 'GET',
      headers: {
        'AccountKey': LTA_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`LTA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items[0] && data.items[0].cameras) {
      // Get all cameras from LTA
      const allCameras = data.items[0].cameras;
      
      // FILTER: Only keep the 4 checkpoint cameras
      const checkpointCameras = allCameras
        .filter(cam => CHECKPOINT_CAMERAS.includes(cam.camera_id))
        .map(cam => ({
          CameraID: cam.camera_id,
          ImageLink: cam.image,
          Location: getCameraLocation(cam.camera_id)
        }));
      
      console.log(`Found ${checkpointCameras.length} checkpoint cameras out of ${allCameras.length} total`);
      
      // Return ONLY the filtered cameras
      return res.status(200).json({ 
        value: checkpointCameras,
        totalCameras: checkpointCameras.length,
        filtered: true
      });
    } else {
      return res.status(404).json({ error: 'No camera data available from LTA' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: 'Unable to fetch traffic camera data',
      details: error.message
    });
  }
}

// Friendly names for each checkpoint camera
function getCameraLocation(cameraId) {
  const locations = {
    '2701': '🚗 Woodlands Causeway (Towards Johor)',
    '2702': '🇸🇬 Woodlands Checkpoint (Towards Singapore)',
    '2704': '🔄 Woodlands Flyover (Towards Checkpoint)',
    '4703': '🌉 Tuas Second Link (JB-SG)'
  };
  
  return locations[cameraId] || `Camera ${cameraId}`;
}
