// units.js - Aircon4u 유닛 목록 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수 호출
    initFilterToggle();
    initPM25RangeSlider();
    initTableSort();
    initUnitActions();
    initNewUnitModal();
    initNotifications();
    
    // BLE 연결 시뮬레이션
    setTimeout(simulateBleConnection, 2000);
  });
  
  // 알림 기능 초기화
  function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPanel = document.querySelector('.notification-panel');
    
    if (!notificationBtn || !notificationPanel) return;
    
    notificationBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      notificationPanel.classList.toggle('show');
    });
    
    // 다른 곳 클릭하면 알림 패널 닫기
    document.addEventListener('click', function(event) {
      if (!notificationBtn.contains(event.target) && 
          !notificationPanel.contains(event.target) && 
          notificationPanel.classList.contains('show')) {
        notificationPanel.classList.remove('show');
      }
    });
    
    // 알림 읽음 표시
    const markAsReadButtons = document.querySelectorAll('.mark-as-read');
    markAsReadButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation();
        const notificationItem = this.closest('.notification-item');
        notificationItem.classList.add('read');
        updateNotificationCount();
      });
    });
    
    // 모두 읽음 표시 버튼
    const markAllReadButton = document.querySelector('.mark-all-read');
    if (markAllReadButton) {
      markAllReadButton.addEventListener('click', function(event) {
        event.stopPropagation();
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
          item.classList.add('read');
        });
        updateNotificationCount();
        showToast('모든 알림이 읽음 표시되었습니다.', 'info');
      });
    }
    
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
  
  // 필터 토글 초기화
  function initFilterToggle() {
    const toggleButton = document.querySelector('.toggle-filters-btn');
    const filterBody = document.querySelector('.filter-body');
    
    if (!toggleButton || !filterBody) return;
    
    // 로컬 스토리지에서 필터 상태 불러오기
    const isCollapsed = localStorage.getItem('filtersCollapsed') === 'true';
    
    if (isCollapsed) {
      filterBody.classList.add('collapsed');
      toggleButton.classList.add('collapsed');
    }
    
    toggleButton.addEventListener('click', function() {
      filterBody.classList.toggle('collapsed');
      this.classList.toggle('collapsed');
      
      // 상태 저장
      const nowCollapsed = filterBody.classList.contains('collapsed');
      localStorage.setItem('filtersCollapsed', nowCollapsed);
    });
    
    // 필터 초기화 버튼
    const resetButton = document.querySelector('.reset-filters-btn');
    
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        // 모든 셀렉트 박스를 첫 번째 옵션으로 초기화
        const selectBoxes = document.querySelectorAll('.filter-body select');
        selectBoxes.forEach(select => {
          select.selectedIndex = 0;
        });
        
        // 범위 슬라이더 초기화
        const pm25Min = document.getElementById('pm25-min');
        const pm25Max = document.getElementById('pm25-max');
        const pm25MinValue = document.getElementById('pm25-min-value');
        const pm25MaxValue = document.getElementById('pm25-max-value');
        
        if (pm25Min && pm25Max && pm25MinValue && pm25MaxValue) {
          pm25Min.value = 0;
          pm25Max.value = 50;
          pm25MinValue.textContent = '0';
          pm25MaxValue.textContent = '50';
        }
        
        // 날짜 입력 초기화
        const dateInputs = document.querySelectorAll('.date-range input');
        dateInputs.forEach(input => {
          input.value = '';
        });
        
        showToast('필터가 초기화되었습니다.', 'info');
      });
    }
    
    // 적용 버튼
    const applyButton = document.querySelector('.apply-filters-btn');
    
    if (applyButton) {
      applyButton.addEventListener('click', function() {
        // 필터 적용 로직 (실제로는 API 호출 등이 필요)
        showToast('필터가 적용되었습니다.', 'success');
      });
    }
  }
  
  // PM2.5 범위 슬라이더 초기화
  function initPM25RangeSlider() {
    const pm25Min = document.getElementById('pm25-min');
    const pm25Max = document.getElementById('pm25-max');
    const pm25MinValue = document.getElementById('pm25-min-value');
    const pm25MaxValue = document.getElementById('pm25-max-value');
    
    if (!pm25Min || !pm25Max || !pm25MinValue || !pm25MaxValue) return;
    
    // 슬라이더 값 변경 시 표시 업데이트
    function updateSliderValues() {
      pm25MinValue.textContent = pm25Min.value;
      pm25MaxValue.textContent = pm25Max.value;
      
      // 슬라이더 시각적 업데이트
      const rangeSlider = document.querySelector('.range-slider');
      const percentage1 = (pm25Min.value / pm25Min.max) * 100;
      const percentage2 = (pm25Max.value / pm25Max.max) * 100;
      
      rangeSlider.style.setProperty('--percentage1', percentage1 + '%');
      rangeSlider.style.setProperty('--percentage2', percentage2 + '%');
    }
    
    // 최소값 슬라이더 변경 이벤트
    pm25Min.addEventListener('input', function() {
      const minVal = parseInt(pm25Min.value);
      const maxVal = parseInt(pm25Max.value);
      
      if (minVal > maxVal) {
        pm25Min.value = maxVal;
      }
      
      updateSliderValues();
    });
    
    // 최대값 슬라이더 변경 이벤트
    pm25Max.addEventListener('input', function() {
      const minVal = parseInt(pm25Min.value);
      const maxVal = parseInt(pm25Max.value);
      
      if (maxVal < minVal) {
        pm25Max.value = minVal;
      }
      
      updateSliderValues();
    });
    
    // 초기 값 설정
    updateSliderValues();
  }
  
  // 테이블 정렬 초기화
  function initTableSort() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    if (!sortableHeaders.length) return;
    
    // 현재 정렬 상태 (기본: 유닛 ID 오름차순)
    let currentSort = {
      column: 'unit-id',
      direction: 'asc'
    };
    
    sortableHeaders.forEach(header => {
      header.addEventListener('click', function() {
        // 정렬할 컬럼 확인
        const columnText = this.textContent.trim().replace(/[^a-zA-Z0-9가-힣]/g, '');
        const column = columnText.toLowerCase().replace(/\s+/g, '-');
        
        // 정렬 방향 결정
        let direction = 'asc';
        if (currentSort.column === column && currentSort.direction === 'asc') {
          direction = 'desc';
        }
        
        // 정렬 상태 업데이트
        currentSort = {
          column: column,
          direction: direction
        };
        
        // 정렬 아이콘 업데이트
        updateSortIcons(this, direction);
        
        // 테이블 정렬 로직 (실제로는 API 호출 또는 클라이언트 정렬)
        sortTable(column, direction);
      });
    });
    
    // 정렬 아이콘 업데이트 함수
    function updateSortIcons(activeHeader, direction) {
      // 모든 헤더의 아이콘 초기화
      sortableHeaders.forEach(header => {
        const icon = header.querySelector('.sort-icon');
        icon.innerHTML = `
          <polyline points="7 11 12 6 17 11"></polyline>
          <polyline points="7 17 12 12 17 17"></polyline>
        `;
        icon.style.color = 'var(--gray-400)';
      });
      
      // 활성화된 헤더의 아이콘 업데이트
      const activeIcon = activeHeader.querySelector('.sort-icon');
      
      if (direction === 'asc') {
        activeIcon.innerHTML = `
          <polyline points="7 11 12 6 17 11"></polyline>
        `;
      } else {
        activeIcon.innerHTML = `
          <polyline points="7 17 12 12 17 17"></polyline>
        `;
      }
      
      activeIcon.style.color = 'var(--primary-blue)';
    }
    
    // 테이블 정렬 함수 (실제 구현 시 수정 필요)
    function sortTable(column, direction) {
      console.log(`테이블 정렬: ${column} ${direction}`);
      // 여기에 실제 정렬 로직 추가 (API 호출 또는 클라이언트 정렬)
    }
  }
  
  // 유닛 액션 초기화
  function initUnitActions() {
    // 디테일 보기 버튼
    const detailButtons = document.querySelectorAll('.action-buttons button:first-child');
    
    if (detailButtons) {
      detailButtons.forEach(button => {
        button.addEventListener('click', function() {
          const row = this.closest('tr');
          const unitId = row.cells[0].textContent;
          
          // 실제로는 상세 페이지로 이동
          window.location.href = `details.html?id=${unitId}`;
        });
      });
    }
    
    // 세척 전 측정 시작 버튼
    const measureButtons = document.querySelectorAll('.action-buttons button:nth-child(2)');
    
    if (measureButtons) {
      measureButtons.forEach(button => {
        button.addEventListener('click', function() {
          const row = this.closest('tr');
          const unitId = row.cells[0].textContent;
          
          // BLE 연결 확인
          const bleIndicator = document.querySelector('.ble-indicator');
          if (bleIndicator && bleIndicator.classList.contains('disconnected')) {
            showToast('BLE 장치가 연결되지 않았습니다. 먼저 연결해주세요.', 'error');
            return;
          }
          
          // 세척 마법사 페이지로 이동 (실제로는 세션 스토리지에 선택된 유닛 정보 저장 후 이동)
          sessionStorage.setItem('selectedUnit', unitId);
          window.location.href = 'wizard.html';
        });
      });
    }
    
    // 세척 완료 입력 버튼
    const completeButtons = document.querySelectorAll('.action-buttons button:nth-child(3)');
    
    if (completeButtons) {
      completeButtons.forEach(button => {
        button.addEventListener('click', function() {
          const row = this.closest('tr');
          const unitId = row.cells[0].textContent;
          
          // 실제로는 세척 완료 입력 모달 표시
          showToast(`${unitId} 유닛의 세척 완료 정보가 저장되었습니다.`, 'success');
        });
      });
    }
  }
  
  // 새 유닛 등록 모달 초기화
  function initNewUnitModal() {
    const newUnitButton = document.querySelector('.page-actions .btn-primary');
    
    if (!newUnitButton) return;
    
    newUnitButton.addEventListener('click', function() {
      openModal('new-unit-modal');
    });
    
    // 저장 버튼
    const saveButton = document.querySelector('#new-unit-modal .btn-primary');
    
    if (saveButton) {
      saveButton.addEventListener('click', function() {
        // 새 유닛 저장 로직 (실제로는 API 호출)
        closeModal('new-unit-modal');
        showToast('새 유닛이 등록되었습니다.', 'success');
      });
    }
  }
  
  // 테이블 페이지네이션 초기화 (필요시 구현)
  function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    if (!paginationButtons.length) return;
    
    paginationButtons.forEach(button => {
      if (button.textContent.trim() && !button.classList.contains('active')) {
        button.addEventListener('click', function() {
          const page = this.textContent.trim();
          
          // 페이지 로드 로직 (실제로는 API 호출)
          console.log(`페이지 ${page} 로드`);
        });
      }
    });
  }