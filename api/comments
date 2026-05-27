// api/comments.js - Handle comment submissions for JamCam
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Check if Supabase is configured
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables missing');
    return res.status(500).json({ 
      error: 'Comment system not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables.',
      docs: 'https://vercel.com/docs/projects/environment-variables'
    });
  }
  
  // GET comments for a checkpoint
  if (req.method === 'GET') {
    const { checkpoint } = req.query;
    
    if (!checkpoint || (checkpoint !== 'woodlands' && checkpoint !== 'tuas')) {
      return res.status(400).json({ error: 'Invalid checkpoint. Use "woodlands" or "tuas"' });
    }
    
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/comments?checkpoint=eq.${checkpoint}&order=created_at.desc&limit=50`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }
      
      const comments = await response.json();
      return res.status(200).json({ comments: comments || [] });
      
    } catch (error) {
      console.error('GET comments error:', error.message);
      return res.status(500).json({ error: 'Failed to load comments: ' + error.message });
    }
  }
  
  // POST a new comment
  if (req.method === 'POST') {
    const { checkpoint, user_name, message } = req.body;
    
    if (!checkpoint || (checkpoint !== 'woodlands' && checkpoint !== 'tuas')) {
      return res.status(400).json({ error: 'Invalid checkpoint. Use "woodlands" or "tuas"' });
    }
    
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ error: 'Message too short (minimum 3 characters)' });
    }
    
    const userName = (user_name && user_name.trim()) ? user_name.trim() : 'Anonymous';
    const cleanMessage = message.trim().substring(0, 500); // Limit to 500 chars
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          checkpoint: checkpoint,
          user_name: userName,
          message: cleanMessage,
          created_at: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      const newComment = Array.isArray(result) ? result[0] : result;
      
      return res.status(201).json({ 
        success: true, 
        comment: newComment 
      });
      
    } catch (error) {
      console.error('POST comment error:', error.message);
      return res.status(500).json({ error: 'Failed to post comment: ' + error.message });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
