// Cart Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCartPage();
});

// Initialize Cart Page
function initCartPage() {
    // Check if we're on cart page
    if (!window.location.pathname.includes('cart.html') && 
        !window.location.pathname.includes('checkout.html')) {
        return;
    }
    
    // Load cart items
    loadCartItems();
    
    // Setup event listeners
    setupCartEventListeners();
    
    // Calculate totals
    calculateCartTotals();
}

// Load Cart Items
function loadCartItems() {
    const cart = getCart();
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItemsList || !emptyCart) return;
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        emptyCart.style.display = 'block';
        updateCartCount();
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItemsList.style.display = 'block';
    
    cartItemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <div class="item-header">
                    <h4 class="item-name">${item.name}</h4>
                    <button class="item-remove" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <p class="item-price">KES ${item.price.toFixed(2)} each</p>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.maxQuantity}" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">
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

// Get Cart from LocalStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save Cart to LocalStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
    
    // Update cart page item count
    const cartItemCount = document.getElementById('cartItemCount');
    if (cartItemCount) {
        cartItemCount.textContent = totalItems;
    }
}

// Calculate Cart Totals
function calculateCartTotals() {
    const cart = getCart();
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const deliveryFee = 150;
    const tax = subtotal * 0.16;
    const total = subtotal + deliveryFee + tax;
    
    // Update UI elements if they exist
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = `KES ${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `KES ${deliveryFee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `KES ${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `KES ${total.toFixed(2)}`;
}

// Setup Cart Event Listeners
function setupCartEventListeners() {
    // Quantity controls
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const index = parseInt(btn.dataset.index);
            const cart = getCart();
            
            if (btn.classList.contains('plus')) {
                if (cart[index].quantity < cart[index].maxQuantity) {
                    cart[index].quantity++;
                } else {
                    showNotification(`Maximum ${cart[index].maxQuantity} items available`, 'error');
                    return;
                }
            } else if (btn.classList.contains('minus')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    // Remove item if quantity becomes 0
                    showRemoveConfirmation(index);
                    return;
                }
            }
            
            saveCart(cart);
            loadCartItems();
            calculateCartTotals();
            updateCartCount();
        }
    });
    
    // Quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const input = e.target;
            const index = parseInt(input.dataset.index);
            const cart = getCart();
            const newQuantity = parseInt(input.value) || 1;
            
            if (newQuantity < 1) {
                input.value = 1;
                cart[index].quantity = 1;
            } else if (newQuantity > cart[index].maxQuantity) {
                input.value = cart[index].maxQuantity;
                cart[index].quantity = cart[index].maxQuantity;
                showNotification(`Maximum ${cart[index].maxQuantity} items available`, 'error');
            } else {
                cart[index].quantity = newQuantity;
            }
            
            saveCart(cart);
            loadCartItems();
            calculateCartTotals();
            updateCartCount();
        }
    });
    
    // Remove item buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.item-remove')) {
            const btn = e.target.closest('.item-remove');
            const index = parseInt(btn.dataset.index);
            showRemoveConfirmation(index);
        }
    });
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (getCart().length === 0) return;
            
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        });
    }
    
    // Apply promo code
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html?redirect=checkout';
                return;
            }
            
            window.location.href = 'checkout.html';
        });
    }
}

// Show Remove Confirmation
function showRemoveConfirmation(index) {
    const cart = getCart();
    const item = cart[index];
    
    if (confirm(`Remove ${item.name} from cart?`)) {
        cart.splice(index, 1);
        saveCart(cart);
        loadCartItems();
        calculateCartTotals();
        updateCartCount();
        showNotification('Item removed from cart', 'success');
    }
}

// Clear Entire Cart
function clearCart() {
    localStorage.removeItem('cart');
    loadCartItems();
    calculateCartTotals();
    updateCartCount();
    showNotification('Cart cleared', 'success');
}

// Apply Promo Code
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.trim();
    const promoMessage = document.getElementById('promoMessage');
    
    if (!promoCode) {
        promoMessage.textContent = 'Please enter a promo code';
        promoMessage.className = 'promo-message error';
        return;
    }
    
    const validCodes = {
        'WELCOME10': 10,
        'SAVE20': 20,
        'FRESH15': 15
    };
    
    if (validCodes[promoCode.toUpperCase()]) {
        const discount = validCodes[promoCode.toUpperCase()];
        promoMessage.textContent = `Promo code applied! ${discount}% discount`;
        promoMessage.className = 'promo-message success';
        
        // Calculate and apply discount
        applyDiscount(discount);
    } else {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'promo-message error';
    }
}

// Apply Discount
function applyDiscount(percentage) {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const discountAmount = (subtotal * percentage) / 100;
    const discountEl = document.getElementById('discount');
    
    if (discountEl) {
        discountEl.textContent = `- KES ${discountAmount.toFixed(2)}`;
        
        // Update total
        const deliveryFee = 150;
        const tax = subtotal * 0.16;
        const total = subtotal + deliveryFee + tax - discountAmount;
        
        const totalEl = document.getElementById('totalAmount');
        if (totalEl) {
            totalEl.textContent = `KES ${total.toFixed(2)}`;
        }
    }
}

// Add to Cart Function (called from other pages)
function addToCart(productId, quantity = 1) {
    // First, get product details
    fetch(`http://localhost:5000/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const cart = getCart();
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
            
            saveCart(cart);
            updateCartCount();
            showNotification(`${product.name} added to cart!`, 'success');
            
            // Animation
            if (event && event.target) {
                const btn = event.target.closest('.btn-add-to-cart') || event.target;
                btn.classList.add('add-to-cart-animation');
                setTimeout(() => btn.classList.remove('add-to-cart-animation'), 500);
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showNotification('Error adding product to cart', 'error');
        });
}

// Get Cart Total Items
function getCartTotalItems() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Get Cart Total Price
function getCartTotalPrice() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Export functions for use in other files
window.cart = {
    getCart,
    saveCart,
    addToCart,
    getCartTotalItems,
    getCartTotalPrice,
    clearCart,
    updateCartCount
};
