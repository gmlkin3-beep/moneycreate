// MOBILE TESTING UTILITY
function testMobileResponsiveness() {
    console.log('📱 MOBILE RESPONSIVENESS TEST');
    console.log('==============================');
    
    // Check viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    console.log('✅ Viewport meta tag:', viewport ? 'Found' : 'Missing');
    
    // Check touch targets
    const buttons = document.querySelectorAll('button, a.btn, input[type="submit"]');
    let smallButtons = 0;
    buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        if (rect.height < 44 || rect.width < 44) {
            smallButtons++;
        }
    });
    console.log('✅ Touch targets:', smallButtons === 0 ? 'All good' : `${smallButtons} buttons too small`);
    
    // Check font sizes
    const bodyFontSize = parseInt(getComputedStyle(document.body).fontSize);
    console.log('✅ Base font size:', bodyFontSize >= 14 ? 'Good for mobile' : 'Too small');
    
    // Check for horizontal scrolling
    const bodyWidth = document.body.scrollWidth;
    const viewportWidth = window.innerWidth;
    console.log('✅ Horizontal scroll:', bodyWidth <= viewportWidth ? 'No horizontal scroll' : 'Has horizontal scroll');
    
    // Mobile-specific elements
    console.log('✅ Mobile menu:', document.querySelector('.mobile-menu-btn') ? 'Found' : 'Not found');
    console.log('✅ Products grid:', document.querySelector('#productsGrid') ? 'Found' : 'Not found');
}

// Run test on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testMobileResponsiveness, 1000);
    
    // Add mobile test button for developers
    if (window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')) {
        const testBtn = document.createElement('button');
        testBtn.textContent = '📱 Test Mobile';
        testBtn.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:9999;background:#007bff;color:white;border:none;padding:10px;border-radius:5px;cursor:pointer;';
        testBtn.onclick = testMobileResponsiveness;
        document.body.appendChild(testBtn);
    }
});
