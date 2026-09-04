// Eat Club - Menu Page Logic (js/menu.js)

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const cards = document.querySelectorAll('.cards-grid .card');
    const noResults = document.getElementById('no-results');
    const categoryPills = document.querySelectorAll('.cat-pill');
    const vegToggleBtn = document.getElementById('veg-toggle');
    const nonVegToggleBtn = document.getElementById('nonveg-toggle');

    let currentCategory = 'all';
    let isVegOnly = false;
    let isNonVegOnly = false;

    // Check URL parameters for search query or category (e.g. ?search=pizza or ?cat=biryani)
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const catParam = urlParams.get('cat');

    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }

    if (catParam) {
        currentCategory = catParam;
        categoryPills.forEach(p => {
            if (p.getAttribute('data-category') === catParam) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
    }

    // Filter Logic
    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.description')?.textContent.toLowerCase() || '';
            const restaurant = card.querySelector('.restaurant-name')?.textContent.toLowerCase() || '';
            const cardCategory = card.getAttribute('data-category') || '';
            const cardType = card.getAttribute('data-type') || '';

            const matchesSearch = query === '' || title.includes(query) || desc.includes(query) || restaurant.includes(query);
            const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
            let matchesDiet = true;
            if (isVegOnly) matchesDiet = (cardType === 'veg');
            if (isNonVegOnly) matchesDiet = (cardType === 'non-veg');

            if (matchesSearch && matchesCategory && matchesDiet) {
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

        if (clearSearchBtn) {
            clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
        }
    }

    // Initial filter apply
    applyFilters();

    // Search events
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            applyFilters();
            searchInput.focus();
        });
    }

    // Category pills click
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.getAttribute('data-category') || 'all';
            applyFilters();
        });
    });

    // Diet toggles
    if (vegToggleBtn) {
        vegToggleBtn.addEventListener('click', () => {
            isVegOnly = !isVegOnly;
            if (isVegOnly) isNonVegOnly = false;
            vegToggleBtn.classList.toggle('active', isVegOnly);
            if (nonVegToggleBtn) nonVegToggleBtn.classList.remove('active');
            applyFilters();
        });
    }

    if (nonVegToggleBtn) {
        nonVegToggleBtn.addEventListener('click', () => {
            isNonVegOnly = !isNonVegOnly;
            if (isNonVegOnly) isVegOnly = false;
            nonVegToggleBtn.classList.toggle('active', isNonVegOnly);
            if (vegToggleBtn) vegToggleBtn.classList.remove('active');
            applyFilters();
        });
    }

    // Add to Cart handler
    const addButtons = document.querySelectorAll('.card .add-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const id = btn.getAttribute('data-id') || Date.now().toString();
            const name = btn.getAttribute('data-name') || card.querySelector('h2')?.textContent || 'Food Item';
            const price = Number(btn.getAttribute('data-price') || 199);
            const icon = btn.getAttribute('data-icon') || '🍽️';

            CartManager.addItem({ id, name, price, icon });

            btn.classList.add('added');
            btn.textContent = 'Added ✓';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.textContent = 'Add +';
            }, 1200);
        });
    });
});

window.resetMenuFilters = function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    const vegToggle = document.getElementById('veg-toggle');
    if (vegToggle) vegToggle.classList.remove('active');

    const nonVegToggle = document.getElementById('nonveg-toggle');
    if (nonVegToggle) nonVegToggle.classList.remove('active');

    const allPill = document.querySelector('.cat-pill[data-category="all"]');
    if (allPill) allPill.click();
};
