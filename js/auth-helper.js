// auth-helper.js - Helper functions for authentication
const AuthHelper = {
    // Check if user is logged in
    isLoggedIn: function() {
        return !!localStorage.getItem('token');
    },
    
    // Get current user
    getUser: function() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    // Require login for a page (e.g., checkout)
    requireLogin: function(redirectTo) {
        if (!this.isLoggedIn()) {
            // Save where we want to return after login
            localStorage.setItem('redirectAfterLogin', redirectTo || window.location.pathname);
            // Redirect to login
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    // Logout
    logout: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
};

// Make it globally available
window.AuthHelper = AuthHelper;
