const PRODUCTS = [
    { id: 'p1', name: 'Vanilla Scones', category: 'scones', img: 'images/pic1.jpg', group: 1, sizes: [{ label: '5 litre', price: 350 }, { label: '10 litre', price: 550 }, { label: '20 litre', price: 700 }] },
    { id: 'p2', name: 'Chocolate Scones', category: 'scones', img: 'images/pic1 (4).jpg', group: 1, sizes: [{ label: '5 litre', price: 350 }, { label: '10 litre', price: 550 }, { label: '20 litre', price: 700 }] },
    { id: 'p3', name: 'Vanilla Muffins', category: 'muffins', img: 'images/pic1 (3).jpg', group: 1, sizes: [{ label: '5 litre', price: 350 }, { label: '10 litre', price: 550 }, { label: '20 litre', price: 700 }] },
    { id: 'p4', name: 'Chocolate Muffins', category: 'muffins', img: 'images/pic1 (2).png', group: 1, sizes: [{ label: '5 litre', price: 350 }, { label: '10 litre', price: 550 }, { label: '20 litre', price: 700 }] },
    { id: 'p5', name: 'Chocolate Cake', category: 'cakes', img: 'images/pic1 (3).png', group: 2, sizes: [{ label: 'small', price: 200 }, { label: 'medium', price: 400 }, { label: 'large', price: 600 }] },
    { id: 'p6', name: 'Carrot Cake', category: 'cakes', img: 'images/pic1 (1).png', group: 2, sizes: [{ label: 'small', price: 200 }, { label: 'medium', price: 400 }, { label: 'large', price: 600 }] },
    { id: 'p7', name: 'Strawberry Muffins', category: 'muffins', img: 'images/pic1 (2).png', group: 2, sizes: [{ label: '5 litre', price: 350 }, { label: '10 litre', price: 550 }, { label: '20 litre', price: 700 }] },
    { id: 'p8', name: 'Cranberry Muffins', category: 'muffins', img: 'images/pic2.png', group: 2, sizes: [{ label: '5 litre', price: 350 }, { label: '10 litre', price: 550 }, { label: '20 litre', price: 700 }] }
];

const BLOG_POSTS = [
    { img: 'images/blog-img1.png', tag: 'Recipe notes', title: 'Caramel Bourbon Vanilla Cupcakes', body: 'The trick is letting the caramel cool just enough before it meets the batter, so it ribbons instead of disappearing.' },
    { img: 'images/blog-img2.png', tag: 'From the kitchen', title: 'Why we bake by the litre', body: 'Bulk orders taught us more about consistency than any single perfect batch ever could.' },
    { img: 'images/blog-img2.png', tag: 'Behind the bakes', title: 'Sourcing better cocoa', body: "A small swap in cocoa supplier changed the way every chocolate bake in the lineup tastes." }
];

const state = {
    cart: [],
    activeFilter: 'all',
    selectedSize: {}
};

function formatCurrency(amount) {
    return 'R' + amount.toLocaleString('en-ZA');
}

function buildProductCard(product) {
    const defaultSize = product.sizes[0];
    state.selectedSize[product.id] = defaultSize;

    const sizeButtons = product.sizes.map((size, index) => (
        `<button class="size-pill${index === 0 ? ' selected' : ''}" data-product="${product.id}" data-size-index="${index}">${size.label}</button>`
    )).join('');

    const priceRows = product.sizes.map(size => (
        `<div class="price-row"><span>${size.label}</span><span>${formatCurrency(size.price)}</span></div>`
    )).join('');

    return `
    <div class="swiper-slide box" data-category="${product.category}">
        <div class="img">
            <img src="${product.img}" alt="${product.name}" loading="lazy">
            <span class="category-tag">${product.category}</span>
        </div>
        <div class="product-content">
            <h3>${product.name}</h3>
            <h5 class="visually-hidden">Price List</h5>
            <div class="price-list">${priceRows}</div>
            <div class="size-select">${sizeButtons}</div>
            <div class="orderNow">
                <button data-product="${product.id}">Add to order</button>
            </div>
        </div>
    </div>`;
}

