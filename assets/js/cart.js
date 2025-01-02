window.onload = function () {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('請先登入會員');
        window.location.href = '../pages/login.html'; // 跳轉到登入頁
        return;
    }

    // 顯示目前使用者名稱
    document.getElementById('current-user').textContent = `目前使用者：${username}`;
    
    const cartContainer = document.getElementById('cart-container');
    const cartKey = `cart_${username}`; // 根據用戶名稱取得購物車鍵名
    const cart = JSON.parse(localStorage.getItem(cartKey)) || []; // 加載購物車

    // 顯示購物車內容
    if (cart.length > 0) {
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartContainer.appendChild(cartItem);
        });
        updateTotal(); // 更新總金額
    } else {
        cartContainer.innerHTML = '<p>您的購物車是空的</p>';
    }

    // 綁定結帳按鈕事件
    document.getElementById('checkout-button').addEventListener('click', function () {
        const popup = document.getElementById('success-popup');
        popup.style.display = 'flex'; // 顯示彈窗
    });

    // 綁定返回主頁按鈕事件
    document.getElementById('return-home').addEventListener('click', function () {
        const popup = document.getElementById('success-popup');
        popup.style.display = 'none'; // 隱藏彈窗
        window.location.href = '/index.html'; // 跳轉到主頁
    });

    // 綁定登出按鈕
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        localStorage.removeItem('username'); // 清除登入用戶
        window.location.href = '../pages/login.html'; // 跳轉到登入頁
    });
};

// 建立購物車項目
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.dataset.name = item.name;
    cartItem.dataset.price = item.price;

    cartItem.innerHTML = `
        <img src="${item.picture}" alt="商品圖片" class="item-image">
        <div class="item-details">
            <h3>${item.name}</h3>
            <p>價錢：${item.price}</p>
            <label for="quantity-${item.id}">數量:</label>
            <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
        </div>
        <button class="remove-item" onclick="removeItem(this)" style="margin-left:3cm;">刪除</button>
    `;

    return cartItem;
}

// 計算並顯示總價
function updateTotal() {
    let total = 0;
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        const price = parseFloat(item.dataset.price.replace('$', ''));
        const quantity = parseInt(item.querySelector('input').value);
        total += price * quantity;
    });
    document.getElementById('total-price').textContent = '$' + total.toFixed(2);
}

// 更新商品數量
function updateQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = parseInt(newQuantity, 10);  // 更新商品數量
        localStorage.setItem('cart', JSON.stringify(cart));  // 更新購物車
        updateTotal();  // 更新總價
    }
}

// 刪除商品
function removeItem(button) {
    const cartItem = button.closest('.cart-item');
    const itemName = cartItem.dataset.name;

    const username = localStorage.getItem('username');
    const cartKey = `cart_${username}`; // 根據用戶名獲取購物車鍵
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // 過濾掉被刪除的商品
    cart = cart.filter(item => item.name !== itemName);

    // 更新 localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));

    // 從 DOM 中刪除商品項目
    cartItem.remove();

    // 更新總價
    updateTotal();
}

// 清空購物車
function clearCart() {
    const username = localStorage.getItem('username');
    if (username) {
        const cartKey = `cart_${username}`;  // 根據用戶名獲取購物車鍵
        localStorage.removeItem(cartKey);  // 完全刪除該用戶的購物車

        // 更新頁面顯示
        document.getElementById('cart-container').innerHTML = '<p>您的購物車是空的</p>';
        updateTotal();  // 更新總價為 0
    } else {
        alert('請先登入會員');
        window.location.href = '../pages/login.html';  // 若未登入則跳轉到登入頁
    }
}


// 顯示外送地址欄
function showDeliveryInfo() {
    const pickupMethod = document.getElementById("pickup").value;
    const deliveryInfo = document.getElementById("delivery-info");

    if (pickupMethod === "delivery") {
        deliveryInfo.classList.remove("hidden");
    } else {
        deliveryInfo.classList.add("hidden");
    }
}

// 顯示付款提示
function showPaymentInfo() {
    const paymentMethod = document.getElementById("payment").value;
    alert(paymentMethod === "card" ? "請準備刷卡資料" : "選擇了現金付款");
}

// 結帳功能
function checkout() {
    const pickupMethod = document.getElementById("pickup").value;
    const address = document.getElementById("address").value;

    if (pickupMethod === "delivery" && !address) {
        alert("請填寫地址！");
        return;
    }

    alert("結帳功能尚未實現");
}

// 點擊結帳按鈕時，顯示彈窗
document.getElementById('checkout-button').addEventListener('click', function () {
    const popup = document.getElementById('success-popup');
    popup.style.display = 'flex'; // 顯示彈窗

    const username = localStorage.getItem('username'); // 取得當前用戶名稱

    // 根據當前用戶名來設置 cart 和 new_cart 鍵名
    const cartKey = `cart_${username}`;  // 例如 'cart_admin' 或 'cart_user1'
    const newCartKey = `new_cart_${username}`;  // 例如 'new_cart_admin' 或 'new_cart_user1'

    // 取得 cart 資料
    const cartAdmin = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (cartAdmin.length > 0) {
        // 先取得新的購物車（如果有）
        let newCartAdmin = JSON.parse(localStorage.getItem(newCartKey)) || [];

        // 將新的 cart_admin 內容覆蓋到 new_cart_admin
        newCartAdmin = cartAdmin;

        // 儲存到 localStorage
        localStorage.setItem(newCartKey, JSON.stringify(newCartAdmin));

        // 清空 cart_admin
        localStorage.setItem(cartKey, JSON.stringify([]));

        alert('結帳完成，已將購物車資料儲存至新購物車，並清空購物車');
    } else {
        alert('購物車是空的');
    }
});



// 獲取所有按鍵
const btns=document.querySelectorAll("button");
// 循環每個按鈕，並為每個按鈕增加點擊事件
btns.forEach(btn=>{
    btn.addEventListener("click",e=>{
        // 創建span元素，並設置其位置為滑鼠點擊的位置
        let span=document.createElement("span");
        span.style.left=e.offsetX+"px";
        span.style.top=e.offsetY+"px";
        // 將span元素添加到按鈕標籤裡
        btn.appendChild(span);
        // 1秒後刪除span元素
        setTimeout(() => {
            span.remove();
        }, 1000);
    })
})