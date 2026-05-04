<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>JamCam - SG-JB Checkpoint Traffic</title>
    <meta name="google-adsense-account" content="ca-pub-4888105418888143">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4888105418888143"
         crossorigin="anonymous"></script>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            background: #f0f0f0; 
            padding-bottom: 80px; 
        }
        
        .top { 
            background: #1a252f; 
            color: white; 
            padding: 20px; 
            text-align: center; 
        }
        
        .top h1 { 
            margin: 0; 
            font-size: 26px; 
        }
        
        .top p { 
            margin: 3px 0 0; 
            font-size: 13px; 
        }
        
        .map-container {
            margin: 10px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            background: white;
        }
        
        .map-header {
            background: #1a252f;
            color: white;
            padding: 10px 16px;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .map-header span {
            font-size: 18px;
        }
        
        iframe {
            display: block;
            width: 100%;
            height: 300px;
            border: none;
        }
        
        .map-info {
            background: white;
            padding: 8px 12px;
            font-size: 11px;
            color: #666;
            text-align: center;
            border-top: 1px solid #eee;
        }
        
        .section-header {
            background: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%);
            color: white;
            padding: 12px 16px;
            margin: 10px 10px 5px 10px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-header span {
            font-size: 20px;
        }
        
        .cameras { 
            display: grid; 
            grid-template-columns: 1fr;
            gap: 12px; 
            padding: 12px; 
        }
        
        @media (min-width: 768px) {
            .cameras { 
                grid-template-columns: 1fr 1fr;
            }
            .cam img { 
                height: 350px;
            }
        }
        
        @media (max-width: 767px) {
            .cam img { 
                height: 250px;
            }
        }
        
        .cam { 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            cursor: pointer; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .cam:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .cam img { 
            width: 100%; 
            object-fit: cover; 
            display: block; 
            background: #e0e0e0; 
            cursor: pointer;
        }
        
        .cam .info { 
            padding: 10px; 
        }
        
        .cam .info .loc { 
            font-size: 13px; 
            font-weight: bold; 
            color: #333; 
            margin-bottom: 4px;
        }
        
        .cam .info .id { 
            font-size: 10px; 
            color: #999; 
        }
        
        .cam .info .wait-time {
            font-size: 12px;
            margin-top: 5px;
            font-weight: bold;
        }
        
        .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 1000;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        
        .lightbox.active {
            display: flex;
        }
        
        .lightbox img {
            max-width: 95%;
            max-height: 85%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            background: none;
            border: none;
        }
        
        .lightbox-caption {
            color: white;
            margin-top: 15px;
            font-size: 14px;
            text-align: center;
        }
        
        .loading { 
            text-align: center; 
            padding: 50px 20px; 
            color: #666; 
        }
        
        .spinner { 
            border: 3px solid #f3f3f3; 
            border-top: 3px solid #1a252f; 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 15px; 
        }
        
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        
        .bottom { 
            position: fixed; 
            bottom: 0; 
            left: 0; 
            right: 0; 
            background: white; 
            padding: 10px 15px; 
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1); 
            display: flex; 
            gap: 10px; 
            z-index: 100;
        }
        
        .btn { 
            flex: 1; 
            padding: 14px; 
            border: none; 
            border-radius: 25px; 
            font-size: 15px; 
            font-weight: 700; 
            cursor: pointer; 
            transition: opacity 0.2s;
        }
        
        .btn:active {
            opacity: 0.8;
        }
        
        .btn-r { 
            background: #1a252f; 
            color: white; 
        }
        
        .btn-s { 
            background: #f0f7ff; 
            color: #1a252f; 
            border: 2px solid #1a252f; 
        }
        
        .error-box { 
            background: #FFF3F0; 
            border: 2px solid #1a252f; 
            border-radius: 12px; 
            padding: 20px; 
            margin: 20px 10px; 
            text-align: center; 
        }
        
        .error-box button { 
            background: #1a252f; 
            color: white; 
            border: none; 
            padding: 12px 25px; 
            border-radius: 25px; 
            font-size: 15px; 
            font-weight: 700; 
            cursor: pointer; 
            margin-top: 10px; 
        }
        
        .info-note { 
            background: #f0f7ff; 
            color: #1a252f; 
            padding: 8px; 
            text-align: center; 
            font-size: 12px; 
            font-weight: bold; 
            border-bottom: 1px solid #d0e0f0; 
        }
        
        .traffic-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .status-text {
            font-size: 11px;
            margin-top: 5px;
        }
        
        .ad-container { 
            text-align: center; 
            margin: 10px; 
            padding: 10px; 
            background: #f9f9f9;
            border-radius: 10px;
            font-size: 11px;
            color: #999;
        }
        
        .section-divider {
            margin: 5px 0;
        }
        
        .traffic-legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 15px 10px;
            padding: 12px 20px;
            background: white;
            border-radius: 50px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 13px;
            font-weight: bold;
        }
        
        .legend-color {
            display: inline-block;
            width: 24px;
            height: 14px;
            border-radius: 4px;
            margin-right: 6px;
            vertical-align: middle;
        }
        
        .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 30px;
            background: #f8f8f8;
        }
        
        @media (max-width: 768px) {
            .traffic-legend {
                gap: 10px;
                padding: 10px 15px;
                font-size: 11px;
                flex-wrap: wrap;
            }
            .legend-item {
                padding: 3px 10px;
            }
        }
    </style>
