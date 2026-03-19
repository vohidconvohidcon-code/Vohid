// МАЪЛУМОТ АЗ РАСМҲОИ ШУМО
const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc2MiOiJzdXBhYmFzZSIsInJlZ2lvbiI6InVzLWVhc3QtMSIsInByb2plY3RfcmVmIjoieWpvb21yZmRrbXJsc3Bha2Npa2IifQ.BhYmFzZSlzInJlZ2iI6Inlqb21ycmRrbXJsc3Bha2Npa2J9tcm';

// ТАНЗИМОТИ ТЕЛЕГРАМ
const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';

let cart = [];
let products = [];

// 1. ГИРИФТАНИ МАҲСУЛОТ АЗ БАЗА
async function loadProducts() {
    const grid = document.getElementById('main-grid');
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        products = await response.json();
        renderProducts();
    } catch (e) {
        console.error("Хатои пайвастшавӣ:", e);
        if(grid) grid.innerHTML = "<p style='text-align:center; color:red;'>Хатогӣ дар пайвастшавӣ ба база!</p>";
    }
}

function renderProducts() {
    const grid = document.getElementById('main-grid');
    if(!grid) return;
    
    if(!products || products.length === 0) {
        grid.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding:50px;'>Маҳсулот ёфт нашуд. Лутфан аз Панели Админ маҳсулот илова кунед.</p>";
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-item">
            <div class="img-box"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'" alt="${p.name}"></div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="item-price">${p.price} смн</p>
                <button class="buy-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Илова кардан</button>
            </div>
        </div>
    `).join('');
}

// 2. ИЛОВАИ МАҲСУЛОТ (АДМИН)
async function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;

    if(!name || !price || !img) return alert("Ҳамаи майдонҳоро пур кунед!");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ name, price, img, cat })
        });

        if(response.ok) {
            alert("Маҳсулот бо муваффақият илова шуд!");
            loadProducts();
            closeAdmin();
        } else {
            const errData = await response.json();
            alert("Хатогӣ: " + errData.message);
        }
    } catch (e) {
        alert("Хатои интернет!");
    }
}

// 3. СИСТЕМАИ САБАД
function addToCart(id, name, price) {
    const found = cart.find(i => i.id === id);
    if(found) found.qty++; else cart.push({ id, name, price, qty: 1 });
    updateCartUI();
    toggleCart(true);
}

function updateCartUI() {
    const list = document.getElementById('cart-content');
    const badge = document.getElementById('cart-badge');
    const totalDisplay = document.getElementById('grand-total');
    
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span>${item.name} (x${item.qty})</span>
            <b>${(item.price * item.qty).toFixed(2)} смн</b>
        </div>`;
    }).join('');

    badge.innerText = cart.length;
    totalDisplay.innerText = total.toFixed(2) + ' смн';
}

function toggleCart(forceOpen = null) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if(forceOpen === true) sidebar.classList.add('active');
    else if(forceOpen === false) sidebar.classList.remove('active');
    else sidebar.classList.toggle('active');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

// ФУНКСИЯҲОИ АДМИН ПАНЕЛ
function openAdmin() { document.getElementById('admin-modal').style.display = 'flex'; }
function closeAdmin() { document.getElementById('admin-modal').style.display = 'none'; }
function checkAdminPass() {
    if(document.getElementById('admin-pass').value === "admin777") {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else alert("Парол хато!");
}

document.addEventListener('DOMContentLoaded', loadProducts);
