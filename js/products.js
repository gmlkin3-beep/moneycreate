// products.js - Products Page Functionality with Cart Animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page
    initializeProductsPage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial products
    loadProducts();
});

// Product data - Less than 34 items per category
const products = [
    // Fruits Category (10 items)
    { id: 1, name: "Fresh Apples", category: "fruits", price: 120, 
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400", 
      description: "Crispy red apples, perfect for snacks", rating: 4.5, stock: 50,
      badge: "new" },
    { id: 2, name: "Sweet Bananas", category: "fruits", price: 80, 
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", 
      description: "Ripe yellow bananas, rich in potassium", rating: 4.7, stock: 100,
      badge: "popular" },
    { id: 3, name: "Juicy Oranges", category: "fruits", price: 100, 
      image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400", 
      description: "Sweet and tangy oranges, vitamin C rich", rating: 4.6, stock: 75,
      badge: null },
    { id: 4, name: "Fresh Grapes", category: "fruits", price: 200, 
      image: "https://images.unsplash.com/photo-1515777315835-281b94c9589f?w=400", 
      description: "Seedless green grapes, sweet and refreshing", rating: 4.8, stock: 40,
      badge: "new" },
    { id: 5, name: "Ripe Mangoes", category: "fruits", price: 150, 
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", 
      description: "Sweet Kenyan mangoes, perfect for juice", rating: 4.9, stock: 60,
      badge: "sale" },
    { id: 6, name: "Fresh Pineapples", category: "fruits", price: 250, 
      image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400", 
      description: "Tropical pineapples, sweet and tangy", rating: 4.4, stock: 30,
      badge: null },
    { id: 7, name: "Sweet Watermelons", category: "fruits", price: 300, 
      image: "https://images.unsplash.com/photo-1563114773-84201d281952?w=400", 
      description: "Juicy watermelons, perfect for summer", rating: 4.7, stock: 25,
      badge: "popular" },
    { id: 8, name: "Fresh Avocados", category: "fruits", price: 50, 
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400", 
      description: "Creamy avocados, great for salads", rating: 4.6, stock: 80,
      badge: null },
    { id: 9, name: "Sweet Strawberries", category: "fruits", price: 350, 
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400", 
      description: "Fresh strawberries, perfect for desserts", rating: 4.8, stock: 45,
      badge: "new" },
    { id: 10, name: "Fresh Papayas", category: "fruits", price: 180, 
      image: "https://images.unsplash.com/photo-1556740732-9c9b0b8b1b1c?w=400", 
      description: "Sweet papayas, rich in vitamins", rating: 4.5, stock: 35,
      badge: null },

    // Vegetables Category (10 items)
    { id: 11, name: "Fresh Tomatoes", category: "vegetables", price: 60, 
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", 
      description: "Red ripe tomatoes, perfect for salads", rating: 4.5, stock: 100,
      badge: null },
    { id: 12, name: "Fresh Onions", category: "vegetables", price: 70, 
      image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400", 
      description: "Fresh red onions, essential for cooking", rating: 4.3, stock: 120,
      badge: null },
    { id: 13, name: "Fresh Potatoes", category: "vegetables", price: 90, 
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", 
      description: "Organic potatoes, perfect for fries", rating: 4.6, stock: 200,
      badge: "popular" },
    { id: 14, name: "Fresh Carrots", category: "vegetables", price: 80, 
      image: "https://images.unsplash.com/photo-1598170845058-78131a90f4bf?w=400", 
      description: "Sweet carrots, great for juice", rating: 4.7, stock: 150,
      badge: null },
    { id: 15, name: "Fresh Cabbages", category: "vegetables", price: 120, 
      image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400", 
      description: "Green cabbages, perfect for salads", rating: 4.4, stock: 80,
      badge: null },
    { id: 16, name: "Fresh Spinach", category: "vegetables", price: 100, 
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", 
      description: "Organic spinach, rich in iron", rating: 4.8, stock: 60,
      badge: "new" },
    { id: 17, name: "Fresh Broccoli", category: "vegetables", price: 150, 
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400", 
      description: "Fresh broccoli, perfect for stir fry", rating: 4.5, stock: 40,
      badge: null },
    { id: 18, name: "Fresh Bell Peppers", category: "vegetables", price: 200, 
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", 
      description: "Colorful bell peppers, great for cooking", rating: 4.6, stock: 70,
      badge: "sale" },
    { id: 19, name: "Fresh Garlic", category: "vegetables", price: 40, 
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", 
      description: "Fresh garlic cloves, essential flavor", rating: 4.7, stock: 90,
      badge: null },
    { id: 20, name: "Fresh Ginger", category: "vegetables", price: 50, 
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", 
      description: "Fresh ginger root, perfect for tea", rating: 4.6, stock: 60,
      badge: null },

    // Dairy Category (8 items)
    { id: 21, name: "Fresh Milk", category: "dairy", price: 80, 
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", 
      description: "Fresh cow milk, pasteurized", rating: 4.8, stock: 200,
      badge: "popular" },
    { id: 22, name: "Cheddar Cheese", category: "dairy", price: 300, 
      image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400", 
      description: "Aged cheddar cheese, perfect for sandwiches", rating: 4.6, stock: 50,
      badge: null },
    { id: 23, name: "Fresh Yogurt", category: "dairy", price: 120, 
      image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400", 
      description: "Natural yogurt, probiotic rich", rating: 4.7, stock: 100,
      badge: "new" },
    { id: 24, name: "Fresh Butter", category: "dairy", price: 250, 
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400", 
      description: "Salted butter, perfect for baking", rating: 4.5, stock: 40,
      badge: null },
    { id: 25, name: "Fresh Cream", category: "dairy", price: 180, 
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", 
      description: "Whipping cream, perfect for desserts", rating: 4.4, stock: 30,
      badge: null },
    { id: 26, name: "Cottage Cheese", category: "dairy", price: 200, 
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", 
      description: "Fresh cottage cheese, low fat", rating: 4.6, stock: 45,
      badge: "sale" },
    { id: 27, name: "Mozzarella Cheese", category: "dairy", price: 350, 
      image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400", 
      description: "Fresh mozzarella, perfect for pizza", rating: 4.8, stock: 25,
      badge: "popular" },
    { id: 28, name: "Fresh Eggs", category: "dairy", price: 400, 
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", 
      description: "Farm fresh eggs, 30 pieces tray", rating: 4.9, stock: 60,
      badge: "new" },

    // Meat & Poultry Category (6 items)
    { id: 29, name: "Fresh Beef", category: "meat", price: 600, 
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", 
      description: "Quality beef, perfect for stew", rating: 4.7, stock: 40,
      badge: null },
    { id: 30, name: "Fresh Chicken", category: "meat", price: 450, 
      image: "https://images.unsplash.com/photo-1501200291289-c5d76f5d1b77?w=400", 
      description: "Whole chicken, fresh and cleaned", rating: 4.8, stock: 50,
      badge: "popular" },
    { id: 31, name: "Fresh Pork", category: "meat", price: 550, 
      image: "https://images.unsplash.com/photo-1501200291289-c5d76f5d1b77?w=400", 
      description: "Fresh pork chops, boneless", rating: 4.6, stock: 35,
      badge: "sale" },
    { id: 32, name: "Fresh Mutton", category: "meat", price: 700, 
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", 
      description: "Tender mutton, perfect for biryani", rating: 4.5, stock: 25,
      badge: null },
    { id: 33, name: "Fresh Fish", category: "meat", price: 800, 
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", 
      description: "Fresh tilapia fish, cleaned", rating: 4.9, stock: 30,
      badge: "new" },
    { id: 34, name: "Fresh Sausages", category: "meat", price: 350, 
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400", 
      description: "Beef sausages, perfect for breakfast", rating: 4.4, stock: 60,
      badge: null },

    // Bakery Category (8 items)
    { id: 35, name: "Fresh Bread", category: "bakery", price: 80, 
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", 
      description: "Fresh white bread, soft and delicious", rating: 4.7, stock: 100,
      badge: "popular" },
    { id: 36, name: "Croissants", category: "bakery", price: 120, 
      image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?w=400", 
      description: "Buttery croissants, perfect with coffee", rating: 4.8, stock: 50,
      badge: "new" },
    { id: 37, name: "Bagels", category: "bakery", price: 100, 
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400", 
      description: "Fresh bagels, sesame seed topping", rating: 4.6, stock: 40,
      badge: null },
    { id: 38, name: "Donuts", category: "bakery", price: 150, 
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400", 
      description: "Glazed donuts, sweet and soft", rating: 4.9, stock: 60,
      badge: "sale" },
    { id: 39, name: "Muffins", category: "bakery", price: 200, 
      image: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=400", 
      description: "Chocolate chip muffins, fresh daily", rating: 4.7, stock: 45,
      badge: null },
    { id: 40, name: "Cake Slices", category: "bakery", price: 250, 
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", 
      description: "Chocolate cake slices, moist and rich", rating: 4.8, stock: 30,
      badge: "popular" },
    { id: 41, name: "Cookies", category: "bakery", price: 180, 
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400", 
      description: "Chocolate chip cookies, crunchy", rating: 4.6, stock: 80,
      badge: null },
    { id: 42, name: "Fresh Buns", category: "bakery", price: 60, 
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", 
      description: "Soft burger buns, perfect for parties", rating: 4.5, stock: 120,
      badge: "new" },

    // Beverages Category (8 items)
    { id: 43, name: "Orange Juice", category: "beverages", price: 200, 
      image: "https://images.unsplash.com/photo-1621506289937-a8e4d2405c43?w=400", 
      description: "Fresh orange juice, no added sugar", rating: 4.7, stock: 70,
      badge: "popular" },
    { id: 44, name: "Apple Juice", category: "beverages", price: 180, 
      image: "https://images.unsplash.com/photo-1621506289937-a8e4d2405c43?w=400", 
      description: "Pure apple juice, refreshing", rating: 4.6, stock: 60,
      badge: null },
    { id: 45, name: "Soda Drinks", category: "beverages", price: 120, 
      image: "https://images.unsplash.com/photo-1621506289937-a8e4d2405c43?w=400", 
      description: "Assorted soda drinks, 500ml", rating: 4.4, stock: 150,
      badge: "sale" },
    { id: 46, name: "Mineral Water", category: "beverages", price: 50, 
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", 
      description: "Pure mineral water, 1 liter", rating: 4.8, stock: 200,
      badge: null },
    { id: 47, name: "Energy Drinks", category: "beverages", price: 150, 
      image: "https://images.unsplash.com/photo-1621506289937-a8e4d2405c43?w=400", 
      description: "Energy boosting drinks, 250ml", rating: 4.3, stock: 90,
      badge: null },
    { id: 48, name: "Coffee Beans", category: "beverages", price: 400, 
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", 
      description: "Premium coffee beans, arabica", rating: 4.9, stock: 40,
      badge: "new" },
    { id: 49, name: "Tea Leaves", category: "beverages", price: 250, 
      image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400", 
      description: "Kenyan tea leaves, premium quality", rating: 4.8, stock: 80,
      badge: "popular" },
    { id: 50, name: "Fresh Smoothie", category: "beverages", price: 300, 
      image: "https://images.unsplash.com/photo-1621506289937-a8e4d2405c43?w=400", 
      description: "Mixed fruit smoothie, healthy option", rating: 4.7, stock: 35,
      badge: null }
];

