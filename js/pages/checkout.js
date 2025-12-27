// checkout.js - External JavaScript for checkout.html
// Extracted from inline scripts on 12/27/2025 14:06:30










        document.addEventListener('DOMContentLoaded', function() {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html?redirect=checkout';
            }
            
            // Load cart items
            updateCheckoutSummary();
            
            // Fill user information if available
            fillUserInfo();
        });
        
        function fillUserInfo() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                document.getElementById('email').value = user.email || '';
                document.getElementById('phoneNumber').value = user.phoneNumber || '';
            }
        }
        
        function updateCheckoutSummary() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemsContainer = document.getElementById('checkoutItems');
            const subtotalElement = document.getElementById('checkoutSubtotal');
            const totalElement = document.getElementById('checkoutTotal');
            
            if (cart.length === 0) {
                window.location.href = 'cart.html';
                return;
            }
            
            // Calculate totals
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const delivery = 150;
            const tax = subtotal * 0.16;
            const total = subtotal + delivery + tax;
            
            // Update UI
            subtotalElement.textContent = `KES ${subtotal.toFixed(2)}`;
            document.getElementById('checkoutDelivery').textContent = `KES ${delivery.toFixed(2)}`;
            document.getElementById('checkoutTax').textContent = `KES ${tax.toFixed(2)}`;
            totalElement.textContent = `KES ${total.toFixed(2)}`;
            
            // Update M-Pesa amount
            document.getElementById('mpesaAmount').textContent = `KES ${total.toFixed(2)}`;
            
            // Generate random order ID for M-Pesa
            document.getElementById('mpesaAccountNo').textContent = Math.floor(Math.random() * 1000000000);
            
            // Display items
            itemsContainer.innerHTML = cart.map(item => `
                <div class="order-item">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                    </div>
                    <span class="item-price">KES ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }
    
