// Eat Club - Cart & Checkout Logic (js/cart.js)

let activeDiscount = 0;
let appliedCouponCode = '';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    window.addEventListener('cartUpdated', () => {
        renderCart();
    });

    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to empty your cart?')) {
                CartManager.clearCart();
                appliedCouponCode = '';
                activeDiscount = 0;
            }
        });
    }

    // Coupon Apply
    const couponForm = document.getElementById('coupon-form');
    if (couponForm) {
        couponForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const codeInput = document.getElementById('coupon-input');
            const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
            
            applyCoupon(code);
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const items = CartManager.getItems();
            if (items.length === 0) {
                showToast('Your cart is empty!');
                return;
            }

            const total = calculateTotal();
            alert(`🎉 Order Placed Successfully!\n\nGrand Total: ₹${total}\nEstimated Delivery: 25-30 Mins\nPayment: Cash / UPI on Delivery\n\nThank you for choosing Eat Club!`);
            CartManager.clearCart();
            appliedCouponCode = '';
            activeDiscount = 0;
            window.location.href = 'index.html';
        });
    }
});

function applyCoupon(code) {
    const itemTotal = CartManager.getTotalPrice();

    if (!code) {
        showToast('Please enter a coupon code.');
        return;
    }

    if (itemTotal === 0) {
        showToast('Add items to cart before applying coupon!');
        return;
    }

    if (code === 'WELCOME50') {
        activeDiscount = Math.min(150, Math.round(itemTotal * 0.5));
        appliedCouponCode = code;
        showToast(`🎉 Coupon WELCOME50 applied! Saved ₹${activeDiscount}`);
    } else if (code === 'FREEDEL') {
        if (itemTotal >= 199) {
            appliedCouponCode = code;
            showToast('🎉 Coupon FREEDEL applied! Free Delivery unlocked.');
        } else {
            showToast('FREEDEL requires minimum order of ₹199');
            return;
        }
    } else if (code === 'FEAST100') {
        if (itemTotal >= 399) {
            activeDiscount = 100;
            appliedCouponCode = code;
            showToast('🎉 Coupon FEAST100 applied! Saved ₹100');
        } else {
            showToast('FEAST100 requires minimum order of ₹399');
            return;
        }
    } else {
        showToast('❌ Invalid or expired coupon code');
        return;
    }

    renderCart();
}

function calculateTotal() {
    const itemTotal = CartManager.getTotalPrice();
    let deliveryFee = itemTotal > 0 ? 40 : 0;
    if (appliedCouponCode === 'FREEDEL' || itemTotal >= 399) {
        deliveryFee = 0;
    }
    const taxes = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;
    return Math.max(0, itemTotal + deliveryFee + taxes - activeDiscount);
}

function renderCart() {
    const items = CartManager.getItems();
    const cartContainer = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('empty-cart-state');
    const cartContent = document.getElementById('cart-content-layout');

    const itemTotalEl = document.getElementById('bill-item-total');
    const deliveryFeeEl = document.getElementById('bill-delivery-fee');
    const taxesEl = document.getElementById('bill-taxes');
    const discountRowEl = document.getElementById('discount-row');
    const discountValEl = document.getElementById('bill-discount');
    const grandTotalEl = document.getElementById('bill-grand-total');
    const itemCountEl = document.getElementById('cart-item-count');

    if (!cartContainer) return;

    if (items.length === 0) {
        if (emptyState) emptyState.classList.add('visible');
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.classList.remove('visible');
    if (cartContent) cartContent.style.display = 'grid';

    if (itemCountEl) {
        itemCountEl.textContent = `(${CartManager.getTotalCount()} items)`;
    }

    cartContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-left">
                <span class="item-icon">${item.icon || '🍽️'}</span>
                <div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-unit-price">₹${item.price} each</div>
                </div>
            </div>

            <div class="qty-controls">
                <button class="qty-btn" onclick="CartManager.removeItem('${item.id}')">−</button>
                <span class="qty-value">${item.qty || 1}</span>
                <button class="qty-btn" onclick="CartManager.addItem({ id: '${item.id}', name: '${item.name.replace(/'/g, "\\'")}', price: ${item.price}, icon: '${item.icon || '🍽️'}' })">+</button>
            </div>

            <div class="item-total-price">
                ₹${Number(item.price) * (item.qty || 1)}
            </div>
        </div>
    `).join('');

    const itemTotal = CartManager.getTotalPrice();
    let deliveryFee = itemTotal > 0 ? 40 : 0;
    if (appliedCouponCode === 'FREEDEL' || itemTotal >= 399) {
        deliveryFee = 0;
    }
    const taxes = Math.round(itemTotal * 0.05);
    const grandTotal = Math.max(0, itemTotal + deliveryFee + taxes - activeDiscount);

    if (itemTotalEl) itemTotalEl.textContent = `₹${itemTotal}`;
    if (deliveryFeeEl) {
        deliveryFeeEl.textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
        deliveryFeeEl.style.color = deliveryFee === 0 ? '#34d399' : 'var(--text)';
    }
    if (taxesEl) taxesEl.textContent = `₹${taxes}`;

    if (discountRowEl && discountValEl) {
        if (activeDiscount > 0) {
            discountRowEl.style.display = 'flex';
            discountValEl.textContent = `-₹${activeDiscount}`;
        } else {
            discountRowEl.style.display = 'none';
        }
    }

    if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;
}