// Initialize products page
function initializeProductsPage() {
    // Update cart count
    updateCartCount();
    
    // Setup category filtering
    setupCategoryFilters();
    
    // Setup quick view modal
    setupQuickViewModal();
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('productSearch').addEventListener('input', filterProducts);
    
    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Price filter
    document.getElementById('priceSlider').addEventListener('input', function() {
        document.getElementById('maxPrice').value = this.value;
        filterProducts();
    });
    
    // Price inputs
    document.getElementById('minPrice').addEventListener('input', filterProducts);
    document.getElementById('maxPrice').addEventListener('input', filterProducts);
    
    // Sort by
    document.getElementById('sortBy').addEventListener('change', filterProducts);
    
    // Apply filters button
    document.getElementById('applyFilters').addEventListener('click', filterProducts);
    
    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Reset search
    document.getElementById('resetSearch')?.addEventListener('click', clearFilters);
    
    // Load more button
    document.getElementById('loadMoreBtn')?.addEventListener('click', loadMoreProducts);
    
    // Close quick view modal
    document.getElementById('closeQuickView').addEventListener('click', closeQuickView);
    
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleThemeModal);
    document.getElementById('closeThemeModal')?.addEventListener('click', closeThemeModal);
}

// Load products
function loadProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('productsGrid');
    const loadingElement = document.getElementById('loadingProducts');
    const noProductsElement = document.getElementById('noProducts');
    
    // Show loading
    loadingElement.style.display = 'block';
    noProductsElement.style.display = 'none';
    productsGrid.innerHTML = '';
    
    // Simulate loading delay for animation
    setTimeout(() => {
        const productsToShow = filteredProducts || products;
        
        if (productsToShow.length === 0) {
            loadingElement.style.display = 'none';
            noProductsElement.style.display = 'block';
            return;
        }
        
        // Display products
        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        
        // Add event listeners to new buttons
        setupProductCardListeners();
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        // Show/hide load more button
        const loadMoreElement = document.getElementById('loadMore');
        if (loadMoreElement) {
            loadMoreElement.style.display = productsToShow.length >= 12 ? 'block' : 'none';
        }
        
    }, 500);
}

