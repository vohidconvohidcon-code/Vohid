// ТАНЗИМОТ
const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE';

const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';

let products = [];
let cart = [];

// 1. ГИРИФТАНИ МАҲСУЛОТ АЗ БАЗА
async function loadProducts() {
    const grid = document.getElementById('main-grid');
    if (!grid) return;
    grid.innerHTML = "⏳ Дар ҳоли боркунӣ...";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: { 
                'apikey': SUPABASE_KEY, 
                'Authorization': `Bearer ${SUPABASE_KEY}` 
            }
        });
        
        products = await response.json();

        if (!response.ok) throw new Error("Хатои база");

        if (products.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Маҳсулот нест. Ба панели Админ даромада илова кунед.</p>";
        } else {
            renderProducts(products);
        }
    } catch (e) {
        grid.innerHTML = "<p style='color:red;'>Хатогӣ дар пайвастшавӣ!</p>";
    }
}

function renderProducts(data) {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-item">
            <div class="img-box">
                <img src="${p.img}" onerror="this.src='https://via.placeholder.com/150'" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="item-price">${p.price} смн</p>
                <button class="buy-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Илова кардан</button>
            </div>
        </div>
    `).join('');
}

// 2. ИЛОВА КАРДАНИ МАҲСУЛОТ (АДМИН)
async function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;

    if (!name || !price || !img) return alert("Ҳамаро пур кунед!");

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, price: parseFloat(price), img, cat })
    });

    if (res.ok) {
        alert("Маҳсулот илова шуд!");
        loadProducts();
        closeAdmin();
        // Тоза кардани поляҳо
        document.getElementById('p-name').value = '';
        document.getElementById('p-price').value = '';
        document.getElementById('p-img').value = '';
    } else {
        const err = await res.json();
        alert("Хатогӣ: " + err.message);
    }
}

// 3. САБАД ВА АДМИН ПАНЕЛ (ФУНКСИЯҲОИ ТЕХНИКӢ)
function addToCart(id, name, price) {
    const found = cart.find(i => i.id === id);
    if (found) found.qty++; else cart.push({ id, name, price, qty: 1 });
    updateCartUI();
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').style.display = 'block';
}

function updateCartUI() {
    const list = document.getElementById('cart-content');
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${item.name} (x${item.qty})</span>
            <b>${(item.price * item.qty).toFixed(2)} смн</b>
        </div>`;
    }).join('');
    document.getElementById('cart-badge').innerText = cart.length;
    document.getElementById('grand-total').innerText = total.toFixed(2) + ' смн';
}

function openAdmin() { document.getElementById('admin-modal').style.display = 'flex'; }
function closeAdmin() { document.getElementById('admin-modal').style.display = 'none'; }
function checkAdminPass() {
    if(document.getElementById('admin-pass').value === "admin777") {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else alert("Парол хато!");
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
    document.getElementById('cart-overlay').style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', loadProducts);
