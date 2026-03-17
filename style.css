@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
    --primary: #00a650; /* Ранги сабзи Пайкар */
    --primary-hover: #008f45;
    --bg-color: #f4f7f6;
    --white: #ffffff;
    --text-dark: #2d3436;
    --text-gray: #636e72;
    --border: #dfe6e9;
    --shadow: 0 4px 15px rgba(0,0,0,0.05);
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }

body { background-color: var(--bg-color); color: var(--text-dark); }

/* Header */
.header { background: var(--white); box-shadow: var(--shadow); position: sticky; top: 0; z-index: 100; padding: 15px 0; }
.header-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.logo { font-size: 24px; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 10px; }
.search-box { display: flex; align-items: center; background: #f1f2f6; border-radius: 8px; padding: 10px 15px; width: 400px; }
.search-box input { border: none; background: transparent; outline: none; margin-left: 10px; width: 100%; font-size: 15px; }
.mobile-cart-btn { display: none; font-size: 24px; color: var(--text-dark); position: relative; cursor: pointer; }
.badge { position: absolute; top: -8px; right: -10px; background: #e74c3c; color: white; font-size: 12px; font-weight: bold; padding: 2px 6px; border-radius: 50%; }

/* Layout */
.main-layout { display: flex; max-width: 1400px; margin: 20px auto; gap: 20px; padding: 0 20px; align-items: flex-start; }

/* Sidebar */
.sidebar { width: 250px; background: var(--white); padding: 20px; border-radius: 12px; box-shadow: var(--shadow); position: sticky; top: 80px; }
.category-list { list-style: none; margin-top: 15px; }
.category-list li { padding: 12px 15px; margin-bottom: 5px; border-radius: 8px; cursor: pointer; transition: 0.2s; color: var(--text-gray); font-weight: 500; }
.category-list li:hover { background: #f1f2f6; }
.category-list li.active { background: #e8f5e9; color: var(--primary); font-weight: 600; }

/* Products */
.products-section { flex: 1; }
.products-section h2 { margin-bottom: 20px; font-size: 22px; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.product-card { background: var(--white); padding: 20px; border-radius: 12px; box-shadow: var(--shadow); text-align: center; transition: 0.3s; position: relative; border: 1px solid transparent; }
.product-card:hover { transform: translateY(-5px); border-color: var(--primary); }
.product-img { width: 100%; height: 160px; object-fit: contain; margin-bottom: 15px; }
.brand-logo { position: absolute; top: 15px; left: 15px; width: 40px; height: 40px; object-fit: contain; }
.product-title { font-size: 15px; color: var(--text-dark); margin-bottom: 10px; height: 40px; overflow: hidden; }
.product-price { font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 15px; }
.add-btn { width: 100%; padding: 10px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.add-btn:hover { background: var(--primary-hover); }

/* Cart */
.cart-sidebar { width: 320px; background: var(--white); border-radius: 12px; box-shadow: var(--shadow); position: sticky; top: 80px; display: flex; flex-direction: column; height: calc(100vh - 100px); }
.cart-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.close-cart { display: none; font-size: 24px; cursor: pointer; }
.cart-items { flex: 1; overflow-y: auto; padding: 20px; }
.empty-cart { text-align: center; color: var(--text-gray); margin-top: 50px; }
.cart-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #f1f2f6; padding-bottom: 10px; }
.item-info h4 { font-size: 14px; margin-bottom: 5px; }
.item-info p { color: var(--primary); font-weight: 600; font-size: 14px; }
.qty-controls { display: flex; align-items: center; gap: 10px; background: #f1f2f6; border-radius: 6px; padding: 2px 8px; }
.qty-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-dark); }
.cart-footer { padding: 20px; border-top: 1px solid var(--border); background: #fafafa; border-radius: 0 0 12px 12px; }
.total-row { display: flex; justify-content: space-between; font-size: 18px; margin-bottom: 15px; }
.total-row strong { color: var(--primary); font-size: 22px; }
.checkout-btn { width: 100%; padding: 15px; background: var(--text-dark); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }

/* Modal */
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2000; align-items: center; justify-content: center; }
.modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; position: relative; }
.close-modal { position: absolute; right: 20px; top: 20px; font-size: 24px; cursor: pointer; }
.checkout-form { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
.checkout-form input, .checkout-form select { padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 15px; outline: none; }
.payment-methods { display: flex; gap: 10px; }
.pay-method { flex: 1; padding: 15px; border: 1px solid var(--border); border-radius: 8px; text-align: center; cursor: pointer; transition: 0.2s; }
.pay-method input { display: none; }
.pay-method:has(input:checked) { border-color: var(--primary); background: #e8f5e9; color: var(--primary); font-weight: 600; }
.pay-btn { background: var(--primary); color: white; padding: 15px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px; }

/* Responsive (Телефон) */
@media (max-width: 992px) {
    .main-layout { flex-direction: column; }
    .sidebar { width: 100%; position: static; display: flex; flex-direction: column; }
    .category-list { display: flex; overflow-x: auto; gap: 10px; padding-bottom: 10px; }
    .category-list li { white-space: nowrap; margin-bottom: 0; }
    .mobile-cart-btn { display: block; }
    .search-box { width: 200px; }
    
    .cart-sidebar { 
        position: fixed; top: 0; right: -100%; height: 100vh; width: 300px; 
        z-index: 1000; border-radius: 0; transition: 0.3s;
    }
    .cart-sidebar.open { right: 0; }
    .close-cart { display: block; }
}
@media (max-width: 500px) { .search-box { display: none; } } /* Поиск дар телефон пинҳон мешавад то ки ҷой бошад */
