// --- ТАНЗИМОТИ ТЕЛЕГРАМ ---
const TELEGRAM_TOKEN = 'ТОКЕНИ_БОТИ_ШУМО'; 
const CHAT_ID = 'ID_ШУМО'; 

// --- БАЗАИ МАҲСУЛОТҲО ---
const products = [
    { id: 1, name: "Молоко 'Саодат' 1л", price: 12.00, img: "https://vash-vibor.tj/wp-content/uploads/2021/05/moloko-saodat-25.jpg" },
    { id: 2, name: "Вода 'Сиёма' 1.5л", price: 5.00, img: "https://siyoma.tj/wp-content/uploads/2020/02/1.5.png" },
    { id: 3, name: "Хлеб свежий", price: 4.00, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300" },
    { id: 4, name: "Coca-Cola 1.5л", price: 13.00, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300" },
    { id: 5, name: "Масло 'Олейна' 1л", price: 18.00, img: "https://re-store.tj/wp-content/uploads/2020/06/619866.png" },
    { id: 6, name: "Рис Лазер 1кг", price: 22.00, img: "https://farovon.tj/wp-content/uploads/2020/04/lazer.jpg" }
];

let cart = [];

// Рендери маҳсулот
function init() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" class="product-img">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${p.price.toFixed(2)} смн</div>
            <button class="add-btn" onclick="addToCart(${p.id})">Илова ба сабад</button>
        </div>
    `).join('');
}

// Илова кардан
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    if (item) item.qty++; else cart.push({ ...product, qty: 1 });
    updateUI();
}

// Навсозии интерфейс
function updateUI() {
    const list = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const totalElem = document.getElementById('total-price');
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Сабад холӣ аст</p>';
        badge.innerText = '0';
        totalElem.innerText = '0.00 смн';
        return;
    }

    let total = 0;
    let count = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        count += item.qty;
        return `
            <div class="cart-item">
                <div>
                    <div style="font-weight:600; font-size:14px;">${item.name}</div>
                    <div style="color:#E30613;">${(item.price * item.qty).toFixed(2)} смн</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>`;
    }).join('');

    badge.innerText = count;
    totalElem.innerText = total.toFixed(2) + ' смн';
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    updateUI();
}

// Тирезаҳо
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').style.display = 
        document.getElementById('cartSidebar').classList.contains('open') ? 'block' : 'none';
}

function openCheckout() {
    if (cart.length === 0) return alert("Сабад холӣ аст!");
    toggleCart();
    document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function toggleAddress() {
    const type = document.getElementById('deliveryType').value;
    document.getElementById('addressBlock').style.display = type === 'Самовывоз' ? 'none' : 'block';
}

// ФИРИСТОДАН БА ТЕЛЕГРАМ
async function sendOrder() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const type = document.getElementById('deliveryType').value;
    const addr = document.getElementById('clientAddress').value.trim();
    const pay = document.querySelector('input[name="payment"]:checked').value;
    const btn = document.getElementById('sendBtn');

    if (!name || !phone) return alert("Ном ва телефонро пур кунед!");
    if (TELEGRAM_TOKEN === 'ТОКЕНИ_БОТИ_ШУМО') return alert("Токенро дар скрипт нагузоштед!");

    btn.innerText = "Интизор...";
    btn.disabled = true;

    let text = `📦 ФАРМОИШИ НАВ (ЁВАР)\n`;
    text += `👤 Мизоҷ: ${name}\n`;
    text += `📞 Телефон: ${phone}\n`;
    text += `🚚 Тарз: ${type}\n`;
    if (type === 'Доставка') text += `📍 Суроға: ${addr || 'Навишта нашудааст'}\n`;
    text += `💳 Пардохт: ${pay}\n`;
    text += `------------------------\n`;
    cart.forEach(i => text += `• ${i.name} (x${i.qty}) = ${(i.price * i.qty).toFixed(2)} смн\n`);
    text += `------------------------\n`;
    text += `💰 ҶАМЪ: ${document.getElementById('total-price').innerText}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });

        if (res.ok) {
            alert("✅ Фармоиш қабул шуд! Мо ба шумо занг мезанем.");
            if (pay === "Alif Mobi") window.location.href = "https://alif.tj";
            cart = []; updateUI(); closeCheckout();
        } else {
            alert("❌ Хатогӣ ҳангоми фиристодан ба Telegram.");
        }
    } catch (e) {
        alert("❌ Хатои шабака!");
    } finally {
        btn.innerText = "Тасдиқи фармоиш";
        btn.disabled = false;
    }
}

window.onload = init;
