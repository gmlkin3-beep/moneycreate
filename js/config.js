// config.js - Store all API endpoints in one place
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : 'https://yourdomain.com/api',
    
    // Feature toggles
    DEBUG_MODE: true,
    
    // Timeouts
    API_TIMEOUT: 10000
};

// For older browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