// Create product card HTML
function createProductCard(product) {
    const badge = product.badge ? 
        `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? 'SALE' : product.badge.toUpperCase()}</span>` : '';
    
    const stars = getStarRating(product.rating);
    
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${badge}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <div class="product-price">KES ${product.price}</div>
                    <div class="product-rating">
                        ${stars}
                        <span class="rating-count">(${product.rating})</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn-quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Setup product card listeners
function setupProductCardListeners() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCartWithAnimation(productId, this);
        });
    });
    
    // Quick view buttons
    document.querySelectorAll('.btn-quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            showQuickView(productId);
        });
    });
}

// Add to cart with animation
function addToCartWithAnimation(productId, button) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Get button position
    const buttonRect = button.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;
    
    // Get cart icon position
    const cartIcon = document.querySelector('.cart-count');
    const cartRect = cartIcon?.getBoundingClientRect();
    const cartX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 50;
    const cartY = cartRect ? cartRect.top + cartRect.height / 2 : 50;
    
    // Create animation element
    const animationElement = document.createElement('div');
    animationElement.className = 'cart-animation';
    animationElement.innerHTML = '<i class="fas fa-shopping-cart" style="font-size: 24px; color: var(--primary-color);"></i>';
    
    // Set start position
    animationElement.style.position = 'fixed';
    animationElement.style.left = buttonX + 'px';
    animationElement.style.top = buttonY + 'px';
    animationElement.style.zIndex = '9999';
    
    // Set CSS variables for animation
    animationElement.style.setProperty('--x', (cartX - buttonX) / 2 + 'px');
    animationElement.style.setProperty('--y', (cartY - buttonY) / 2 + 'px');
    animationElement.style.setProperty('--x-end', (cartX - buttonX) + 'px');
    animationElement.style.setProperty('--y-end', (cartY - buttonY) + 'px');
    
    document.body.appendChild(animationElement);
    
    // Remove animation element after animation
    setTimeout(() => {
        animationElement.remove();
        
        // Actually add to cart
        addToCart(productId);
        
        // Show success notification
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Button feedback animation
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.backgroundColor = 'var(--success-color)';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            button.style.backgroundColor = '';
        }, 1000);
        
    }, 1000);
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            showNotification(`Only ${product.stock} items available in stock`, 'error');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        if (quantity > product.stock) {
            showNotification(`Only ${product.stock} items available in stock`, 'error');
            return;
        }
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            category: product.category,
            maxQuantity: product.stock
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count display
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all cart count elements
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
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
            }
            .notification-success { background: var(--success-color); }
            .notification-error { background: var(--danger-color); }
            .notification-info { background: var(--info-color); }
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
                margin-left: 1rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 1000;
    const sortBy = document.getElementById('sortBy').value;
    
    let filtered = products.filter(product => {
        // Search filter
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
            !product.description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        return true;
    });
    
    // Sort products
    filtered = sortProducts(filtered, sortBy);
    
    // Display filtered products
    loadProducts(filtered);
}

