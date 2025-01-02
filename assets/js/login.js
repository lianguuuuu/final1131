// 登入功能
document.getElementById('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();// 阻止預設的表單提交行為

  // 取得用戶輸入的帳號與密碼，並去除多餘的空白
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // 模擬用戶資料庫（靜態用戶清單）
  const users = [
    { username: 'admin', password: '1234' },
    { username: 'user1', password: 'password' },
  ];

  // 尋找符合用戶名和密碼的用戶
  const user = users.find(user => user.username === username && user.password === password);
  
  // 如果找到用戶，執行登入成功邏輯；否則顯示錯誤訊息
  if (user) {
    handleLoginSuccess(username);
  } else {
    showErrorMessage('用戶名或密碼錯誤！');
  }
});

// 處理登入成功的函數
function handleLoginSuccess(username) {
  // 使用 localStorage 儲存登入的用戶名
  localStorage.setItem('username', username);

  // 確保該用戶的購物車資料存在（若不存在，則初始化為空陣列）
  const cartKey = `cart_${username}`;
  if (!localStorage.getItem(cartKey)) {// 動態生成購物車的 key
    localStorage.setItem(cartKey, JSON.stringify([]));// 初始化購物車
  }
  // 提示登入成功並導向首頁
  alert('登入成功');
  window.location.href = 'https://lianguuuuu.github.io/final1131/index.html';
}

// 顯示錯誤訊息的函數
function showErrorMessage(message) {
const errorMessage = document.getElementById('error-message');
errorMessage.textContent = message;// 設定錯誤訊息內容
errorMessage.style.display = 'block';// 顯示錯誤訊息
}

// DOM 元素選取：切換登入與註冊區塊
let login_title=document.querySelector('.login-title');// 登入區塊的標題
let register_title=document.querySelector('.register-title');// 註冊區塊的標題
let login_box=document.querySelector('.login-box');// 登入區塊
let register_box=document.querySelector('.register-box');// 註冊區塊

// 點擊登入標題時切換至登入區塊
login_title.addEventListener('click',()=>{
  // 判斷是否收起，收起才可以點擊
  if(login_box.classList.contains('slide-up')){
      register_box.classList.add('slide-up');
      login_box.classList.remove('slide-up');
  }
})
// 點擊註冊標題時切換至註冊區塊
register_title.addEventListener('click',()=>{
  if(register_box.classList.contains('slide-up')){
      login_box.classList.add('slide-up');
      register_box.classList.remove('slide-up');
  }
})