function buildBlogCard(post) {
    return `
    <div class="swiper-slide box">
        <div class="img"><img src="${post.img}" alt="${post.title}" loading="lazy"></div>
        <div class="content">
            <span class="tag">${post.tag}</span>
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <a href="#blogs" class="btn">learn more</a>
        </div>
    </div>`;
}

function renderProducts(filter) {
    const groupOne = PRODUCTS.filter(p => p.group === 1 && (filter === 'all' || p.category === filter));
    const groupTwo = PRODUCTS.filter(p => p.group === 2 && (filter === 'all' || p.category === filter));

    document.getElementById('productWrapperOne').innerHTML = groupOne.map(buildProductCard).join('');
    document.getElementById('productWrapperTwo').innerHTML = groupTwo.map(buildProductCard).join('');

    attachProductHandlers();
}

function attachProductHandlers() {
    document.querySelectorAll('.size-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const productId = pill.dataset.product;
            const sizeIndex = Number(pill.dataset.sizeIndex);
            const product = PRODUCTS.find(p => p.id === productId);
            state.selectedSize[productId] = product.sizes[sizeIndex];

            pill.parentElement.querySelectorAll('.size-pill').forEach(sibling => sibling.classList.remove('selected'));
            pill.classList.add('selected');
        });
    });

    document.querySelectorAll('.orderNow button').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.product;
            const product = PRODUCTS.find(p => p.id === productId);
            const size = state.selectedSize[productId];
            addToCart(product, size);

            btn.classList.add('added');
            const originalText = btn.textContent;
            btn.textContent = 'Added \u2713';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.textContent = originalText;
            }, 1200);
        });
    });
}

function addToCart(product, size) {
    const existing = state.cart.find(item => item.id === product.id && item.size === size.label);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ id: product.id, name: product.name, img: product.img, size: size.label, price: size.price, qty: 1 });
    }
    renderCart();
    showToast(`${product.name} (${size.label}) added to order`);
}

function changeQty(id, size, delta) {
    const item = state.cart.find(i => i.id === id && i.size === size);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
    }
    renderCart();
}

function removeFromCart(id, size) {
    state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const countBadge = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('cartCheckout');

    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);

    countBadge.textContent = totalItems;
    totalEl.textContent = formatCurrency(totalPrice);
    checkoutBtn.disabled = state.cart.length === 0;

    if (state.cart.length === 0) {
        container.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-basket"></i>Your basket is empty. Add a bake from the menu to get started.</div>`;
        return;
    }

    container.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${item.size} &middot; ${formatCurrency(item.price)}</span>
                <div class="cart-item-controls">
                    <button class="qty-btn" data-action="dec" data-id="${item.id}" data-size="${item.size}">&minus;</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-action="inc" data-id="${item.id}" data-size="${item.size}">&plus;</button>
                    <button class="cart-item-remove" data-action="remove" data-id="${item.id}" data-size="${item.size}">remove</button>
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('[data-action="inc"]').forEach(btn => btn.addEventListener('click', () => changeQty(btn.dataset.id, btn.dataset.size, 1)));
    container.querySelectorAll('[data-action="dec"]').forEach(btn => btn.addEventListener('click', () => changeQty(btn.dataset.id, btn.dataset.size, -1)));
    container.querySelectorAll('[data-action="remove"]').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.dataset.id, btn.dataset.size)));
}

function showToast(message) {
    const stack = document.getElementById('toastStack');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i>${message}`;
    stack.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

function buildWhatsAppMessage() {
    const lines = state.cart.map(item => `${item.qty}x ${item.name} (${item.size}) - ${formatCurrency(item.qty * item.price)}`);
    const total = state.cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const message = `Hi LANY's Bakes! I'd like to order:\n${lines.join('\n')}\n\nTotal: ${formatCurrency(total)}`;
    return encodeURIComponent(message);
}

function initCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');

    const openCart = () => {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
    };
    const closeCart = () => {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
    };

    document.getElementById('cart-toggle').addEventListener('click', openCart);
    document.getElementById('cartClose').addEventListener('click', closeCart);
    backdrop.addEventListener('click', closeCart);

    document.getElementById('cartCheckout').addEventListener('click', () => {
        if (state.cart.length === 0) return;
        const phone = '27672476216';
        window.open(`https://wa.me/${phone}?text=${buildWhatsAppMessage()}`, '_blank');
    });

    renderCart();
}

