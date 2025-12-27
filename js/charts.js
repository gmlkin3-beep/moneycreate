// Charts JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize additional charts if needed
    initAdditionalCharts();
});

// Initialize Additional Charts
function initAdditionalCharts() {
    // Sales Trend Chart
    initSalesTrendChart();
    
    // Customer Demographics Chart
    initCustomerDemographicsChart();
    
    // Product Category Chart
    initProductCategoryChart();
}

// Sales Trend Chart
function initSalesTrendChart() {
    const ctx = document.getElementById('salesTrendChart');
    if (!ctx) return;
    
    // Sample data - replace with actual API call
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: '2023',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 90, 85],
                borderColor: 'rgba(255, 107, 53, 1)',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                tension: 0.4
            },
            {
                label: '2024',
                data: [28, 48, 40, 19, 86, 27, 90, 60, 70, 85, 95, 100],
                borderColor: 'rgba(46, 134, 171, 1)',
                backgroundColor: 'rgba(46, 134, 171, 0.1)',
                tension: 0.4
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: salesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Sales (KES)'
                    }
                }
            }
        }
    });
}

// Customer Demographics Chart
function initCustomerDemographicsChart() {
    const ctx = document.getElementById('customerDemographicsChart');
    if (!ctx) return;
    
    const demographicsData = {
        labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
        datasets: [{
            data: [12, 19, 30, 25, 14],
            backgroundColor: [
                'rgba(255, 107, 53, 0.8)',
                'rgba(46, 134, 171, 0.8)',
                'rgba(40, 167, 69, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(108, 117, 125, 0.8)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: demographicsData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Product Category Chart
function initProductCategoryChart() {
    const ctx = document.getElementById('productCategoryChart');
    if (!ctx) return;
    
    const categoryData = {
        labels: ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Beverages'],
        datasets: [{
            label: 'Sales by Category',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(255, 107, 53, 0.7)',
            borderColor: 'rgba(255, 107, 53, 1)',
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: categoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2
                    }
                }
            }
        }
    });
}

// Export Charts as Image
function exportChart(chartId, fileName) {
    const chartCanvas = document.getElementById(chartId);
    if (!chartCanvas) return;
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = chartCanvas.toDataURL('image/png');
    link.click();
}

// Update Chart Theme
function updateChartTheme() {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    
    // Update all charts with new theme color
    Chart.helpers.each(Chart.instances, function(chart) {
        if (chart.config.type === 'line') {
            chart.data.datasets.forEach(dataset => {
                if (dataset.label === 'Revenue' || dataset.label === '2024') {
                    dataset.borderColor = primaryColor;
                    dataset.backgroundColor = primaryColor.replace(')', ', 0.1)').replace('rgb', 'rgba');
                }
            });
        } else if (chart.config.type === 'bar') {
            chart.data.datasets.forEach(dataset => {
                dataset.backgroundColor = primaryColor;
                dataset.borderColor = primaryColor;
            });
        }
        chart.update();
    });
}

// Listen for theme changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            updateChartTheme();
        }
    });
});

observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

// Real-time Data Updates
function startRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        updateRealTimeData();
    }, 30000); // Update every 30 seconds
}

function updateRealTimeData() {
    // Update revenue chart with random data for demo
    if (window.revenueChart) {
        const newData = window.revenueChart.data.datasets[0].data.map(value => {
            const change = (Math.random() - 0.5) * 20;
            return Math.max(0, value + change);
        });
        
        window.revenueChart.data.datasets[0].data = newData;
        window.revenueChart.update('none');
    }
}

// Start real-time updates when dashboard loads
if (window.location.pathname.includes('dashboard')) {
    startRealTimeUpdates();
}

// Chart Data Export
async function exportChartData(chartId) {
    const chart = Chart.getChart(chartId);
    if (!chart) return;
    
    const data = {
        labels: chart.data.labels,
        datasets: chart.data.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data
        }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart-data-${chartId}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Add Chart Controls
function addChartControls(chartId) {
    const chartContainer = document.getElementById(chartId).parentElement;
    if (!chartContainer) return;
    
    const controls = document.createElement('div');
    controls.className = 'chart-controls';
    controls.innerHTML = `
        <button onclick="exportChart('${chartId}', '${chartId}-chart')">
            <i class="fas fa-download"></i> Export as PNG
        </button>
        <button onclick="exportChartData('${chartId}')">
            <i class="fas fa-file-export"></i> Export Data
        </button>
        <button onclick="toggleChartType('${chartId}')">
            <i class="fas fa-exchange-alt"></i> Toggle Type
        </button>
    `;
    
    chartContainer.appendChild(controls);
}

// Toggle Chart Type
function toggleChartType(chartId) {
    const chart = Chart.getChart(chartId);
    if (!chart) return;
    
    const newType = chart.config.type === 'line' ? 'bar' : 'line';
    chart.config.type = newType;
    chart.update();
}