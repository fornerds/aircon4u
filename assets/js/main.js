// main.js - Aircon4u 공통 스크립트

document.addEventListener('DOMContentLoaded', function() {
    initSideNav();
    initUserMenu();
    initNotifications();
    initThemeToggle();
    initLanguageToggle();
    initSearchShortcut();
  });
  
  // 사이드 네비게이션 초기화
  function initSideNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const sidenav = document.querySelector('.sidenav');
    const mainContent = document.querySelector('.main-content');
    
    if (!navToggle || !sidenav || !mainContent) return;
    
    // 로컬 스토리지에서 사이드바 상태 불러오기
    const isCollapsed = localStorage.getItem('sidenavCollapsed') === 'true';
    
    if (isCollapsed) {
      sidenav.classList.add('collapsed');
      mainContent.classList.add('collapsed');
      navToggle.innerHTML = '&rarr;';
    } else {
      navToggle.innerHTML = '&larr;';
    }
    
    navToggle.addEventListener('click', function() {
      sidenav.classList.toggle('collapsed');
      mainContent.classList.toggle('collapsed');
      
      const currentlyCollapsed = sidenav.classList.contains('collapsed');
      localStorage.setItem('sidenavCollapsed', currentlyCollapsed);
      
      if (currentlyCollapsed) {
        navToggle.innerHTML = '&rarr;';
      } else {
        navToggle.innerHTML = '&larr;';
      }
    });
    
    // 현재 페이지 활성화
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const itemPage = item.getAttribute('data-page');
      if (itemPage === currentPage || (currentPage === '' && itemPage === 'index')) {
        item.classList.add('active');
      }
    });
  }
  
  // 사용자 메뉴 초기화
  function initUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (!userMenu || !userDropdown) return;
    
    userMenu.addEventListener('click', function() {
      userDropdown.classList.toggle('show');
    });
    
    // 다른 곳 클릭하면 드롭다운 닫기
    document.addEventListener('click', function(event) {
      if (!userMenu.contains(event.target) && userDropdown.classList.contains('show')) {
        userDropdown.classList.remove('show');
      }
    });
  }
  
  // 알림 초기화
  function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPanel = document.querySelector('.notification-panel');
    
    if (!notificationBtn || !notificationPanel) return;
    
    notificationBtn.addEventListener('click', function() {
      notificationPanel.classList.toggle('show');
    });
    
    // 다른 곳 클릭하면 알림 패널 닫기
    document.addEventListener('click', function(event) {
      if (!notificationBtn.contains(event.target) && !notificationPanel.contains(event.target) && notificationPanel.classList.contains('show')) {
        notificationPanel.classList.remove('show');
      }
    });
    
    // 알림 읽음 표시
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
      const markAsReadBtn = item.querySelector('.mark-as-read');
      
      if (markAsReadBtn) {
        markAsReadBtn.addEventListener('click', function(event) {
          event.stopPropagation();
          item.classList.add('read');
          updateNotificationCount();
        });
      }
      
      item.addEventListener('click', function() {
        if (!item.classList.contains('read')) {
          item.classList.add('read');
          updateNotificationCount();
        }
      });
    });
    
    // 알림 개수 업데이트
    function updateNotificationCount() {
      const unreadCount = document.querySelectorAll('.notification-item:not(.read)').length;
      const badge = document.querySelector('.notification-badge');
      
      if (badge) {
        badge.textContent = unreadCount;
        
        if (unreadCount === 0) {
          badge.style.display = 'none';
        } else {
          badge.style.display = 'flex';
        }
      }
    }
    
    // 초기 알림 개수 설정
    updateNotificationCount();
  }
  
  // 테마 토글(다크 모드/라이트 모드) 초기화
  function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;
    
    // 로컬 스토리지에서 테마 불러오기
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '☀️';
    } else {
      themeToggle.innerHTML = '🌙';
    }
    
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        themeToggle.innerHTML = '☀️';
      } else {
        themeToggle.innerHTML = '🌙';
      }
    });
  }
  
  // 언어 토글(한국어/영어) 초기화
  function initLanguageToggle() {
    const langToggle = document.querySelector('.lang-toggle');
    
    if (!langToggle) return;
    
    // 로컬 스토리지에서 언어 불러오기
    const currentLang = localStorage.getItem('language') || 'ko';
    document.documentElement.setAttribute('lang', currentLang);
    
    langToggle.textContent = currentLang === 'ko' ? 'EN' : 'KO';
    
    langToggle.addEventListener('click', function() {
      const currentLang = document.documentElement.getAttribute('lang');
      const newLang = currentLang === 'ko' ? 'en' : 'ko';
      
      document.documentElement.setAttribute('lang', newLang);
      localStorage.setItem('language', newLang);
      langToggle.textContent = newLang === 'ko' ? 'EN' : 'KO';
      
      // 여기에 다국어 처리 로직 추가
      translatePage(newLang);
    });
  }
  
  // 다국어 처리 함수
  function translatePage(lang) {
    // 실제 구현시에는 i18n 라이브러리나 JSON 파일을 사용하여 번역 데이터 처리
    console.log('Page language changed to:', lang);
    
    // 예시: 간단한 번역 구현
    const translations = {
      'ko': {
        'dashboard': '대시보드',
        'units': '유닛 목록',
        'details': '유닛 상세',
        'wizard': '세척 마법사',
        'analytics': '예측/분석',
        'reports': '리포트 센터',
        'sampling': '샘플링 대시보드',
        'admin': '관리자 설정',
        'notifications': '알림 센터'
      },
      'en': {
        'dashboard': 'Dashboard',
        'units': 'Units List',
        'details': 'Unit Details',
        'wizard': 'Cleaning Wizard',
        'analytics': 'Analytics',
        'reports': 'Report Center',
        'sampling': 'Sampling Dashboard',
        'admin': 'Admin Settings',
        'notifications': 'Notifications'
      }
    };
    
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
  }
  
  // 글로벌 검색 단축키 초기화 (Ctrl + K)
  function initSearchShortcut() {
    document.addEventListener('keydown', function(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openGlobalSearch();
      }
    });
  }
  
  // 글로벌 검색 열기
  function openGlobalSearch() {
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchModal || !searchInput) return;
    
    searchModal.classList.add('show');
    searchInput.focus();
    
    // ESC 키로 검색 모달 닫기
    document.addEventListener('keydown', function closeSearchOnEsc(event) {
      if (event.key === 'Escape') {
        closeGlobalSearch();
        document.removeEventListener('keydown', closeSearchOnEsc);
      }
    });
  }
  
  // 글로벌 검색 닫기
  function closeGlobalSearch() {
    const searchModal = document.querySelector('.search-modal');
    
    if (!searchModal) return;
    
    searchModal.classList.remove('show');
  }
  
  // BLE 연결 상태 업데이트
  function updateBleStatus(connected) {
    const bleIndicator = document.querySelector('.ble-indicator');
    
    if (!bleIndicator) return;
    
    if (connected) {
      bleIndicator.classList.remove('disconnected');
      bleIndicator.classList.add('connected');
      bleIndicator.setAttribute('title', 'BLE 연결됨');
    } else {
      bleIndicator.classList.remove('connected');
      bleIndicator.classList.add('disconnected');
      bleIndicator.setAttribute('title', 'BLE 연결 안됨');
    }
  }
  
  // 모달 함수
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (!modal) return;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  // 토스트 메시지 표시
  function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      // 토스트 컨테이너가 없으면 생성
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.querySelector('.toast-container').appendChild(toast);
    
    // 애니메이션 시작
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // 일정 시간 후 제거
    setTimeout(() => {
      toast.classList.remove('show');
      
      toast.addEventListener('transitionend', function() {
        toast.remove();
      });
    }, duration);
  }
  
  // 차트 관련 유틸리티
  function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }
  
  function getRandomData(count, min, max) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    
    return data;
  }
  
  // 날짜 관련 유틸리티
  function formatDate(date, format = 'yyyy-MM-dd') {
    const d = new Date(date);
    
    const map = {
      yyyy: d.getFullYear(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      dd: String(d.getDate()).padStart(2, '0'),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0')
    };
    
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, matched => map[matched]);
  }
  
  // AJAX 유틸리티 함수
  async function fetchData(url, options = {}) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      showToast('데이터를 불러오는 중 오류가 발생했습니다.', 'error');
      throw error;
    }
  }
  
  // BLE 연결 시뮬레이션 (실제 구현시 BLE JS SDK 사용)
  function simulateBleConnection() {
    // 랜덤하게 연결 상태 변경 (데모용)
    const connected = Math.random() > 0.3;
    updateBleStatus(connected);
    
    // 연결 상태에 따라 다른 메시지 표시
    if (connected) {
      showToast('BLE 장치가 연결되었습니다.', 'success');
    } else {
      showToast('BLE 장치 연결이 끊어졌습니다. 다시 연결해주세요.', 'warning');
    }
  }