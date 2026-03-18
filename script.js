// ТАНЗИМОТ
const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA';
const CHAT_ID = '1288252509';

let cart = [+992175333223];

// ГУЗАРИШ БАЙНИ БАХШҲО
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(sectionId + '-section').classList.add('active');
    document.getElementById('btn-' + sectionId).classList.add('active');
    
    if(sectionId === 'history') loadHistory();
}

// САБАД
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    const display = document.getElementById('cart-sidebar').classList.contains('active') ? 'block' : 'none';
    document.getElementById('cart-overlay').style.display = display;
}

function addToCart(id, name, price) {
    const found = cart.find(i => i.id === id);
    if(found) {
        found.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cart-content');
    const totalDisplay = document.getElementById('grand-total');
    const badge = document.getElementById('cart-badge');
    
    let total = 0;
    if(cart.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#888;">Сабад холӣ аст</p>';
    } else {
        list.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f9f9f9; padding-bottom:5px;">
                    <div><b>${item.name}</b><br><small>${item.price} смн x ${item.qty}</small></div>
                    <b>${(item.price * item.qty).toFixed(2)}</b>
                </div>
            `;
        }).join('');
    }
    
    badge.innerText = cart.length;
    totalDisplay.innerText = total.toFixed(2) + ' смн';
}

// ФИЛТРИ КАТЕГОРИЯ
function filterItems(cat, event) {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.product-item').forEach(item => {
        if(cat === 'all' || item.getAttribute('data-cat') === cat) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// ПАРДОХТ ВА ТЕЛЕГРАМ
function goToPayment() {
    if(cart.length === 0) return alert("Сабад холӣ аст!");
    toggleCart();
    document.getElementById('pay-modal').style.display = 'flex';
}

function closePayModal() {
    document.getElementById('pay-modal').style.display = 'none';
}

async function submitFinalOrder() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const receipt = document.getElementById('receipt-input').files[0];
    const btn = document.getElementById('finish-order-btn');

    if(!name || !phone || !receipt) return alert("Лутфан ҳамаи маълумотро пур кунед ва чекро бор кунед!");

    btn.innerText = "Интизор...";
    btn.disabled = true;

    let orderList = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    let total = document.getElementById('grand-total').innerText;
    
    let caption = `📦 ФАРМОИШИ НАВ\n👤 Мизоҷ: ${name}\n📞 Тел: ${phone}\n🛒 Заказ: ${orderList}\n💰 Ҷамъ: ${total}`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', receipt);
    formData.append('caption', caption);

    try {
        const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        if(response.ok) {
            saveToHistory(orderList, total);
            alert("✅ Фармоиши шумо қабул шуд! Админ тафтиш мекунад.");
            cart = [];
            updateCartUI();
            closePayModal();
        } else {
            alert("Хатогӣ дар бот!");
        }
    } catch (e) {
        alert("Хатои шабака!");
    } finally {
        btn.innerText = "Фиристодани Фармоиш";
        btn.disabled = false;
    }
}

// ТАЪРИХ (LOCALSTORAGE)
function saveToHistory(items, total) {
    let history = JSON.parse(localStorage.getItem('user_history')) || [];
    history.unshift({
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: items,
        total: total,
        status: 'Дар ҳоли интизор'
    });
    localStorage.setItem('user_history', JSON.stringify(history));
}

function loadHistory() {
    const container = document.getElementById('history-container');
    let history = JSON.parse(localStorage.getItem('user_history')) || [];
    
    if(history.length === 0) {
        container.innerHTML = '<p style="text-align:center;margin-top:50px;color:#888;">Шумо то ҳол харид накардаед.</p>';
        return;
    }
    
    container.innerHTML = history.map(h => `
        <div class="history-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <small>${h.date}</small>
                <span class="status-tag">${h.status}</span>
            </div>
            <p><b>Заказ:</b> ${h.items}</p>
            <p><b>Маблағ:</b> <span style="color:#E30613; font-weight:bold;">${h.total}</span></p>
        </div>
    `).join('');
}

// 1. Функсияи нусхабардорӣ
function copyNumber(text) {
    navigator.clipboard.writeText(text).then(() => {
        const numElem = document.getElementById('p-number');
        const originalText = numElem.innerText;
        numElem.innerText = "НУСХАБАРДОРӢ ШУД!";
        numElem.style.color = "green";
        
        setTimeout(() => {
            numElem.innerText = originalText;
            numElem.style.color = "#2d3436";
        }, 1500);
    });
}

// 2. Функсияи фиристодан (бо ислоҳи хатогиҳо)
async function submitFinalOrder() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    const fileInput = document.getElementById('receipt-input');
    const receipt = fileInput.files[0];
    const btn = document.getElementById('finish-order-btn');

    if(!name || !phone || !receipt) {
        alert("Лутфан ном, телефон ва скриншоти чекро пур кунед!");
        return;
    }

    btn.innerText = "Дар ҳоли фиристодан...";
    btn.disabled = true;

    const orderList = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    const total = document.getElementById('grand-total').innerText;
    
    const caption = `📦 ФАРМОИШИ НАВ\n👤 Мизоҷ: ${name}\n📞 Тел: ${phone}\n🛒 Заказ: ${orderList}\n💰 Ҷамъ: ${total}`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', receipt);
    formData.append('caption', caption);

    try {
        // Истифодаи fetch бо параметрҳои дуруст
        const response = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if(result.ok) {
            saveToHistory(orderList, total);
            alert("✅ Фармоиш бо муваффақият фиристода шуд!");
            cart = [];
            updateCartUI();
            closePayModal();
            fileInput.value = ""; // тоза кардани файл
        } else {
            alert("Хатогии Бот: " + result.description);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Хатогии интернет! Санҷед, ки VPN хомӯш аст ё интернет кор мекунад.");
    } finally {
        btn.innerText = "Тасдиқ ва Фиристодан";
        btn.disabled = false;
    }
}

// Пароли админ (метавонед иваз кунед)
const ADMIN_PASSWORD = "admin777";

// Маҳсулотҳои аввалия (агар база холӣ бошад)
const defaultProducts = [
    { id: 1, name: "Шири Саодат 1л", price: 12, img: "https://vash-vibor.tj/wp-content/uploads/2021/05/moloko-saodat-25.jpg", cat: "milk", sale: false },
    { id: 2, name: "Оби Сиёма 1.5л", price: 5, img: "https://siyoma.tj/wp-content/uploads/2020/02/1.5.png", cat: "drinks", sale: false }
];

// Гирифтани маҳсулотҳо аз LocalStorage
let products = JSON.parse(localStorage.getItem('my_store_products')) || defaultProducts;

function initStore() {
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('main-grid');
    if(!grid) return;

    grid.innerHTML = products.map(p => `
        <div class="product-item" data-cat="${p.cat}">
            <div class="img-box">
                ${p.sale ? '<span class="sale-badge">АКЦИЯ</span>' : ''}
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="item-price">${p.price.toFixed(2)} смн</p>
                <button class="buy-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Илова кардан</button>
            </div>
        </div>
    `).join('');
}

// ФУНКСИЯҲОИ АДМИН
function openAdmin() {
    document.getElementById('admin-modal').style.display = 'flex';
}

function closeAdmin() {
    document.getElementById('admin-modal').style.display = 'none';
}

function checkAdminPass() {
    const pass = document.getElementById('admin-pass').value;
    if(pass === ADMIN_PASSWORD) {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        renderAdminList();
    } else {
        alert("Парол хатост!");
    }
}

function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const img = document.getElementById('p-img').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const cat = document.getElementById('p-cat').value;
    const sale = document.getElementById('p-sale').checked;

    if(!name || !price || !img) return alert("Пур кунед!");

    const newP = {
        id: Date.now(),
        name,
        price,
        img,
        cat,
        sale
    };

    products.push(newP);
    saveProducts();
    renderProducts();
    renderAdminList();
    alert("Маҳсулот илова шуд!");
}

function deleteProduct(id) {
    if(confirm("Нест карда шавад?")) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        renderAdminList();
    }
}

function renderAdminList() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = products.map(p => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding:5px;">
            <span>${p.name}</span>
            <button onclick="deleteProduct(${p.id})" style="color:red; border:none; background:none; cursor:pointer;">Нест кардан</button>
        </div>
    `).join('');
}

function saveProducts() {
    localStorage.setItem('my_store_products', JSON.stringify(products));
}

// Дар охири файл даъват кунед
document.addEventListener('DOMContentLoaded', initStore);
