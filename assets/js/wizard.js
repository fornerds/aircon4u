// wizard.js - Aircon4u 세척 마법사 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 초기화 함수 호출
    initWizardNavigation();
    initUnitInfo();
    initSensorConnection();
    initMeasurementProcess();
    initChecklistHandlers();
    initReportHandlers();
    
    // BLE 연결 시뮬레이션
    setTimeout(simulateBleConnection, 1000);
  });
  
  // 마법사 네비게이션 초기화
  function initWizardNavigation() {
    const nextButtons = document.querySelectorAll('.next-step-btn');
    const prevButtons = document.querySelectorAll('.prev-step-btn');
    const completeButton = document.querySelector('.complete-btn');
    
    // 다음 단계 버튼
    if (nextButtons) {
      nextButtons.forEach(button => {
        button.addEventListener('click', function() {
          const currentPanel = button.closest('.wizard-panel');
          const currentStep = parseInt(currentPanel.getAttribute('data-step'));
          const nextStep = currentStep + 1;
          
          // 다음 단계로 이동
          goToStep(nextStep);
        });
      });
    }
    
    // 이전 단계 버튼
    if (prevButtons) {
      prevButtons.forEach(button => {
        button.addEventListener('click', function() {
          const currentPanel = button.closest('.wizard-panel');
          const currentStep = parseInt(currentPanel.getAttribute('data-step'));
          const prevStep = currentStep - 1;
          
          if (prevStep >= 1) {
            // 이전 단계로 이동
            goToStep(prevStep);
          }
        });
      });
    }
    
    // 완료 버튼
    if (completeButton) {
      completeButton.addEventListener('click', function() {
        // 완료 모달 표시
        openModal('complete-modal');
      });
    }
    
    // 단계 이동 함수
    function goToStep(step) {
      // 모든 패널 비활성화
      const panels = document.querySelectorAll('.wizard-panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      // 지정된 패널 활성화
      const targetPanel = document.querySelector(`.wizard-panel[data-step="${step}"]`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // 단계 표시 업데이트
      updateStepIndicators(step);
    }
    
    // 단계 표시 업데이트 함수
    function updateStepIndicators(activeStep) {
      const steps = document.querySelectorAll('.wizard-step');
      
      steps.forEach(step => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        
        step.classList.remove('active', 'completed');
        
        if (stepNumber === activeStep) {
          step.classList.add('active');
        } else if (stepNumber < activeStep) {
          step.classList.add('completed');
        }
      });
    }
  }
  
  // 유닛 정보 초기화
  function initUnitInfo() {
    // 세션 스토리지에서 선택된 유닛 ID 가져오기
    const selectedUnit = sessionStorage.getItem('selectedUnit');
    
    if (selectedUnit) {
      document.querySelector('.unit-id').textContent = selectedUnit;
      
      // 실제 구현 시에는 API로 유닛 정보 가져와서 표시
      // 지금은 예시 데이터로 대체
      if (selectedUnit === 'AC-2023-0008') {
        document.querySelector('.unit-name').textContent = '소회의실 B';
        document.querySelector('.unit-location').textContent = '(B동 3층 소회의실)';
      }
    } else {
      // 유닛이 선택되지 않은 경우 기본 유닛 설정
      const defaultUnit = 'AC-2023-0008';
      sessionStorage.setItem('selectedUnit', defaultUnit);
      document.querySelector('.unit-id').textContent = defaultUnit;
      document.querySelector('.unit-name').textContent = '소회의실 B';
      document.querySelector('.unit-location').textContent = '(B동 3층 소회의실)';
    }
  }
  
  // 센서 연결 상태 초기화
  function initSensorConnection() {
    const refreshButtons = document.querySelectorAll('.refresh-btn');
    
    if (refreshButtons) {
      refreshButtons.forEach(button => {
        button.addEventListener('click', function() {
          refreshSensorStatus();
        });
      });
    }
    
    // 센서 상태 새로고침 함수
    function refreshSensorStatus() {
      // 실제 구현 시에는 BLE 연결 상태 확인 및 업데이트
      // 지금은 시뮬레이션
      
      const sensorStatuses = document.querySelectorAll('.connection-status');
      
      if (sensorStatuses.length) {
        // 랜덤하게 센서 연결 상태 변경 (데모용)
        sensorStatuses.forEach(status => {
          const isConnected = Math.random() > 0.2;
          
          status.classList.remove('connected', 'disconnected');
          if (isConnected) {
            status.classList.add('connected');
            status.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              연결됨
            `;
          } else {
            status.classList.add('disconnected');
            status.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              연결 안됨
            `;
          }
        });
        
        // 연결 상태 업데이트 후 메시지 표시
        showToast('센서 연결 상태가 업데이트되었습니다.', 'info');
      }
    }
  }
  
  // 측정 프로세스 초기화
  function initMeasurementProcess() {
    const startButtons = document.querySelectorAll('.start-measurement-btn');
    const nextButtons = document.querySelectorAll('.next-step-btn');
    
    if (startButtons) {
      startButtons.forEach(button => {
        button.addEventListener('click', function() {
          const panel = button.closest('.wizard-panel');
          const step = parseInt(panel.getAttribute('data-step'));
          
          // 측정 시작 버튼 비활성화
          button.disabled = true;
          button.classList.add('btn-secondary');
          button.classList.remove('btn-primary');
          
          // 상태 변경
          const statusElement = panel.querySelector('.measurement-status');
          if (statusElement) {
            statusElement.textContent = '측정 중...';
            statusElement.classList.add('measuring');
          }
          
          // 타이머 시작
          startMeasurementTimer(panel, 10, function() {
            // 타이머 완료 후 실행되는 콜백
            
            // 측정 데이터 표시
            displayMeasurementData(panel, step);
            
            // 버튼 상태 변경
            button.textContent = '측정 완료';
            button.disabled = true;
            
            // 상태 변경
            if (statusElement) {
              statusElement.textContent = '완료됨';
              statusElement.classList.remove('measuring');
              statusElement.classList.add('completed');
            }
            
            // 세척 후 측정인 경우 (3단계), 비교 결과도 표시
            if (step === 3) {
              displayComparisonResults(panel);
            }
            
            // 다음 단계 버튼 활성화
            const nextButton = panel.querySelector('.next-step-btn');
            if (nextButton) {
              nextButton.disabled = false;
            }
          });
        });
      });
    }
    
    // 타이머 시작 함수
    function startMeasurementTimer(panel, duration, callback) {
      const timerElement = panel.querySelector('.timer-number');
      let timeLeft = duration;
      
      function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        // 타이머 표시 업데이트
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // 측정 값 실시간 업데이트
        updateLiveReadings(panel);
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          callback();
        } else {
          timeLeft--;
        }
      }
      
      // 초기 표시 업데이트
      updateTimer();
      
      // 1초마다 타이머 업데이트
      const timerInterval = setInterval(updateTimer, 1000);
    }
    
    // 실시간 측정값 업데이트 함수
    function updateLiveReadings(panel) {
      const valueElements = panel.querySelectorAll('.value-number');
      
      // 실제 구현 시에는 BLE로부터 실시간 데이터 수신
      // 지금은 시뮬레이션
      
      valueElements.forEach((element, index) => {
        // 랜덤한 변동값 생성
        let value;
        
        switch (index % 8) {
          case 0: // 흡입 온도
            value = (25 + Math.random() * 1 - 0.5).toFixed(1);
            break;
          case 1: // 흡입 습도
            value = Math.floor(45 + Math.random() * 6 - 3);
            break;
          case 2: // 흡입 풍속
            value = (3 + Math.random() * 0.6 - 0.3).toFixed(1);
            break;
          case 3: // 흡입 PM2.5
            value = Math.floor(20 + Math.random() * 10 - 5);
            break;
          case 4: // 토출 온도
            value = (14 + Math.random() * 1 - 0.5).toFixed(1);
            break;
          case 5: // 토출 습도
            value = Math.floor(60 + Math.random() * 6 - 3);
            break;
          case 6: // 토출 풍속
            value = (4 + Math.random() * 0.6 - 0.3).toFixed(1);
            break;
          case 7: // 토출 PM2.5
            value = Math.floor(5 + Math.random() * 4 - 2);
            break;
        }
        
        // 값 업데이트
        element.textContent = value;
      });
    }
    
    // 측정 데이터 표시 함수
    function displayMeasurementData(panel, step) {
      // 실제 구현 시에는 측정 완료 후 최종 데이터 처리
      // 지금은 예시 데이터로 대체
      
      const valueElements = panel.querySelectorAll('.value-number');
      
      // 1단계: 세척 전 측정 또는 3단계: 세척 후 측정
      if (step === 1) {
        // 세척 전 측정 데이터
        const preCleaningData = [
          '24.8', '46', '3.2', '28', 
          '15.3', '62', '4.1', '7'
        ];
        
        valueElements.forEach((element, index) => {
          if (index < preCleaningData.length) {
            element.textContent = preCleaningData[index];
          }
        });
        
        // 세션 스토리지에 데이터 저장 (다음 단계에서 사용)
        sessionStorage.setItem('preCleaningData', JSON.stringify(preCleaningData));
        
      } else if (step === 3) {
        // 세척 후 측정 데이터
        const postCleaningData = [
          '24.5', '45', '3.8', '12', 
          '13.8', '58', '4.9', '3'
        ];
        
        valueElements.forEach((element, index) => {
          if (index < postCleaningData.length) {
            element.textContent = postCleaningData[index];
          }
        });
        
        // 세션 스토리지에 데이터 저장
        sessionStorage.setItem('postCleaningData', JSON.stringify(postCleaningData));
      }
    }
    
    // 비교 결과 표시 함수
    function displayComparisonResults(panel) {
      // 저장된 세척 전/후 데이터 가져오기
      const preCleaningData = JSON.parse(sessionStorage.getItem('preCleaningData'));
      const postCleaningData = JSON.parse(sessionStorage.getItem('postCleaningData'));
      
      if (!preCleaningData || !postCleaningData) return;
      
      // 결과 계산
      const efficiencyImprovement = calculateEfficiencyImprovement(preCleaningData, postCleaningData);
      const coolingCapacityImprovement = calculateCoolingCapacityImprovement(preCleaningData, postCleaningData);
      const powerSavingEstimate = calculatePowerSavingEstimate(efficiencyImprovement);
      const carbonReductionEstimate = calculateCarbonReductionEstimate(powerSavingEstimate);
      
      // 결과 표시
      const comparisonValues = panel.querySelectorAll('.comparison-value');
      
      if (comparisonValues.length >= 4) {
        comparisonValues[0].textContent = `${efficiencyImprovement.toFixed(1)}%`;
        comparisonValues[1].textContent = `${coolingCapacityImprovement.toFixed(1)}%`;
        comparisonValues[2].textContent = `${powerSavingEstimate} kWh/년`;
        comparisonValues[3].textContent = `${carbonReductionEstimate} kg/년`;
      }
      
      // 결과 데이터 저장 (리포트 생성에 사용)
      const comparisonResults = {
        efficiencyImprovement,
        coolingCapacityImprovement,
        powerSavingEstimate,
        carbonReductionEstimate
      };
      
      sessionStorage.setItem('comparisonResults', JSON.stringify(comparisonResults));
    }
    
    // 효율 개선율 계산 함수
    function calculateEfficiencyImprovement(preData, postData) {
      // 흡입부 및 토출부 온도 차이 비교
      const preTempDiff = Math.abs(parseFloat(preData[0]) - parseFloat(preData[4]));
      const postTempDiff = Math.abs(parseFloat(postData[0]) - parseFloat(postData[4]));
      
      // 풍속 개선 비교
      const preAirflow = parseFloat(preData[2]);
      const postAirflow = parseFloat(postData[2]);
      
      // 효율 계산 (온도 차이와 풍속의 가중 평균)
      const tempImprovement = (postTempDiff / preTempDiff - 1) * 100;
      const airflowImprovement = (postAirflow / preAirflow - 1) * 100;
      
      // 종합 효율 개선율 (온도 차이 70%, 풍속 30% 가중치)
      return tempImprovement * 0.7 + airflowImprovement * 0.3;
    }
    
    // 냉방 능력 향상 계산 함수
    function calculateCoolingCapacityImprovement(preData, postData) {
      // 흡입부 및 토출부 온도, 풍속을 고려한 냉방 능력 계산
      const preCooling = parseFloat(preData[2]) * Math.abs(parseFloat(preData[0]) - parseFloat(preData[4]));
      const postCooling = parseFloat(postData[2]) * Math.abs(parseFloat(postData[0]) - parseFloat(postData[4]));
      
      return (postCooling / preCooling - 1) * 100;
    }
    
    // 전력 절감 예상 계산 함수
    function calculatePowerSavingEstimate(efficiencyImprovement) {
      // 기본 연간 에어컨 전력 소비량 (kWh) 가정
      const baseAnnualConsumption = 3150;
      
      // 효율 개선에 따른 절감량 계산
      const savingRate = efficiencyImprovement / 100;
      return Math.round(baseAnnualConsumption * savingRate);
    }
    
    // 탄소 감축 효과 계산 함수
    function calculateCarbonReductionEstimate(powerSaving) {
      // 전력 1kWh당 CO2 배출량 (kg) - 한국 평균
      const co2PerKwh = 0.45;
      
      return Math.round(powerSaving * co2PerKwh);
    }
  }
  
  // 체크리스트 핸들러 초기화
  function initChecklistHandlers() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const nextButton = document.querySelector('.wizard-panel[data-step="2"] .next-step-btn');
    
    if (checkboxes && nextButton) {
      // 체크박스 변경 이벤트 리스너
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          // 모든 체크박스가 체크되었는지 확인
          const allChecked = Array.from(checkboxes).every(cb => cb.checked);
          
          // 다음 단계 버튼 활성화/비활성화
          nextButton.disabled = !allChecked;
        });
      });
    }
  }
  
  // 리포트 핸들러 초기화
  function initReportHandlers() {
    // 수신자 추가 버튼
    const addRecipientBtn = document.querySelector('.add-recipient-btn');
    
    if (addRecipientBtn) {
      addRecipientBtn.addEventListener('click', function() {
        openModal('add-recipient-modal');
      });
    }
    
    // 수신자 추가 모달의 추가 버튼
    const modalAddBtn = document.querySelector('#add-recipient-modal .btn-primary');
    
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', function() {
        const nameInput = document.querySelector('#add-recipient-modal input[type="text"]');
        const emailInput = document.querySelector('#add-recipient-modal input[type="email"]');
        
        if (nameInput && emailInput && nameInput.value.trim() && emailInput.value.trim()) {
          // 새 수신자 추가
          addRecipient(nameInput.value.trim(), emailInput.value.trim());
          
          // 입력 필드 초기화
          nameInput.value = '';
          emailInput.value = '';
          
          // 모달 닫기
          closeModal('add-recipient-modal');
        } else {
          showToast('이름과 이메일을 모두 입력해주세요.', 'warning');
        }
      });
    }
    
    // 수신자 제거 버튼들
    const recipientsList = document.querySelector('.recipients-list');
    
    if (recipientsList) {
      recipientsList.addEventListener('click', function(event) {
        const removeBtn = event.target.closest('.remove-recipient-btn');
        
        if (removeBtn) {
          const recipientItem = removeBtn.closest('.recipient-item');
          
          if (recipientItem) {
            recipientItem.remove();
          }
        }
      });
    }
    
    // 수신자 추가 함수
    function addRecipient(name, email) {
      const recipientsList = document.querySelector('.recipients-list');
      
      if (!recipientsList) return;
      
      const recipientItem = document.createElement('div');
      recipientItem.className = 'recipient-item';
      recipientItem.innerHTML = `
        <div class="recipient-info">
          <span class="recipient-name">${name}</span>
          <span class="recipient-email">${email}</span>
        </div>
        <button class="remove-recipient-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      
      recipientsList.appendChild(recipientItem);
    }
  }