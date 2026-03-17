const TELEGRAM_TOKEN = '76543210:AAHzX...'; // Токени бот, ки аз @BotFather гирифтед
const CHAT_ID = '123456789'; // ID-и шумо, ки аз @userinfobot гирифтед

// Пойгоҳи маҳсулот
const products = [
    { id: 1, name: "Молоко Саодат", price: 12, cat: "dairy", img: "https://via.placeholder.com/150", logo: "https://via.placeholder.com/50" },
    { id: 2, name: "Вода Сиёма 1.5л", price: 5, cat: "drinks", img: "https://via.placeholder.com/150", logo: "https://via.placeholder.com/50" },
    { id: 3, name: "Хлеб свежий", price: 4, cat: "bakery", img: "https://via.placeholder.com/150", logo: "https://via.placeholder.com/50" }
];

let cart = [];

// Нишон додани маҳсулот
function displayProducts(data) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = data.map(p => `
        <div class="product-card">
            <img src="${p.logo}" class="brand-logo">
            <img src="${p.img}" class="main-img">
            <h4>${p.name}</h4>
            <p><b>${p.price} смн.</b></p>
            <button class="add-btn" onclick="addToCart(${p.id})">В корзину</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const totalDisp = document.getElementById('total-price');
    const countDisp = document.getElementById('cart-count');
    const list = document.getElementById('cart-items');
    
    const sum = cart.reduce((total, item) => total + item.price, 0);
    if(totalDisp) totalDisp.innerText = sum;
    if(countDisp) countDisp.innerText = cart.length;
    
    if(list) {
        list.innerHTML = cart.length === 0 ? '<p>Пусто</p>' : 
        cart.map(i => `<div class="cart-item"><span>${i.name}</span><span>${i.price} смн.</span></div>`).join('');
    }
}

// КУШОДАНИ ТИРЕЗАИ ПАРДОХТ
function openOrderModal() {
    if (cart.length === 0) {
        alert("Сабад холӣ аст!");
        return;
    }
    document.getElementById('modal-total').innerText = document.getElementById('total-price').innerText;
    document.getElementById('orderModal').style.display = "block";
}

function closeModal() {
    document.getElementById('orderModal').style.display = "none";
}

// ФИРИСТОДАН БА TELEGRAM ВА ПАРДОХТ
async function processOrder() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const delivery = document.getElementById('deliveryType').value;
    const address = document.getElementById('userAddress').value;
    const total = document.getElementById('modal-total').innerText;

    if (!name || !phone) {
        alert("Лутфан ном ва телефонро нависед!");
        return;
    }

    const productsList = cart.map(i => "- " + i.name).join("\n");

    const message = `
🚀 **НОВЫЙ ЗАКАЗ!**
👤 Клиент: ${name}
📞 Телефон: ${phone}
💰 Сумма: ${total} смн.
💳 Оплата: ${payment}
🏠 Доставка: ${delivery === 'pickup' ? 'Самовывоз' : address}
📦 Товары:
${productsList}
    `;

    // Фиристодан ба Telegram
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            // Агар пардохти онлайн бошад, гузариш ба линки бонк
            if (payment === "Alif Mobi") {
                window.location.href = "https://alif.tj"; // Линки Алифро ин ҷо гузоред
            } else if (payment === "Dushanbe City") {
                alert("Заказ принят! Пожалуйста, оплатите через QR-код Dushanbe City.");
            } else {
                alert("Заказ успешно принят! Мы вам позвоним.");
            }
            
            cart = [];
            updateCart();
            closeModal();
        } else {
            alert("Хатогӣ дар пайваст бо Telegram. Токен ё ID-ро санҷед.");
        }
    } catch (error) {
        alert("Интернетро санҷед ё хатогӣ дар код!");
    }
}

window.onload = () => displayProducts(products);
