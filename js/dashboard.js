// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    checkAdminAccess();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initCharts();
    
    // Setup event listeners
    setupDashboardListeners();
});

// Admin Access Check
function checkAdminAccess() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Decode token to check role
    try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        if (userData.role !== 'admin') {
            window.location.href = 'index.html';
        }
        
        // Set admin name
        const adminName = document.getElementById('adminName');
        if (adminName) {
            adminName.textContent = userData.email.split('@')[0];
        }
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/orders/stats/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        // Update stats cards
        document.getElementById('totalRevenue').textContent = `KES ${data.totalRevenue.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = data.totalOrders;
        document.getElementById('totalCustomers').textContent = data.totalCustomers || '0';
        document.getElementById('pendingOrders').textContent = data.pendingOrders;
        
        // Update recent orders table
        updateRecentOrdersTable(data.recentOrders);
        
        // Update charts data
        updateChartsData(data);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showDashboardError('Failed to load dashboard data');
    }
}

// Update Recent Orders Table
function updateRecentOrdersTable(orders) {
    const tableBody = document.getElementById('recentOrdersTable');
    if (!tableBody) return;
    
    if (!orders || orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No orders found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.User?.username || 'N/A'}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>KES ${order.totalAmount.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="btn-action btn-view" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-action btn-edit" onclick="editOrder(${order.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize Charts
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        window.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Revenue',
                    data: [],
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `KES ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KES ' + value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Products Chart
    const productsCtx = document.getElementById('productsChart');
    if (productsCtx) {
        window.productsChart = new Chart(productsCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Units Sold',
                    data: [],
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-dark'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Update Charts Data
function updateChartsData(data) {
    // Update revenue chart
    if (window.revenueChart && data.monthlySales) {
        const months = data.monthlySales.map(item => item.month);
        const revenues = data.monthlySales.map(item => parseFloat(item.total) || 0);
        
        window.revenueChart.data.labels = months;
        window.revenueChart.data.datasets[0].data = revenues;
        window.revenueChart.update();
    }
    
    // Update products chart
    if (window.productsChart && data.topProducts) {
        const products = data.topProducts.map(item => item.Product?.name || `Product ${item.productId}`);
        const quantities = data.topProducts.map(item => parseInt(item.totalSold) || 0);
        
        window.productsChart.data.labels = products;
        window.productsChart.data.datasets[0].data = quantities;
        window.productsChart.update();
    }
}

// Event Listeners
function setupDashboardListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Revenue period selector
    const revenuePeriod = document.getElementById('revenuePeriod');
    if (revenuePeriod) {
        revenuePeriod.addEventListener('change', function() {
            loadRevenueData(this.value);
        });
    }
    
    // Mobile menu toggle for dashboard
    const dashboardToggle = document.querySelector('.dashboard-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (dashboardToggle && sidebar) {
        dashboardToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Load Revenue Data by Period
async function loadRevenueData(period) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/orders/revenue/${period}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateRevenueChart(data, period);
        }
    } catch (error) {
        console.error('Error loading revenue data:', error);
    }
}

// Update Revenue Chart
function updateRevenueChart(data, period) {
    if (!window.revenueChart) return;
    
    let labels = [];
    let revenues = [];
    
    switch (period) {
        case 'weekly':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            break;
        case 'daily':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            break;
        case 'monthly':
        default:
            labels = data.map(item => item.month);
            break;
    }
    
    revenues = data.map(item => parseFloat(item.total) || 0);
    
    window.revenueChart.data.labels = labels;
    window.revenueChart.data.datasets[0].data = revenues;
    window.revenueChart.update();
}

// View Order Details
function viewOrder(orderId) {
    window.location.href = `order-details.html?id=${orderId}`;
}

// Edit Order
function editOrder(orderId) {
    // Implement edit functionality
    console.log('Edit order:', orderId);
}

// Show Dashboard Error
function showDashboardError(message) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'dashboard-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Dashboard</h3>
            <p>${message}</p>
            <button onclick="loadDashboardData()" class="btn btn-primary">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
    
    // Remove existing error
    const existingError = document.querySelector('.dashboard-error');
    if (existingError) {
        existingError.remove();
    }
    
    mainContent.appendChild(errorDiv);
}

// Add Dashboard Error Styles
const dashboardErrorStyles = document.createElement('style');
dashboardErrorStyles.textContent = `
    .dashboard-error {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .error-content {
        text-align: center;
        padding: 2rem;
        max-width: 400px;
    }
    
    .error-content i {
        font-size: 3rem;
        color: var(--danger-color);
        margin-bottom: 1rem;
    }
    
    .error-content h3 {
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }
    
    .error-content p {
        color: var(--text-light);
        margin-bottom: 1.5rem;
    }
`;
document.head.appendChild(dashboardErrorStyles);