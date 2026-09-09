const CART_STORAGE_KEY = 'eatclub_cart';
const LOCATION_STORAGE_KEY = 'eatclub_location';

const CartManager = {
    getItems() {
        try {
            return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    saveItems(items) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        this.updateBadge();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items } }));
    },

    addItem(item) {
        const items = this.getItems();
        const existing = items.find(i => i.id === item.id);
        if (existing) {
            existing.qty = (existing.qty || 1) + 1;
        } else {
            items.push({ ...item, qty: 1 });
        }
        this.saveItems(items);
        showToast(`Added "${item.name}" to cart! 🛒`);
    },

    removeItem(id) {
        let items = this.getItems();
        const existing = items.find(i => i.id === id);
        if (existing) {
            if (existing.qty > 1) {
                existing.qty -= 1;
                showToast(`Reduced quantity of "${existing.name}"`);
            } else {
                items = items.filter(i => i.id !== id);
                showToast(`Removed "${existing.name}" from cart`);
            }
        }
        this.saveItems(items);
    },

    deleteItem(id) {
        let items = this.getItems();
        const existing = items.find(i => i.id === id);
        items = items.filter(i => i.id !== id);
        this.saveItems(items);
        if (existing) showToast(`Deleted "${existing.name}" from cart`);
    },

    getTotalCount() {
        const items = this.getItems();
        return items.reduce((total, item) => total + (item.qty || 1), 0);
    },

    getTotalPrice() {
        const items = this.getItems();
        return items.reduce((total, item) => total + (Number(item.price) * (item.qty || 1)), 0);
    },

    clearCart() {
        localStorage.removeItem(CART_STORAGE_KEY);
        this.updateBadge();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items: [] } }));
    },

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getTotalCount();
            badge.textContent = count;
            badge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        }
    }
};

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

window.copyCoupon = function(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showToast(`🎉 Coupon "${code}" copied to clipboard!`);
        }).catch(() => {
            showToast(`Coupon Code: ${code}`);
        });
    } else {
        showToast(`Coupon Code: ${code}`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CartManager.updateBadge();

    const locPicker = document.getElementById('location-picker');
    const savedLoc = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (savedLoc && locPicker) {
        const locText = locPicker.querySelector('.location-text');
        if (locText) locText.textContent = savedLoc;
    }

    if (locPicker) {
        locPicker.addEventListener('click', () => {
            const current = locPicker.querySelector('.location-text')?.textContent || 'Greater Noida';
            const newLoc = prompt('Enter your delivery location / area:', current);
            if (newLoc && newLoc.trim() !== '') {
                const locText = locPicker.querySelector('.location-text');
                if (locText) locText.textContent = newLoc.trim();
                localStorage.setItem(LOCATION_STORAGE_KEY, newLoc.trim());
                showToast(`📍 Delivery location updated to: ${newLoc.trim()}`);
            }
        });
    }

    const notifBtn = document.getElementById('notification-btn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            showToast('🔔 Special Offer: Use code WELCOME50 for 50% OFF your food!');
        });
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query && !window.location.pathname.includes('menu.html')) {
                    window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});
