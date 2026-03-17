// Пойгоҳи маҳсулот
const products = [
    { id: 1, name: "Молоко Саодат 2.5%", price: 12, cat: "dairy", img: "https://vash-vibor.tj/wp-content/uploads/2021/05/moloko-saodat-25.jpg", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A7eT-pGv6Q0pD5m0yYmD_eR8qUqfUfUfUfUf" },
    { id: 2, name: "Сыр Чеддер", price: 45, cat: "dairy", img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=200", logo: "https://cdn-icons-png.flaticon.com/512/123/123275.png" },
    { id: 3, name: "Хлеб Бородинский", price: 5, cat: "bakery", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200", logo: "https://cdn-icons-png.flaticon.com/512/992/992747.png" },
    { id: 4, name: "Лепешка Таджикская", price: 3, cat: "bakery", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7f-E-2-Z-k", logo: "https://cdn-icons-png.flaticon.com/512/992/992747.png" },
    { id: 5, name: "Вода Сиёма 1.5л", price: 5, cat: "drinks", img: "https://siyoma.tj/wp-content/uploads/2020/02/1.5.png", logo: "https://siyoma.tj/wp-content/uploads/2020/02/logo.png" },
    { id: 6, name: "RC Cola 1л", price: 9, cat: "drinks", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200", logo: "https://cdn-icons-png.flaticon.com/512/825/825513.png" }
];

let cart = [];

// Нишон додани маҳсулот
function displayProducts(data) {
    const grid = document.getElementById('product-grid');
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

// Филтри каталог
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.cat === category);
        displayProducts(filtered);
    }
}

// Корзина
function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cart-items');
    const totalDisp = document.getElementById('total-price');
    const countDisp = document.getElementById('cart-count');

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-text">Корзина пуста</p>';
    } else {
        list.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.price} смн.</span>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, i) => sum + i.price, 0);
    totalDisp.innerText = total;
    countDisp.innerText = cart.length;
}

// Ҷустуҷӯ (Поиск)
function searchProduct() {
    const text = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(text));
    displayProducts(filtered);
}


// Функсия барои кушодани тирезаи фармоиш
document.querySelector('.buy-btn').onclick = function() {
    if (cart.length === 0) {
        alert("Ваша корзина пуста!");
        return;
    }
    document.getElementById('orderModal').style.display = "block";
}

function closeModal() {
    document.getElementById('orderModal').style.display = "none";
}

// Пинҳон ё нишон додани блоки адрес
function toggleAddress() {
    const type = document.getElementById('deliveryType').value;
    document.getElementById('addressBlock').style.display = (type === 'pickup') ? 'none' : 'block';
}

// Фиристодани фармоиш
function sendOrder() {
    const delivery = document.getElementById('deliveryType').value;
    const address = document.getElementById('userAddress').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const total = document.getElementById('total-price').innerText;

    if (delivery === 'delivery' && !address) {
        alert("Пожалуйста, введите адрес доставки!");
        return;
    }

    let message = `Заказ принят!\nСумма: ${total} смн.\nМетод: ${delivery}\nОплата: ${payment}`;
    if(delivery === 'delivery') message += `\nАдрес: ${address}`;

    alert(message);
    
    // Тоза кардани сабад пас аз фармоиш
    cart = [];
    updateCart();
    closeModal();
}

// Пинҳон кардани модал ҳангоми клик дар беруни он
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target == modal) closeModal();
}

// Кушодани модал
function openOrderModal() {
    if (cart.length === 0) {
        alert("Сначала добавьте товары в корзину!");
        return;
    }
    const total = document.getElementById('total-price').innerText;
    document.getElementById('modal-total').innerText = total;
    document.getElementById('orderModal').style.display = "block";
}

function processOrder() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const total = document.getElementById('modal-total').innerText;

    if (!name || !phone) {
        alert("Лутфан ном ва рақами телефонро нависед!");
        return;
    }

    // Рӯйхати маҳсулот барои Telegram ё SMS
    const productsList = cart.map(i => i.name).join(", ");

    // 1. Имитатсияи пардохт
    if (payment === "Alif Mobi") {
        // Дар оянда ин ҷо линки воқеии Alif гузошта мешавад
        window.location.href = "https://alif.tj"; // Гузариш ба сайт ё барнома
        return;
    } 
    
    if (payment === "Dushanbe City") {
        alert("Шумо усули Dushanbe City-ро интихоб кард. Лутфан QR-кодро дар барномаи DC скан кунед.");
        // Ин ҷо метавонед сурати QR-коди худро нишон диҳед
    }

    // 2. Фиристодани маълумот (имитатсия)
    alert(`Ташаккур, ${name}! Фармоиши шумо ба маблағи ${total} смн. қабул шуд. Мо бо рақами ${phone} тамос мегирем.`);
    
    // Тоза кардани сабад
    cart = [];
    updateCart();
    closeModal();
}

// Иваз кардани тугмаи кӯҳна дар HTML
document.querySelector('.buy-btn').setAttribute('onclick', 'openOrderModal()');


// Оғози кор
window.onload = () => displayProducts(products);