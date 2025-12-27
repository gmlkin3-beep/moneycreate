// register.js - External JavaScript for register.html
// Extracted from inline scripts on 12/27/2025 14:06:30




        document.addEventListener('DOMContentLoaded', function() {
            // Toggle password visibility
            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
            
            toggleConfirmPassword.addEventListener('click', function() {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
            
            // Password strength indicator
            passwordInput.addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
            
            // Terms modal
            const termsLink = document.getElementById('termsLink');
            const termsModal = document.getElementById('termsModal');
            const acceptTerms = document.getElementById('acceptTerms');
            const declineTerms = document.getElementById('declineTerms');
            const termsCheckbox = document.getElementById('terms');
            
            termsLink.addEventListener('click', function(e) {
                e.preventDefault();
                termsModal.style.display = 'flex';
            });
            
            acceptTerms.addEventListener('click', function() {
                termsCheckbox.checked = true;
                termsModal.style.display = 'none';
            });
            
            declineTerms.addEventListener('click', function() {
                termsCheckbox.checked = false;
                termsModal.style.display = 'none';
            });
        });
        
        function checkPasswordStrength(password) {
            const strengthBar = document.querySelector('.strength-fill');
            const strengthText = document.querySelector('.strength-text');
            const strengthContainer = document.getElementById('passwordStrength');
            
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength++;
            
            // Lowercase check
            if (/[a-z]/.test(password)) strength++;
            
            // Uppercase check
            if (/[A-Z]/.test(password)) strength++;
            
            // Number check
            if (/[0-9]/.test(password)) strength++;
            
            // Special character check
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            // Update UI
            strengthContainer.className = 'password-strength';
            
            switch(strength) {
                case 0:
                case 1:
                    strengthContainer.classList.add('strength-weak');
                    strengthText.textContent = 'Weak password';
                    break;
                case 2:
                    strengthContainer.classList.add('strength-fair');
                    strengthText.textContent = 'Fair password';
                    break;
                case 3:
                case 4:
                    strengthContainer.classList.add('strength-good');
                    strengthText.textContent = 'Good password';
                    break;
                case 5:
                    strengthContainer.classList.add('strength-strong');
                    strengthText.textContent = 'Strong password';
                    break;
            }
        }
    
