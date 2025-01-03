// 當頁面加載時顯示評論
document.addEventListener('DOMContentLoaded', function () {
const username = localStorage.getItem('username'); // 取得當前用戶名稱

if (!username) {
    alert('請先登入會員');
    window.location.href = '../pages/login.html'; // 如果未登入，跳轉至登入頁面
    return;
}

const cartKey = `cart_${username}`;  // 例如 'cart_admin' 或 'cart_user1'
const newCartKey = `new_cart_${username}`;  // 動態設置新的購物車名

// 讀取對應的會員資料
fetch('../assets/json/users.json')
    .then(response => response.json())
    .then(users => {
        const user = users.find(u => u.username === username);
        if (user) {
            // 顯示使用者資料
            document.getElementById('picture').src = user.picture || "https://via.placeholder.com/100";
            document.getElementById('username').textContent = `用戶名稱: ${user.username}`;
            document.getElementById('email').textContent = `電子郵件: ${user.mail}`;
            document.getElementById('living').textContent = `住址: ${user.living || '未設定'}`;
            document.getElementById('phone').textContent = `電話: ${user.phoneNumber || '未設定'}`;

            // 讀取 new_cart_admin 資料
            const newCartAdmin = JSON.parse(localStorage.getItem(newCartKey)) || [];

            // 顯示新購物車的內容
            const cartContainer = document.getElementById('cart-container');
            if (newCartAdmin.length > 0) {
                newCartAdmin.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <p>商品名稱: ${item.name}</p>
                        <p>價格: ${item.price}</p>
                    `;
                    cartContainer.appendChild(cartItem);
                });
            } else {
                cartContainer.innerHTML = '<p>購物紀錄是空的</p>';
            }

            // 顯示評論
            displayReviewsOnLogout(username);
        } else {
            alert('找不到該用戶的資料');
        }
    })
    .catch(error => {
        console.error('讀取 users.json 時出錯:', error);
    });
});

// 顯示評論
function displayReviewsOnLogout(username) {
    const reviewsContainer = document.getElementById("reviews-container");
    reviewsContainer.innerHTML = ""; // 清空現有內容

    const userReviewsKey = `${username}_reviews`;
    const storedReviews = JSON.parse(localStorage.getItem(userReviewsKey)) || {};
    const newCartKey = `new_cart_${username}`;
    const newCartItems = JSON.parse(localStorage.getItem(newCartKey)) || [];

    if (Object.keys(storedReviews).length === 0) {
        reviewsContainer.innerHTML = "<p>目前沒有評論記錄。</p>";
        return;
    }

    // 取得已結帳商品的名稱列表
    const checkedOutItemNames = newCartItems.map(item => item.name);

    // 所有的商品評論
    for (const productId in storedReviews) {
        const productReviews = storedReviews[productId];

        // 篩選出未結帳的評論
        const filteredReviews = productReviews.filter(review => !checkedOutItemNames.includes(productId));

        if (filteredReviews.length > 0) {
            // 每個商品的評論標題
            const productTitle = document.createElement("h4");
            productTitle.textContent = `商品 ID：${productId}`;
            reviewsContainer.appendChild(productTitle);

            // 顯示篩選後的評論
            filteredReviews.forEach(review => {
                const reviewDiv = document.createElement("div");
                reviewDiv.classList.add("review");

                // 評分
                const rating = document.createElement("p");
                rating.innerHTML = `評分：${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`;

                // 留言內容
                const comment = document.createElement("p");
                comment.textContent = `留言：${review.comment}`;

                // 添加到評論區塊
                reviewDiv.appendChild(rating);
                reviewDiv.appendChild(comment);
                reviewsContainer.appendChild(reviewDiv);
            });
        }
    }
}

// 當頁面加載時顯示評論
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username'); // 取得當前用戶名稱

    if (!username) {
        alert('請先登入會員');
        window.location.href = '../pages/login.html'; // 如果未登入，跳轉至登入頁面
        return;
    }

    // 顯示評論
    displayReviewsOnLogout(username);
});


// 登出功能
document.getElementById('logoutButton')?.addEventListener('click', function () {
    handleLogout();
  });
  
  // 處理登出
  function handleLogout() {
    localStorage.removeItem('username'); // 清除登入資訊
    alert('您已成功登出');
    window.location.href = '../pages/login.html';
  }
