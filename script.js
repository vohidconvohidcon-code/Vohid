const SUPABASE_URL = 'https://yjoomrfdkmrlspakcikb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb29tcmZka21ybHNwYWtjaWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjUyODIsImV4cCI6MjA4OTQwMTI4Mn0.QnWDad_ES313_5r-PIpCkqNkHpMN0jxCdOn5dOkXESE'; // Калиди худро гузоред
const MY_WALLET = "175333223"; // РАҚАМИ ҲАМЁНИ ШУМО (Алиф / Душанбе Сити)
const TG_TOKEN = '8481595290:AAHoqXeF-NYPEbgNjs8CPhy138ULHYGenlA'; 
const CHAT_ID = '1288252509';

let cart = [];

// 1. ИДОРАКУНИИ САБАД
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    document.getElementById('cart-count').innerText = cart.length;
    alert(`"${name}" ба сабад илова шуд!`);
}

// 2. КУШОДАНИ ПАНЕЛИ ПАРДОХТ
function openCheckout() {
    if (cart.length === 0) return alert("Сабад холӣ аст!");
    document.getElementById('checkout-modal').style.display = 'block';
    
    let total = cart.reduce((sum, i) => sum + i.price, 0);
    document.getElementById('order-summary').innerText = `Ҷамъ: ${total} смн`;
}

// 3. НУСХАБАРДОРИИ РАҚАМИ ҲАМЁН
function copyWallet() {
    navigator.clipboard.writeText(MY_WALLET);
    alert("Рақами ҳамён нусхабардорӣ шуд: " + MY_WALLET);
}

// 4. ФИРИСТОДАНИ ЗАКАЗ
async function submitOrder() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const addr = document.getElementById('cust-addr').value;
    const delivery = document.getElementById('delivery-type').value;
    const payment = document.getElementById('payment-method').value;
    const receipt = document.getElementById('receipt-url').value;

    if (!name || !phone) return alert("Ном ва телефонро ворид кунед!");

    const itemsText = cart.map(i => `${i.name}`).join(", ");
    const total = cart.reduce((sum, i) => sum + i.price, 0);

    const orderData = {
        items: itemsText,
        total_price: total,
        customer_name: name,
        customer_phone: phone,
        customer_address: addr,
        delivery_type: delivery,
        payment_method: payment,
        receipt_img: receipt,
        status: 'Дар интизорӣ'
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });

    if (res.ok) {
        // Фиристодан ба Telegram
        const msg = `🚀 ЗАКАЗИ НАВ!\n👤 Харидор: ${name}\n📞 Тел: ${phone}\n📍 Суроға: ${addr}\n🚚 Намуд: ${delivery}\n💳 Пардохт: ${payment}\n💰 Сумма: ${total} смн\n📝 Статус: Интизорӣ`;
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}`);
        
        alert("Закази шумо қабул шуд!");
        cart = [];
        location.reload();
    }
}

// 5. ПАНЕЛИ АДМИН: ТАСДИҚ Ё РАД
async function updateStatus(id, newStatus, phone) {
    await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });

    // Хабар ба Telegram дар бораи тасдиқ/рад
    const msg = `📢 ЗАКАЗ №${id}\nСтатус: ${newStatus === 'Тасдиқ' ? '✅ Тасдиқ шуд' : '❌ Рад шуд'}`;
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}`);
    
    alert("Заказ " + newStatus);
    loadOrders();
}
