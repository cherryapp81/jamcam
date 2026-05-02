export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const LTA_API_URL = 'https://api.data.gov.sg/v1/transport/traffic-images';
  const LTA_API_KEY = process.env.LTA_KEY || process.env.LTA_API_KEY;
  
  if (!LTA_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  
  try {
    const response = await fetch(LTA_API_URL, {
      headers: { 'AccountKey': LTA_API_KEY, 'Accept': 'application/json' }
    });
    
    const data = await response.json();
    const allCameras = data.items[0].cameras;
    
    // Find Woodlands cameras (27xx) and Tuas cameras (47xx)
    const woodlandsCameras = allCameras
      .filter(cam => cam.camera_id.startsWith('27'))
      .map(cam => ({
        CameraID: cam.camera_id,
        Location: cam.location_description || 'Woodlands Area',
        ImageLink: cam.image
      }));
    
    const tuasCameras = allCameras
      .filter(cam => cam.camera_id.startsWith('47'))
      .map(cam => ({
        CameraID: cam.camera_id,
        Location: cam.location_description || 'Tuas Area',
        ImageLink: cam.image
      }));
    
    return res.status(200).json({
      woodlandsCameras: woodlandsCameras,
      tuasCameras: tuasCameras,
      totalWoodlands: woodlandsCameras.length,
      totalTuas: tuasCameras.length,
      message: 'All available Woodlands (27xx) and Tuas (47xx) cameras'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
