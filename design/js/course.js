// ============ 轻创 - 课程详情 ============
const courseDetails = {
  basic: {
    icon: '📱',
    tag: '入门首选',
    tagBg: '#bbdefb',
    tagColor: '#1565c0',
    heroBg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    name: '线上录播课',
    price: '¥399',
    btnClass: 'basic-btn',
    desc: '适合零基础想了解宠物赛道的新手，32节系统录播课程覆盖从选品到成交的全流程。',
    items: [
      '32节高清录播课，终身回看',
      '宠物零食/用品选品方法论',
      '短视频获客实操技巧',
      '私域流量搭建与转化',
      '社群答疑 + 每周直播答疑',
      '赠送全套供应商名录',
      '⚠️ 不含分销资格',
    ],
    videos: [
      { id: 0, free: true, title: '第1节：宠物赛道前景与机会分析', dur: '08:30', thumb: '🎯' },
      { id: 1, free: true, title: '第2节：新手如何选择细分品类', dur: '12:15', thumb: '📊' },
      { id: 2, free: true, title: '第3节：供应链基础：找货源的3个方法', dur: '10:40', thumb: '🔍' },
      { id: 3, free: false, title: '第4节：账号搭建与基础运营', dur: '15:20', thumb: '📱' },
      { id: 4, free: false, title: '第5节：私域流量池搭建实操', dur: '18:00', thumb: '💬' },
      { id: 5, free: false, title: '第6节：从咨询到成交的话术技巧', dur: '14:30', thumb: '💡' },
    ],
  },
  pro: {
    icon: '👨‍🏫',
    tag: '🔥 热门推荐',
    tagBg: '#f8bbd0',
    tagColor: '#ad1457',
    heroBg: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
    name: '梵优合伙人',
    price: '¥2,999',
    btnClass: 'pro-btn',
    desc: '90天1v1深度陪跑，从账号搭建到稳定出单，导师手把手带你跑通宠物轻创全链路。',
    items: [
      '包含全部录播课内容',
      '90天导师1v1专属指导',
      '账号定位与人设打造方案',
      '每周实战作业批改反馈',
      '优质货源厂家直接对接',
      '抖音/小红书流量扶持计划',
      '优秀学员可获平台签约机会',
      '🟢 解锁梵优合伙人分销资格(佣金9%)',
    ],
    videos: [
      { id: 0, free: true, title: '进阶课1：爆款短视频脚本拆解', dur: '20:00', thumb: '🎬' },
      { id: 1, free: true, title: '进阶课2：投放策略与ROI优化', dur: '18:30', thumb: '📈' },
      { id: 2, free: true, title: '进阶课3：直播间搭建与话术设计', dur: '22:10', thumb: '🎙️' },
      { id: 3, free: false, title: '进阶课4：梵优合伙人IP打造全流程', dur: '26:00', thumb: '🌟' },
      { id: 4, free: false, title: '进阶课5：多平台矩阵运营策略', dur: '24:15', thumb: '🔗' },
      { id: 5, free: false, title: '进阶课6：月销10万案例深度复盘', dur: '30:00', thumb: '🏆' },
    ],
  },
  partner: {
    icon: '💎',
    tag: '👑 高阶权益',
    tagBg: '#e1bee7',
    tagColor: '#7b1fa2',
    heroBg: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
    name: '梵优主理人',
    price: '¥5,999',
    btnClass: 'partner-btn',
    desc: '全年深度陪跑 + 区域代理权 + 分红权益，打造属于你自己的宠物轻创事业。',
    items: [
      '包含梵优合伙人全部权益',
      '全年365天深度陪跑',
      '所在城市独家区域代理权',
      '团队搭建与管理培训',
      '平台佣金分红权益',
      '线下私董会（每季度1次）',
      '可参与平台项目投资决策',
      '🟢 解锁梵优主理人分销资格(佣金15%)',
    ],
    videos: [
      { id: 0, free: true, title: '总裁课1：商业模式设计与顶层规划', dur: '28:00', thumb: '🏛️' },
      { id: 1, free: true, title: '总裁课2：团队搭建与绩效管理', dur: '25:30', thumb: '👥' },
      { id: 2, free: true, title: '总裁课3：供应链深度整合策略', dur: '32:00', thumb: '🔗' },
      { id: 3, free: false, title: '总裁课4：品牌打造与市场定位', dur: '22:40', thumb: '💎' },
      { id: 4, free: false, title: '总裁课5：融资与规模化扩张路径', dur: '30:20', thumb: '🚀' },
      { id: 5, free: false, title: '总裁课6：行业峰会闭门分享', dur: '45:00', thumb: '🎤' },
    ],
  },
};

