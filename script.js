// --- ТАНЗИМОТИ ТЕЛЕГРАМ ---
const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509'; 

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

// --- ТАНЗИМОТИ ТЕЛЕГРАМ ---
const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509'; 

async function sendOrder() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const type = document.getElementById('deliveryType').value;
    const addr = document.getElementById('clientAddress').value.trim();
    const pay = document.querySelector('input[name="payment"]:checked').value;
    const fileInput = document.getElementById('receiptFile');
    const btn = document.getElementById('sendBtn');

    // Санҷиши пур кардани маълумот
    if (!name || !phone) return alert("Лутфан ном ва телефонро нависед!");
    if (fileInput.files.length === 0) return alert("Лутфан скриншоти расидро (чек) бор кунед!");

    btn.innerText = "Дар ҳоли фиристодан...";
    btn.disabled = true;

    // 1. Омода кардани матни фармоиш
    let orderText = `📦 ФАРМОИШИ НАВ\n`;
    orderText += `👤 Мизоҷ: ${name}\n`;
    orderText += `📞 Телефон: ${phone}\n`;
    orderText += `🚚 Намуд: ${type}\n`;
    if (type === 'Доставка') orderText += `📍 Суроға: ${addr}\n`;
    orderText += `💳 Пардохт: ${pay}\n`;
    orderText += `------------------------\n`;
    cart.forEach(i => {
        orderText += `• ${i.name} (x${i.qty}) = ${(i.price * i.qty).toFixed(2)} смн\n`;
    });
    orderText += `------------------------\n`;
    orderText += `💰 ҶАМЪ: ${document.getElementById('total-price').innerText}`;

    // 2. Фиристодани Расм (Скриншот) бо матни заказ ба Telegram
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', fileInput.files[0]);
    formData.append('caption', orderText); // Матни заказ дар зери расм мешавад

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("✅ Фармоиш ва расид қабул шуд! Админ зуд тафтиш карда ба шумо занг мезанад.");
            
            // Тоза кардани сабад ва пӯшидани модал
            cart = [];
            updateUI();
            closeCheckout();
            fileInput.value = ""; // Тоза кардани майдони файл
        } else {
            const err = await response.json();
            alert("❌ Хатогӣ дар Telegram: " + err.description);
        }
    } catch (e) {
        alert("❌ Хатои шабака! Интернет-ро тафтиш кунед.");
    } finally {
        btn.innerText = "Тасдиқи фармоиш";
        btn.disabled = false;
    }
}

window.onload = init;
