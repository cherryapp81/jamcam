// api/comments.js - Complete version with confirm and report features
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
      error: 'Comment system not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables.'
    });
  }
  
  // ============================================
  // GET comments for a checkpoint
  // ============================================
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
  
  // ============================================
  // POST - handle different actions
  // ============================================
  if (req.method === 'POST') {
    // --- ACTION: confirm (increment confirm_count) ---
    if (req.query.action === 'confirm') {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Comment ID is required' });
      }
      
      try {
        // First, get current confirm_count
        const getResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/comments?id=eq.${id}&select=confirm_count`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          }
        );
        
        if (!getResponse.ok) {
          throw new Error(`Failed to get comment: ${getResponse.status}`);
        }
        
        const data = await getResponse.json();
        if (!data || data.length === 0) {
          return res.status(404).json({ error: 'Comment not found' });
        }
        
        const currentCount = data[0].confirm_count || 0;
        const newCount = currentCount + 1;
        
        // Update the confirm_count
        const updateResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/comments?id=eq.${id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              confirm_count: newCount
            })
          }
        );
        
        if (!updateResponse.ok) {
          throw new Error(`Failed to update: ${updateResponse.status}`);
        }
        
        const result = await updateResponse.json();
        return res.status(200).json({ 
          success: true, 
          comment: result[0] || { confirm_count: newCount }
        });
        
      } catch (error) {
        console.error('Confirm error:', error.message);
        return res.status(500).json({ error: 'Failed to confirm: ' + error.message });
      }
    }
    
    // --- ACTION: report (set reported = true) ---
    if (req.query.action === 'report') {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Comment ID is required' });
      }
      
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/comments?id=eq.${id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              reported: true
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to report: ${response.status}`);
        }
        
        const result = await response.json();
        return res.status(200).json({ 
          success: true, 
          comment: result[0] 
        });
        
      } catch (error) {
        console.error('Report error:', error.message);
        return res.status(500).json({ error: 'Failed to report: ' + error.message });
      }
    }
    
    // --- ACTION: POST new comment (default) ---
    const { checkpoint, user_name, message } = req.body;
    
    if (!checkpoint || (checkpoint !== 'woodlands' && checkpoint !== 'tuas')) {
      return res.status(400).json({ error: 'Invalid checkpoint. Use "woodlands" or "tuas"' });
    }
    
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ error: 'Message too short (minimum 3 characters)' });
    }
    
    const userName = (user_name && user_name.trim()) ? user_name.trim() : 'Anonymous';
    const cleanMessage = message.trim().substring(0, 500);
    
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
          confirm_count: 0,
          reported: false,
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