// Sort products
function sortProducts(products, sortBy) {
    return [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'newest':
                return b.id - a.id;
            case 'popular':
                return b.rating - a.rating;
            default: // featured
                return (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.rating - a.rating;
        }
    });
}

// Clear all filters
function clearFilters() {
    document.getElementById('productSearch').value = '';
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    document.getElementById('minPrice').value = '0';
    document.getElementById('maxPrice').value = '1000';
    document.getElementById('priceSlider').value = '1000';
    document.getElementById('sortBy').value = 'featured';
    
    filterProducts();
}

// Load more products
function loadMoreProducts() {
    // In a real app, this would load more products from server
    // For now, just show a notification
    showNotification('Loading more products...', 'info');
    
    // Simulate loading
    setTimeout(() => {
        showNotification('More products loaded!', 'success');
    }, 1000);
}

// Setup category filters
function setupCategoryFilters() {
    // Update category counts based on actual products
    const categories = ['fruits', 'vegetables', 'dairy', 'meat', 'bakery', 'beverages'];
    
    categories.forEach(category => {
        const count = products.filter(p => p.category === category).length;
        const element = document.querySelector(`.category-item input[value="${category}"]`)
            ?.closest('.category-item')
            ?.querySelector('.category-count');
        
        if (element) {
            element.textContent = `(${count})`;
        }
    });
}

