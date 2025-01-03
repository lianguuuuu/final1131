function handleCardClick(element) {
  // 取得商品 ID
  const productId = element.getAttribute("data-product-id");

  if (productId === "DIY") {
      // 跳轉到 diy.html
      window.location.href = './pages/diy_page.html';  // 使路徑相對
  } else {
      // 跳轉到其他商品頁面
      window.location.href = './pages/product_page.html?productId=' + productId;  // 調整路徑
  }
}

