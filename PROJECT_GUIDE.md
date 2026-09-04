# 🍔 Eat Club — Complete Project Documentation & Code Explanation

> **Project Name:** Eat Club (30-Day 30-Project Challenge)  
> **Tech Stack:** HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+), LocalStorage API  
> **Architecture:** Clean, Multi-Page Modular Architecture (Separate HTML, CSS & JS per Page)

---

## 📑 Table of Contents
1. [Project Overview & Folder Structure](#1-project-overview--folder-structure)
2. [Global Core Architecture (Shared CSS & JS)](#2-global-core-architecture)
   - `css/global.css`
   - `js/global.js` (State Management & LocalStorage)
3. [Page-by-Page Code Breakdown & Explanation](#3-page-by-page-code-breakdown)
   - **Home Page** (`index.html`, `css/home.css`, `js/main.js`)
   - **Menu Catalog** (`menu.html`, `css/menu.css`, `js/menu.js`)
   - **Offers & Coupons** (`offers.html`, `css/offers.css`)
   - **Partner Restaurants** (`restaurants.html`, `css/restaurants.css`)
   - **Cart & Checkout** (`cart.html`, `css/cart.css`, `js/cart.js`)
   - **Help & FAQ** (`contact.html`, `css/contact.css`, `js/contact.js`)
   - **Authentication** (`login.html`, `css/login.css`, `js/login.js`)
4. [How Data Flows Across Pages (Cart & State Integration)](#4-how-data-flows-across-pages)
5. [Key Design Patterns & Best Practices](#5-key-design-patterns--best-practices)

---

## 1. Project Overview & Folder Structure

Is project ko **100% modular, clean aur scalable** banaya gaya hai jisme har page ki apni separate styling aur logic hai, jabki shared components (jaise Navbar, Footer, Toast notifications aur Cart state) ek global file se manage hote hain.

```
EAT CLUB/
│
├── 📄 index.html          → Home Page
├── 📄 menu.html           → Full Food Catalog & Interactive Filters
├── 📄 offers.html         → Exclusive Coupons & Discounts
├── 📄 restaurants.html    → Partner Kitchens Showcase
├── 📄 cart.html           → Shopping Cart & Live Bill Checkout
├── 📄 contact.html        → 24/7 Support, Inquiry Form & FAQ Accordion
├── 📄 login.html          → User Login & Sign In
├── 📄 PROJECT_GUIDE.md    → Complete Project Guide (Ye file)
│
├── 📂 css/
│   ├── 🎨 global.css      → Shared tokens, navbar, footer, buttons & toasts
│   ├── 🎨 home.css        → Home page specific styling
│   ├── 🎨 menu.css        → Menu cards, diet indicators & filter pills
│   ├── 🎨 offers.css      → Deals cards, coupon boxes & bank discounts
│   ├── 🎨 restaurants.css → Restaurant cards & metadata
│   ├── 🎨 cart.css        → Cart list, quantity controls & bill breakdown
│   ├── 🎨 contact.css     → Support cards, inquiry form & FAQ styles
│   └── 🎨 login.css       → Authentication card & form styles
│
└── 📂 js/
    ├── ⚡ global.js       → Persistent Cart State (localStorage), Toasts, Location
    ├── ⚡ main.js         → Home page logic
    ├── ⚡ menu.js         → Instant search, category pills & diet toggles
    ├── ⚡ cart.js         → Dynamic item rendering, qty increment & coupon engine
    ├── ⚡ contact.js      → FAQ accordion toggling & form handling
    └── ⚡ login.js        → Form validation & demo auth
```

---

## 2. Global Core Architecture

### 🎨 `css/global.css` (Shared Design System)
Yeh file poore website ke design variables, CSS reset, reusable components, header, footer aur toast notifications ko define karti hai.

#### Key Code Snippet:
```css
:root {
    --bg: #0d0e12;               /* Dark modern background */
    --bg-card: #15171e;          /* Elevated card surface */
    --text: #f5f6f8;             /* Crisp white text */
    --text-dim: #9aa1b2;         /* Subtitle and meta text */
    --accent: #ff6b35;           /* Eat Club signature orange */
    --accent-glow: rgba(255, 107, 53, 0.25);
    --accent-green: #10b981;     /* Pure veg indicator & success */
    --border: #232734;           /* Subtle dark border */
    --radius-md: 12px;           /* Rounded corners */
    --transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```
**Explanation:**
- CSS Custom Properties (`:root`) use karke pure app me consistent colors aur spacing maintain hoti hai.
- Reusable classes jaise `.btn`, `.btn-primary`, `.section-badge`, `.navbar`, aur `.site-footer` globally available hain.

---

### ⚡ `js/global.js` (Cart State & LocalStorage Manager)
Yeh sabse important JavaScript file hai jo **`CartManager` Object** ke through cart data ko browser ke `localStorage` me store karti hai. Jab aap kisi bhi page se item add karte ho, to badge count aur cart har page par automatically sync ho jata hai.

#### Key Code Snippet:
```javascript
const CART_STORAGE_KEY = 'eatclub_cart';

const CartManager = {
    // 1. LocalStorage se items fetch karna
    getItems() {
        try {
            return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // 2. LocalStorage me save karna aur badge update karna
    saveItems(items) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        this.updateBadge();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items } }));
    },

    // 3. Item add ya quantity increment karna
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

    // 4. Cart badge update karna with bounce animation
    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getTotalCount();
            badge.textContent = count;
            badge.style.transform = 'scale(1.3)';
            setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
        }
    }
};
```
**Explanation:**
- **Custom Event (`cartUpdated`):** Cart change hote hi event dispatch hota hai, jisse `cart.html` ka bill live recalculate ho jata hai bina page reload kiye.
- **`showToast(message)`:** Kisi bhi action (jaise add item, copy coupon, change location) par bottom-right me smooth animated popup dikhata hai.

---

## 3. Page-by-Page Code Breakdown

### 🏠 1. Home Page (`index.html`)
- **CSS:** `css/global.css` + `css/home.css`
- **JS:** `js/global.js` + `js/main.js`

#### Features:
1. **Hero Section:** High conversion headline, Call to Action buttons, live delivery stats (500+ Kitchens, 25 Mins, 4.8★), aur floating discount cards (`floatUpDown` animation).
2. **Special Offers Preview:** 3 vibrant coupon cards with 1-click clipboard copy (`WELCOME50`, `FREEDEL`, `FEAST100`).
3. **Cuisine Categories Grid:** Clickable categories jo user ko `menu.html?cat=pizza` jaise filter ke sath menu page par le jati hain.
4. **Why Choose Eat Club:** 4 core benefits (Fast delivery, 100% Quality, Live GPS Tracking, Zero hidden fees).
5. **Customer Reviews:** Real reviews from verified users.
6. **Mobile App Showcase:** App store badges aur download stats.

#### Code Snippet from `index.html`:
```html
<header class="hero-section">
    <div class="container hero-grid">
        <div class="hero-content">
            <div class="hero-tag">
                <span class="pulse-dot"></span>
                <span>Fastest Delivery in Greater Noida</span>
            </div>
            <h1 class="hero-title">
                Craving Good Food? <br>
                <span>We Deliver Hot & Fresh</span> to Your Doorstep.
            </h1>
            <p class="hero-desc">...</p>
            <div class="hero-actions">
                <a href="menu.html" class="btn btn-primary">Order Now</a>
                <a href="offers.html" class="btn btn-secondary">View Offers (50% Off)</a>
            </div>
        </div>
    </div>
</header>
```

---

### 🍕 2. Menu Catalog Page (`menu.html`)
- **CSS:** `css/global.css` + `css/menu.css`
- **JS:** `js/global.js` + `js/menu.js`

#### Features:
1. **Instant Search:** User jo bhi type karta hai, dish cards real-time me filter ho jate hain bina reload ke.
2. **Category Filter Pills:** All, Pizza, Biryani, Burgers, Momos, Snacks, Desserts.
3. **Diet Toggles:** 🟢 Veg Only / 🔴 Non-Veg filter toggle.
4. **Dish Cards:** Bestseller badges, veg/non-veg dots, ratings, preparation time, discounted pricing, aur dynamic **Add +** button.
5. **URL Parameter Support:** Agar user home page se `menu.html?cat=biryani` par aata hai, to Biryani category automatically select ho jati hai!

#### Filter Logic in `js/menu.js`:
```javascript
function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.description')?.textContent.toLowerCase() || '';
        const cardCategory = card.getAttribute('data-category') || '';
        const cardType = card.getAttribute('data-type') || '';

        const matchesSearch = query === '' || title.includes(query) || desc.includes(query);
        const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
        let matchesDiet = true;
        if (isVegOnly) matchesDiet = (cardType === 'veg');
        if (isNonVegOnly) matchesDiet = (cardType === 'non-veg');

        // Sabhi conditions match hone par hi dish display hogi
        if (matchesSearch && matchesCategory && matchesDiet) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Empty state handle karna
    if (noResults) {
        noResults.classList.toggle('visible', visibleCount === 0);
    }
}
```

---

### 🏷️ 3. Offers & Deals Page (`offers.html`)
- **CSS:** `css/global.css` + `css/offers.css`
- **JS:** `js/global.js`

#### Features:
1. **Discount Coupons:** `WELCOME50` (50% Off), `FREEDEL` (Free Delivery), `FEAST100` (₹100 Off), `LUNCH20` (20% Off).
2. **One-Click Copy:** `copyCoupon('WELCOME50')` code ko user ke clipboard par copy karta hai aur confirmation toast trigger karta hai.
3. **Bank & Wallet Offers:** HDFC Cards, PayTM UPI, aur CRED partner cashback details.

---

### 🏪 4. Partner Restaurants Page (`restaurants.html`)
- **CSS:** `css/global.css` + `css/restaurants.css`
- **JS:** `js/global.js`

#### Features:
1. **Restaurant Grid:** The Pizza Haven, Royal Biryani Palace, Urban Burger Co., Momo Junction, Chai & Samosa Co., Sweet Tooth Bakery.
2. **Metadata Badges:** Distance (km), Average Prep & Delivery Time (mins), Average Price for Two, Cuisines list, aur Star Ratings.
3. **Direct Navigation:** "View Dishes" button direct specific category menu par redirect karta hai.

---

### 🛒 5. Cart & Checkout Page (`cart.html`)
- **CSS:** `css/global.css` + `css/cart.css`
- **JS:** `js/global.js` + `js/cart.js`

#### Features:
1. **Dynamic Cart Items Rendering:** Added items list, individual prices, aur subtotal.
2. **Quantity Controller (`+` / `-`):** Quantity badhane ya kam karne par instant calculation hoti hai.
3. **Empty State View:** Agar cart empty ho to friendly icon aur "Browse Menu" button dikhta hai.
4. **Coupon Redemption Engine:** Valid coupons calculate karke instant discount row show karta hai.
5. **Bill Breakdown:** Item Total + Delivery Fee (₹40 or Free) + Taxes (5%) - Coupon Discount = **Grand Total**.
6. **Simulated Order Placement:** "Proceed to Checkout" click karne par order confirmation modal aata hai aur cart clear ho jata hai.

#### Live Calculation Logic in `js/cart.js`:
```javascript
function calculateTotal() {
    const itemTotal = CartManager.getTotalPrice();
    let deliveryFee = itemTotal > 0 ? 40 : 0;
    
    // Free delivery conditions
    if (appliedCouponCode === 'FREEDEL' || itemTotal >= 399) {
        deliveryFee = 0;
    }
    
    const taxes = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0;
    return Math.max(0, itemTotal + deliveryFee + taxes - activeDiscount);
}
```

---

### 💬 6. Help & Support / FAQ Page (`contact.html`)
- **CSS:** `css/global.css` + `css/contact.css`
- **JS:** `js/global.js` + `js/contact.js`

#### Features:
1. **Quick Support Cards:** Phone hotline (+91 98765 43210), Instant Live Chat trigger, Email support.
2. **Inquiry Form:** Name, Email, Topic selection, aur Message input with validation.
3. **Interactive FAQ Accordion:** Click karne par question open/close hota hai smooth transition ke sath.

#### Accordion Logic in `js/contact.js`:
```javascript
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');

        // Sabhi FAQs ko pehle close karo
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

        // Current FAQ ko toggle karo
        if (!wasOpen) {
            item.classList.add('open');
        }
    });
});
```

---

### 🔐 7. Authentication Page (`login.html`)
- **CSS:** `css/global.css` + `css/login.css`
- **JS:** `js/global.js` + `js/login.js`

#### Features:
1. **Modern Login Card:** Clean email & password input with focus-ring styling.
2. **Social Login Buttons:** Google & Apple sign-in options.
3. **Form Validation:** Checks required fields and simulates redirect to `index.html`.

---

## 4. How Data Flows Across Pages

```
[ menu.html ] --(Click 'Add +')--> [ CartManager.addItem() in global.js ]
                                           |
                                           v
                             [ Saved in LocalStorage ]
                                           |
                +--------------------------+--------------------------+
                |                                                     |
                v                                                     v
   [ Navbar Cart Badge: #cart-badge ]                 [ cart.html: renderCart() ]
   (Auto-increments with scale anim)                  (Calculates bill & discounts)
```

1. **User Action:** User `menu.html` par kisi item par click karta hai.
2. **State Update:** `CartManager.addItem()` item ko `localStorage` array me add/increment karta hai.
3. **Global Sync:** Navbar ka cart badge bounce animation ke sath increment hota hai aur toast popup generate hota hai.
4. **Checkout:** Jab user `cart.html` open karta hai, to wahi saved items display hote hain aur bill real-time calculate hota hai.

---

## 5. Key Design Patterns & Best Practices

1. **Separation of Concerns (SoC):** Structure (HTML), Presentation (CSS), aur Behavior (JS) ko completely alag rakha gaya hai.
2. **No Inline Styling Mess:** Stylesheet modules (`global.css`, `home.css`, `menu.css`, etc.) maintainable code ensure karte hain.
3. **Mobile First & Responsive:** CSS Grid aur Flexbox with `@media (max-width: ...)` har screen size (Mobile, Tablet, Desktop) par pixel-perfect rendering dete hain.
4. **Zero Heavy Dependencies:** Pure Vanilla JavaScript aur CSS use kiya gaya hai jisse page load time ultra-fast hai.

---

*Enjoy building and mastering web development with Eat Club! 🚀*
