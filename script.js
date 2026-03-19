const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc2MiOiJzdXBhYmFzZSIsInJlZ2lvbiI6InVzLWVhc3QtMSIsInByb2plY3RfcmVmIjoieWpvb21yZmRrbXJsc3Bha2Npa2IifQ.BhYmFzZSlzInJlZ2iI6Inlqb21ycmRrbXJsc3Bha2Npa2B9tcm';

// ⚠️ ДИҚҚАТ: Токени боти худро дар инҷо гузоред!
const TG_TOKEN = 'ТОКЕНИ_БОТИ_ШУМО'; 
const CHAT_ID = '6013669149'; 

let products = [];
let cart = [];
let currentEditId = null;

// ==========================================
// 1. БОРКУНӢ ВА НАМОИШИ МАҲСУЛОТ ВА КАТЕГОРИЯҲО
// ==========================================
async function loadProducts() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        products = await res.json();
        renderProducts('Ҳама'); // Ҳангоми даромадан ҳамаи маҳсулотро нишон медиҳад
        renderAdminList();
    } catch (e) {
        console.error("Хатои боркунӣ:", e);
    }
}

function renderProducts(category = 'Ҳама') {
    const grid = document.getElementById('main-grid');
    if (!grid) return;

    // Филтр кардани категорияҳо
    let filteredProducts = products;
    if (category !== 'Ҳама') {
        filteredProducts = products.filter(p => p.cat === category);
    }

    grid.innerHTML = filteredProducts.map(p => `
        <div class="product-card">
            <span class="badge">${p.cat || 'Умумӣ'}</span>
            <img src="${p.img || 'https://via.placeholder.com/150'}" onerror="this.src='https://via.placeholder.com/150'">
            <h3>${p.name}</h3>
            <p class="price">${p.price} смн</p>
            <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">🛒 Харидан</button>
        </div>
    `).join('');
}

// Ин функсияро тугмаҳои категория (Ширӣ, Нӯшокиҳо) ҷеғ мезананд
function filterCategory(cat) {
    renderProducts(cat);
}

// ==========================================
// 2. САБАД ВА ПАРДОХТ (TELEGRAM)
// ==========================================
function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    alert(`✅ "${name}" ба сабад илова шуд!`);
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    }
}

async function sendOrder() {
    if (cart.length === 0) return alert("Сабад холӣ аст!");
    
    let message = "📦 ЗАКАЗИ НАВ:\n\n";
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} x ${item.qty} = ${item.price * item.qty} смн\n`;
        total += item.price * item.qty;
    });
    message += `\n💰 Ҷамъ: ${total} смн`;

    const tgUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    
    try {
        await fetch(tgUrl);
        alert("✅ Закази шумо ба Telegram фиристода шуд!");
        cart = [];
        updateCartUI();
    } catch (e) { alert("❌ Хатогӣ ҳангоми фиристодан."); }
}

// ==========================================
// 3. ПАНЕЛИ АДМИН (ИЛОВА, ИСЛОҲ, НЕСТ КАРДАН)
// ==========================================
function openAdmin() { document.getElementById('admin-modal').style.display = 'block'; }
function closeAdmin() { document.getElementById('admin-modal').style.display = 'none'; }

function checkAdminPass() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === '1234') { // Рамзи админ
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else {
        alert("❌ Рамз нодуруст аст!");
    }
}

function renderAdminList() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    list.innerHTML = products.map(p => `
        <div class="admin-item">
            <span>${p.name} (${p.price}смн)</span>
            <div>
                <button class="btn-edit" onclick="prepareEdit(${p.id})">✏️</button>
                <button class="btn-del" onclick="deleteProduct(${p.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function prepareEdit(id) {
    const p = products.find(item => item.id === id);
    currentEditId = id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-img').value = p.img;
    document.getElementById('p-cat').value = p.cat;
    document.getElementById('save-btn').innerText = "Захираи тағйирот";
}

async function saveProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;

    if (!name || !price) return alert("Ном ва нарх ҳатмӣ аст!");

    const data = { name, price: parseFloat(price), img: img || '', cat: cat || 'Умумӣ' };
    const method = currentEditId ? 'PATCH' : 'POST';
    const url = currentEditId ? `${SUPABASE_URL}/rest/v1/products?id=eq.${currentEditId}` : `${SUPABASE_URL}/rest/v1/products`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("✅ Муваффақият!");
            resetAdminForm();
            loadProducts();
        } else { alert("❌ Хатогӣ ҳангоми сабт."); }
    } catch (e) { alert("❌ Хатои пайвастшавӣ."); }
}

async function deleteProduct(id) {
    if (!confirm("Мехоҳед ин маҳсулотро нест кунед?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    loadProducts();
}

function resetAdminForm() {
    currentEditId = null;
    document.getElementById('save-btn').innerText = "Илова кардан";
    document.getElementById('p-name').value = '';
    document.getElementById('p-price').value = '';
    document.getElementById('p-img').value = '';
}

// Иҷро кардани боркунӣ ҳангоми кушодани сайт
document.addEventListener('DOMContentLoaded', loadProducts);
