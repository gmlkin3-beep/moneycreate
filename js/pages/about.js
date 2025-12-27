// about.js - External JavaScript for about.html
document.addEventListener('DOMContentLoaded', function() {
    console.log('About page loaded');
    
    // Add any interactive features here
    // Example: Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Example: Founder section interactive features
    const founderSection = document.querySelector('.founder-section');
    if (founderSection) {
        console.log('Founder section found');
        
        // Add hover effect to contact link
        const contactLink = founderSection.querySelector('.contact-link');
        if (contactLink) {
            contactLink.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            contactLink.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
    }
    
    // Load founder data dynamically (example)
    function loadFounderData() {
        // This could be an API call in a real application
        const founderData = {
            name: 'Alex Johnson',
            title: 'CEO & Founder',
            quote: 'We build solutions that change lives.',
            email: 'founder@company.com'
        };
        
        // Update elements if they exist
        const nameElement = document.querySelector('.founder-name');
        if (nameElement) nameElement.textContent = founderData.name;
        
        const quoteElement = document.querySelector('.founder-quote');
        if (quoteElement) quoteElement.textContent = `"${founderData.quote}"`;
    }
    
    // Call the function
    loadFounderData();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
