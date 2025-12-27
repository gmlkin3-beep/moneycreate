// Notification System
function                     // Save token
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    
                                        showNotification('Login successful!', 'success');
                    
                    // Check if there's a redirect parameter in URL
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectTo = urlParams.get('redirect');
                    
                    // Redirect based on parameter
                    setTimeout(() => {
                        if (redirectTo === 'checkout') {
                            window.location.href = 'checkout.html';
                        } else {
                            window.location.href = 'index.html';  // Default to home
                        }
                    }, 1500);, 1500);
                    } else {
                        // Default redirect (profile or home)
                        setTimeout(() => {
                            window.location.href = 'profile.html'; // Or your profile/dashboard
                        }, 1500);
                    } else if (data.user.role === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                showNotification(data.error || 'Login failed', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Network error. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Setup Register Form
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validation
        if (!terms) {
            showNotification('Please accept the terms and conditions', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = document.getElementById('registerBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, phoneNumber: phone })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showNotification('Account created successfully! Please login.', 'success');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showNotification(data.error || 'Registration failed', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Network error. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Setup User Menu
function setupUserMenu() {
    const token = localStorage.getItem('token');
    const userMenu = document.getElementById('userMenu');
    
    if (!userMenu) return;
    
    if (token) {
        try {
            const userData = JSON.parse(atob(token.split('.')[1]));
            const user = JSON.parse(localStorage.getItem('user'));
            
            userMenu.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn">
                        <i class="fas fa-user-circle"></i> ${user?.username || userData.email.split('@')[0]}
                    </button>
                    <div class="dropdown-menu">
                        <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="orders.html"><i class="fas fa-shopping-bag"></i> Orders</a>
                        ${userData.role === 'admin' ? '<a href="dashboard.html"><i class="fas fa-chart-line"></i> Dashboard</a>' : ''}
                        <hr>
                        <a href="#" id="logoutLink"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
            
            // Add dropdown functionality
            const userBtn = userMenu.querySelector('.user-btn');
            const dropdown = userMenu.querySelector('.dropdown-menu');
            
            userBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                dropdown.classList.remove('show');
            });
            
            // Logout functionality
            document.getElementById('logoutLink').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
            
        } catch (error) {
            console.error('Error parsing token:', error);
            showDefaultAuthButtons();
        }
    } else {
        showDefaultAuthButtons();
    }
}

function showDefaultAuthButtons() {
    const userMenu = document.getElementById('userMenu');
    if (!userMenu) return;
    
    userMenu.innerHTML = `
        <button class="auth-btn" id="loginBtnNav"><i class="fas fa-sign-in-alt"></i> Login</button>
        <button class="auth-btn register" id="registerBtnNav"><i class="fas fa-user-plus"></i> Register</button>
    `;
    
    // Add event listeners
    const loginBtn = document.getElementById('loginBtnNav');
    const registerBtn = document.getElementById('registerBtnNav');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Logged out successfully', 'success');
    
    // Redirect to home after 1 second
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Check Authentication Status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        return userData;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return null;
    }
}

// Require Authentication
function requireAuth(redirectTo = 'login.html') {
    const user = checkAuthStatus();
    if (!user) {
        window.location.href = redirectTo;
        return null;
    }
    return user;
}

// Require Admin Access
function requireAdmin(redirectTo = 'index.html') {
    const user = requireAuth('login.html');
    if (!user) return null;
    
    if (user.role !== 'admin') {
        window.location.href = redirectTo;
        return null;
    }
    return user;
}

// Update User Theme
async function updateUserTheme(theme) {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AUTH.THEME), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme })
        });
    } catch (error) {
        console.error('Error updating theme:', error);
    }
}

// Export functions for use in other files
window.auth = {
    checkAuthStatus,
    requireAuth,
    requireAdmin,
    logout,
    updateUserTheme
};





