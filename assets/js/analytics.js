// analytics.js - Aircon4u 예측/분석 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수 호출
    initTabs();
    initHeatmapViews();
    initSimulator();
    initForecastCharts();
    initCalendarViews();
    initScheduleModals();
    
    // BLE 연결 시뮬레이션
    setTimeout(simulateBleConnection, 2000);
  });
  
  // 탭 초기화
  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabs.length || !tabContents.length) return;
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // 모든 탭 및 콘텐츠 비활성화
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // 선택한 탭 및 콘텐츠 활성화
        this.classList.add('active');
        document.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
        
        // 로컬 스토리지에 현재 탭 저장
        localStorage.setItem('activeAnalyticsTab', tabId);
      });
    });
    
    // 로컬 스토리지에서 이전 선택한 탭 불러오기
    const savedTab = localStorage.getItem('activeAnalyticsTab');
    
    if (savedTab) {
      const tabToActivate = document.querySelector(`.tab[data-tab="${savedTab}"]`);
      if (tabToActivate) {
        tabToActivate.click();
      }
    }
  }
  
  // 히트맵 뷰 초기화
  function initHeatmapViews() {
    const heatmapTab = document.querySelector('.tab-content[data-tab="pollution-heatmap"]');
    if (!heatmapTab) return;
    
    const viewButtons = heatmapTab.querySelectorAll('.view-btn');
    const heatmapView = heatmapTab.querySelector('.heatmap-container');
    const tableView = heatmapTab.querySelector('.table-view');
    
    if (!viewButtons.length || !heatmapView || !tableView) return;
    
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 모든 버튼 비활성화
        viewButtons.forEach(btn => btn.classList.remove('active'));
        
        // 클릭한 버튼 활성화
        this.classList.add('active');
        
        // 뷰 전환
        const viewType = this.getAttribute('data-view');
        
        if (viewType === 'heatmap') {
          heatmapView.style.display = 'flex';
          tableView.style.display = 'none';
        } else if (viewType === 'table') {
          heatmapView.style.display = 'none';
          tableView.style.display = 'block';
        }
      });
    });
    
    // 히트맵 셀 호버 효과 및 클릭 이벤트
    const gridCells = heatmapTab.querySelectorAll('.grid-cell');
    
    gridCells.forEach(cell => {
      cell.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const rowIndex = Array.from(this.parentNode.children).indexOf(this) % 12;
        const colIndex = Math.floor(Array.from(this.parentNode.children).indexOf(this) / 12);
        
        const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        const monthName = monthNames[rowIndex];
        
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        const unitName = sidebarItems[colIndex]?.textContent || '알 수 없는 유닛';
        
        // 상세 정보 표시
        showToast(`${unitName}의 ${monthName} 오염도: ${value}%`, 'info');
      });
    });
    
    // 건물 선택 변경 이벤트
    const buildingSelect = heatmapTab.querySelector('.building-select');
    
    if (buildingSelect) {
      buildingSelect.addEventListener('change', function() {
        const building = this.value;
        
        // 실제 구현시 API를 호출하여 선택한 건물의 데이터로 히트맵 업데이트
        // 데모에서는 토스트 메시지만 표시
        showToast(`${building === 'all' ? '전체 건물' : building + '동'}의 데이터로 업데이트되었습니다.`, 'success');
      });
    }
  }
  
  // 세척 주기 시뮬레이터 초기화
  function initSimulator() {
    const simulatorTab = document.querySelector('.tab-content[data-tab="cleaning-simulator"]');
    if (!simulatorTab) return;
    
    // 슬라이더 값 변경 이벤트
    const sliders = simulatorTab.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
      const valueDisplay = slider.nextElementSibling;
      
      slider.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
      });
    });
    
    // 계산 버튼 클릭 이벤트
    const calculateBtn = simulatorTab.querySelector('.simulator-calculate-btn');
    
    if (calculateBtn) {
      calculateBtn.addEventListener('click', function() {
        // 사용자가 설정한 가중치 및 옵션 가져오기
        const ageWeight = Number(document.getElementById('age-weight').value);
        const usageWeight = Number(document.getElementById('usage-weight').value);
        const envWeight = Number(document.getElementById('environment-weight').value);
        const threshold = document.getElementById('threshold-select').value;
        const seasonal = document.getElementById('seasonal-toggle').checked;
        const staff = document.getElementById('staff-select').value;
        
        // 실제 구현시 API를 호출하여 시뮬레이션 결과 받아오기
        // 데모에서는 가중치에 따라 결과를 약간 변경
        
        // 결과 업데이트
        updateSimulationResults(ageWeight, usageWeight, envWeight, seasonal);
        
        // 안내 메시지
        showToast('시뮬레이션이 완료되었습니다.', 'success');
      });
    }
    
    // 초기화 버튼 클릭 이벤트
    const resetBtn = simulatorTab.querySelector('.simulator-reset-btn');
    
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        // 슬라이더 초기화
        document.getElementById('age-weight').value = 3;
        document.getElementById('usage-weight').value = 4;
        document.getElementById('environment-weight').value = 3;
        
        // 값 표시 업데이트
        document.querySelectorAll('.slider-value')[0].textContent = '3';
        document.querySelectorAll('.slider-value')[1].textContent = '4';
        document.querySelectorAll('.slider-value')[2].textContent = '3';
        
        // 옵션 초기화
        document.getElementById('threshold-select').value = '85';
        document.getElementById('seasonal-toggle').checked = true;
        document.getElementById('staff-select').value = 'medium';
        
        // 안내 메시지
        showToast('설정이 초기화되었습니다.', 'info');
      });
    }
    
    // 초기 차트 생성
    createCleaningFrequencyChart();
    createCleaningCycleChart();
  }
  
  // 시뮬레이션 결과 업데이트
  function updateSimulationResults(ageWeight, usageWeight, envWeight, seasonal) {
    // 가중치에 따라 결과 값을 약간 변경 (실제 구현 시 더 정교한 계산 필요)
    const totalWeight = ageWeight + usageWeight + envWeight;
    const weightFactor = totalWeight / 10; // 기준점: 10
    
    const baseCleanings = 130;
    const totalCleanings = Math.round(baseCleanings * (1 + (weightFactor - 1) * 0.2));
    
    const baseCycle = 3;
    const avgCycle = (baseCycle * (1 - (weightFactor - 1) * 0.1)).toFixed(1);
    
    const baseSaving = 10000;
    const powerSaving = Math.round(baseSaving * (1 + (weightFactor - 1) * 0.3));
    
    const baseCostSaving = 2000000;
    const costSaving = Math.round(baseCostSaving * (1 + (weightFactor - 1) * 0.3));
    
    // 계절적 효과 반영
    const seasonalFactor = seasonal ? 1.1 : 1;
    
    // 값 표시 업데이트
    document.getElementById('total-cleanings').textContent = Math.round(totalCleanings * seasonalFactor);
    document.getElementById('avg-cycle').textContent = avgCycle + '개월';
    document.getElementById('power-saving').textContent = formatNumber(Math.round(powerSaving * seasonalFactor)) + ' kWh';
    document.getElementById('cost-saving').textContent = '₩' + formatNumber(Math.round(costSaving * seasonalFactor));
    
    // 차트 업데이트
    updateCleaningFrequencyChart(ageWeight, usageWeight, envWeight, seasonal);
    updateCleaningCycleChart(ageWeight, usageWeight, envWeight, seasonal);
  }
  
  // 세척 빈도 차트 생성
  function createCleaningFrequencyChart() {
    const ctx = document.getElementById('cleaningFrequencyChart');
    if (!ctx) return;
    
    const cleaningFrequencyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [{
          label: '월별 세척 건수',
          data: [8, 6, 10, 12, 14, 18, 22, 20, 15, 9, 8, 10],
          backgroundColor: '#64b5f6',
          borderColor: '#2980b9',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '오염도 (%)'
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          },
          annotation: {
            annotations: {
              threshold: {
                type: 'line',
                yMin: 85,
                yMax: 85,
                borderColor: '#f39c12',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: '임계값 (85%)',
                  enabled: true,
                  position: 'end'
                }
              },
              today: {
                type: 'line',
                xMin: 6,
                xMax: 6,
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 2,
                label: {
                  content: '현재',
                  enabled: true,
                  position: 'top'
                }
              }
            }
          }
        }
      }
    });
    
    // 차트 객체 저장
    window.cleaningFrequencyChart = cleaningFrequencyChart;
  }
  
  // 예측 차트 업데이트
  function updateForecastChart(unitId, metric, period) {
    const chart = window.forecastChart;
    if (!chart) return;
    
    // 실제 구현 시 API를 호출하여 선택한 유닛 및 메트릭에 대한 예측 데이터 가져와야 함
    // 여기서는 랜덤한 값으로 데이터를 변경
    
    const pastData = chart.data.datasets[0].data;
    const forecastData = chart.data.datasets[1].data;
    
    // 선택한 지표에 따라 기준값 변경
    let baseValue, yLabel;
    switch (metric) {
      case 'pollution':
        baseValue = 25;
        yLabel = '오염도 (%)';
        break;
      case 'efficiency':
        baseValue = 70;
        yLabel = '효율성 (%)';
        break;
      case 'power':
        baseValue = 500;
        yLabel = '전력 소비량 (kWh)';
        break;
      default:
        baseValue = 25;
        yLabel = '오염도 (%)';
    }
    
    // 선택한 유닛에 따라 변동 및 추세 조정
    let trendFactor;
    switch (unitId) {
      case 'AC-2023-0001':
        trendFactor = 0.5;
        break;
      case 'AC-2023-0002':
        trendFactor = 0.6;
        break;
      case 'AC-2023-0003':
        trendFactor = 0.7;
        break;
      case 'AC-2023-0008':
        trendFactor = 0.8;
        break;
      case 'AC-2023-0022':
        trendFactor = 0.9;
        break;
      default:
        trendFactor = 0.8;
    }
    
    // 과거 데이터 및 예측 데이터 갱신
    const newPastData = [];
    const newForecastData = [];
    const newUpperBound = [];
    const newLowerBound = [];
    
    // 날짜 범위 조정 (과거 90일 + 미래 period일)
    const dates = [];
    const today = new Date();
    
    for (let i = -90; i <= period; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(formatDate(date, 'MM-dd'));
    }
    
    // 과거 데이터 생성
    let currentValue = baseValue;
    for (let i = 0; i < 91; i++) {
      const noise = Math.random() * 6 - 3;
      const trend = i * trendFactor;
      
      currentValue = baseValue + trend + noise;
      if (metric === 'efficiency' && currentValue > 100) currentValue = 100;
      if (currentValue < 0) currentValue = 0;
      
      newPastData.push(currentValue);
      newForecastData.push(null);
      newUpperBound.push(null);
      newLowerBound.push(null);
    }
    
    // 미래 예측 데이터 생성
    const lastValue = newPastData[newPastData.length - 1];
    for (let i = 0; i < period + 1; i++) {
      const trend = i * trendFactor;
      
      const forecastValue = lastValue + trend;
      const uncertainty = 3 + (i * 0.2);
      
      if (i === 0) newPastData.push(lastValue);
      else newPastData.push(null);
      
      newForecastData.push(forecastValue);
      newUpperBound.push(forecastValue + uncertainty);
      newLowerBound.push(forecastValue - uncertainty);
    }
    
    // 차트 업데이트
    chart.data.labels = dates;
    chart.data.datasets[0].data = newPastData;
    chart.data.datasets[1].data = newForecastData;
    chart.data.datasets[2].data = newUpperBound;
    chart.data.datasets[3].data = newLowerBound;
    
    // y축 레이블 업데이트
    chart.options.scales.y.title.text = yLabel;
    
    // 임계값 라인 조정 (효율성의 경우 방향 반대)
    let thresholdValue;
    if (metric === 'efficiency') {
      thresholdValue = 60; // 효율성은 낮을 때 위험
    } else if (metric === 'power') {
      thresholdValue = 800; // 전력 소비량은 높을 때 위험
    } else {
      thresholdValue = 85; // 오염도는 높을 때 위험
    }
    
    // 실제 구현 시 아래 코드를 사용해 임계값 라인 업데이트
    // chart.options.plugins.annotation.annotations.threshold.yMin = thresholdValue;
    // chart.options.plugins.annotation.annotations.threshold.yMax = thresholdValue;
    
    // "현재" 라인 위치 업데이트
    // chart.options.plugins.annotation.annotations.today.xMin = dates[90];
    // chart.options.plugins.annotation.annotations.today.xMax = dates[90];
    
    chart.update();
    
    // 예측 통계 업데이트
    updateForecastStats(metric, unitId);
  }
  
  // 예측 통계 업데이트
  function updateForecastStats(metric, unitId) {
    // 임계값 도달 예상일 계산 (실제 구현 시에는 차트 데이터 기반으로 계산)
    const today = new Date();
    let daysToThreshold;
    
    // 선택한 지표 및 유닛에 따라 예상 일수 조정
    switch (metric) {
      case 'pollution':
        daysToThreshold = 45 + Math.floor(Math.random() * 10); // 오염도
        break;
      case 'efficiency':
        daysToThreshold = 30 + Math.floor(Math.random() * 15); // 효율성
        break;
      case 'power':
        daysToThreshold = 20 + Math.floor(Math.random() * 20); // 전력 소비량
        break;
      default:
        daysToThreshold = 45;
    }
    
    // 유닛 ID에 따라 약간의 변동 추가
    if (unitId === 'AC-2023-0008') {
      daysToThreshold -= 10; // 위험도 높은 유닛
    } else if (unitId === 'AC-2023-0001') {
      daysToThreshold += 5; // 위험도 낮은 유닛
    }
    
    // 임계값 도달 예상일 표시
    const thresholdDate = new Date(today);
    thresholdDate.setDate(thresholdDate.getDate() + daysToThreshold);
    
    document.querySelector('.threshold-date').textContent = formatDate(thresholdDate);
    
    // 신뢰 구간 및 기타 정보 업데이트
    document.querySelector('.confidence-interval').textContent = '±' + (5 + Math.floor(Math.random() * 5)) + '일';
    document.querySelector('.prediction-model').textContent = metric === 'power' ? 'Prophet' : 'ARIMA(2,1,1)';
    document.querySelector('.prediction-accuracy').textContent = (80 + Math.floor(Math.random() * 10)) + '%';
  }
  
  // 계절적 패턴 차트 생성
  function createSeasonalChart() {
    const ctx = document.getElementById('seasonalChart');
    if (!ctx) return;
    
    const seasonalChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [
          {
            label: '오염도 증가율',
            data: [0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 1.7, 1.4, 1.0, 0.7, 0.6],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            fill: true
          },
          {
            label: '사용량',
            data: [0.8, 0.7, 0.9, 1.0, 1.1, 1.4, 1.7, 1.6, 1.2, 1.0, 0.9, 0.8],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: '상대 수치 (1.0 = 평균)'
            }
          }
        }
      }
    });
    
    window.seasonalChart = seasonalChart;
  }
  
  // 캘린더 뷰 초기화
  function initCalendarViews() {
    const calendarTab = document.querySelector('.tab-content[data-tab="cleaning-schedule"]');
    if (!calendarTab) return;
    
    // 뷰 전환 버튼
    const calendarViewBtn = calendarTab.querySelector('.calendar-view-btn');
    const listViewBtn = calendarTab.querySelector('.list-view-btn');
    const calendarView = calendarTab.querySelector('.calendar-view');
    const listView = calendarTab.querySelector('.list-view');
    
    if (calendarViewBtn && listViewBtn && calendarView && listView) {
      calendarViewBtn.addEventListener('click', function() {
        calendarViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        calendarView.classList.add('active');
        listView.classList.remove('active');
      });
      
      listViewBtn.addEventListener('click', function() {
        listViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
        listView.classList.add('active');
        calendarView.classList.remove('active');
      });
    }
    
    // 월 이동 버튼
    const prevMonthBtn = calendarTab.querySelector('.prev-month-btn');
    const nextMonthBtn = calendarTab.querySelector('.next-month-btn');
    const currentMonthLabel = calendarTab.querySelector('.current-month');
    
    if (prevMonthBtn && nextMonthBtn && currentMonthLabel) {
      // 현재 표시 중인 날짜 (기본: 현재 월)
      let currentDate = new Date();
      
      // 월 이동 함수
      function updateCalendarMonth(date) {
        currentMonthLabel.textContent = date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월';
        
        // 실제 구현 시 캘린더 데이터 업데이트 필요
        // 지금은 데모용으로 토스트 메시지만 표시
        showToast(currentMonthLabel.textContent + ' 데이터가 로드되었습니다.', 'info');
      }
      
      // 초기 월 표시
      updateCalendarMonth(currentDate);
      
      // 이전 월 버튼
      prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendarMonth(currentDate);
      });
      
      // 다음 월 버튼
      nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendarMonth(currentDate);
      });
    }
    
    // 세척 이벤트 클릭 이벤트
    const events = calendarTab.querySelectorAll('.event');
    
    events.forEach(event => {
      event.addEventListener('click', function() {
        const unitId = this.getAttribute('data-unit');
        const date = this.closest('.date-cell').querySelector('.date-number').textContent;
        const month = currentMonthLabel?.textContent.split('월')[0] || '4월';
        
        // 상세 정보 표시
        showToast(`${month} ${date}일 - ${unitId} 세척 일정 상세 정보`, 'info');
      });
    });
  }
  
  // 세척 일정 모달 초기화
  function initScheduleModals() {
    const scheduleTab = document.querySelector('.tab-content[data-tab="cleaning-schedule"]');
    if (!scheduleTab) return;
    
    // 일정 추가 버튼
    const addScheduleBtn = scheduleTab.querySelector('.btn-primary');
    
    if (addScheduleBtn) {
      addScheduleBtn.addEventListener('click', function() {
        openModal('add-schedule-modal');
      });
    }
    
    // 모달의 저장 버튼
    const saveBtn = document.querySelector('#add-schedule-modal .btn-primary');
    
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        // 입력 값 가져오기
        const unitSelect = document.querySelector('#add-schedule-modal .form-group:nth-child(1) .form-control');
        const dateInput = document.querySelector('#add-schedule-modal .form-group:nth-child(2) .form-control');
        const staffSelect = document.querySelector('#add-schedule-modal .form-group:nth-child(3) .form-control');
        
        if (!unitSelect.value || !dateInput.value || !staffSelect.value) {
          showToast('모든 필수 항목을 입력해주세요.', 'warning');
          return;
        }
        
        // 실제 구현 시 API를 호출하여 일정 저장
        closeModal('add-schedule-modal');
        showToast('세척 일정이 추가되었습니다.', 'success');
        
        // 필요하다면 캘린더 및 리스트 뷰 업데이트
      });
    }
  }
  
  // 숫자 포맷 함수
  function formatNumber(number) {
    return new Intl.NumberFormat('ko-KR').format(number);
  }
  
  // 날짜 포맷 함수
  function formatDate(date, format = 'yyyy-MM-dd') {
    const d = new Date(date);
    
    const map = {
      yyyy: d.getFullYear(),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      dd: String(d.getDate()).padStart(2, '0')
    };
    
    return format.replace(/yyyy|MM|dd/g, matched => map[matched]);
  }
  
  // 세척 빈도 차트 업데이트
  function updateCleaningFrequencyChart(ageWeight, usageWeight, envWeight, seasonal) {
    const chart = window.cleaningFrequencyChart;
    if (!chart) return;
    
    // 가중치를 기반으로 새 데이터 생성
    const baseData = [8, 6, 10, 12, 14, 18, 22, 20, 15, 9, 8, 10];
    const newData = baseData.map(value => {
      // 가중치 영향 계산
      const weightEffect = (ageWeight / 3 * 0.3) + (usageWeight / 3 * 0.5) + (envWeight / 3 * 0.2);
      let newValue = Math.round(value * weightEffect);
      
      // 계절적 요인 적용
      if (seasonal) {
        // 여름철(6~8월) 더 많은 세척
        const monthIndex = baseData.indexOf(value);
        if (monthIndex >= 5 && monthIndex <= 7) {
          newValue = Math.round(newValue * 1.2);
        }
      }
      
      return newValue;
    });
    
    // 차트 업데이트
    chart.data.datasets[0].data = newData;
    chart.update();
  }
  
  // 세척 주기 차트 생성
  function createCleaningCycleChart() {
    const ctx = document.getElementById('cleaningCycleChart');
    if (!ctx) return;
    
    const cleaningCycleChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: ['회의실', '사무실', '로비', '구내식당', '접견실', '임원실', '휴게실'],
        datasets: [{
          label: '최적 세척 주기(월)',
          data: [2.5, 3, 2, 1.5, 4, 3.5, 5],
          backgroundColor: '#4ba3c3',
          borderColor: '#1c4966',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    
    // 차트 객체 저장
    window.cleaningCycleChart = cleaningCycleChart;
  }
  
  // 세척 주기 차트 업데이트
  function updateCleaningCycleChart(ageWeight, usageWeight, envWeight, seasonal) {
    const chart = window.cleaningCycleChart;
    if (!chart) return;
    
    // 가중치를 기반으로 새 데이터 생성
    const baseData = [2.5, 3, 2, 1.5, 4, 3.5, 5];
    const newData = baseData.map(value => {
      // 가중치 영향 계산 (높은 가중치 = 짧은 주기)
      const weightEffect = 1 / ((ageWeight / 3 * 0.3) + (usageWeight / 3 * 0.5) + (envWeight / 3 * 0.2));
      let newValue = value * weightEffect;
      
      // 계절적 요인 적용
      if (seasonal) {
        // 여름철에는 주기 단축
        newValue = newValue * 0.9;
      }
      
      return parseFloat(newValue.toFixed(1));
    });
    
    // 차트 업데이트
    chart.data.datasets[0].data = newData;
    chart.update();
  }
  
  // 예측 차트 초기화
  function initForecastCharts() {
    const forecastTab = document.querySelector('.tab-content[data-tab="time-series"]');
    if (!forecastTab) return;
    
    // 단위 변경 이벤트
    const unitSelect = forecastTab.querySelector('.unit-select');
    const metricSelect = forecastTab.querySelector('.metric-select');
    const periodSelect = forecastTab.querySelector('.period-select');
    
    // 셀렉트 박스 변경 이벤트
    if (unitSelect && metricSelect && periodSelect) {
      [unitSelect, metricSelect, periodSelect].forEach(select => {
        select.addEventListener('change', function() {
          updateForecastChart(
            unitSelect.value, 
            metricSelect.value, 
            parseInt(periodSelect.value)
          );
        });
      });
    }
    
    // 초기 차트 생성
    createForecastChart();
    createSeasonalChart();
  }
  
  // 예측 차트 생성
  function createForecastChart() {
    const ctx = document.getElementById('forecastChart');
    if (!ctx) return;
    
    // 날짜 범위 생성 (과거 90일 + 미래 90일)
    const dates = [];
    const today = new Date();
    
    for (let i = -90; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(formatDate(date, 'MM-dd'));
    }
    
    // 과거 데이터 및 예측 데이터 생성
    const pastData = [];
    const forecastData = [];
    const upperBound = [];
    const lowerBound = [];
    
    const initialValue = 25; // 시작 값
    let currentValue = initialValue;
    
    // 과거 데이터 생성 (약간의 변동과 상승 추세)
    for (let i = 0; i < 91; i++) {
      const noise = Math.random() * 6 - 3; // -3 ~ +3 사이의 노이즈
      const trend = i * 0.7; // 상승 추세
      
      currentValue = initialValue + trend + noise;
      if (currentValue < 0) currentValue = 0;
      
      pastData.push(currentValue);
      forecastData.push(null); // 과거 부분은 예측 데이터 null
      upperBound.push(null);
      lowerBound.push(null);
    }
    
    // 미래 예측 데이터 생성
    const lastValue = pastData[pastData.length - 1];
    for (let i = 0; i < 91; i++) {
      const trend = i * 0.8; // 예측 기간 동안의 상승 추세
      
      const forecastValue = lastValue + trend;
      const uncertainty = 3 + (i * 0.2); // 시간이 지날수록 불확실성 증가
      
      // 예측 기간에는 과거 데이터 null
      if (i === 0) pastData.push(lastValue);
      else pastData.push(null);
      
      forecastData.push(forecastValue);
      upperBound.push(forecastValue + uncertainty);
      lowerBound.push(forecastValue - uncertainty);
    }
    
    // 차트 생성
    const forecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '실제 오염도',
            data: pastData,
            borderColor: '#2980b9',
            backgroundColor: 'rgba(41, 128, 185, 0.1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 3
          },
          {
            label: '예측 오염도',
            data: forecastData,
            borderColor: '#e74c3c',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 3
          },
          {
            label: '상한 신뢰구간',
            data: upperBound,
            borderColor: 'rgba(231, 76, 60, 0.3)',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 1,
            fill: '+1', // 하한 경계와의 사이를 채움
            pointRadius: 0,
            pointHoverRadius: 0
          },
          {
            label: '하한 신뢰구간',
            data: lowerBound,
            borderColor: 'rgba(231, 76, 60, 0.3)',
            borderWidth: 1,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 12
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '오염도 (%)'
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          },
          annotation: {
            annotations: {
              threshold: {
                type: 'line',
                yMin: 85,
                yMax: 85,
                borderColor: '#f39c12',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: '임계값 (85%)',
                  enabled: true,
                  position: 'end'
                }
              },
              today: {
                type: 'line',
                xMin: 6,
                xMax: 6,
                borderColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 2,
                label: {
                  content: '현재',
                  enabled: true,
                  position: 'top'
                }
              }
            }
          }
        }
      }
    });
    
    // 차트 객체 저장
    window.forecastChart = forecastChart;
  }