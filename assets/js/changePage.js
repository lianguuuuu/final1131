// 動態設定按鈕跳轉
function setButtonRedirect() {
    const button = document.getElementById('nav-button1'); // 找到按鈕
    const username = localStorage.getItem('username'); // 從 localStorage 中取得用戶名
  
    if (username) {
      // 已登入
      button.href = './pages/logout.html'; // 設定為會員專區
      button.innerHTML = '<img src="../../picture/member_login.png" alt="會員專區" style="width: 35px; height: 35px;">'; // 按鈕內容設置為圖片
    } else {
      // 未登入
      button.href = './pages/login.html'; // 設定為登入頁
      button.textContent = '登入'; // 按鈕文字
    }
}
  
// 頁面加載時執行
window.onload = function () {
    setButtonRedirect();
};