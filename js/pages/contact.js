// contact.js - External JavaScript for contact.html
// Extracted from inline scripts on 12/27/2025 14:06:30


                            // Pre-fill email with logged-in user's email
                            document.addEventListener('DOMContentLoaded', function() {
                                const user = JSON.parse(localStorage.getItem('user'));
                                const emailInput = document.getElementById('email');
                                
                                if (user && user.email && emailInput) {
                                    emailInput.value = user.email;
                                }
                            });
                        






        // Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        userEmail: JSON.parse(localStorage.getItem('user'))?.email || 'Not logged in'
    };
    
    // Create mailto link with user's email as sender and allover4131@gmail.com as recipient
    const subject = encodeURIComponent(`GML Online Stores Contact: ${formData.subject}`);
    const body = encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `User Account Email: ${formData.userEmail}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\nThis message was sent from GML Online Stores website contact form.`
    );
    
    // Open user's email client
    window.location.href = `mailto:allover4131@gmail.com?subject=${subject}&body=${body}`;
    
    // Show success message
    setTimeout(() => {
        alert('Thank you for your message! Please send the email that opened in your email client.');
        this.reset();
        
        // Restore user's email if they were logged in
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
            document.getElementById('email').value = user.email;
        }
    }, 1000);
});
        });
        
        // Theme functionality
        document.getElementById('themeToggle')?.addEventListener('click', function() {
            document.getElementById('themeModal').style.display = 'flex';
        });
        
        document.getElementById('closeThemeModal')?.addEventListener('click', function() {
            document.getElementById('themeModal').style.display = 'none';
        });
        
        // Theme color selection
        document.querySelectorAll('.theme-color').forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.dataset.theme;
                document.body.className = `theme-${theme}`;
                localStorage.setItem('theme', theme);
                
                // Update active button
                document.querySelectorAll('.theme-color').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                document.getElementById('themeModal').style.display = 'none';
            });
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'orange';
        document.body.className = `theme-${savedTheme}`;
        document.querySelector(`.theme-color.${savedTheme}`)?.classList.add('active');
    
