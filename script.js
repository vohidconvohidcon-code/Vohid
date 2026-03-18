const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509'; 

let cart = [+992175333223];

// Гузариш байни мағоза ва таърих
function showSection(section) {
    const shop = document.getElementById('shop-section');
    const history = document.getElementById('history-section');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    if (section === 'shop') {
        shop.style.display = 'block';
        history.style.display = 'none';
    } else {
        shop.style.display = 'none';
        history.style.display = 'block';
        loadHistory();
    }
}

// Функсияҳои сабад
function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) item.qty++; else cart.push({ id, name, price, qty: 1 });
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cart-items');
    const total = document.getElementById('total-price');
    const badge = document.getElementById('cart-badge');
    
    let sum = 0;
    list.innerHTML = cart.map(i => {
        sum += i.price * i.qty;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${i.name} x${i.qty}</span>
                    <b>${(i.price * i.qty).toFixed(2)} смн</b>
                </div>`;
    }).join('');
    
    badge.innerText = cart.length;
    total.innerText = sum.toFixed(2);
}

function toggleCart() {
    document.getElementById('sidebar').classList.toggle('open');
    const isOpen = document.getElementById('sidebar').classList.contains('open');
    document.getElementById('overlay').style.display = isOpen ? 'block' : 'none';
}

// Фармоиш
function openCheckout() {
    if (cart.length === 0) return alert("Сабад холӣ аст!");
    toggleCart();
    document.getElementById('checkoutModal').style.display = 'flex';
}
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

// Фиристодан
async function sendOrder() {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const file = document.getElementById('receiptImg').files[0];
    const btn = document.getElementById('sendBtn');

    if (!name || !phone || !file) return alert("Лутфан ҳамаро пур кунед!");

    btn.innerText = "Фиристода истодааст...";
    btn.disabled = true;

    let itemsText = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    let total = document.getElementById('total-price').innerText;
    let msg = `📦 ЗАКАЗ: ${itemsText}\n👤 МИЗОҶ: ${name}\n📞 ТЕЛ: ${phone}\n💰 ҶАМЪ: ${total} смн`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', file);
    formData.append('caption', msg);

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
        if (res.ok) {
            saveOrderLocally(itemsText, total);
            alert("Фармоиш фиристода шуд!");
            cart = []; updateCart(); closeCheckout();
        }
    } catch (e) { alert("Хатогии интернет!"); }
    finally { btn.innerText = "Фиристодан"; btn.disabled = false; }
}

// Таърих дар LocalStorage
function saveOrderLocally(items, total) {
    let history = JSON.parse(localStorage.getItem('orders')) || [];
    history.unshift({ date: new Date().toLocaleString(), items, total, status: 'Дар ҳоли интизор' });
    localStorage.setItem('orders', JSON.stringify(history));
}

function loadHistory() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('orders')) || [];
    if (history.length === 0) {
        list.innerHTML = "<p>Таърих холӣ аст.</p>";
        return;
    }
    list.innerHTML = history.map(h => `
        <div class="history-card">
            <p><small>${h.date}</small></p>
            <p><b>Маҳсулот:</b> ${h.items}</p>
            <p><b>Ҷамъ:</b> ${h.total} смн</p>
            <p class="status">Статус: ${h.status}</p>
        </div>
    `).join('');
}
