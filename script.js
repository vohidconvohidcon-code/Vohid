const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE';

const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';

let products = [];
let cart = [];

// 1. Боркунии маҳсулот
async function loadProducts() {
    const grid = document.getElementById('main-grid');
    if (!grid) return;
    grid.innerHTML = "⏳ Дар ҳоли боркунӣ...";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        products = await response.json();
        
        if (products.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Маҳсулот нест. Аз панели Админ илова кунед.</p>";
        } else {
            renderProducts(products);
        }
    } catch (e) {
        grid.innerHTML = "❌ Хатои пайвастшавӣ!";
    }
}

function renderProducts(data) {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = data.map(p => `
        <div class="product-item">
            <img src="${p.img || 'https://via.placeholder.com/150'}" style="width:100%; border-radius:10px;">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="item-price">${p.price} смн</p>
                <button class="buy-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Илова кардан</button>
            </div>
        </div>
    `).join('');
}

// 2. Иловаи маҳсулоти нав
async function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;

    if (!name || !price || !img) return alert("Лутфан ҳамаро пур кунед!");

    // МУҲИМ: Мо ID-ро намефиристем! База худаш онро месозад.
    const productData = { name, price: parseFloat(price), img, cat };

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (res.ok) {
            alert("✅ Муваффақият! Маҳсулот илова шуд.");
            loadProducts();
            closeAdmin();
            document.getElementById('p-name').value = '';
            document.getElementById('p-price').value = '';
            document.getElementById('p-img').value = '';
        } else {
            const err = await res.json();
            alert("❌ Хатогӣ: " + err.message);
        }
    } catch (e) {
        alert("Хатои интернет!");
    }
}

// Функсияҳои ёрирасон (Сабад ва Админ)
function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) item.qty++; else cart.push({ id, name, price, qty: 1 });
    updateCart();
}

function updateCart() {
    const badge = document.getElementById('cart-badge');
    if(badge) badge.innerText = cart.length;
    // Дар ин ҷо метавонед коди намоиши сабадро илова кунед
}

function openAdmin() { document.getElementById('admin-modal').style.display = 'flex'; }
function closeAdmin() { document.getElementById('admin-modal').style.display = 'none'; }
function checkAdminPass() {
    if(document.getElementById('admin-pass').value === "admin777") {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else alert("Парол хато!");
}

document.addEventListener('DOMContentLoaded', loadProducts);
