const URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE'; // Токени дарози худро монед
const TG_BOT = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509';
const MY_WALLET = "004220770";

let products = [];
let cart = [];

// === 1. МАҲСУЛОТ ВА САБАД ===
async function loadProducts() {
    const res = await fetch(`${URL}/rest/v1/products?select=*&order=id.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    if(res.ok) {
        products = await res.json();
        renderProducts('Ҳама');
    }
}

function renderProducts(cat) {
    const container = document.getElementById('products-container');
    const filtered = cat === 'Ҳама' ? products : products.filter(p => p.cat === cat);
    
    if (filtered.length === 0) {
        container.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center;">Дар ин категория маҳсулот нест.</h3>`;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img || 'https://via.placeholder.com/150'}" alt="${p.name}">
            <h4>${p.name}</h4>
            <div class="price">${p.price} смн</div>
            <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">🛒 Сабад</button>
        </div>
    `).join('');
}

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    document.getElementById('cart-count').innerText = cart.length;
}

// === 2. ЗАКАЗ КАРДАН (CHECKOUT) ===
function openCheckout() {
    if (cart.length === 0) return alert("Сабади шумо холӣ аст!");
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemsNames = cart.map(item => item.name).join(', ');
    
    document.getElementById('cart-summary').innerHTML = `
        <b>Маҳсулот:</b> ${itemsNames}<br><br>
        <b style="font-size: 18px;">Ҷамъи умумӣ: ${total} смн</b>
    `;
    openModal('checkout-modal');
}

function toggleBankInfo(method) {
    document.getElementById('bank-info').style.display = (method === 'Бонк') ? 'block' : 'none';
}

function copyWallet() {
    navigator.clipboard.writeText(MY_WALLET);
    alert("Рақами ҳамён нусхабардорӣ шуд!");
}

async function submitOrder() {
    const data = {
        customer_name: document.getElementById('c-name').value,
        customer_phone: document.getElementById('c-phone').value,
        customer_address: document.getElementById('c-addr').value,
        delivery_type: document.getElementById('c-del').value,
        payment_method: document.getElementById('c-pay').value,
        receipt_url: document.getElementById('c-receipt').value,
        items_list: cart.map(i => i.name).join(', '),
        total_amount: cart.reduce((sum, i) => sum + i.price, 0)
    };

    if (!data.customer_name || !data.customer_phone) return alert("Ном ва телефонро ҳатман нависед!");

    // Сабт ба Базаи маълумот
    const res = await fetch(`${URL}/rest/v1/orders`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data) // ID худкор мемонад
    });

    if (res.ok) {
        // Фиристодан ба Телеграм
        const tgMessage = `📦 ЗАКАЗИ НАВ!\n👤 Харидор: ${data.customer_name}\n📞 Тел: ${data.customer_phone}\n🏠 Адрес: ${data.customer_address}\n🚚 Доставка: ${data.delivery_type}\n💳 Пардохт: ${data.payment_method}\n🛍️ Маҳсулот: ${data.items_list}\n💰 Ҷамъ: ${data.total_amount} смн`;
        
        fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(tgMessage)}`);
        
        alert("Закази шумо бо муваффақият қабул шуд ва ба админ рафт!");
        cart = [];
        closeModals();
        document.getElementById('cart-count').innerText = '0';
    } else {
        alert("Хатогӣ ҳангоми фиристодани заказ.");
    }
}

// === 3. ИСТОРИЯИ ХАРИДОР ===
async function checkHistory() {
    const phone = document.getElementById('h-phone').value;
    if(!phone) return alert("Рақами телефонро нависед!");

    const res = await fetch(`${URL}/rest/v1/orders?customer_phone=eq.${phone}&order=id.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    const orders = await res.json();
    
    const list = document.getElementById('history-list');
    if (orders.length === 0) {
        list.innerHTML = "<p>Бо ин рақам заказ ёфт нашуд.</p>";
        return;
    }

    list.innerHTML = orders.map(o => `
        <div class="admin-item">
            <p><b>Заказ №${o.id}</b> | Статус: <span class="status-${o.status}">${o.status}</span></p>
            <p>🛍️ ${o.items_list} (<b>${o.total_amount} смн</b>)</p>
            <small>Сана: ${new Date(o.created_at).toLocaleString()}</small>
        </div>
    `).join('');
}

// === 4. ПАНЕЛИ АДМИН ===
function loginAdmin() {
    if (document.getElementById('admin-pass').value === '1234') {
        document.getElementById('admin-login-area').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadAdminOrders();
    } else {
        alert("Рамз нодуруст аст!");
    }
}

function switchAdminTab(tab) {
    document.getElementById('tab-orders').style.display = tab === 'orders' ? 'block' : 'none';
    document.getElementById('tab-add').style.display = tab === 'add' ? 'block' : 'none';
    if(tab === 'orders') loadAdminOrders();
}

async function addNewProduct() {
    const pData = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        img: document.getElementById('p-img').value,
        cat: document.getElementById('p-cat').value
    };

    if (!pData.name || !pData.price) return alert("Ном ва нархро нависед!");

    // МУҲИМ: ID равон намекунем, база худаш мегузорад. Ин хатогии шуморо ҳал мекунад.
    const res = await fetch(`${URL}/rest/v1/products`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(pData)
    });

    if (res.ok) {
        alert("Маҳсулоти нав илова шуд!");
        document.getElementById('p-name').value = '';
        document.getElementById('p-price').value = '';
        document.getElementById('p-img').value = '';
        loadProducts(); // Дарҳол дар экран пайдо мешавад
    } else {
        alert("Хатогӣ ҳангоми илова кардан.");
    }
}

async function loadAdminOrders() {
    const res = await fetch(`${URL}/rest/v1/orders?select=*&order=id.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    const orders = await res.json();
    
    document.getElementById('admin-orders-list').innerHTML = orders.map(o => `
        <div class="admin-item">
            <p><b>№${o.id}</b> | 👤 ${o.customer_name} (${o.customer_phone})</p>
            <p>🛍️ ${o.items_list} | <b>${o.total_amount} смн</b></p>
            <p>🚚 ${o.delivery_type} | 💳 ${o.payment_method}</p>
            <p>Статус: <span class="status-${o.status}">${o.status}</span></p>
            ${o.receipt_url ? `<a href="${o.receipt_url}" target="_blank" style="color:blue;">🖼️ Дидани чеки пардохт</a><br><br>` : ''}
            <div>
                <button onclick="updateStatus(${o.id}, 'Тасдиқ')" style="background:#27ae60; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">✅ Ок (Тасдиқ)</button>
                <button onclick="updateStatus(${o.id}, 'Рад')" style="background:#e74c3c; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; margin-left:10px;">❌ Рад кардан</button>
            </div>
        </div>
    `).join('');
}

async function updateStatus(id, newStatus) {
    const res = await fetch(`${URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    
    if(res.ok) {
        // Огоҳӣ ба Телеграм
        fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(`📢 Заказ №${id}\nСтатуси нав: ${newStatus}`)}`);
        loadAdminOrders();
    }
}

// === ФУНКСИЯҲОИ ЁРИРАСОН ===
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }

// Ҳангоми кушодани сайт маҳсулотҳоро бор кун
document.addEventListener('DOMContentLoaded', loadProducts);
