// cart.js - External JavaScript for cart.html
// Extracted from inline scripts on 12/27/2025 14:06:30








        document.addEventListener('DOMContentLoaded', function() {
            // Initialize cart
            initCartPage();
            
            // Setup theme toggle
            const themeToggle = document.getElementById('themeToggle');
            const themeModal = document.getElementById('themeModal');
            const closeThemeModal = document.getElementById('closeThemeModal');
            
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    themeModal.style.display = 'flex';
                });
            }
            
            if (closeThemeModal) {
                closeThemeModal.addEventListener('click', () => {
                    themeModal.style.display = 'none';
                });
            }
            
            // Theme color buttons
            document.querySelectorAll('.theme-color').forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    document.body.className = `theme-${theme}`;
                    localStorage.setItem('theme', theme);
                    
                    // Update active button
                    document.querySelectorAll('.theme-color').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    themeModal.style.display = 'none';
                    
                    // Show notification
                    showNotification(`Theme changed to ${theme}`, 'success');
                });
            });
            
            // Mobile menu toggle
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                });
            }
            
            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.nav-links') && !event.target.closest('.menu-toggle')) {
                    navLinks.classList.remove('active');
                }
            });
            
            // Load recently viewed products
            loadRecentlyViewed();
        });
        
        // Function to show notification
        function showNotification(message, type = 'success') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type} notification-slide`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 500);
            }, 5000);
            
            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
        }
        
        // Load recently viewed products
        async function loadRecentlyViewed() {
            try {
                const response = await fetch('http://localhost:5000/api/products/featured');
                const products = await response.json();
                
                const recentProductsContainer = document.getElementById('recentProducts');
                if (recentProductsContainer && products.length > 0) {
                    // Take first 4 featured products as "recently viewed"
                    const recentProducts = products.slice(0, 4);
                    
                    recentProductsContainer.innerHTML = recentProducts.map(product => `
                        <div class="recent-product-card">
                            <div class="recent-product-image">
                                <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${product.name}">
                            </div>
                            <div class="recent-product-info">
                                <h4>${product.name}</h4>
                                <p class="price">KES ${product.price.toFixed(2)}</p>
                                <button class="btn-add-to-cart-sm" onclick="addToCart(${product.id})">
                                    <i class="fas fa-cart-plus"></i> Add
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                console.error('Error loading recently viewed products:', error);
            }
        }
        
        // Add to cart function
        async function addToCart(productId, quantity = 1) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${productId}`);
                const product = await response.json();
                
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    if (existingItem.quantity + quantity > product.quantity) {
                        showNotification(`Only ${product.quantity} items available in stock`, 'error');
                        return;
                    }
                    existingItem.quantity += quantity;
                } else {
                    if (quantity > product.quantity) {
                        showNotification(`Only ${product.quantity} items available in stock`, 'error');
                        return;
                    }
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: quantity,
                        image: product.imageUrl,
                        maxQuantity: product.quantity
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                showNotification(`${product.name} added to cart!`, 'success');
                
            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Error adding product to cart', 'error');
            }
        }
        
        // Update cart display
        function updateCartDisplay() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItemsList = document.getElementById('cartItemsList');
            const emptyCart = document.getElementById('emptyCart');
            const cartItemCount = document.getElementById('cartItemCount');
            
            // Update cart count in header
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = totalItems;
            });
            
            if (cartItemCount) {
                cartItemCount.textContent = totalItems;
            }
            
            if (cart.length === 0) {
                if (cartItemsList) cartItemsList.style.display = 'none';
                if (emptyCart) emptyCart.style.display = 'block';
                updateOrderSummary();
                return;
            }
            
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartItemsList) {
                cartItemsList.style.display = 'block';
                cartItemsList.innerHTML = cart.map((item, index) => `
                    <div class="cart-item animate-card" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <div class="item-header">
                                <h4 class="item-name">${item.name}</h4>
                                <button class="item-remove" onclick="removeFromCart(${index})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <p class="item-price">KES ${item.price.toFixed(2)} each</p>
                            <div class="item-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.maxQuantity}" 
                                           onchange="updateQuantityInput(${index}, this.value)">
                                    <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div class="item-total">
                                    KES ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            
            updateOrderSummary();
        }
        
        // Update order summary
        function updateOrderSummary() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            const deliveryFee = 150;
            const tax = subtotal * 0.16;
            const total = subtotal + deliveryFee + tax;
            
            // Apply discount if any
            const discountElement = document.getElementById('discount');
            let discount = 0;
            if (discountElement && discountElement.textContent.includes('KES')) {
                const discountText = discountElement.textContent.replace('- KES ', '').replace(',', '');
                discount = parseFloat(discountText) || 0;
            }
            
            const finalTotal = total - discount;
            
            // Update UI
            document.getElementById('subtotal').textContent = `KES ${subtotal.toFixed(2)}`;
            document.getElementById('deliveryFee').textContent = `KES ${deliveryFee.toFixed(2)}`;
            document.getElementById('tax').textContent = `KES ${tax.toFixed(2)}`;
            document.getElementById('totalAmount').textContent = `KES ${finalTotal.toFixed(2)}`;
        }
        
        // Remove item from cart
        function removeFromCart(index) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemName = cart[index].name;
            
            if (confirm(`Remove ${itemName} from cart?`)) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                showNotification(`${itemName} removed from cart`, 'success');
            }
        }
        
        // Update quantity
        function updateQuantity(index, change) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            cart[index].quantity += change;
            
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }
            
            if (cart[index].quantity > cart[index].maxQuantity) {
                cart[index].quantity = cart[index].maxQuantity;
                showNotification(`Maximum ${cart[index].maxQuantity} items available`, 'error');
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
        
        // Update quantity from input
        function updateQuantityInput(index, value) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const newQuantity = parseInt(value) || 1;
            
            if (newQuantity < 1) {
                cart[index].quantity = 1;
            } else if (newQuantity > cart[index].maxQuantity) {
                cart[index].quantity = cart[index].maxQuantity;
                showNotification(`Maximum ${cart[index].maxQuantity} items available`, 'error');
            } else {
                cart[index].quantity = newQuantity;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
        
        // Apply promo code
        document.getElementById('applyPromoBtn').addEventListener('click', function() {
            const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
            const promoMessage = document.getElementById('promoMessage');
            
            const validPromos = {
                'WELCOME10': 10,
                'SAVE20': 20,
                'FRESH15': 15
            };
            
            if (validPromos[promoCode]) {
                const discountPercent = validPromos[promoCode];
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                let subtotal = 0;
                cart.forEach(item => {
                    subtotal += item.price * item.quantity;
                });
                
                const discountAmount = (subtotal * discountPercent) / 100;
                document.getElementById('discount').textContent = `- KES ${discountAmount.toFixed(2)}`;
                
                promoMessage.textContent = `Promo code applied! ${discountPercent}% discount`;
                promoMessage.className = 'promo-message success';
                
                updateOrderSummary();
                showNotification(`Promo code ${promoCode} applied successfully!`, 'success');
            } else {
                promoMessage.textContent = 'Invalid promo code';
                promoMessage.className = 'promo-message error';
                showNotification('Invalid promo code', 'error');
            }
        });
        
        // Clear cart
        document.getElementById('clearCartBtn').addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Your cart is already empty', 'info');
                return;
            }
            
            if (confirm('Are you sure you want to clear your entire cart?')) {
                localStorage.removeItem('cart');
                updateCartDisplay();
                showNotification('Cart cleared successfully', 'success');
            }
        });
        
        // Checkout button
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                showNotification('Your cart is empty. Add some products first!', 'error');
                return;
            }
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('Please login to checkout', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html?redirect=checkout';
                }, 1500);
                return;
            }
            
            // Get selected delivery method
            const selectedDelivery = document.querySelector('input[name="delivery"]:checked').value;
            localStorage.setItem('deliveryMethod', selectedDelivery);
            
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
        
        // Initialize cart on page load
        updateCartDisplay();
        
        // Add CSS for notifications and recent products
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: var(--shadow);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 2000;
            }
            
            .notification-error {
                background-color: var(--danger-color);
            }
            
            .notification-info {
                background-color: var(--info-color);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1rem;
            }
            
            .cart-tips {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-top: 3rem;
                padding: 2rem;
                background-color: var(--bg-light);
                border-radius: var(--radius);
            }
            
            .tip-card {
                text-align: center;
                padding: 1.5rem;
                background-color: var(--white);
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                transition: var(--transition);
            }
            
            .tip-card:hover {
                transform: translateY(-5px);
            }
            
            .tip-card i {
                font-size: 2rem;
                color: var(--primary-color);
                margin-bottom: 1rem;
            }
            
            .tip-card h4 {
                margin-bottom: 0.5rem;
                color: var(--text-color);
            }
            
            .tip-card p {
                color: var(--text-light);
                font-size: 0.9rem;
            }
            
            .recent-products {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-top: 1rem;
            }
            
            .recent-product-card {
                background-color: var(--white);
                border-radius: var(--radius);
                overflow: hidden;
                box-shadow: var(--shadow);
                transition: var(--transition);
            }
            
            .recent-product-card:hover {
                transform: translateY(-5px);
            }
            
            .recent-product-image {
                height: 120px;
                overflow: hidden;
            }
            
            .recent-product-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .recent-product-info {
                padding: 1rem;
            }
            
            .recent-product-info h4 {
                font-size: 1rem;
                margin-bottom: 0.5rem;
                color: var(--text-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .recent-product-info .price {
                color: var(--primary-color);
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .btn-add-to-cart-sm {
                width: 100%;
                padding: 0.5rem;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.3rem;
            }
            
            .social-links {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .social-links a {
                color: var(--text-light);
                font-size: 1.2rem;
                transition: var(--transition);
            }
            
            .social-links a:hover {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(additionalStyles);
    
