// ===== ANIMATED MOBILE NAVBAR =====
(function() {
    'use strict';
    
    // Wait for DOM
    document.addEventListener('DOMContentLoaded', function() {
        initMobileNavbar();
        updateCartCount();
    });
    
    function initMobileNavbar() {
        // Create mobile navbar HTML if not exists
        if (!document.querySelector('.mobile-nav-container')) {
            const mobileNavHTML = `
                <div class="mobile-nav-container">
                    <div class="mobile-top-bar">
                        <div class="mobile-logo">
                            <a href="index.html">🛒 MyShop</a>
                        </div>
                        <div class="mobile-nav-icons">
                            <a href="cart.html" class="mobile-icon-link">
                                <span class="cart-count">0</span> 🛒
                            </a>
                            <button class="mobile-menu-toggle" id="mobileMenuToggle">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="mobile-menu-overlay" id="mobileMenuOverlay">
                        <div class="mobile-menu-content">
                            <div class="mobile-menu-header">
                                <div class="user-info">
                                    <div class="user-avatar">👤</div>
                                    <div class="user-details">
                                        <span class="user-name">Guest User</span>
                                        <a href="login.html" class="login-link">Login / Register</a>
                                    </div>
                                </div>
                                <button class="close-menu" id="closeMobileMenu">×</button>
                            </div>
                            
                            <nav class="mobile-menu-nav">
                                <a href="index.html" class="mobile-nav-link">
                                    <span>🏠</span> Home
                                </a>
                                <a href="products.html" class="mobile-nav-link">
                                    <span>📦</span> Products
                                </a>
                                <a href="cart.html" class="mobile-nav-link">
                                    <span>🛒</span> Cart <span class="cart-badge">0</span>
                                </a>
                                <a href="checkout.html" class="mobile-nav-link">
                                    <span>💳</span> Checkout
                                </a>
                                <a href="about.html" class="mobile-nav-link">
                                    <span>ℹ️</span> About
                                </a>
                                <a href="contact.html" class="mobile-nav-link">
                                    <span>📞</span> Contact
                                </a>
                                <a href="profile.html" class="mobile-nav-link">
                                    <span>👤</span> Profile
                                </a>
                                <a href="privacy.html" class="mobile-nav-link">
                                    <span>🔒</span> Privacy
                                </a>
                                <a href="dashboard.html" class="mobile-nav-link">
                                    <span>📊</span> Dashboard
                                </a>
                            </nav>
                            
                            <div class="mobile-menu-footer">
                                <a href="login.html" class="btn-login">Login</a>
                                <a href="register.html" class="btn-register">Register</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', mobileNavHTML);
            
            // Add CSS if not already added
            if (!document.querySelector('link[href="mobile-nav.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'mobile-nav.css';
                document.head.appendChild(link);
            }
        }
        
        // Setup event listeners
        setupMobileMenu();
        highlightCurrentPage();
    }
    
    function setupMobileMenu() {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const closeBtn = document.getElementById('closeMobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        
        if (toggleBtn && overlay) {
            // Toggle menu
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu
            closeBtn.addEventListener('click', function() {
                toggleBtn.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            // Close menu when clicking overlay (not content)
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    toggleBtn.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    toggleBtn.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Smooth close when clicking nav links
            const navLinks = document.querySelectorAll('.mobile-nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    setTimeout(() => {
                        toggleBtn.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }, 300);
                });
            });
        }
    }
    
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.mobile-nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'products.html' && linkPage === 'products.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    function updateCartCount() {
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Update cart count in navbar
        const cartCounts = document.querySelectorAll('.cart-count, .cart-badge');
        cartCounts.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
        
        // Update cart link badge
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    }
    
    // Listen for cart updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateCartCount();
        }
    });
    
    // Update cart count every 2 seconds (for cross-page updates)
    setInterval(updateCartCount, 2000);
    
    console.log('📱 Mobile navbar initialized');
})();
