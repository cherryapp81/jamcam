export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const LTA_API_URL = 'https://api.data.gov.sg/v1/transport/traffic-images';
  const LTA_API_KEY = process.env.LTA_API_KEY;
  
  if (!LTA_API_KEY) {
    return res.status(500).json({ error: 'LTA_API_KEY not set' });
  }
  
  try {
    const response = await fetch(LTA_API_URL, {
      headers: {
        'AccountKey': LTA_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.items && data.items[0] && data.items[0].cameras) {
      const cameras = data.items[0].cameras.map(cam => ({
        CameraID: cam.camera_id,
        ImageLink: cam.image,
        Location: cam.location_description || cam.camera_id
      }));
      
      return res.status(200).json({ value: cameras });
    } else {
      return res.status(404).json({ error: 'No camera data' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch' });
  }
}
