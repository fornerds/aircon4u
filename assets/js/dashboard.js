// dashboard.js - Aircon4u dashboard script

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded. Initializing charts...');
  
  // 먼저 차트가 로드되었는지 확인
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded yet. Cannot initialize chart.');
    displayChartInitializationError('차트 라이브러리 로드 실패', 'Chart.js 라이브러리를 로드할 수 없습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요.');
    return;
  }
  
  // 플러그인 로딩 및 차트 초기화 시도
  tryInitializeChart();
});

// 차트 초기화 시도 함수
function tryInitializeChart() {
  // 플러그인 존재 여부 확인
  if (typeof window.ChartAnnotation !== 'undefined' || typeof ChartAnnotation !== 'undefined') {
    // 플러그인이 로드되었으면 바로 등록
    console.log('ChartAnnotation plugin found, initializing chart...');
    
    // ChartAnnotation이 window 객체에 없지만 전역으로 있는 경우 등록
    if (typeof window.ChartAnnotation === 'undefined' && typeof ChartAnnotation !== 'undefined') {
      window.ChartAnnotation = ChartAnnotation;
    }
    
    // 플러그인 등록
    if (window.ChartAnnotation) {
      Chart.register(window.ChartAnnotation);
    }
    
    // 차트 초기화
    initPollutionChart();
  } else {
    // 플러그인에 대한 참조가 없는 경우 수동으로 등록 시도
    console.warn('ChartAnnotation plugin not found. Attempting to register from ChartJS plugins...');
    
    // Chart.registry에 접근 가능한지 확인
    if (Chart && Chart.registry && Chart.registry.plugins) {
      const annotationPlugin = Chart.registry.plugins.get('annotation');
      if (annotationPlugin) {
        window.ChartAnnotation = annotationPlugin;
        console.log('Found annotation plugin in Chart registry, registering...');
      }
    }
    
    // 차트 초기화 (어노테이션 상태와 관계없이 진행)
    initPollutionChart();
  }
}

// Helper function to display errors on the chart canvas area
function displayChartInitializationError(title, message = '차트 초기화 중 오류가 발생했습니다.') {
  const pollutionChartCanvas = document.getElementById('enthalpyChart');
  if (pollutionChartCanvas && pollutionChartCanvas.parentElement) {
    const container = pollutionChartCanvas.parentElement;
    pollutionChartCanvas.style.display = 'none';
    
    // Remove any existing error message
    const existingError = container.querySelector('.chart-error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'chart-error-message';
    errorDiv.style.padding = '20px';
    errorDiv.style.textAlign = 'center';
    errorDiv.innerHTML = `
      <p><strong>${title}</strong></p>
      <p>${message}</p>
      <button class="btn btn-sm btn-primary" id="retry-chart-btn" style="margin-top: 10px;">다시 시도</button>
    `;
    container.appendChild(errorDiv);
    
    // 다시 시도 버튼 이벤트 등록
    const retryButton = document.getElementById('retry-chart-btn');
    if (retryButton) {
      retryButton.addEventListener('click', function() {
        // 에러 메시지 제거
        errorDiv.remove();
        // 캔버스 다시 보이게
        pollutionChartCanvas.style.display = 'block';
        // 차트 초기화 재시도
        tryInitializeChart();
      });
    }
  }
}

// Date formatting function
function formatDate(date, format) {
  const year = date.getFullYear().toString().slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  
  if (format === 'MM-dd') {
    return `${month}-${day}`;
  } else if (format === 'yy-MM') {
    return `${year}-${month}`;
  } else {
    return `${year}-${month}-${day}`;
  }
}

// Pollution chart initialization
function initPollutionChart() {
  console.log('Initializing pollution chart...');
  
  // Get chart canvas
  const pollutionChartCtx = document.getElementById('enthalpyChart');
  if (!pollutionChartCtx) {
    console.error('enthalpyChart element not found. Check if canvas#enthalpyChart exists in HTML.');
    displayChartInitializationError('차트 요소 없음', '차트를 표시할 HTML 요소를 찾을 수 없습니다.');
    return;
  }
  
  // Generate date range (30 days)
  const dates = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date, 'MM-dd'));
  }

  // Cleaning dates (set arbitrarily - 10 days ago, 20 days ago)
  const cleaningDates = [10, 20];
  
  // Generate pollution data - pattern starts low after cleaning and gradually increases
  const pollutionData = [];
  
  // Initial pollution value (start around 60%)
  let currentPollution = 60 + (Math.random() * 10);
  
  // Generate pollution data for 30 days
  for (let i = 0; i < 30; i++) {
    // If it's a cleaning day, pollution drops significantly (to around 20%)
    if (cleaningDates.includes(30 - i - 1)) { // Reflect cleaning effect on next day
      currentPollution = 20 + (Math.random() * 5);
    } else {
      // Pollution increases slightly each day (0.5~1.5%)
      currentPollution += 0.5 + (Math.random() * 1.0);
      
      // Add slight variation (-1~1%)
      currentPollution += (Math.random() * 2 - 1);
      
      // Limit to max 80%
      currentPollution = Math.min(80, currentPollution);
    }
    
    // Limit to min 20%
    currentPollution = Math.max(20, currentPollution);
    
    // Round to one decimal place
    pollutionData.push(Math.round(currentPollution * 10) / 10);
  }

  // Check canvas size before creating chart
  if (pollutionChartCtx.clientWidth === 0 || pollutionChartCtx.clientHeight === 0) {
    console.warn('Chart canvas size is 0. Setting default size...');
    pollutionChartCtx.style.height = '300px';
    pollutionChartCtx.style.width = '100%';
  }

  try {
    // 어노테이션 플러그인 사용 여부 확인
    const hasAnnotationPlugin = 
      typeof window.ChartAnnotation !== 'undefined' || 
      (typeof Chart !== 'undefined' && 
       typeof Chart.Annotation !== 'undefined');
    
    // Chart options
    const chartOptions = {
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
              return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '날짜'
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: '오염도 (%)'
          },
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      }
    };
    
    // 어노테이션 추가 - 항상 시도
    console.log('Adding annotations to chart...');
    const annotationsObj = {};
    
    // 세척 날짜에 세로 점선 추가
    cleaningDates.forEach((day, index) => {
      const dateIndex = 30 - day - 1;
      if (dateIndex >= 0 && dateIndex < dates.length) {
        annotationsObj[`cleaning-${index}`] = {
          type: 'line',
          xMin: dates[dateIndex],
          xMax: dates[dateIndex],
          borderColor: 'rgba(255, 0, 0, 0.8)',
          borderWidth: 2,
          borderDash: [5, 5],
          label: {
            display: true,
            content: '세척일',
            position: 'top',
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            font: {
              size: 10
            }
          }
        };
      }
    });
    
    // 어노테이션 플러그인 설정 추가
    chartOptions.plugins.annotation = {
      annotations: annotationsObj
    };
    
    // 필요한 경우 플러그인 직접 추가
    if (!hasAnnotationPlugin) {
      console.warn('ChartAnnotation plugin might not be available, annotations may not appear correctly.');
    }
    
    // Create chart
    const pollutionChart = new Chart(pollutionChartCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '오염도(%)',
            data: pollutionData,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            fill: true,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 4,
          }
        ]
      },
      options: chartOptions
    });
    
    console.log('Pollution chart created successfully.');
    
  } catch (error) {
    console.error('Error creating pollution chart:', error);
    displayChartInitializationError('차트 생성 오류', `차트를 생성하는 중 오류가 발생했습니다: ${error.message}`);
  }
}

 