function openCourseDetail(type) {
  const d = courseDetails[type];
  document.getElementById('courseDetailHero').style.background = d.heroBg;
  document.getElementById('courseDetailHero').textContent = d.icon;
  document.getElementById('courseDetailTag').textContent = d.tag;
  document.getElementById('courseDetailTag').style.background = d.tagBg;
  document.getElementById('courseDetailTag').style.color = d.tagColor;
  document.getElementById('courseDetailName').textContent = d.name;
  document.getElementById('courseDetailPrice').innerHTML = d.price;
  document.getElementById('courseDetailDesc').textContent = d.desc;
  document.getElementById('courseDetailList').innerHTML = d.items
    .map(
      (i) =>
        `<div class="course-detail-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>${i}</span></div>`,
    )
    .join('');
  document.getElementById('courseDetailBtn').className = 'course-detail-btn ' + d.btnClass;
  document.getElementById('courseDetailBtn').dataset.type = type;

  // 渲染该课程的专属视频列表
  renderVideoList(d.videos);
  // 重置播放器
  currentVideo = -1;
  const placeholder = document.getElementById('videoPlaceholder');
  placeholder.innerHTML = `<div class="video-play-btn" onclick="playVideo(0)"><svg viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"/></svg></div>`;
  placeholder.style.display = 'flex';
  document.getElementById('videoEl').style.display = 'none';

  document.getElementById('courseDetailOverlay').classList.remove('hidden');
}

function closeCourseDetail(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('courseDetailOverlay').classList.add('hidden');
}

function buyCourse() {
  const type = document.getElementById('courseDetailBtn').dataset.type;
  const d = courseDetails[type];
  // document.getElementById('courseDetailOverlay').classList.add('hidden');
  // showToast('已提交「' + d.name + '」报名，客服将在24h内联系您 📩');
  showToast('跳转支付页面');
}

// ============ 轻创 - 视频播放 ============
let currentVideo = -1;

function renderVideoList(videos) {
  const listEl = document.getElementById('videoList');
  listEl.innerHTML = videos
    .map((v) => {
      const lockedClass = v.free ? '' : ' locked';
      const lockBadge = v.free ? '' : '<div class="video-lock-badge">🔒</div>';
      const freeBadge = v.free ? '<span class="video-free-badge">免费</span>' : '';
      return `
      <div class="video-item${lockedClass}" onclick="${v.free ? 'playVideo(' + v.id + ')' : "showToast('🔒 报名该课程即可解锁全部视频')"}">
        <div class="video-item-thumb">${v.thumb}${lockBadge}</div>
        <div class="video-item-info">
          <div class="video-item-title">${v.title}${freeBadge}</div>
          <div class="video-item-meta">${v.dur}</div>
        </div>
      </div>
    `;
    })
    .join('');
}

function playVideo(id) {
  const videos = courseDetails[document.getElementById('courseDetailBtn').dataset.type].videos;
  if (!videos[id].free) {
    showToast('🔒 报名该课程即可解锁全部视频');
    return;
  }
  const placeholder = document.getElementById('videoPlaceholder');
  placeholder.innerHTML = `
    <div style="text-align:center;color:#fff;">
      <div style="font-size:48px;margin-bottom:8px;">${videos[id].thumb}</div>
      <div style="font-size:14px;font-weight:600;">${videos[id].title}</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:4px;">▶ 正在播放 · ${videos[id].dur}</div>
    </div>
  `;
  placeholder.style.display = 'flex';
  document.getElementById('videoEl').style.display = 'none';

  document.querySelectorAll('.video-item').forEach((el, i) => {
    el.classList.toggle('playing', i === id);
  });
  currentVideo = id;
}

function onVideoEnded() {
  const videos = courseDetails[document.getElementById('courseDetailBtn').dataset.type].videos;
  const next = currentVideo + 1;
  if (next < videos.length && videos[next].free) {
    playVideo(next);
  }
}
