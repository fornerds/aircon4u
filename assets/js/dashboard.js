// dashboard.js - Aircon4u 대시보드 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수 호출
    initMiniCharts();
    initEnthalpyChart();
    simulateSensorData();
    initToastDemo();
    
    // BLE 연결 시뮬레이션
    setTimeout(simulateBleConnection, 2000);
  });
  
  // 미니 차트 초기화
  function initMiniCharts() {
    // 미니 차트 데이터 (임시, 나중에 API로 대체)
    const miniChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
          beginAtZero: false,
        }
      },
      elements: {
        line: {
          tension: 0.3,
          borderWidth: 2,
        },
        point: {
          radius: 0,
        }
      },
    };
  
    // 차트 1: 흡입 온도
    new Chart(document.querySelector('.mini-chart-1'), {
      type: 'line',
      data: {
        labels: Array.from({length: 12}, (_, i) => i + 1),
        datasets: [{
          data: [23.2, 23.5, 23.8, 24.0, 24.3, 24.5, 24.6, 24.7, 24.5, 24.3, 24.2, 24.5],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
        }]
      },
      options: miniChartOptions
    });
  
    // 차트 2: 흡입 습도
    new Chart(document.querySelector('.mini-chart-2'), {
      type: 'line',
      data: {
        labels: Array.from({length: 12}, (_, i) => i + 1),
        datasets: [{
          data: [40, 42, 43, 45, 47, 46, 45, 44, 45, 46, 45, 45],
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          fill: true,
        }]
      },
      options: miniChartOptions
    });
  
    // 차트 3: 흡입 풍속
    new Chart(document.querySelector('.mini-chart-3'), {
      type: 'line',
      data: {
        labels: Array.from({length: 12}, (_, i) => i + 1),
        datasets: [{
          data: [3.0, 3.2, 3.3, 3.1, 3.2, 3.4, 3.2, 3.1, 3.0, 3.2, 3.3, 3.2],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
        }]
      },
      options: miniChartOptions
    });
  
    // 차트 4: 흡입 PM2.5
    new Chart(document.querySelector('.mini-chart-4'), {
      type: 'line',
      data: {
        labels: Array.from({length: 12}, (_, i) => i + 1),
        datasets: [{
          data: [15, 16, 18, 19, 17, 18, 19, 20, 18, 17, 18, 18],
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          fill: true,
        }]
      },
      options: miniChartOptions
    });
  
    // 차트 5: 토출 온도
    new Chart(document.querySelector('.mini-chart-5'), {
      type: 'line',
      data: {
        labels: Array.from({length: 12}, (_, i) => i + 1),
        datasets: [{
          data: [15.0, 14.8, 14.5, 14.3, 14.0, 14.2, 14.5, 14.7, 14.4, 14.2, 14.0, 14.2],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
        }]
      },
      options: miniChartOptions
    });
  
    // 차트 6: 토출 습도
    new Chart(document.querySelector('.mini-chart-6'), {
      type: 'line',
      data: {
        labels: Array.from({length: 12}, (_, i) => i + 1),
        datasets: [{
          data: [60, 61, 63, 62, 60, 61, 63, 65, 64, 62, 60, 62],
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          fill: true,
        }]
      },
      options: miniChartOptions
    });
  }
  
  // 엔탈피 차트 초기화
  function initEnthalpyChart() {
    // 날짜 범위 생성 (30일치)
    const dates = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(formatDate(date, 'MM-dd'));
    }
  
    // 샘플 데이터 생성
    const inletData = [];
    const outletData = [];
    const differenceData = [];
  
    let inletBase = 40; // 흡입부 엔탈피 기준값 (kJ/kg)
    let outletBase = 30; // 토출부 엔탈피 기준값 (kJ/kg)
  
    for (let i = 0; i < 30; i++) {
      // 약간의 변동을 주어 데이터 생성
      const inletVariation = Math.random() * 3 - 1.5;
      const outletVariation = Math.random() * 2 - 1;
      
      // 점진적으로 변화하는 패턴 추가
      const dayEffect = Math.sin(i / 5) * 2;
      
      const inletValue = inletBase + inletVariation + dayEffect;
      const outletValue = outletBase + outletVariation + dayEffect * 0.7;
      
      inletData.push(inletValue);
      outletData.push(outletValue);
      differenceData.push(inletValue - outletValue);
    }
  
    // 엔탈피 차트 생성
    const enthalpyChartCtx = document.getElementById('enthalpyChart');
    if (!enthalpyChartCtx) return;
    
    const enthalpyChart = new Chart(enthalpyChartCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '흡입부 엔탈피 (kJ/kg)',
            data: inletData,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            fill: false,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 4,
          },
          {
            label: '토출부 엔탈피 (kJ/kg)',
            data: outletData,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            fill: false,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 4,
          },
          {
            label: '엔탈피 차이 (kJ/kg)',
            data: differenceData,
            borderColor: '#f39c12',
            backgroundColor: 'rgba(243, 156, 18, 0.1)',
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            position: 'nearest',
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.raw.toFixed(1);
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  
    // 시간 범위 토글 버튼 이벤트 리스너
    const timeRangeButtons = document.querySelectorAll('.time-range-btn');
    if (timeRangeButtons) {
      timeRangeButtons.forEach(button => {
        button.addEventListener('click', function() {
          // 현재 활성화된 버튼 비활성화
          document.querySelector('.time-range-btn.active').classList.remove('active');
          // 클릭한 버튼 활성화
          this.classList.add('active');
          
          // 버튼 텍스트에 따라 차트 데이터 업데이트
          let newDates = [];
          let range = 30; // 기본값은 30일(월)
          
          if (this.textContent === '일') {
            range = 24; // 24시간
            // 시간별 날짜 생성
            const now = new Date();
            for (let i = range - 1; i >= 0; i--) {
              const hour = new Date(now);
              hour.setHours(hour.getHours() - i);
              newDates.push(formatDate(hour, 'HH:mm'));
            }
          } else if (this.textContent === '주') {
            range = 7; // 7일
            // 주간 날짜 생성
            const now = new Date();
            for (let i = range - 1; i >= 0; i--) {
              const date = new Date(now);
              date.setDate(date.getDate() - i);
              newDates.push(formatDate(date, 'MM-dd'));
            }
          } else { // 월
            // 월간 날짜 생성 (이미 위에서 생성된 dates 사용)
            newDates = [...dates];
          }
          
          // 새로운 데이터 생성
          const newInletData = [];
          const newOutletData = [];
          const newDifferenceData = [];
          
          for (let i = 0; i < range; i++) {
            // 시간대에 따라 변화하는 패턴 생성
            const timeEffect = Math.sin(i / (range / 6)) * 3;
            
            const inletVariation = Math.random() * 3 - 1.5;
            const outletVariation = Math.random() * 2 - 1;
            
            const inletValue = inletBase + inletVariation + timeEffect;
            const outletValue = outletBase + outletVariation + timeEffect * 0.7;
            
            newInletData.push(inletValue);
            newOutletData.push(outletValue);
            newDifferenceData.push(inletValue - outletValue);
          }
          
          // 차트 데이터 업데이트
          enthalpyChart.data.labels = newDates;
          enthalpyChart.data.datasets[0].data = newInletData;
          enthalpyChart.data.datasets[1].data = newOutletData;
          enthalpyChart.data.datasets[2].data = newDifferenceData;
          enthalpyChart.update();
        });
      });
    }
  }
  
  // 실시간 센서 데이터 시뮬레이션
  function simulateSensorData() {
    // 센서 값 요소들 가져오기
    const sensorValues = document.querySelectorAll('.sensor-value');
    if (!sensorValues.length) return;
    
    // 초기값
    const initialValues = [
      { value: 24.5, unit: '°C', min: 24.0, max: 25.0, step: 0.1 },     // 흡입 온도
      { value: 45, unit: '%', min: 42, max: 48, step: 1 },              // 흡입 습도
      { value: 3.2, unit: ' m/s', min: 3.0, max: 3.5, step: 0.1 },      // 흡입 풍속
      { value: 18, unit: ' μg/m³', min: 16, max: 20, step: 1 },         // 흡입 PM2.5
      { value: 14.2, unit: '°C', min: 13.5, max: 14.5, step: 0.1 },     // 토출 온도
      { value: 62, unit: '%', min: 60, max: 65, step: 1 }               // 토출 습도
    ];
    
    // 10초마다 값을 업데이트하는 함수
    function updateSensorValues() {
      sensorValues.forEach((element, index) => {
        if (index < initialValues.length) {
          const config = initialValues[index];
          
          // 랜덤하게 값이 올라가거나 내려가게 함
          const direction = Math.random() > 0.5 ? 1 : -1;
          const change = direction * config.step;
          
          // 새 값 계산
          config.value += change;
          
          // 최소/최대 범위 내로 제한
          if (config.value < config.min) config.value = config.min;
          if (config.value > config.max) config.value = config.max;
          
          // 화면에 표시 (소수점 1자리까지)
          const formattedValue = Number.isInteger(config.value) ? 
            config.value : config.value.toFixed(1);
          element.textContent = formattedValue + config.unit;
        }
      });
      
      // 다음 업데이트 예약
      setTimeout(updateSensorValues, 10000);
    }
    
    // 최초 실행
    setTimeout(updateSensorValues, 10000);
  }
  
  // 토스트 메시지 데모
  function initToastDemo() {
    // 세척 예약 버튼에 이벤트 리스너 추가
    const cleaningButtons = document.querySelectorAll('.cleaning-alerts-card .btn-primary');
    
    if (cleaningButtons) {
      cleaningButtons.forEach(button => {
        button.addEventListener('click', function(event) {
          // 가장 가까운 행 찾기
          const row = this.closest('tr');
          const unitId = row.cells[0].textContent;
          
          // 토스트 메시지 표시
          showToast(`${unitId} 유닛 세척이 예약되었습니다.`, 'success');
          
          // 버튼 상태 변경
          this.textContent = '예약됨';
          this.disabled = true;
          this.classList.remove('btn-primary');
          this.classList.add('btn-secondary');
        });
      });
    }
    
    // 리포트 다운로드 버튼에 이벤트 리스너 추가
    const downloadButtons = document.querySelectorAll('.report-actions .btn-outline:last-child');
    
    if (downloadButtons) {
      downloadButtons.forEach(button => {
        button.addEventListener('click', function(event) {
          // 가장 가까운 리포트 아이템 찾기
          const reportItem = this.closest('.report-item');
          const reportTitle = reportItem.querySelector('.report-title').textContent;
          
          // 토스트 메시지 표시
          showToast(`'${reportTitle}' 다운로드가 시작되었습니다.`, 'info');
        });
      });
    }
  }