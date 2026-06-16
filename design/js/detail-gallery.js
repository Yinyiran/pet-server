// ============ 图片轮播 & 视频播放 ============

function initGalleryScroll() {
  const track = document.getElementById('detailGalleryTrack');
  const dots = document.querySelectorAll('#detailGalleryDots .detail-gallery-dot');
  var scrollTimer;
  track.onscroll = function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }, 100);
  };
}

function goToGallerySlide(index) {
  var track = document.getElementById('detailGalleryTrack');
  track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
}

function playDetailVideo() {
  var bg = document.getElementById('detailVideoBg');
  var el = document.getElementById('detailVideoEl');
  bg.style.display = 'none';
  el.style.display = 'block';
  el.play().catch(function () {
    el.style.display = 'none';
    bg.style.display = 'flex';
    showToast('视频加载中，请稍后再试');
  });
}

function onDetailVideoEnded() {
  var bg = document.getElementById('detailVideoBg');
  var el = document.getElementById('detailVideoEl');
  el.style.display = 'none';
  bg.style.display = 'flex';
}
