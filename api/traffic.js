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
      const timestamp = data.items[0].timestamp;
      
      // FILTER: Only keep the 4 checkpoint cameras
      const checkpointCameras = allCameras
        .filter(cam => CHECKPOINT_CAMERAS.includes(cam.camera_id))
        .map(cam => ({
          CameraID: cam.camera_id,
          ImageLink: cam.image,
          Location: getCameraLocation(cam.camera_id),
          // Add traffic intelligence
          trafficStatus: getTrafficStatus(cam.camera_id, timestamp),
          waitTime: getWaitTimeEstimate(cam.camera_id, timestamp),
          lastUpdated: timestamp
        }));
      
      // Return ONLY the filtered cameras
      return res.status(200).json({ 
        value: checkpointCameras,
        totalCameras: checkpointCameras.length,
        filtered: true,
        timestamp: timestamp
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

// Get traffic status based on day and time
function getTrafficStatus(cameraId, timestamp) {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const day = date.getDay(); // 0 = Sunday, 5 = Friday
  
  // Peak hours
  const isMorningPeak = (hour >= 7 && hour <= 9);
  const isEveningPeak = (hour >= 17 && hour <= 20);
  const isNight = (hour >= 22 || hour <= 5);
  
  // Woodlands to JB (2701)
  if (cameraId === '2701') {
    // Friday evening heavy to JB
    if (day === 5 && hour >= 16) {
      return { status: '🔴 HEAVY TRAFFIC', color: '#e74c3c', level: 'heavy' };
    }
    // Weekend mornings
    if ((day === 6 || day === 0) && hour >= 8 && hour <= 11) {
      return { status: '🟠 MODERATE TRAFFIC', color: '#f39c12', level: 'moderate' };
    }
    if (isEveningPeak) {
      return { status: '🟠 MODERATE TRAFFIC', color: '#f39c12', level: 'moderate' };
    }
    if (isNight) {
      return { status: '🟢 LIGHT TRAFFIC', color: '#27ae60', level: 'light' };
    }
    return { status: '🟢 LIGHT TRAFFIC', color: '#27ae60', level: 'light' };
  }
  
  // Woodlands to Singapore (2702)
  if (cameraId === '2702') {
    // Sunday evening heavy back to SG
    if (day === 0 && hour >= 15) {
      return { status: '🔴 HEAVY TRAFFIC', color: '#e74c3c', level: 'heavy' };
    }
    // Monday morning peak
    if (day === 1 && isMorningPeak) {
      return { status: '🟠 MODERATE TRAFFIC', color: '#f39c12', level: 'moderate' };
    }
    if (isMorningPeak) {
      return { status: '🟠 MODERATE TRAFFIC', color: '#f39c12', level: 'moderate' };
    }
    if (isNight) {
      return { status: '🟢 LIGHT TRAFFIC', color: '#27ae60', level: 'light' };
    }
    return { status: '🟢 LIGHT TRAFFIC', color: '#27ae60', level: 'light' };
  }
  
  // Woodlands Flyover (2704)
  if (cameraId === '2704') {
    if (isMorningPeak || isEveningPeak) {
      return { status: '🟠 MODERATE TRAFFIC', color: '#f39c12', level: 'moderate' };
    }
    return { status: '🟢 SMOOTH', color: '#27ae60', level: 'light' };
  }
  
  // Tuas Second Link (4703)
  if (cameraId === '4703') {
    if (isMorningPeak || isEveningPeak) {
      return { status: '🟠 MODERATE TRAFFIC', color: '#f39c12', level: 'moderate' };
    }
    return { status: '🟢 SMOOTH', color: '#27ae60', level: 'light' };
  }
  
  return { status: '🟢 NORMAL', color: '#27ae60', level: 'light' };
}

// Estimate wait time in minutes
function getWaitTimeEstimate(cameraId, timestamp) {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const day = date.getDay();
  
  const isMorningPeak = (hour >= 7 && hour <= 9);
  const isEveningPeak = (hour >= 17 && hour <= 20);
  
  // Woodlands to JB (2701)
  if (cameraId === '2701') {
    if (day === 5 && hour >= 16) return '60-90 min';
    if ((day === 6 || day === 0) && hour >= 8 && hour <= 11) return '30-45 min';
    if (isEveningPeak) return '20-30 min';
    if (isMorningPeak) return '15-25 min';
    return '5-15 min';
  }
  
  // Woodlands to Singapore (2702)
  if (cameraId === '2702') {
    if (day === 0 && hour >= 15) return '45-60 min';
    if (day === 1 && isMorningPeak) return '30-40 min';
    if (isMorningPeak) return '20-30 min';
    if (isEveningPeak) return '15-25 min';
    return '5-15 min';
  }
  
  // Woodlands Flyover (2704)
  if (cameraId === '2704') {
    if (isMorningPeak || isEveningPeak) return '10-15 min';
    return '5 min';
  }
  
  // Tuas Second Link (4703)
  if (cameraId === '4703') {
    if (isMorningPeak || isEveningPeak) return '5-10 min';
    return '5 min';
  }
  
  return '5-10 min';
}