</head>
<body>

<div class="top">
    <h1>📷 JamCam</h1>
    <p>SG-JB Checkpoint Traffic | Live Cameras + Location Maps</p>
    <p id="statusText" class="status-text" style="color: #CCFFCC;">Starting up...</p>
</div>

<div class="info-note">
    🚗 Live camera feeds for Woodlands Causeway & Tuas Second Link
</div>

<div class="ad-container" id="adSpace">
    <div style="font-size:10px; text-transform:uppercase;">Advertisement</div>
    <div style="padding: 20px; background: #e0e0e0; border-radius: 8px;">
        [Ad Space - Google AdSense coming soon]
    </div>
</div>

<div id="cameraGrid"></div>

<div class="traffic-legend">
    <div class="legend-item">
        <span class="legend-color" style="background:#4CAF50;"></span>
        <span>Smooth Traffic</span>
    </div>
    <div class="legend-item">
        <span class="legend-color" style="background:#FF9800;"></span>
        <span>Moderate Traffic</span>
    </div>
    <div class="legend-item">
        <span class="legend-color" style="background:#f44336;"></span>
        <span>Heavy Traffic</span>
    </div>
</div>

<div class="bottom">
    <button class="btn btn-r" onclick="loadCameras()">🔄 Refresh Cameras</button>
    <button class="btn btn-s" onclick="shareApp()">📤 Share</button>
</div>

<div id="lightbox" class="lightbox" onclick="closeLightbox()">
    <button class="lightbox-close" onclick="closeLightbox()">×</button>
    <img id="lightbox-img" src="" alt="Zoomed traffic camera">
    <div id="lightbox-caption" class="lightbox-caption"></div>
</div>

