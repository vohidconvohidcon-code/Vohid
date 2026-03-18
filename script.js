const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509'; 

let cart = [9762000027554640];

// 1. Гузариш байни бахшҳо
function showSection(name) {
    if(name === 'shop') {
        document.getElementById('shop-section').style.display = 'block';
        document.getElementById('history-section').style.display = 'none';
    } else {
        document.getElementById('shop-section').style.display = 'none';
        document.getElementById('history-section').style.display = 'block';
        renderHistory();
    }
}

// 2. Илова ба сабад
function addToCart(id, name, price) {
    const exist = cart.find(i => i.id === id);
    if (exist) exist.qty++; else cart.push({ id, name, price, qty: 1 });
    updateUI();
}

function updateUI() {
    const list = document.getElementById('cart-items');
    const totalElem = document.getElementById('total-price');
    const badge = document.getElementById('cart-badge');
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `<div style="padding:5px 0; border-bottom:1px solid #eee;">${item.name} x${item.qty} - <b>${(item.price*item.qty).toFixed(2)}</b></div>`;
    }).join('');
    badge.innerText = cart.length;
    totalElem.innerText = total.toFixed(2) + ' смн';
}

// 3. Таърихи Фармоиш (LocalStorage)
function saveToHistory(order) {
    let history = JSON.parse(localStorage.getItem('myOrders')) || [];
    history.unshift(order); // Закази навро ба аввал мегузорад
    localStorage.setItem('myOrders', JSON.stringify(history));
}

function renderHistory() {
    const list = document.getElementById('order-history-list');
    let history = JSON.parse(localStorage.getItem('myOrders')) || [];
    if(history.length === 0) return;
    
    list.innerHTML = history.map(h => `
        <div class="history-item">
            <p><b>Сана:</b> ${h.date}</p>
            <p><b>Маҳсулот:</b> ${h.items}</p>
            <p><b>Ҷамъ:</b> ${h.total}</p>
            <p><b>Статус:</b> <span class="status-waiting">${h.status}</span></p>
        </div>
    `).join('');
}

// 4. Фиристодан ба Telegram
async function sendOrder() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const fileInput = document.getElementById('receiptFile');
    const btn = document.getElementById('sendBtn');

    if (!name || !phone || fileInput.files.length === 0) return alert("Лутфан ҳамаро пур кунед!");

    btn.innerText = "Фиристода истодааст...";
    btn.disabled = true;

    let orderInfo = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    let totalStr = document.getElementById('total-price').innerText;

    let text = `📦 ЗАКАЗИ НАВ\n👤 Мизоҷ: ${name}\n📞 Тел: ${phone}\n🛒: ${orderInfo}\n💰: ${totalStr}`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', fileInput.files[0]);
    formData.append('caption', text);

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
        if (res.ok) {
            // Сабт дар таърих
            saveToHistory({
                date: new Date().toLocaleString(),
                items: orderInfo,
                total: totalStr,
                status: "Дар ҳоли интизор (Админ тафтиш мекунад)"
            });
            alert("Заказ қабул шуд!");
            cart = []; updateUI(); closeCheckout();
        }
    } catch (e) { alert("Хато!"); }
    finally { btn.innerText = "Тасдиқ ва фиристодан"; btn.disabled = false; }
}

// Функсияҳои ёрирасон
function toggleCart() { document.getElementById('cartSidebar').classList.toggle('open'); document.getElementById('cartOverlay').style.display = document.getElementById('cartSidebar').classList.contains('open') ? 'block' : 'none'; }
function openCheckout() { if(cart.length>0) document.getElementById('checkoutModal').style.display='flex'; }
function closeCheckout() { document.getElementById('checkoutModal').style.display='none'; }
