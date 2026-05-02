let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 15 * 1000; // 15 seconds (traffic cams update often)

// Pre-index camera list for O(1) lookup (faster than includes)
const CHECKPOINT_CAMERAS = {
  '2701': '🚗 Woodlands Causeway (Towards Johor)',
  '2702': '🇸🇬 Woodlands Checkpoint (Towards Singapore)',
  '2704': '🔄 Woodlands Flyover (Towards Checkpoint)',
  '4703': '🌉 Tuas Second Link (JB-SG)'
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // ⚡ Serve from cache if valid
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_DURATION) {
    return res.status(200).json({
      ...cache,
      cached: true
    });
  }

  const LTA_API_URL = 'https://api.data.gov.sg/v1/transport/traffic-images';
  const LTA_API_KEY = process.env.LTA_KEY || process.env.LTA_API_KEY;

  if (!LTA_API_KEY) {
    return res.status(500).json({
      error: 'Missing LTA API key'
    });
  }

  try {
    const response = await fetch(LTA_API_URL, {
      method: 'GET',
      headers: {
        AccountKey: LTA_API_KEY,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`LTA API failed: ${response.status}`);
    }

    const data = await response.json();

    const cameras = data?.items?.[0]?.cameras;

    if (!Array.isArray(cameras)) {
      return res.status(404).json({
        error: 'Invalid camera response structure'
      });
    }

    // ⚡ Fast filter using object lookup instead of includes()
    const checkpointCameras = cameras
      .filter(cam => CHECKPOINT_CAMERAS[cam.camera_id])
      .map(cam => ({
        id: cam.camera_id,
        image: cam.image,
        location: CHECKPOINT_CAMERAS[cam.camera_id],
        timestamp: cam.timestamp
      }));

    const result = {
      value: checkpointCameras,
      total: checkpointCameras.length,
      updatedAt: new Date().toISOString()
    };

    // store cache
    cache = result;
    cacheTime = now;

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: 'Traffic camera fetch failed',
      message: error.message
    });
  }
}
