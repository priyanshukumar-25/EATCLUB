// Eat Club - Home Page Script (js/main.js)

document.addEventListener('DOMContentLoaded', () => {
    // Quick Add or View triggers on Home Page
    const heroOrderBtn = document.querySelector('.hero-actions .btn-primary');
    if (heroOrderBtn) {
        heroOrderBtn.addEventListener('click', () => {
            showToast('🍽️ Heading to Menu catalog...');
        });
    }
});
