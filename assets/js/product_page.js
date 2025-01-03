// 載入 JSON 資料並顯示商品詳情
function loadProductData(productId) {
    fetch('/final1131/assets/json/products.json')  // 使用相對路徑從父層資料夾載入 products.json
        .then(response => response.json())
        .then(data => {
            const product = data.find(p => p.id === productId);
            if (product) {
                // 顯示商品的詳細資訊
                const description = product.description.replace(/\n/g, '<br>');
                document.getElementById('product-description').innerHTML = description;

                document.getElementById('product-image').src = product.picture;
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-price').textContent = '價錢: ' + product.price;
                document.getElementById('product-calories').textContent = '熱量: ' + product.calories;
            }
        })
        .catch(error => console.error('Error loading product data:', error));
}

// 根據 URL 的查詢參數來載入對應的商品資料
function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    if (productId) {
        loadProductData(productId);  // 載入相應的商品資料
    }
    updateCartCount();  // 初始化購物車數量
}

// 加入購物車
function addToCart() {
    const username = localStorage.getItem('username'); // 確認用戶已登入
    if (!username) {
        alert('請先登入');
        window.location.href = '/final1131/pages/login.html';
        return;
    }

    const cartKey = `cart_${username}`; // 動態生成用戶專屬的購物車鍵
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    const quantity = parseInt(document.getElementById('product-quantity').value, 10); // 取得用戶選擇的數量

    if (productId) {
        fetch('/final1131/assets/json/products.json')
            .then(response => response.json())
            .then(data => {
                const product = data.find(p => p.id === productId);
                if (product) {
                    const existingProduct = cart.find(item => item.id === product.id);
                    if (existingProduct) {
                        // 如果商品已經存在購物車中，則更新數量
                        existingProduct.quantity += quantity;
                    } else {
                        // 如果是新的商品，則初始化數量
                        product.quantity = quantity;
                        cart.push(product);
                    }
                    localStorage.setItem(cartKey, JSON.stringify(cart)); // 儲存到用戶專屬購物車
                    alert('已加入購物車');
                    updateCartCount();  // 更新購物車數量
                }
            })
            .catch(error => console.error('Error adding to cart:', error));
    }
}

// 更新購物車數量顯示
function updateCartCount() {
    const username = localStorage.getItem('username');
    const cartKey = `cart_${username}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0); // 計算購物車中的商品數量
    const cartIcon = document.querySelector('.cart-icon0');

    if (cartCount > 0) {
        cartIcon.setAttribute('data-count', cartCount);  // Set cart item count (could be used for notification or cart icon)
    } else {
        cartIcon.removeAttribute('data-count');
    }
}

// 改變商品數量
function changeQuantity(amount) {
    const quantityElement = document.getElementById('product-quantity');
    let currentQuantity = parseInt(quantityElement.value, 10);  // 從輸入取得當前數量

    // 確認數量在1以上
    currentQuantity = Math.max(1, currentQuantity + amount);
    quantityElement.value = currentQuantity;  // 更新數量
}

// 更新總價
function updateTotal() {
    const username = localStorage.getItem('username');
    const cartKey = `cart_${username}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', '')); // 去除 $ 符號，轉為數字
        total += price * item.quantity;
    });

    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`; // 更新總價顯示
}

// 清空購物車
function clearCart() {
    const username = localStorage.getItem('username');
    const cartKey = `cart_${username}`;
    localStorage.removeItem(cartKey); // 清空用戶專屬購物車
    document.getElementById('cart-container').innerHTML = '<p>您的購物車是空的</p>';
    document.getElementById('total-price').textContent = '$0.00'; // 清空總價
    updateCartCount();
}

// 初始化頁面
window.onload = initializePage;

// 提交評論
function submitReview() {
    const name = document.getElementById('user_name').value;
    const review = document.getElementById('user_review').value;
    const rating = document.getElementById('user_rating').value;

    fetch('product_page.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: name, user_review: review, user_rating: rating })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            document.getElementById('reviews-container').innerHTML += `
                <div>
                    <h3>${name} (${rating}/5)</h3>
                    <p>${review}</p>
                </div>`;
        }
    });
}



// 確保頁面加載完成後執行代碼
document.addEventListener("DOMContentLoaded", function () {
    // 從 URL 中取得 productId 參數
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    if (!productId) {
        alert("無法獲取商品 ID！");
        return;
    }

    console.log("Current Product ID: ", productId);

    // 獲取當前登入的使用者名稱
    const username = localStorage.getItem("username");
    if (!username) {
        alert("請先登入會員");
        window.location.href = "/final1131/pages/login.html"; // 跳轉至登入頁面
        return;
    }

    const storedReviewsKey = `${username}_reviews`; // 使用者專屬的 reviews 鍵
    let storedReviews = JSON.parse(localStorage.getItem(storedReviewsKey)) || {};
    let defaultReviews = JSON.parse(localStorage.getItem("defaultReviews")) || {};

    // 初始化預設評論
    if (!defaultReviews[productId]) {
        defaultReviews[productId] = [
            {
                username: "Ken",
                profilePic: "https://via.placeholder.com/40",
                comment: "好吃，非常推薦!!",
                rating: 5
            },
            {
                username: "Esther",
                profilePic: "https://via.placeholder.com/40",
                comment: "色香味俱全!",
                rating: 4
            }
        ];
        localStorage.setItem("defaultReviews", JSON.stringify(defaultReviews));
    }

    // 初始化當前商品的使用者評論
    if (!storedReviews[productId]) {
        storedReviews[productId] = [];
        localStorage.setItem(storedReviewsKey, JSON.stringify(storedReviews));
    }

    // 顯示評論
    function loadReviews(productId) {
        const reviewsContainer = document.getElementById("reviews");
        reviewsContainer.innerHTML = ""; // 清空現有評論

        // 顯示預設評論
        if (defaultReviews[productId]) {
            defaultReviews[productId].forEach(review => {
                const reviewDiv = createReviewElement(review);
                reviewsContainer.appendChild(reviewDiv);
            });
        }

        // 顯示使用者評論
        const userReviews = storedReviews[productId] || [];
        userReviews.forEach(review => {
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

    // 初始化時加載評論
    loadReviews(productId);

    // 提交評論
    document.getElementById("submitReview").addEventListener("click", function () {
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        const comment = document.getElementById("comment").value;

        if (selectedRating && comment) {
            const newReview = {
                username: username,
                profilePic: "https://via.placeholder.com/40",
                comment: comment,
                rating: parseInt(selectedRating.value)
            };

            // 儲存評論
            storedReviews[productId].push(newReview);
            localStorage.setItem(storedReviewsKey, JSON.stringify(storedReviews));

            // 加載最新評論
            loadReviews(productId);

            alert("評論已提交！");

            // 清空輸入欄位
            document.getElementById("comment").value = "";
            document.querySelector('input[name="rating"]:checked').checked = false;
        } else {
            alert("請填寫評論並選擇星等！");
        }
    });
});

