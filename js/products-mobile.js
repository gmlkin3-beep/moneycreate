// PRODUCTS PAGE MOBILE FIX
document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        // Add mobile-specific classes
        productsGrid.classList.add('products-grid');
        
        // Adjust grid based on screen size
        function adjustProductsGrid() {
            if (window.innerWidth <= 480) {
                productsGrid.style.gridTemplateColumns = '1fr';
                productsGrid.style.gap = '10px';
            } else if (window.innerWidth <= 768) {
                productsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                productsGrid.style.gap = '15px';
            } else {
                productsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                productsGrid.style.gap = '20px';
            }
        }
        
        // Adjust on load and resize
        adjustProductsGrid();
        window.addEventListener('resize', adjustProductsGrid);
        
        // Make product cards more mobile-friendly
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.2s';
            
            // Make entire card clickable on mobile
            card.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && !e.target.closest('button')) {
                    const addToCartBtn = this.querySelector('.btn-add-to-cart');
                    if (addToCartBtn) {
                        addToCartBtn.click();
                    }
                }
            });
        });
    }
    
    // Make buttons larger for touch
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
        btn.style.fontSize = '16px';
    });
    
    // Adjust search input for mobile
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.style.fontSize = '16px';
        searchInput.style.padding = '12px';
        searchInput.style.width = '100%';
    }
});
