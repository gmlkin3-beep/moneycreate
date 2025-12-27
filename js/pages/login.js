// login.js - External JavaScript for login.html
// Extracted from inline scripts on 12/27/2025 14:06:30




        // Add form submit handler
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Save token and user data
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));
                    
                    alert('Login successful!');
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed: ' + data.message);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    
