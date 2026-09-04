// Main interactive script for SwiggyMenu

document.addEventListener('DOMContentLoaded', () => {
    // Dish Search Filter
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.cards .card');
    const noResults = document.getElementById('no-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            cards.forEach(card => {
                const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.description')?.textContent.toLowerCase() || '';
                
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.add('visible');
                } else {
                    noResults.classList.remove('visible');
                }
            }
        });
    }

    // Add to Cart Counter & Button Toggle
    const addButtons = document.querySelectorAll('.card .add');
    const cartBadge = document.querySelector('.icon-btn[aria-label="Cart"] .badge');
    let cartCount = cartBadge ? parseInt(cartBadge.textContent) || 0 : 0;

    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('added')) {
                btn.classList.remove('added');
                btn.textContent = 'Add';
                cartCount = Math.max(0, cartCount - 1);
            } else {
                btn.classList.add('added');
                btn.textContent = 'Added ✓';
                cartCount++;
            }

            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
});
