const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509'; 

let cart = [];

// 1. Илова ба сабад
function addToCart(id, name, price) {
    const exist = cart.find(i => i.id === id);
    if (exist) {
        exist.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateUI();
}

// 2. Навсозии сабад
function updateUI() {
    const list = document.getElementById('cart-items');
    const totalElem = document.getElementById('total-price');
    const badge = document.getElementById('cart-badge');
    
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #f0f0f0; padding-bottom:5px;">
                    <span>${item.name} x${item.qty}</span>
                    <b>${(item.price * item.qty).toFixed(2)} смн</b>
                </div>`;
    }).join('');
    
    badge.innerText = cart.length;
    totalElem.innerText = total.toFixed(2) + ' смн';
}

// 3. Фильтри Категорияҳо
function filterProduct(category) {
    const cards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.cat-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 4. Тирезаҳо
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
    document.getElementById('cartOverlay').style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}
function openCheckout() { if(cart.length > 0) document.getElementById('checkoutModal').style.display = 'flex'; }
function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

// 5. Фиристодан ба Telegram
async function sendOrder() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const fileInput = document.getElementById('receiptFile');
    
    if (!name || !phone || fileInput.files.length === 0) return alert("Маълумотро пурра кунед!");

    let text = `📦 ЗАКАЗИ НАВ\n👤 Ном: ${name}\n📞 Тел: ${phone}\n\n`;
    cart.forEach(i => text += `• ${i.name} (x${i.qty})\n`);
    text += `\n💰 ҶАМЪ: ${document.getElementById('total-price').innerText}`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', fileInput.files[0]);
    formData.append('caption', text);

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, { method: 'POST', body: formData });
    if (res.ok) { alert("Заказ фиристода шуд!"); cart=[]; updateUI(); closeCheckout(); }
}
