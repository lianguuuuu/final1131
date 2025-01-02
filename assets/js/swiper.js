const slides = document.getElementById('slides');
const totalSlides = document.querySelectorAll('.slide').length;
let currentIndex = 0;
let isTransitioning = false;

// 自動切換
function showSlide(index, smooth = true) {
  const offset = -index * 100; // 計算位移百分比
  slides.style.transition = smooth ? "transform 0.5s ease-in-out" : "none";
  slides.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  if (isTransitioning) return; // 防止在過渡中多次點擊
  isTransitioning = true;

  if (currentIndex === totalSlides - 1) {
    // 當到最後一張時，先平滑切換到最後一張，然後瞬間跳到第一張
    showSlide(currentIndex);
    setTimeout(() => {
      slides.style.transition = "none"; // 瞬間移動
      currentIndex = 0;
      showSlide(currentIndex, false);
      isTransitioning = false;
    }, 500); // 時間需與 CSS 過渡一致
  } else {
    currentIndex++;
    showSlide(currentIndex);
    setTimeout(() => (isTransitioning = false), 500); // 過渡結束後解除鎖定
  }
}

function prevSlide() {
  if (isTransitioning) return; // 防止在過渡中多次點擊
  isTransitioning = true;

  if (currentIndex === 0) {
    // 當到第一張時，先瞬間跳到最後一張，然後平滑切換回倒數第二張
    slides.style.transition = "none";
    currentIndex = totalSlides - 1;
    showSlide(currentIndex, false);
    setTimeout(() => {
      currentIndex--;
      showSlide(currentIndex);
      isTransitioning = false;
    }, 10); // 瞬間移動後立即啟動過渡
  } else {
    currentIndex--;
    showSlide(currentIndex);
    setTimeout(() => (isTransitioning = false), 500); // 過渡結束後解除鎖定
  }
}

document.getElementById('next').addEventListener('click', nextSlide);
document.getElementById('prev').addEventListener('click', prevSlide);

// 每 5 秒自動切換
setInterval(nextSlide, 5000);
