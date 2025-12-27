// MOBILE OPTIMIZATION SCRIPT
(function() {
    'use strict';
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobile);
    } else {
        initMobile();
    }
    
    function initMobile() {
        optimizeTouch();
        optimizeImages();
        improveScrolling();
        addMobileClasses();
        setupViewport();
    }
    
    // 1. Make elements touch-friendly
    function optimizeTouch() {
        // Add touch classes to interactive elements
        document.querySelectorAll('button, a, [role="button"]').forEach(el => {
            el.classList.add('touch-element');
        });
        
        // Prevent double-tap zoom
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // 2. Optimize images for mobile
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Lazy loading for mobile
            img.loading = 'lazy';
            
            // Add error handling
            img.onerror = function() {
                this.style.display = 'none';
            };
        });
    }
    
    // 3. Improve scrolling performance
    function improveScrolling() {
        // Add smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // 4. Add mobile-specific classes
    function addMobileClasses() {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Check if actually on mobile
        if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.body.classList.add('is-mobile');
        }
        
        // Add orientation class
        function updateOrientation() {
            if (window.innerHeight > window.innerWidth) {
                document.body.classList.add('portrait');
                document.body.classList.remove('landscape');
            } else {
                document.body.classList.add('landscape');
                document.body.classList.remove('portrait');
            }
        }
        
        updateOrientation();
        window.addEventListener('resize', updateOrientation);
        window.addEventListener('orientationchange', updateOrientation);
    }
    
    // 5. Setup viewport fixes
    function setupViewport() {
        // Prevent zoom on input focus (iOS fix)
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                window.scrollTo(0, 0);
                document.body.style.zoom = 1.0;
            });
        });
    }
    
    // Mobile menu toggle
    function setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('nav ul, .nav-menu, .nav-links');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.innerHTML = navMenu.classList.contains('active') ? '✕ Close' : '☰ Menu';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    menuBtn.innerHTML = '☰ Menu';
                }
            });
        }
    }
    
    // Run mobile menu setup
    setTimeout(setupMobileMenu, 100);
    
    // Console log for debugging
    console.log('📱 Mobile optimization loaded');
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen:', window.screen.width + 'x' + window.screen.height);
    console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
    
})();
