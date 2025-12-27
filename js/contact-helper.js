// contact-helper.js - Enhanced contact form functionality
const ContactHelper = {
    // Initialize contact forms
    init: function() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupSupportForms();
    },
    
    // Setup main contact form
    setupContactForm: function() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Pre-fill user email if logged in
        this.prefillUserEmail();
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            try {
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Get form data
                const formData = {
                    name: `${document.getElementById('firstName')?.value || ''} ${document.getElementById('lastName')?.value || ''}`.trim(),
                    email: document.getElementById('email')?.value || '',
                    phone: document.getElementById('phone')?.value || '',
                    subject: document.getElementById('subject')?.value || 'General Inquiry',
                    message: document.getElementById('message')?.value || '',
                    userAccountEmail: JSON.parse(localStorage.getItem('user'))?.email || 'Not logged in',
                    timestamp: new Date().toISOString()
                };
                
                // Here you would typically send to a backend
                // For now, create mailto link
                const mailtoLink = ContactHelper.createMailtoLink(formData);
                
                // Open email client
                window.open(mailtoLink, '_blank');
                
                // Show success message
                ContactHelper.showNotification('Email client opened! Please send the pre-filled email.', 'success');
                
                // Reset form but keep user email
                contactForm.reset();
                ContactHelper.prefillUserEmail();
                
            } catch (error) {
                ContactHelper.showNotification('Error: ' + error.message, 'error');
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    },
    
    // Pre-fill email with logged-in user's email
    prefillUserEmail: function() {
        const user = JSON.parse(localStorage.getItem('user'));
        const emailInput = document.getElementById('email');
        
        if (user && user.email && emailInput && !emailInput.value) {
            emailInput.value = user.email;
        }
    },
    
    // Create mailto link
    createMailtoLink: function(formData) {
        const recipient = 'allover4131@gmail.com';
        const subject = encodeURIComponent(`GML Online Stores - ${formData.subject}`);
        const body = encodeURIComponent(
`CONTACT FORM SUBMISSION
=======================

From: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
User Account: ${formData.userAccountEmail}
Time: ${new Date(formData.timestamp).toLocaleString()}

MESSAGE:
${formData.message}

---
This message was sent via GML Online Stores contact form.
For support, call: 0741 128 853`
        );
        
        return `mailto:${recipient}?subject=${subject}&body=${body}`;
    },
    
    // Setup newsletter subscription
    setupNewsletterForm: function() {
        const newsletterForm = document.getElementById('newsletterForm');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Save to localStorage
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [];
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
            }
            
            ContactHelper.showNotification('Thank you for subscribing to GML Online Stores newsletter!', 'success');
            newsletterForm.reset();
        });
    },
    
    // Setup support forms
    setupSupportForms: function() {
        // Quick support buttons
        document.querySelectorAll('.btn-email-support').forEach(button => {
            button.addEventListener('click', function() {
                const user = JSON.parse(localStorage.getItem('user'));
                const userEmail = user?.email || '';
                
                const subject = encodeURIComponent('GML Online Stores Support Request');
                const body = encodeURIComponent(
`SUPPORT REQUEST
===============

User Account: ${userEmail || 'Not logged in'}
Issue Type: General Support
Time: ${new Date().toLocaleString()}

Please describe your issue below:





---
For urgent matters, call: 0741 128 853`
                );
                
                window.open(`mailto:allover4131@gmail.com?subject=${subject}&body=${body}`, '_blank');
            });
        });
        
        // Quick call buttons
        document.querySelectorAll('.btn-call-support').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Call GML Online Stores support at 0741 128 853?')) {
                    window.location.href = 'tel:0741128853';
                }
            });
        });
    },
    
    // Show notification
    showNotification: function(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `contact-notification contact-notification-${type}`;
        notification.innerHTML = `
            <div class="contact-notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="contact-notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('contact-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'contact-notification-styles';
            style.textContent = `
                .contact-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 9999;
                    animation: slideInRight 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                }
                .contact-notification-success { background: var(--success-color); }
                .contact-notification-error { background: var(--danger-color); }
                .contact-notification-info { background: var(--info-color); }
                .contact-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .contact-notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-left: 1rem;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.contact-notification-close').addEventListener('click', () => {
            notification.remove();
        });
    },
    
    // Quick contact methods
    quickEmail: function(subject = '', body = '') {
        const user = JSON.parse(localStorage.getItem('user'));
        const userEmail = user?.email || '';
        
        const finalSubject = subject || 'GML Online Stores Inquiry';
        const finalBody = body || 
`INQUIRY
=======

User Account: ${userEmail || 'Not logged in'}
Time: ${new Date().toLocaleString()}

Message:




---
GML Online Stores - 0741 128 853`;
        
        const encodedSubject = encodeURIComponent(finalSubject);
        const encodedBody = encodeURIComponent(finalBody);
        
        window.open(`mailto:allover4131@gmail.com?subject=${encodedSubject}&body=${encodedBody}`, '_blank');
    },
    
    quickCall: function() {
        if (confirm('Call GML Online Stores support at 0741 128 853?')) {
            window.location.href = 'tel:0741128853';
        }
    }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContactHelper.init());
} else {
    ContactHelper.init();
}

// Make it globally available
window.ContactHelper = ContactHelper;
