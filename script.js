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

const products = [
    { id: 1, name: "Шири Саодат", price: 12, img: "https://admin.bi1.tj/storage/good_images/00013833.webp", cat: "milk" },
    { id: 2, name: "Оби Сиёма", price: 5, img: "data:image/jpeg;base64,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", cat: "drinks" },
    // Маҳсулоти навро ҳамин ҷо илова кунед ва файлро дар GitHub захира кунед
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