<script>
    // ============================================
    // JAMCAM - COMPLETE JAVASCRIPT
    // ============================================
    
    // API Configuration
    var API_URL = '/api/traffic';
    
    // Data stores
    var allCameras = [];
    var woodlandsCameras = [];
    var tuasCameras = [];
    
    // ============================================
    // LIGHTBOX FUNCTIONS (Zoom images)
    // ============================================
    
    function openLightbox(imageUrl, caption) {
        var lightbox = document.getElementById('lightbox');
        var lightboxImg = document.getElementById('lightbox-img');
        var lightboxCaption = document.getElementById('lightbox-caption');
        
        lightboxImg.src = imageUrl;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        var lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // ============================================
    // MAIN FUNCTIONS
    // ============================================
    
    function loadCameras() {
        var status = document.getElementById('statusText');
        var grid = document.getElementById('cameraGrid');
        
        grid.innerHTML = '<div class="loading"><div class="spinner"></div>Checking checkpoint traffic...</div>';
        status.textContent = 'Connecting to LTA...';
        status.style.color = 'white';

        fetch(API_URL)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                console.log('Camera data received:', data);
                
                if (data && data.value && data.value.length > 0) {
                    allCameras = data.value;
                    
                    // Filter Woodlands cameras (2701, 2702, 2705)
                    woodlandsCameras = allCameras.filter(function(cam) {
                        return cam.CameraID === '2701' || cam.CameraID === '2702' || cam.CameraID === '2705';
                    });
                    
                    // Filter Tuas cameras (4713, 4703, 4701)
                    tuasCameras = allCameras.filter(function(cam) {
                        return cam.CameraID === '4713' || cam.CameraID === '4703' || cam.CameraID === '4701';
                    });
                    
                    var now = new Date();
                    var timeStr = now.toLocaleTimeString('en-SG', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
                    var totalCams = woodlandsCameras.length + tuasCameras.length;
                    
                    status.textContent = '🟢 ' + totalCams + ' checkpoint cams | Last update: ' + timeStr;
                    status.style.color = '#CCFFCC';
                    
                    displayCameras();
                } else {
                    showError('No checkpoint camera data received');
                }
            })
            .catch(function(error) {
                console.error('Fetch error:', error);
                showError('Cannot connect: ' + error.message);
            });
    }
    
    function showError(msg) {
        var grid = document.getElementById('cameraGrid');
        var status = document.getElementById('statusText');
        
        status.textContent = '🔴 ' + msg;
        status.style.color = '#FFCCCC';
        
        grid.innerHTML = 
            '<div class="error-box">' +
            '<div style="font-size:40px;margin-bottom:10px;">📡</div>' +
            '<strong>Cannot Load Checkpoint Cameras</strong><br><br>' +
            msg + '<br><br>' +
            '<button onclick="loadCameras()">🔄 Try Again</button>' +
            '</div>';
    }
    
    function renderCameraSection(title, icon, cameras) {
        if (!cameras || cameras.length === 0) {
            return '<div class="section-header" style="background: #95a5a6;">' +
                   '<span>' + icon + '</span>' +
                   '<span>' + title + '</span>' +
                   '<span style="font-size:12px; margin-left:auto;">No cameras available</span>' +
                   '</div>' +
                   '<div class="cameras" style="grid-template-columns:1fr;">' +
                   '<div class="error-box" style="margin:0;">No cameras found for ' + title + '</div>' +
                   '</div>';
        }
        
        var html = '<div class="section-header">' +
                   '<span>' + icon + '</span>' +
                   '<span>' + title + '</span>' +
                   '<span style="font-size:12px; margin-left:auto;">' + cameras.length + ' cameras</span>' +
                   '</div>';
        
        html += '<div class="cameras">';
        
        for (var i = 0; i < cameras.length; i++) {
            var cam = cameras[i];
            var id = cam.CameraID;
            var imgUrl = cam.ImageLink;
            var location = cam.Location || 'Checkpoint Camera ' + id;
            var trafficStatus = cam.trafficStatus || { status: '🟢 LIGHT TRAFFIC', color: '#27ae60', level: 'light' };
            var waitTime = cam.waitTime || '5-10 min';
            
            var imgWithTimestamp = imgUrl + '?t=' + Date.now();
            var borderColor = trafficStatus.color;
            var badgeText = trafficStatus.status;
            
            // Escape single quotes in location for JavaScript
            var safeLocation = location.replace(/'/g, "\\'");
            
            html += '<div class="cam" onclick="openLightbox(\'' + imgUrl + '\', \'' + safeLocation + '\')" style="position:relative; border: 2px solid ' + borderColor + ';">';
            html += '<div class="traffic-badge" style="background: ' + borderColor + '; color: white;">' + badgeText + '</div>';
            html += '<img src="' + imgWithTimestamp + '" alt="' + location + '" loading="lazy" onerror="this.src=\'https://via.placeholder.com/300x350?text=Loading+Failed\'">';
            html += '<div class="info">';
            html += '<div class="loc">📷 ' + location + '</div>';
            html += '<div class="id">Camera ID: ' + id + '</div>';
            html += '<div class="wait-time" style="color: ' + borderColor + ';">⏱️ Estimated wait: ' + waitTime + '</div>';
            html += '</div></div>';
        }
        
        html += '</div>';
        return html;
    }
    
    function renderMapSection(title, icon, lat, lng, zoomLevel) {
        var mapUrl = 'https://www.onemap.gov.sg/minimap?lat=' + lat + '&lng=' + lng + '&zoom=' + zoomLevel;
        
        return '<div class="map-container">' +
               '<div class="map-header">' +
               '<span>' + icon + '</span>' + title + ' Location Map' +
               '</div>' +
               '<iframe src="' + mapUrl + '" width="100%" height="300" style="border:0;" frameborder="0" allowfullscreen></iframe>' +
               '<div class="map-info">📍 ' + title + ' Area | Map by OneMap Singapore</div>' +
               '</div>';
    }
    
    function displayCameras() {
        var grid = document.getElementById('cameraGrid');
        
        var woodlandsSection = renderCameraSection('Woodlands Checkpoint', '🏢', woodlandsCameras);
        var woodlandsMap = renderMapSection('Woodlands Checkpoint', '🏢', 1.444, 103.768, 14);
        var tuasSection = renderCameraSection('Tuas Checkpoint', '🌉', tuasCameras);
        var tuasMap = renderMapSection('Tuas Checkpoint', '🌉', 1.347, 103.633, 14);
        
        if (woodlandsCameras.length === 0 && tuasCameras.length === 0) {
            grid.innerHTML = '<div class="error-box">No checkpoint cameras found. Please check back later.</div>';
        } else {
            grid.innerHTML = woodlandsSection + woodlandsMap + '<div class="section-divider"></div>' + tuasSection + tuasMap;
        }
    }
    
    function shareApp() {
        var message = '🚗 Beat the jam at SG-JB checkpoints!\n\nJamCam - Live traffic cameras with wait time estimates\nWoodlands Causeway & Tuas Second Link\n\n' + window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'JamCam - Checkpoint Traffic',
                text: message,
                url: window.location.href
            }).catch(function() {});
        } else {
            // Fallback for browsers that don't support Web Share API
            var textarea = document.createElement('textarea');
            textarea.value = message;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Link copied to clipboard!');
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    // Auto-refresh every 2 minutes (120,000 ms)
    setInterval(loadCameras, 120000);
    
    // Initial load
    loadCameras();
</script>

<!-- About JamCam Section (for Google AdSense) -->
<div style="background: #f0f7ff; padding: 20px; margin: 10px; border-radius: 12px; border: 1px solid #d0e0f0;">
    <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #1a252f;">About JamCam</h2>
    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #333;">
        <strong>JamCam provides live traffic camera feeds for the two main checkpoints between Singapore and Malaysia:</strong>
        Woodlands Causeway and Tuas Second Link.
    </p>
    <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #333;">
        Our mission is to help <strong>daily commuters, travelers, and delivery drivers</strong> make informed decisions
        about which checkpoint to use and when to cross, potentially saving hours of waiting time.
    </p>
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333;">
        Each camera feed includes <strong>real-time traffic status indicators</strong> (Heavy/Moderate/Light)
        and <strong>estimated wait times</strong> based on historical traffic patterns.
    </p>
    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #d0e0f0; font-size: 12px; color: #666;">
        📍 <strong>Data Source:</strong> LTA DataMall (Singapore Land Transport Authority)<br>
        🗺️ <strong>Maps:</strong> OneMap Singapore
    </div>
</div>

<!-- Footer -->
<div style="text-align: center; padding: 15px; font-size: 11px; color: #999; background: white; margin-top: 10px;">
    <a href="/privacy.html" style="color: #999; margin: 0 8px; text-decoration: none;">Privacy</a> |
    <a href="/contact.html" style="color: #999; margin: 0 8px; text-decoration: none;">Contact</a> |
    <a href="/about.html" style="color: #999; margin: 0 8px; text-decoration: none;">About</a>
    <div style="margin-top: 8px;">© 2025 JamCam. All rights reserved.</div>
</div>

</body>
</html>
