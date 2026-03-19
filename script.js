const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE';

let products = [];
let cart = [];
let currentEditId = null;

// Бор кардани маҳсулот
async function loadProducts() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    products = await res.json();
    renderProducts('Ҳама');
    renderAdminList();
}

function renderProducts(cat) {
    const grid = document.getElementById('main-grid');
    const filtered = cat === 'Ҳама' ? products : products.filter(p => p.cat === cat);
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img || 'https://via.placeholder.com/150'}">
            <h4>${p.name}</h4>
            <p style="color:red; font-weight:bold;">${p.price} смн</p>
            <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})" style="width:100%; padding:8px; background:#27ae60; color:white; border:none; border-radius:5px;">🛒 Харидан</button>
        </div>
    `).join('');
}

function filterCategory(cat) { renderProducts(cat); }

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(`"${name}" илова шуд!`);
}

// Функсияҳои Админ
function openAdmin() { document.getElementById('admin-modal').style.display = 'block'; }
function closeAdmin() { document.getElementById('admin-modal').style.display = 'none'; }

function checkAdminPass() {
    if (document.getElementById('admin-pass').value === '1234') {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else { alert("Рамз хатост!"); }
}

async function saveProduct() {
    const data = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        img: document.getElementById('p-img').value,
        cat: document.getElementById('p-cat').value
    };

    if (!data.name || !data.price) return alert("Ном ва нархро нависед!");

    const method = currentEditId ? 'PATCH' : 'POST';
    const url = currentEditId ? `${SUPABASE_URL}/rest/v1/products?id=eq.${currentEditId}` : `${SUPABASE_URL}/rest/v1/products`;

    const res = await fetch(url, {
        method: method,
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Захира шуд!");
        currentEditId = null;
        loadProducts();
    } else { alert("Хатогӣ ҳангоми сабт!"); }
}

function renderAdminList() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = products.map(p => `
        <div class="admin-item">
            <span>${p.name}</span>
            <button onclick="deleteProduct(${p.id})">🗑️</button>
        </div>
    `).join('');
}

async function deleteProduct(id) {
    if (!confirm("Нест кунем?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    loadProducts();
}

document.addEventListener('DOMContentLoaded', loadProducts);
