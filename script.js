// ==========================================
// 1. ТАНЗИМОТИ БАЗА ВА БОТ
// ==========================================
const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';

// ДИҚҚАТ: Ключи худро дар байни қавсайнҳои '' гузоред! Он бояд бо "eyJhb..." сар шавад.
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE'; 

const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';

let cart = [];
let products = [];

// ==========================================
// 2. ГИРИФТАНИ МАҲСУЛОТ АЗ БАЗА (АСОСӢ)
// ==========================================
async function loadProducts() {
    const grid = document.getElementById('main-grid');
    if (!grid) return;

    grid.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding: 20px;'>⏳ Дар ҳоли боркунӣ...</p>";

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        // Агар ключ хато бошад ё RLS фаъол бошад
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Хатои база:", errorData);
            grid.innerHTML = `<p style='grid-column:1/-1; color:red; text-align:center;'>❌ Хатогӣ: Ключи Supabase нодуруст аст ё RLS хомӯш нест!</p>`;
            return;
        }

        products = await response.json();
        
        // Агар база холӣ бошад
        if (!Array.isArray(products) || products.length === 0) {
            grid.innerHTML = "<p style='grid-column:1/-1; text-align:center; padding:50px;'>Маҳсулот ҳанӯз илова нашудааст. Аз панели админ илова кунед.</p>";
            return;
        }

        renderProducts();

    } catch (e) {
        console.error("Хатои интернет:", e);
        grid.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:red;'>❌ Хатои пайвастшавӣ ба интернет ё сервер!</p>";
    }
}

function renderProducts() {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-item">
            <div class="img-box">
                <img src="${p.img}" onerror="this.src='https://via.placeholder.com/150?text=Расм+нест'" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="item-price">${p.price} смн</p>
                <button class="buy-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Илова кардан</button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 3. ПАНЕЛИ АДМИН (ИЛОВАИ МАҲСУЛОТ)
// ==========================================
async function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const priceVal = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat') ? document.getElementById('p-cat').value : 'all';

    if (!name || !priceVal || !img) {
        alert("⚠️ Лутфан ҳамаи майдонҳоро пур кунед!");
        return;
    }

    const price = parseFloat(priceVal);

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ name: name, price: price, img: img, cat: cat })
        });

        if (response.ok) {
            alert("✅ Маҳсулот бо муваффақият илова шуд!");
            document.getElementById('p-name').value = '';
            document.getElementById('p-price').value = '';
            document.getElementById('p-img').value = '';
            
            closeAdmin();
            loadProducts(); // Рӯйхатро нав мекунад
        } else {
            const errData = await response.json();
            alert("❌ Хатогӣ ҳангоми илова: " + JSON.stringify(errData));
        }
    } catch (e) {
        alert("❌ Хатои интернет ҳангоми илова кардан!");
    }
}

function openAdmin() { document.getElementById('admin-modal').style.display = 'flex'; }
function closeAdmin() { document.getElementById('admin-modal').style.display = 'none'; }
function checkAdminPass() {
    if(document.getElementById('admin-pass').value === "admin777") {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else {
        alert("❌ Парол хатост!");
    }
}

// ==========================================
// 4. СИСТЕМАИ САБАД ВА ФАРМОИШ (TELEGRAM)
// ==========================================
function addToCart(id, name, price) {
    const found = cart.find(i => i.id === id);
    if (found) found.qty++; else cart.push({ id, name, price, qty: 1 });
    updateCartUI();
    toggleCart(true); 
}

function updateCartUI() {
    const list = document.getElementById('cart-content');
    const badge = document.getElementById('cart-badge');
    const totalDisplay = document.getElementById('grand-total');
    if(!list || !badge || !totalDisplay) return;

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
    if(!sidebar) return;

    if (forceOpen === true) sidebar.classList.add('active');
    else if (forceOpen === false) sidebar.classList.remove('active');
    else sidebar.classList.toggle('active');
    
    if(overlay) overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

function openPayModal() {
    if (cart.length === 0) return alert("Сабади шумо холӣ аст!");
    const payModal = document.getElementById('pay-modal');
    if(payModal) payModal.style.display = 'flex';
}

function closePayModal() {
    const payModal = document.getElementById('pay-modal');
    if(payModal) payModal.style.display = 'none';
}

function copyNumber(text) {
    navigator.clipboard.writeText(text).then(() => {
        const numElem = document.getElementById('p-number');
        if(numElem) {
            numElem.innerText = "НУСХАБАРДОРӢ ШУД!";
            numElem.style.color = "green";
            setTimeout(() => { numElem.innerText = "900 00 00 00"; numElem.style.color = "#2d3436"; }, 1500);
        }
    });
}

async function submitFinalOrder() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const fileInput = document.getElementById('receipt-input');
    const btn = document.getElementById('finish-order-btn');

    if (!name || !phone || !fileInput || !fileInput.files[0]) {
        return alert("⚠️ Лутфан ном, телефон ва скриншоти чекро пур кунед!");
    }

    btn.innerText = "Дар ҳоли фиристодан...";
    btn.disabled = true;

    const orderList = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    const total = document.getElementById('grand-total').innerText;
    const caption = `📦 ФАРМОИШИ НАВ\n👤 Мизоҷ: ${name}\n📞 Тел: ${phone}\n🛒 Заказ: ${orderList}\n💰 Ҷамъ: ${total}`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', fileInput.files[0]);
    formData.append('caption', caption);

    try {
        const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.ok) {
            alert("✅ Фармоиш бо муваффақият фиристода шуд!");
            cart = [];
            updateCartUI();
            closePayModal();
            toggleCart(false);
            fileInput.value = "";
        } else {
            alert("❌ Хатогии Бот: " + result.description);
        }
    } catch (error) {
        alert("❌ Хатогии интернет ҳангоми фиристодан!");
    } finally {
        btn.innerText = "Тасдиқ ва Фиристодан";
        btn.disabled = false;
    }
}

// САРШАВИИ КОР
document.addEventListener('DOMContentLoaded', loadProducts);
