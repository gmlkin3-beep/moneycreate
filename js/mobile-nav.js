// MOBILE NAVIGATION SCRIPT
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-btn')) {
        const nav = document.querySelector('nav, .navbar, header');
        if (nav) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰ Menu';
            menuBtn.style.cssText = `
                display: none;
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                margin: 10px 0;
            `;
            
            // Insert at beginning of nav
            nav.insertBefore(menuBtn, nav.firstChild);
            
            // Toggle menu on click
            menuBtn.addEventListener('click', function() {
                const navMenu = nav.querySelector('ul, .nav-links, .menu');
                if (navMenu) {
                    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
                    navMenu.style.flexDirection = 'column';
                    navMenu.style.width = '100%';
                }
            });
        }
    }
    
    // Add CSS for mobile menu
    const mobileMenuCSS = `
        @media screen and (max-width: 768px) {
            .mobile-menu-btn { display: block !important; }
            nav ul, .nav-links, .menu { 
                display: none !important;
                flex-direction: column !important;
                width: 100% !important;
                background: white;
                position: absolute;
                top: 60px;
                left: 0;
                z-index: 1000;
                box-shadow: 0 5px 10px rgba(0,0,0,0.1);
            }
            nav ul.active, .nav-links.active, .menu.active {
                display: flex !important;
            }
            nav a, .nav-link {
                padding: 15px !important;
                border-bottom: 1px solid #eee !important;
                width: 100% !important;
                text-align: left !important;
            }
        }
    `;
    
    // Add the CSS
    const style = document.createElement('style');
    style.textContent = mobileMenuCSS;
    document.head.appendChild(style);
});
