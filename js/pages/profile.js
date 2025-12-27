// profile.js - External JavaScript for profile.html
// Extracted from inline scripts on 12/27/2025 14:06:30






        document.addEventListener('DOMContentLoaded', function() {
            // Check authentication
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }
            
            // Load user profile
            loadUserProfile();
            
            // Tab switching
            setupProfileTabs();
            
            // Edit profile
            setupProfileEdit();
            
            // Address management
            setupAddressManagement();
            
            // Preferences
            setupPreferences();
            
            // Logout
            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        });
        
        function loadUserProfile() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                document.getElementById('profileName').textContent = user.username || 'User';
                document.getElementById('profileEmail').textContent = user.email || '';
                document.getElementById('userFullName').textContent = user.username || '';
                document.getElementById('userEmail').textContent = user.email || '';
                document.getElementById('userPhone').textContent = user.phoneNumber || '';
                document.getElementById('userRole').textContent = user.role === 'admin' ? 'Administrator' : 'Customer';
            }
            
            // Load orders
            loadUserOrders();
        }
        
        function loadUserOrders() {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            fetch('http://localhost:5000/api/orders/user/1', { // Replace with actual user ID
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(orders => {
                updateOrdersDisplay(orders);
            })
            .catch(error => {
                console.error('Error loading orders:', error);
            });
        }
        
        function updateOrdersDisplay(orders) {
            const ordersList = document.getElementById('ordersList');
            if (!orders || orders.length === 0) {
                ordersList.innerHTML = `
                    <div class="no-orders">
                        <i class="fas fa-shopping-bag"></i>
                        <h3>No orders yet</h3>
                        <p>Your order history will appear here</p>
                        <a href="products.html" class="btn btn-primary">Start Shopping</a>
                    </div>
                `;
                return;
            }
            
            ordersList.innerHTML = orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
                        <div class="order-status status-${order.status}">${order.status}</div>
                    </div>
                    <div class="order-body">
                        <div class="order-items-preview">
                            ${order.OrderItems && order.OrderItems.slice(0, 2).map(item => `
                                <div class="order-item-preview">
                                    <span class="item-name">${item.Product?.name || 'Product'}</span>
                                    <span class="item-quantity">x${item.quantity}</span>
                                </div>
                            `).join('')}
                            ${order.OrderItems && order.OrderItems.length > 2 ? 
                                `<div class="more-items">+${order.OrderItems.length - 2} more items</div>` : ''
                            }
                        </div>
                        <div class="order-total">KES ${order.totalAmount.toFixed(2)}</div>
                    </div>
                    <div class="order-actions">
                        <a href="order-details.html?id=${order.id}" class="btn btn-outline btn-sm">
                            View Details
                        </a>
                        ${order.status === 'pending' ? `
                            <button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">
                                Cancel Order
                            </button>
                        ` : ''}
                        ${order.status === 'delivered' ? `
                            <button class="btn btn-primary btn-sm" onclick="reorder(${order.id})">
                                Reorder
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }
        
        function setupProfileTabs() {
            const navItems = document.querySelectorAll('.profile-nav .nav-item');
            const tabContents = document.querySelectorAll('.tab-content');
            
            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all
                    navItems.forEach(nav => nav.classList.remove('active'));
                    tabContents.forEach(tab => tab.classList.remove('active'));
                    
                    // Add active class to clicked
                    this.classList.add('active');
                    const tabId = this.dataset.tab + 'Tab';
                    document.getElementById(tabId).classList.add('active');
                });
            });
        }
        
        function setupProfileEdit() {
            const editBtn = document.getElementById('editProfileBtn');
            const cancelBtn = document.getElementById('cancelEditBtn');
            const editForm = document.getElementById('editProfileForm');
            const infoGrid = editForm.previousElementSibling;
            
            editBtn.addEventListener('click', function() {
                infoGrid.style.display = 'none';
                editForm.style.display = 'block';
                editBtn.style.display = 'none';
            });
            
            cancelBtn.addEventListener('click', function() {
                infoGrid.style.display = 'block';
                editForm.style.display = 'none';
                editBtn.style.display = 'block';
            });
            
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle profile update here
                alert('Profile updated!');
                infoGrid.style.display = 'block';
                editForm.style.display = 'none';
                editBtn.style.display = 'block';
            });
        }
        
        function setupAddressManagement() {
            const addBtn = document.getElementById('addAddressBtn');
            const modal = document.getElementById('addAddressModal');
            const cancelBtn = document.getElementById('cancelAddressBtn');
            const form = document.getElementById('addressForm');
            
            addBtn.addEventListener('click', function() {
                modal.style.display = 'flex';
            });
            
            cancelBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle address addition here
                alert('Address added!');
                modal.style.display = 'none';
            });
        }
        
        function setupPreferences() {
            const themeOptions = document.querySelectorAll('.theme-option');
            const saveBtn = document.getElementById('savePreferencesBtn');
            
            themeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    themeOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    const theme = this.dataset.theme;
                    changeTheme(theme);
                });
            });
            
            saveBtn.addEventListener('click', function() {
                // Save preferences to backend
                const preferences = {
                    theme: document.querySelector('.theme-option.active').dataset.theme,
                    emailPromotions: document.getElementById('emailPromotions').checked,
                    smsNotifications: document.getElementById('smsNotifications').checked,
                    productRecommendations: document.getElementById('productRecommendations').checked,
                    language: document.getElementById('languagePref').value
                };
                
                // Save to localStorage
                localStorage.setItem('preferences', JSON.stringify(preferences));
                
                // Show success message
                alert('Preferences saved!');
            });
        }
        
        function changeTheme(theme) {
            document.body.className = `theme-${theme}`;
            localStorage.setItem('theme', theme);
            
            // Update user preference in database if logged in
            const token = localStorage.getItem('token');
            if (token) {
                fetch('http://localhost:5000/api/auth/theme', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ theme })
                });
            }
        }
    
