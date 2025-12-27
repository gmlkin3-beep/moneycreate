// privacy.js - External JavaScript for privacy.html
// Extracted from inline scripts on 12/27/2025 14:06:30




        // FAQ functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                faqItem.classList.toggle('active');
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
    
