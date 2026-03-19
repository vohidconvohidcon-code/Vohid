const URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE'; 
const TG_BOT = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';
const MY_WALLET = "175333223"; 

let products = [];
let cart = [];

// БОРКУНИИ МАҲСУЛОТ
async function loadProducts() {
    const res = await fetch(`${URL}/rest/v1/products?select=*&order=id.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    products = await res.json();
    renderProducts('Ҳама');
}

function renderProducts(cat) {
    const grid = document.getElementById('product-grid');
    const filtered = cat === 'Ҳама' ? products : products.filter(p => p.cat === cat);
    grid.innerHTML = filtered.map(p => `
        <div class="card">
            <img src="${p.img || 'https://via.placeholder.com/150'}">
            <h4>${p.name}</h4>
            <p style="color:#e74c3c; font-weight:bold">${p.price} смн</p>
            <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})" style="background:#1a252f; color:white; border:none; padding:8px; width:100%; border-radius:5px; cursor:pointer">🛒 Харидан</button>
        </div>
    `).join('');
}

// САБАД
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    document.getElementById('cart-count').innerText = cart.length;
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
    if(id === 'checkout-modal') {
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        document.getElementById('cart-summary').innerHTML = `Ҷамъ: <b>${total} смн</b><br><small>${cart.map(i => i.name).join(', ')}</small>`;
    }
}

function toggleBank(val) { document.getElementById('bank-panel').style.display = (val === 'Бонк' ? 'block' : 'none'); }
function copyWallet() { navigator.clipboard.writeText(MY_WALLET); alert("Рақами ҳамён нусха шуд!"); }

// ФИРИСТОДАНИ ЗАКАЗ
async function sendOrder() {
    const orderData = {
        customer_name: document.getElementById('c-name').value,
        customer_phone: document.getElementById('c-phone').value,
        customer_address: document.getElementById('c-addr').value,
        delivery_type: document.getElementById('c-del').value,
        payment_method: document.getElementById('c-pay').value,
        items_list: cart.map(i => i.name).join(", "),
        total_amount: cart.reduce((sum, i) => sum + i.price, 0),
        receipt_url: document.getElementById('c-receipt').value
    };

    if(!orderData.customer_name || !orderData.customer_phone) return alert("Ном ва телефонро нависед!");

    const res = await fetch(`${URL}/rest/v1/orders`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });

    if(res.ok) {
        const msg = `📦 ЗАКАЗИ НАВ!\n👤: ${orderData.customer_name}\n📞: ${orderData.customer_phone}\n💰: ${orderData.total_amount}смн\n💳: ${orderData.payment_method}`;
        fetch(`https://api.telegram.org/bot${TG_BOT}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}`);
        alert("Закази шумо қабул шуд!");
        cart = []; location.reload();
    }
}

// ИСТОРИЯ
async function getUserHistory() {
    const phone = document.getElementById('h-phone').value;
    const res = await fetch(`${URL}/rest/v1/orders?customer_phone=eq.${phone}&order=id.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    const data = await res.json();
    document.getElementById('history-list').innerHTML = data.map(o => `
        <div class="order-card">
            <p>Заказ №${o.id} - <span class="status-${o.status}">${o.status}</span></p>
            <p>${o.items_list}</p>
            <small>${new Date(o.created_at).toLocaleString()}</small>
        </div>
    `).join('') || "Заказ ёфт нашуд";
}

// АДМИН
function openAdmin() { openModal('admin-modal'); }
function loginAdmin() { 
    if(document.getElementById('admin-pass').value === '1234') { 
        document.getElementById('admin-auth').style.display='none'; 
        document.getElementById('admin-area').style.display='block'; 
        loadAdminOrders(); 
    } 
}

async function addProduct() {
    const p = { 
        name: document.getElementById('p-name').value, 
        price: parseFloat(document.getElementById('p-price').value), 
        img: document.getElementById('p-img').value, 
        cat: document.getElementById('p-cat').value 
    };
    await fetch(`${URL}/rest/v1/products`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
    });
    alert("Илова шуд!"); loadProducts();
}

async function loadAdminOrders() {
    const res = await fetch(`${URL}/rest/v1/orders?select=*&order=id.desc`, { headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` } });
    const data = await res.json();
    document.getElementById('admin-order-list').innerHTML = data.map(o => `
        <div class="order-card">
            <p><b>№${o.id}</b> | ${o.customer_name} (${o.customer_phone})</p>
            <p>${o.items_list} | <b>${o.total_amount}смн</b></p>
            <p>Статус: <span class="status-${o.status}">${o.status}</span></p>
            ${o.receipt_url ? `<a href="${o.receipt_url}" target="_blank">🖼️ Дидани Чек</a>` : ''}
            <div>
                <button onclick="updateOrderStatus(${o.id}, 'Тасдиқ')" style="background:green; color:white;">Ок</button>
                <button onclick="updateOrderStatus(${o.id}, 'Рад')" style="background:red; color:white;">Рад</button>
            </div>
        </div>
    `).join('');
}

async function updateOrderStatus(id, status) {
    await fetch(`${URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadAdminOrders();
}

async function addProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;

    if (!name || !price) return alert("Пур кунед!");

    // МУҲИМ: id-ро дар инҷо нанависед!
    const productData = {
        name: name,
        price: parseFloat(price),
        img: img,
        cat: cat
    };

    const res = await fetch(`${URL}/rest/v1/products`, {
        method: 'POST',
        headers: { 
            'apikey': KEY, 
            'Authorization': `Bearer ${KEY}`, 
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal' 
        },
        body: JSON.stringify(productData)
    });

    if (res.ok) {
        alert("Маҳсулот илова шуд!");
        loadProducts(); // Навсозии рӯйхат
        closeModals();
    } else {
        alert("Хатогӣ!");
    }
}

function switchTab(tab) {
    document.getElementById('tab-orders').style.display = tab === 'orders' ? 'block' : 'none';
    document.getElementById('tab-add').style.display = tab === 'add' ? 'block' : 'none';
}
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.style.display='none'); }
document.addEventListener('DOMContentLoaded', loadProducts);
