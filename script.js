const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE';

const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';

let products = [];
let currentEditId = null;

// 1. БОРКУНИИ МАҲСУЛОТ ВА ДИЗАЙНИ ГРИД
async function loadProducts() {
    const grid = document.getElementById('main-grid');
    if (!grid) return;
    grid.innerHTML = "<div class='loader'>⏳ Дар ҳоли боркунӣ...</div>";

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        products = await res.json();
        renderProducts();
        renderAdminList(); // Намоиши рӯйхат барои идоракунӣ
    } catch (e) {
        grid.innerHTML = "❌ Хатои пайвастшавӣ";
    }
}

function renderProducts() {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="badge">${p.cat}</div>
            <img src="${p.img}" onerror="this.src='https://via.placeholder.com/150'">
            <div class="info">
                <h3>${p.name}</h3>
                <p class="price">${p.price} <span>смн</span></p>
                <button onclick="addToCart(${p.id})">🛒 Харидан</button>
            </div>
        </div>
    `).join('');
}

// 2. ИДОРАКУНИИ МАҲСУЛОТ (EDIT / DELETE)
function renderAdminList() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    list.innerHTML = products.map(p => `
        <div class="admin-item">
            <span>${p.name} - ${p.price}смн</span>
            <div>
                <button class="edit-btn" onclick="prepareEdit(${p.id})">✏️</button>
                <button class="del-btn" onclick="deleteProduct(${p.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Омодагӣ барои ислоҳ
function prepareEdit(id) {
    const p = products.find(item => item.id === id);
    currentEditId = id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-img').value = p.img;
    document.getElementById('p-cat').value = p.cat;
    document.getElementById('save-btn').innerText = "Захираи тағйирот";
}

// САБТ (ҲАМ НАВ ВА ҲАМ ИСЛОҲ)
async function saveProduct() {
    const data = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        img: document.getElementById('p-img').value,
        cat: document.getElementById('p-cat').value
    };

    const url = currentEditId 
        ? `${SUPABASE_URL}/rest/v1/products?id=eq.${currentEditId}` 
        : `${SUPABASE_URL}/rest/v1/products`;
    
    const method = currentEditId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Бомуваффақият иҷро шуд!");
        resetForm();
        loadProducts();
    }
}

async function deleteProduct(id) {
    if (!confirm("Мехоҳед ин маҳсулотро нест кунед?")) return;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (res.ok) loadProducts();
}

function resetForm() {
    currentEditId = null;
    document.getElementById('save-btn').innerText = "Илова кардан";
    document.querySelectorAll('.admin-input').forEach(i => i.value = '');
}

// 3. ПАРДОХТ (ОПТИМИЗАЦИЯ)
function checkout() {
    if (cart.length === 0) return alert("Сабад холӣ аст!");
    let text = "🚀 Навбати нав:\n\n";
    cart.forEach(i => text += `🔹 ${i.name} x ${i.qty} = ${i.price * i.qty}смн\n`);
    text += `\n💰 Ҷамъ: ${document.getElementById('grand-total').innerText}`;
    
    const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`;
    fetch(url).then(() => {
        alert("Закази шумо қабул шуд! Ба наздикӣ тамос мегирем.");
        cart = [];
        updateCartUI();
        toggleCart();
    });
}

document.addEventListener('DOMContentLoaded', loadProducts);