// Setup quick view modal
function setupQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuickView();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
}

// Show quick view
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const body = document.getElementById('quickViewBody');
    
    const stars = getStarRating(product.rating);
    
    body.innerHTML = `
        <div class="quick-view-product">
            <div class="product-gallery">
                <img src="${product.image}" alt="${product.name}" class="main-image">
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h2 class="product-title">${product.name}</h2>
                <div class="product-rating large">
                    ${stars}
                    <span class="rating-count">${product.rating} (Based on 120 reviews)</span>
                </div>
                <div class="product-price large">KES ${product.price}</div>
                <p class="product-description full">${product.description}</p>
                
                <div class="product-stock">
                    <i class="fas fa-box"></i>
                    <span>In Stock: ${product.stock} items available</span>
                </div>
                
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <div class="quantity-control">
                        <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                        <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                        <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                
                <div class="quick-view-actions">
                    <button class="btn btn-primary btn-add-to-cart-large" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-buy-now" data-id="${product.id}">
                        <i class="fas fa-bolt"></i> Buy Now
                    </button>
                </div>
                
                <div class="product-features">
                    <h4>Product Features:</h4>
                    <ul>
                        <li><i class="fas fa-check"></i> Fresh from the farm</li>
                        <li><i class="fas fa-check"></i> 100% natural</li>
                        <li><i class="fas fa-check"></i> No preservatives</li>
                        <li><i class="fas fa-check"></i> Daily delivery available</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for quick view
    const addToCartBtn = body.querySelector('.btn-add-to-cart-large');
    const buyNowBtn = body.querySelector('.btn-buy-now');
    const minusBtn = body.querySelector('.quantity-btn.minus');
    const plusBtn = body.querySelector('.quantity-btn.plus');
    const quantityInput = body.querySelector('#quantity');
    
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        addToCartWithAnimation(productId, this);
        closeQuickView();
    });
    
    buyNowBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
        window.location.href = 'cart.html';
    });
    
    minusBtn.addEventListener('click', function() {
        const current = parseInt(quantityInput.value);
        if (current > 1) {
            quantityInput.value = current - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        const current = parseInt(quantityInput.value);
        if (current < product.stock) {
            quantityInput.value = current + 1;
        }
    });
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Close quick view
function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Theme modal functions
function toggleThemeModal() {
    const modal = document.getElementById('themeModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function closeThemeModal() {
    document.getElementById('themeModal').style.display = 'none';
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add some animation to page load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

