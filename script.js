// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Shopping Cart Functions - Start with empty cart
let cartItems = [];

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelector('.cart-total strong').textContent = `Total: ₹${total.toLocaleString()}`;
}

function renderCartItems() {
    const cartContainer = document.getElementById('cartItemsContainer');
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</div>';
        return;
    }
    
    cartContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">${item.icon}</div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(this, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(this, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateQuantity(button, change) {
    const cartItem = button.closest('.cart-item');
    const itemId = parseInt(cartItem.getAttribute('data-item-id'));
    const item = cartItems.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity becomes 0
        if (item.quantity <= 0) {
            cartItems = cartItems.filter(cartItem => cartItem.id !== itemId);
        } else if (item.quantity > 10) {
            item.quantity = 10; // Max quantity limit
        }
        
        renderCartItems();
        updateCartCount();
        updateCartTotal();
    }
}

function getProductIcon(productName) {
    const iconMap = {
        'Heritage Collection': '🥻',
        'Fusion Line': '👚',
        'Celebration Wear': '👘',
        'Silk Saree': '🥻',
        'Indo-Western Dress': '👗',
        'Designer Lehenga': '👘',
        'Embroidered Kurti': '👚',
        'Jacket Set': '🦺',
        'Bridal Collection': '👑'
    };
    return iconMap[productName] || '👗';
}

function addToCart(productName, price) {
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: Date.now(), // Simple unique ID
            name: productName,
            price: price,
            quantity: 1,
            icon: getProductIcon(productName)
        });
    }
    
    renderCartItems();
    updateCartCount();
    updateCartTotal();
    
    // Show success message
    showNotification(`${productName} added to cart!`);
    
    // Optional: Auto-open cart for a moment
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('active');
    setTimeout(() => {
        cartSidebar.classList.remove('active');
    }, 2000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1003;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Gallery Filter Functions
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter items with animation
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Quick View Modal Functions
let currentProduct = {};

function quickView(productName) {
    const products = {
        'Silk Saree': { name: 'Silk Saree', price: 5999, icon: '🥻' },
        'Indo-Western Dress': { name: 'Indo-Western Dress', price: 3299, icon: '👗' },
        'Designer Lehenga': { name: 'Designer Lehenga', price: 8999, icon: '👘' },
        'Embroidered Kurti': { name: 'Embroidered Kurti', price: 2499, icon: '👚' },
        'Jacket Set': { name: 'Jacket Set', price: 4299, icon: '🦺' },
        'Bridal Collection': { name: 'Bridal Collection', price: 15999, icon: '👑' }
    };
    
    currentProduct = products[productName];
    
    if (currentProduct) {
        document.getElementById('modalProductName').textContent = currentProduct.name;
        document.getElementById('modalProductPrice').textContent = `₹${currentProduct.price.toLocaleString()}`;
        document.getElementById('modalProductIcon').textContent = currentProduct.icon;
        
        const modal = document.getElementById('quickViewModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct.name, currentProduct.price);
        closeModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('quickViewModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Form submission
document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
        // Add loading animation
        this.classList.add('loading');
        this.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.classList.remove('loading');
            this.disabled = false;
            showNotification('Thank you for your message! We\'ll get back to you soon.');
            
            // Clear form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        }, 2000);
    } else {
        showNotification('Please fill in all fields.');
    }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(86, 28, 36, 0.98)';
    } else {
        navbar.style.background = 'rgba(86, 28, 36, 0.95)';
    }
});

// Initialize cart display
document.addEventListener('DOMContentLoaded', function() {
    renderCartItems(); // Render empty cart initially
    updateCartCount(); // Should show 0
    updateCartTotal(); // Should show ₹0
    
    // Add some entrance animations to elements
    const animatedElements = document.querySelectorAll('.popup-effect');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Testimonials auto-rotation (optional)
let testimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    testimonials.forEach((testimonial, index) => {
        testimonial.style.transform = index === testimonialIndex ? 'scale(1.05)' : 'scale(1)';
        testimonial.style.opacity = index === testimonialIndex ? '1' : '0.8';
    });
    
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
}

// Start testimonial rotation every 5 seconds
setInterval(rotateTestimonials, 5000);

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Escape key to close modal or cart
    if (e.key === 'Escape') {
        closeModal();
        document.getElementById('cartSidebar').classList.remove('active');
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('filter-btn')) {
        e.target.click();
    }
});

// Add some dynamic effects
function addSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: absolute;
        pointer-events: none;
        font-size: 1.2rem;
        animation: sparkleFloat 1s ease-out forwards;
        z-index: 1000;
    `;
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        document.body.removeChild(sparkle);
    }, 1000);
}

// Add sparkle effect to buttons on click
document.querySelectorAll('.add-to-cart-btn, .cta-button, .submit-btn').forEach(button => {
    button.addEventListener('click', function() {
        addSparkleEffect(this);
    });
});

// Add CSS for sparkle animation
const sparkleCSS = `
@keyframes sparkleFloat {
    0% {
        transform: translateY(0) scale(0);
        opacity: 1;
    }
    50% {
        transform: translateY(-20px) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-40px) scale(0);
        opacity: 0;
    }
}

@keyframes slideOutRight {
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);