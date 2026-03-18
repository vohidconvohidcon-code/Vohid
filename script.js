const TELEGRAM_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; // Токени худро гузоред
const CHAT_ID = '1288252509'; // ID-и худро гузоред

const products = [
    { id: 1, name: "Молоко 'Саодат' 1л", price: 12.00, img: "https://vash-vibor.tj/wp-content/uploads/2021/05/moloko-saodat-25.jpg" },
    { id: 2, name: "Вода 'Сиёма' 1.5л", price: 5.00, img: "https://siyoma.tj/wp-content/uploads/2020/02/1.5.png" },
    { id: 3, name: "Хлеб свежий", price: 4.00, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300" },
    { id: 4, name: "Масло Олейна 1л", price: 18.00, img: "https://re-store.tj/wp-content/uploads/2020/06/619866.png" }
];

let cart = [];

function init() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" class="product-img">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${p.price.toFixed(2)} смн</div>
            <button class="add-btn" onclick="addToCart(${p.id})">Илова кардан</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const p = products.find(i => i.id === id);
    const exist = cart.find(i => i.id === id);
    if (exist) exist.qty++; else cart.push({...p, qty: 1});
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const totalElem = document.getElementById('total-price');
    
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `<div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${item.name} x${item.qty}</span>
                    <b>${(item.price * item.qty).toFixed(2)} смн</b>
                </div>`;
    }).join('');
    
    badge.innerText = cart.length;
    totalElem.innerText = total.toFixed(2) + ' смн';
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').style.display = document.getElementById('cartSidebar').classList.contains('open') ? 'block' : 'none';
}

function openCheckout() {
    if (cart.length === 0) return alert("Сабад холӣ аст!");
    toggleCart();
    document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckout() { document.getElementById('checkoutModal').style.display = 'none'; }

async function sendOrder() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const type = document.getElementById('deliveryType').value;
    const addr = document.getElementById('clientAddress').value;
    const fileInput = document.getElementById('receiptFile');
    const btn = document.getElementById('sendBtn');

    if (!name || !phone || fileInput.files.length === 0) {
        return alert("Лутфан ҳамаи майдонҳо ва расидро пур кунед!");
    }

    btn.innerText = "Фиристода истодааст...";
    btn.disabled = true;

    let text = `📦 ЗАКАЗИ НАВ\n👤 Ном: ${name}\n📞 Тел: ${phone}\n🚚 Намуд: ${type}\n📍 Суроға: ${addr}\n\n`;
    cart.forEach(i => text += `• ${i.name} (x${i.qty})\n`);
    text += `\n💰 ҶАМЪ: ${document.getElementById('total-price').innerText}`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', fileInput.files[0]);
    formData.append('caption', text);

    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            alert("✅ Заказ фиристода шуд! Интизори занг бошед.");
            cart = []; updateCart(); closeCheckout();
        } else { alert("❌ Хато дар фиристодан."); }
    } catch (e) { alert("❌ Хатои интернет."); }
    finally { btn.innerText = "Фиристодани заказ"; btn.disabled = false; }
}

window.onload = init;