function initMobileNav() {
    const navbar = document.querySelector('.navbar');
    const backdrop = document.getElementById('navBackdrop');
    const menuBar = document.getElementById('menu-bar');

    const toggleNav = () => {
        navbar.classList.toggle('active');
        backdrop.classList.toggle('active');
    };

    menuBar.addEventListener('click', toggleNav);
    menuBar.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); } });
    backdrop.addEventListener('click', () => {
        navbar.classList.remove('active');
        backdrop.classList.remove('active');
    });

    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            backdrop.classList.remove('active');
        });
    });
}

function initSearch() {
    const search = document.querySelector('.search');
    const searchToggle = document.getElementById('search-toggle');
    const searchInput = document.getElementById('searchInput');
    const resultsBox = document.getElementById('searchResults');

    const toggleSearch = () => {
        search.classList.toggle('active');
        if (search.classList.contains('active')) searchInput.focus();
    };

    searchToggle.addEventListener('click', toggleSearch);
    searchToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSearch(); } });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) { resultsBox.innerHTML = ''; return; }

        const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(query) || p.category.includes(query));
        if (matches.length === 0) {
            resultsBox.innerHTML = `<div class="no-results">No bakes match "${searchInput.value}"</div>`;
            return;
        }
        resultsBox.innerHTML = matches.map(p => `<div class="result-item"><span>${p.name}</span><span>${formatCurrency(p.sizes[0].price)}+</span></div>`).join('');
    });

    document.addEventListener('click', e => {
        if (!search.contains(e.target) && !searchToggle.contains(e.target)) {
            search.classList.remove('active');
        }
    });
}

function initFilters() {
    document.getElementById('filterBar').addEventListener('click', e => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeFilter = chip.dataset.filter;
        renderProducts(state.activeFilter);
        refreshSwipers();
    });
}

function initScrollHeader() {
    const header = document.getElementById('siteHeader');
    const sections = document.querySelectorAll('section[id], .home[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);

        let currentSection = sections[0]?.id;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom > 120) currentSection = section.id;
        });
        navLinks.forEach(link => link.classList.toggle('active', link.dataset.section === currentSection));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const message = document.getElementById('newsletterMessage');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            message.textContent = 'Please enter a valid email address.';
            message.className = 'form-message error';
            return;
        }

        message.textContent = `You're on the list, ${email.split('@')[0]}! Watch your inbox.`;
        message.className = 'form-message success';
        emailInput.value = '';
    });
}

let swiperInstances = [];

function refreshSwipers() {
    swiperInstances.forEach(instance => instance.destroy(true, true));
    swiperInstances = [];

    const productSwipers = document.querySelectorAll('.product-row');
    productSwipers.forEach(el => {
        swiperInstances.push(new Swiper(el, {
            spaceBetween: 30,
            loop: el.querySelectorAll('.swiper-slide').length > 2,
            autoplay: { delay: 5500, disableOnInteraction: false },
            pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
            breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        }));
    });

    swiperInstances.push(new Swiper('.blogs-row', {
        spaceBetween: 30,
        loop: true,
        autoplay: { delay: 6500, disableOnInteraction: false },
        pagination: { el: '.blogs-row .swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 1 }, 1024: { slidesPerView: 1 } }
    }));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('blogWrapper').innerHTML = BLOG_POSTS.map(buildBlogCard).join('');

    renderProducts('all');
    initCart();
    initMobileNav();
    initSearch();
    initFilters();
    initScrollHeader();
    initNewsletter();
    refreshSwipers();
});
