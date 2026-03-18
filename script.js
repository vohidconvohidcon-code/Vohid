// НАСТРОЙКИ ТЕЛЕГРАМ БОТА
const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; // Токени худро гузоред
const CHAT_ID = '1288252509'; // ID-и худро гузоред

// Базаи маҳсулотҳои мағоза
const products = [
    { id: 1, name: "Молоко 'Саодат' 2.5% 1л", price: 12.50, cat: "dairy", img: "https://vash-vibor.tj/wp-content/uploads/2021/05/moloko-saodat-25.jpg" },
    { id: 2, name: "Творог Домашний 500г", price: 25.00, cat: "dairy", img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=300" },
    { id: 3, name: "Хлеб 'Точикистон'", price: 4.50, cat: "bakery", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300" },
    { id: 4, name: "Булочка с джемом", price: 5.00, cat: "bakery", img: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300" },
    { id: 5, name: "Вода 'Сиёма' 1.5л (Газ)", price: 5.00, cat: "drinks", img: "https://siyoma.tj/wp-content/uploads/2020/02/1.5.png" },
    { id: 6, name: "Coca-Cola 1.5л", price: 13.00, cat: "drinks", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300" },
    { id: 7, name: "Бананы Эквадор (1кг)", price: 23.00, cat: "fruits", img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300" },
    { id: 8, name: "Мясо Говядина (1кг)", price: 75.00, cat: "meat", img: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=300" }
];

let cart = [];

// Намоиши маҳсулот дар саҳифа
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Ничего не найдено 😔</p>`;
        return;
    }
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.img}" class="product-img" alt="${p.name}">
            <h3 class="product-title">${p.name}</h3>
            <div class="product-price">${p.price.toFixed(2)} смн</div>
            <button class="add-btn" onclick="addToCart(${p.id})">
                <i class="fa-solid fa-cart-plus"></i> В корзину
            </button>
        </div>
    `).join('');
}

// Филтр кардани категорияҳо
function filterProducts(cat, element) {
    document.querySelectorAll('.cat-list li').forEach(li => li.classList.remove('active'));
    if (element) element.classList.add('active');
    
    document.getElementById('category-title').innerText = element ? element.innerText : "Все товары";
    
    if (cat === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.cat === cat));
}

// Ҷустуҷӯ
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    document.getElementById('category-title').innerText = "Результаты поиска";
    renderProducts(filtered);
}

// Илова ба сабад
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    
    updateCartUI();
    // Аниматсияи хурд ҳангоми илова
    const badge = document.getElementById('cart-badge');
    badge.style.transform = "scale(1.5)";
    setTimeout(() => badge.style.transform = "scale(1)", 200);
}

// Тағйири миқдор дар сабад
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

// Навсозии намуди сабад
function updateCartUI() {
    const list = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const totalElem = document.getElementById('total-price');

    if (cart.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding: 40px 0; color: #888;">Корзина пуста 🛒</div>';
        badge.innerText = '0';
        totalElem.innerText = '0.00 смн';
        return;
    }

    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
        <div class="cart-item">
            <div>
                <div style="font-size:14px; font-weight:600;">${item.name}</div>
                <div style="color:#E30613; font-weight:bold;">${(item.price * item.qty).toFixed(2)} смн</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>`;
    }).join('');

    badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    totalElem.innerText = `${total.toFixed(2)} смн`;
}

// Кушодан/Пӯшидани сабад
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    }
}

// Модали пардохт
function openCheckout() {
    if (cart.length === 0) {
        alert("Корзина пуста! Добавьте товары.");
        return;
    }
    toggleCart(); // Пӯшидани сабад
    document.getElementById('checkoutModal').style.display = 'flex';
}
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

function toggleAddress() {
    const type = document.getElementById('deliveryType').value;
    document.getElementById('addressBlock').style.display = type === 'pickup' ? 'none' : 'block';
}

// ФИРИСТОДАН БА ТЕЛЕГРАМ
async function sendOrder() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const delivery = document.getElementById('deliveryType').value;
    const address = document.getElementById('clientAddress').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const btn = document.getElementById('sendBtn');

    if (!name || !phone) {
        alert("Заполните Имя и Телефон!");
        return;
    }
    
    if(TELEGRAM_TOKEN === 'ТОКЕНИ_ШУМО') {
        alert("ОШИБКА: Вы не ввели токен Telegram в файле script.js!");
        return;
    }

    btn.innerText = "Отправка...";
    btn.disabled = true;

    let itemsText = cart.map(i => `🔸 ${i.name} (x${i.qty}) - ${i.price * i.qty} смн`).join('\n');
    let total = document.getElementById('total-price').innerText;

    const message = `
🛒 **НОВЫЙ ЗАКАЗ (ЁВАР Clone)**
👤 Клиент: ${name}
📞 Телефон: ${phone}
🚚 Тип: ${delivery === 'pickup' ? 'Самовывоз' : 'Доставка'}
📍 Адрес: ${address || '-'}
💳 Оплата: ${payment}

📦 **Товары:**
${itemsText}

💰 **К оплате:** ${total}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            alert("✅ Заказ успешно оформлен! Ожидайте звонка.");
            
            // Агар Алиф бошад, ба барномаи Алиф мегузаронад
            if (payment === "Alif Mobi") {
                window.location.href = "https://alif.tj"; // Ё ба линки пардохти худатон
            }
            
            cart = [];
            updateCartUI();
            closeCheckout();
        } else {
            alert("❌ Ошибка при отправке в Telegram.");
        }
    } catch (e) {
        alert("❌ Проверьте подключение к интернету!");
    } finally {
        btn.innerText = "Подтвердить заказ";
        btn.disabled = false;
    }
}

// Оғози кор
window.onload = () => { renderProducts(products); };
