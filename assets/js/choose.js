// 確保在頁面加載後執行JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // 選取套餐按鈕和子選單
    const menuToggle = document.getElementById('menu-toggle');
    const submenu = document.getElementById('submenu');

    //點擊套餐時顯示或隱藏子選單
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault(); // 阻止連結的預設行為
        submenu.classList.toggle('visible'); // 切換子選單的顯示狀態
    });

    // 點擊其他地方時隱藏子選單
    document.addEventListener('click', (e) => {
        //如果點擊的不是套餐按鈕或子選單內部，隱藏子選單
        if (!menuToggle.contains(e.target) && !submenu.contains(e.target)) {
            submenu.classList.remove('visible');
        }
    });
});


//要使用的元素
const links=document.querySelectorAll('.choose li a');

links.forEach(link=>{
    let letters=link.textContent.split('');
    //初始化
    link.textContent='';
    letters.forEach((letter,i)=>{
        //創span
        let span=document.createElement('span');
        span.textContent=letter;
        //css透過attr函數使用(data-text)
        span.dataset.text=letter;
        //計算動畫延遲時間
        span.style.transitionDelay=i/15+'s';
        //加span到a標籤
        link.append(span);
    })
})  
