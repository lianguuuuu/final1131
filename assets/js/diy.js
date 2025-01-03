function addToCart() {
    const username = localStorage.getItem('username'); // 獲取當前用戶名稱
    if (!username) {
        alert('請先登入會員');
        window.location.href = '/final/pages/login.html';
        return;
    }

    const cartKey = `cart_${username}`; // 根據用戶名稱生成購物車鍵
    const form = document.getElementById('diyForm');
    const formData = new FormData(form);

    const main = formData.get('main');
    const meat = formData.get('meat');
    const sides = formData.getAll('side'); // 複選框的值

    if (!main || !meat) {
        alert('請選擇主食和肉品！');
        return;
    }

    // 從輸入框獲取數量，確保它是 1 或更大的正數
    const quantityInput = document.getElementById('product-quantity');
    const quantity = parseInt(quantityInput.value, 10) || 1;

    // 創建商品物件
    const diyItem = {
        name: `DIY (${main}, ${meat}, ${sides.join(', ')})`, // 注意這裡也是使用 backticks
        price: 150, // 假設固定價格
        picture: '/final/picture/yummy.png', // 商品圖片
        id: "DIY", // 固定商品 ID
        quantity: quantity, // 動態數量
    };

    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingItem = cart.find(item => item.name === diyItem.name);

    if (existingItem) {
        existingItem.quantity += diyItem.quantity; // 更新數量
    } else {
        cart.push(diyItem); // 加入新商品
    }

    localStorage.setItem(cartKey, JSON.stringify(cart)); // 保存購物車至 localStorage
    alert('商品已成功加入購物車！');
    updateCartCount(); // 更新購物車數量顯示

    // 清空選擇框
    form.reset(); // 重置表單，清空選擇

    // 重置數量為 1
    quantityInput.value = 1; // 重置數量為 1
}


function changeQuantity(change, event) {
    event.preventDefault(); // 防止按鈕默認行為
    const quantityInput = document.getElementById("product-quantity");
    let currentQuantity = parseInt(quantityInput.value, 10);

    // 確保數量不小於 1
    currentQuantity += change;
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }

    // 更新數量
    quantityInput.value = currentQuantity;
}

document.addEventListener("DOMContentLoaded", function () {
    // 設置數量預設為 1
    const quantityInput = document.getElementById('product-quantity');
    if (quantityInput) {
        quantityInput.value = 1; // 每次加載頁面時，數量設置為 1
    }

    updateCartCount(); // 初始化購物車數量顯示
    loadReviews("DIY"); // 顯示評論
});

function updateCartCount() {
    const username = localStorage.getItem('username'); // 獲取當前用戶名稱
    if (!username) return; // 如果沒有用戶名稱，不更新購物車數量

    const cartKey = `cart_${username}`; // 根據用戶名稱生成購物車鍵，注意使用 backticks
    const cart = JSON.parse(localStorage.getItem(cartKey)) || []; // 讀取購物車
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0); // 計算總數量

    // 更新頁面上的購物車數量顯示
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount; // 顯示總數量
    }
}

// 初始化購物車數量顯示
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
});

// 提交評論並更新 localStorage
document.getElementById("submitReview").addEventListener("click", function () {
    const username = localStorage.getItem("username");
    if (!username) {
        alert("請先登入會員");
        window.location.href = '/final/pages/login.html';
        return;
    }

    const selectedRating = document.querySelector('input[name="rating"]:checked');
    const comment = document.getElementById("comment").value;

    if (!selectedRating || !comment) {
        alert("請填寫評論並選擇星等！");
        return;
    }

    // 創建評論物件
    const newReview = {
        username: username,
        profilePic: "https://via.placeholder.com/40",
        comment: comment,
        rating: parseInt(selectedRating.value)
    };

    // 獲取用戶專屬評論鍵
    const userReviewsKey = `${username}_reviews`;
    const storedReviews = JSON.parse(localStorage.getItem(userReviewsKey)) || {};

    // 如果商品 ID（DIY）不存在，初始化為空陣列
    if (!storedReviews["DIY"]) {
        storedReviews["DIY"] = [];
    }

    // 添加新評論到商品 ID 下
    storedReviews["DIY"].push(newReview);

    // 更新 localStorage
    localStorage.setItem(userReviewsKey, JSON.stringify(storedReviews));

    alert("評論已提交！");
    
    // 顯示新評論
    loadReviews("DIY");

    // 清空輸入框
    document.getElementById("comment").value = ""; 
    document.querySelector('input[name="rating"]:checked').checked = false; // 清空選擇
});

// 防止刷新數量時重新加載
document.getElementById("product-quantity").addEventListener("focus", function (e) {
    e.stopImmediatePropagation();
});

// 初始化評論區域
document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    if (!username) return;

    const cartKey = `cart_${username}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const item = cart.find(item => item.id === "DIY");

    if (item) {
        const quantityInput = document.getElementById('product-quantity');
        quantityInput.value = item.quantity; // 設置初始數量
    }

    updateCartCount(); // 初始化購物車數量顯示

    loadReviews("DIY"); // 顯示評論
});

// 顯示評論
function loadReviews(productId) {
    const reviewsContainer = document.getElementById("reviews");
    reviewsContainer.innerHTML = ""; // 清空現有評論

    const defaultReviews = JSON.parse(localStorage.getItem("defaultReviews")) || {};
    const storedReviewsKey = `${localStorage.getItem("username")}_reviews`;
    const storedReviews = JSON.parse(localStorage.getItem(storedReviewsKey)) || {};

    // 顯示預設評論
    if (defaultReviews[productId]) {
        defaultReviews[productId].forEach((review) => {
            const reviewDiv = createReviewElement(review);
            reviewsContainer.appendChild(reviewDiv);
        });
    }

    // 顯示使用者評論
    const userReviews = storedReviews[productId] || [];
    userReviews.forEach((review) => {
        const reviewDiv = createReviewElement(review);
        reviewsContainer.appendChild(reviewDiv);
    });
}

// 創建評論 DOM 元素
function createReviewElement(review) {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review");

    const profilePic = document.createElement("img");
    profilePic.src = review.profilePic || "https://via.placeholder.com/40";

    const reviewContent = document.createElement("div");
    reviewContent.classList.add("review-content");

    const username = document.createElement("div");
    username.textContent = review.username || "匿名用戶";

    const rating = document.createElement("div");
    rating.innerHTML = "評分：";
    for (let i = 0; i < 5; i++) {
        rating.innerHTML += i < review.rating ? "&#9733;" : "&#9734;";
    }

    const comment = document.createElement("div");
    comment.textContent = review.comment;

    reviewContent.appendChild(username);
    reviewContent.appendChild(rating);
    reviewContent.appendChild(comment);

    reviewDiv.appendChild(profilePic);
    reviewDiv.appendChild(reviewContent);

    return reviewDiv;
}
