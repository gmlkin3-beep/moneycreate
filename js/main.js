// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Load featured products
    loadFeaturedProducts();
    
    // Initialize cart
    initCart();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check user authentication
    checkAuthStatus();
    
    // Ensure themes.css is loaded (adds dark theme variable overrides)
    if (!document.querySelector('link[href*="themes.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../css/themes.css';
        document.head.appendChild(link);
    }
    
    // Create a small floating theme control if not present
    if (!document.getElementById('themeControl')) {
        const ctrl = document.createElement('div');
        ctrl.id = 'themeControl';
        ctrl.innerHTML = `
            <button id="themeToggle" title="Toggle dark/light">🌓</button>
            <input id="accentColor" type="color" title="Accent color" value="#4f46e5" />
        `;
        Object.assign(ctrl.style, {
            position: 'fixed',
            right: '12px',
            bottom: '12px',
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '6px',
            borderRadius: '8px',
            boxShadow: '0 6px 18px rgba(16,24,40,0.08)',
            zIndex: 9999,
            display: 'flex',
            gap: '6px',
            alignItems: 'center'
        });
        document.body.appendChild(ctrl);
        
        const toggle = document.getElementById('themeToggle');
        const colorInput = document.getElementById('accentColor');
        
        // Initialize from existing state
        const currentAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        if (currentAccent) colorInput.value = rgbToHex(currentAccent) || '#4f46e5';
        
        toggle.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme');
            if (cur === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        });
        
        colorInput.addEventListener('input', (e) => {
            const v = e.target.value;
            document.documentElement.style.setProperty('--accent', v);
        });
    }
    
    function rgbToHex(s) {
        if (!s) return null;
        s = s.replace(/\s+/g, '');
        // handle rgb(255,255,255)
        const m = s.match(/rgb\((\d+),(\d+),(\d+)\)/i);
        if (m) {
            return '#' + [1,2,3].map(i=>parseInt(m[i]).toString(16).padStart(2,'0')).join('');
        }
        // already hex?
        if (s[0] === '#') return s;
        return null;
    }
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'orange';
    document.body.className = `theme-${savedTheme}`;
    
    // Update active theme button
    document.querySelectorAll('.theme-color').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });
}

function changeTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
    
    // Update user preference in database if logged in
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:5000/api/auth/theme', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme })
        });
    }
    
    showNotification(`Theme changed to ${theme}`);
}

// Product Management
async function loadFeaturedProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products/featured');
        const products = await response.json();
        
        const container = document.getElementById('featuredProducts');
        if (container) {
            container.innerHTML = products.map(product => `
                <div class="product-card animate-card">
                    <div class="product-image">
                        <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">KES ${product.price.toFixed(2)}</div>
                        <div class="product-quantity">${product.quantity} in stock</div>
                        <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function addToCart(productId, quantity = 1) {
    // First, get product details
    fetch(`http://localhost:5000/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                if (existingItem.quantity + quantity > product.quantity) {
                    showNotification(`Only ${product.quantity} items available in stock`, 'error');
                    return;
                }
                existingItem.quantity += quantity;
            } else {
                if (quantity > product.quantity) {
                    showNotification(`Only ${product.quantity} items available in stock`, 'error');
                    return;
                }
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.imageUrl,
                    maxQuantity: product.quantity
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Animation
            const btn = event.target;
            btn.classList.add('add-to-cart-animation');
            setTimeout(() => btn.classList.remove('add-to-cart-animation'), 500);
            
            showNotification(`${product.name} added to cart!`);
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showNotification('Error adding product to cart', 'error');
        });
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeModal = document.getElementById('themeModal');
    const closeThemeModal = document.getElementById('closeThemeModal');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeModal.style.display = 'flex';
        });
    }
    
    if (closeThemeModal) {
        closeThemeModal.addEventListener('click', () => {
            themeModal.style.display = 'none';
        });
    }
    
    // Theme color buttons
    document.querySelectorAll('.theme-color').forEach(btn => {
        btn.addEventListener('click', () => {
            changeTheme(btn.dataset.theme);
            themeModal.style.display = 'none';
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
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

// Auth Status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userMenu = document.querySelector('.user-menu');
    
    if (token) {
        // Decode token to get user info
        const userData = JSON.parse(atob(token.split('.')[1]));
        
        if (userMenu) {
            userMenu.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn">
                        <i class="fas fa-user-circle"></i> ${userData.email}
                    </button>
                    <div class="dropdown-menu">
                        <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="orders.html"><i class="fas fa-shopping-bag"></i> Orders</a>
                        ${userData.role === 'admin' ? '<a href="dashboard.html"><i class="fas fa-chart-line"></i> Dashboard</a>' : ''}
                        <hr>
                        <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
            
            document.getElementById('logoutBtn').addEventListener('click', logout);
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-slide`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 2000;
    }
    
    .notification-error {
        background-color: var(--danger-color);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
    }
`;
document.head.appendChild(notificationStyles);
