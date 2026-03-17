// МАЪЛУМОТИ ТЕЛЕГРАМ - ИН ҶОРО ИВАЗ КУНЕД!
const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509';

// Базаи Маҳсулотҳо (С зебо ва мукаммал)
const products = [
    { id: 1, name: "Молоко 'Саодат' 2.5%", price: 12.50, cat: "dairy", img: "https://vash-vibor.tj/wp-content/uploads/2021/05/moloko-saodat-25.jpg", logo: "https://cdn-icons-png.flaticon.com/512/3746/3746014.png" },
    { id: 2, name: "Творог Домашний 500г", price: 25.00, cat: "dairy", img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=300", logo: "https://cdn-icons-png.flaticon.com/512/3746/3746014.png" },
    { id: 3, name: "Хлеб Бородинский", price: 5.00, cat: "bakery", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300", logo: "https://cdn-icons-png.flaticon.com/512/992/992747.png" },
    { id: 4, name: "Лепешка Тандырная", price: 4.00, cat: "bakery", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7f-E-2-Z-k", logo: "https://cdn-icons-png.flaticon.com/512/992/992747.png" },
    { id: 5, name: "Вода 'Сиёма' 1.5л (Газ)", price: 5.00, cat: "drinks", img: "https://siyoma.tj/wp-content/uploads/2020/02/1.5.png", logo: "https://siyoma.tj/wp-content/uploads/2020/02/logo.png" },
    { id: 6, name: "Coca-Cola 1.5л", price: 13.00, cat: "drinks", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300", logo: "https://brandlogos.net/wp-content/uploads/2021/11/coca-cola-logo.png" },
    { id: 7, name: "Бананы Эквадор (1кг)", price: 22.00, cat: "fruits", img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300", logo: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
    { id: 8, name: "Яблоки Голден (1кг)", price: 15.00, cat: "fruits", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=300", logo: "https://cdn-icons-png.flaticon.com/512/415/415733.png" }
];

let cart = [];

// 1. Намоиши Маҳсулотҳо
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.logo}" class="brand-logo" alt="logo">
            <img src="${p.img}" class="product-img" alt="${p.name}">
            <h3 class="product-title">${p.name}</h3>
            <div class="product-price">${p.price.toFixed(2)} смн</div>
            <button class="add-btn" onclick="addToCart(${p.id})">В корзину</button>
        </div>
    `).join('');
}

// 2. Филтр кардани Категорияҳо
function filterProducts(cat, element) {
    // Тоза кардани 'active' аз ҳамаи тугмаҳо
    document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
    if(element) element.classList.add('active');
    
    const title = document.getElementById('category-title');
    if (cat === 'all') {
        title.innerText = "Все товары";
        renderProducts(products);
    } else {
        title.innerText = element ? element.innerText : "Результат";
        renderProducts(products.filter(p => p.cat === cat));
    }
}

// 3. Ҷустуҷӯ
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    document.getElementById('category-title').innerText = "Поиск...";
    renderProducts(filtered);
}

// 4. Мантиқи Сабад (Корзина)
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty += 1; // Агар бошад, фақат миқдорашро зиёд мекунад
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalElem = document.getElementById('total-price');
    const badge = document.getElementById('mobile-cart-badge');

    if (cart.length === 0) {
        list.innerHTML = '<div class="empty-cart">Корзина пуста 🛒</div>';
        totalElem.innerText = '0.00 смн';
        badge.innerText = '0';
        return;
    }

    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
        <div class="cart-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${(item.price * item.qty).toFixed(2)} смн</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>`;
    }).join('');

    totalElem.innerText = `${total.toFixed(2)} смн`;
    badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

// Кушодан ва маҳкам кардани Сабад дар Телефон
function toggleMobileCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

// 5. Оформление Заказа (Пардохт)
function openCheckout() {
    if (cart.length === 0) {
        alert("Сначала добавьте товары в корзину!");
        return;
    }
    document.getElementById('checkoutModal').style.display = "flex";
}
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = "none";
}
function toggleAddress() {
    const type = document.getElementById('deliveryType').value;
    document.getElementById('clientAddress').style.display = type === 'pickup' ? 'none' : 'block';
}

// 6. ФИРИСТОДАН БА TELEGRAM
async function sendOrder() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const delivery = document.getElementById('deliveryType').value;
    const address = document.getElementById('clientAddress').value;
    const btn = document.getElementById('sendBtn');

    if (!name || !phone) {
        alert("Пожалуйста, введите имя и телефон!");
        return;
    }

    if(TELEGRAM_TOKEN === 'ТОКЕНИ_БОТИ_ШУМО') {
        alert("ДИҚҚАТ! Шумо токени Telegram-ро дар код нагузоштед. Бинобар ин хабар намеравад.");
        return;
    }

    btn.innerText = "Отправка...";
    btn.disabled = true;

    // Тайёр кардани рӯйхати маҳсулот
    let itemsText = cart.map(i => `▪️ ${i.name} (x${i.qty}) - ${i.price * i.qty} смн`).join('\n');
    let totalPrice = document.getElementById('total-price').innerText;

    const message = `
🛍 **НОВЫЙ ЗАКАЗ (Paykar Clone)**
👤 Клиент: ${name}
📞 Телефон: ${phone}
🚚 Доставка: ${delivery === 'pickup' ? 'Самовывоз' : address}
💳 Оплата: ${payment}

📦 **Товары:**
${itemsText}

💰 **Итого к оплате:** ${totalPrice}
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
            alert("✅ Спасибо! Ваш заказ успешно отправлен. Мы свяжемся с вами.");
            if (payment === "Alif Mobi") {
                window.location.href = "https://alif.tj"; // Гузариш ба пардохт
            }
            cart = [];
            updateCartUI();
            closeCheckout();
        } else {
            alert("❌ Ошибка при отправке в Telegram.");
        }
    } catch (error) {
        alert("❌ Ошибка сети! Проверьте интернет.");
    } finally {
        btn.innerText = "Подтвердить и Заказать";
        btn.disabled = false;
    }
}

// Оғози кор
window.onload = () => {
    renderProducts(products);
};
