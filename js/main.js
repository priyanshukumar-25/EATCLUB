document.addEventListener('DOMContentLoaded', () => {
    const heroOrderBtn = document.querySelector('.hero-actions .btn-primary');
    if (heroOrderBtn) {
        heroOrderBtn.addEventListener('click', () => {
            showToast('🍽️ Heading to Menu catalog...');
        });
    }
});
