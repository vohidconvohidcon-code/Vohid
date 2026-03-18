// ТАНЗИМОТ
const TG_TOKEN = '7716104445:AAH3mB5lU_qR_Yp5fD1_NqIqf3OqN7pI3_Q';
const CHAT_ID = '6013669149';

let cart = [];

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
