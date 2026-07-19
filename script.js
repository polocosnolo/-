const STORAGE_KEY = 'ai_health_assistant_survey';
const DEFAULT_SURVEY = { responses: [] };

const medicineData = {
  painFever: {
    category: '해열·진통·소염제',
    medicines: [
      { name: '타이레놀정', ingredient: '아세트아미노펜', use: '발열, 두통, 근육통 완화' },
      { name: '판콜에이내복액', ingredient: '아세트아미노펜 등 복합성분', use: '감기 증상의 발열 및 통증 완화' },
      { name: '어린이 부루펜시럽', ingredient: '이부프로펜', use: '어린이 발열 및 통증 완화' },
      { name: '이지엔6 프로', ingredient: '이부프로펜', use: '두통, 생리통, 근육통 완화' },
      { name: '탁센', ingredient: '나프록센', use: '염증성 통증 완화' }
    ]
  },
  cold: {
    category: '종합감기약',
    medicines: [
      { name: '판피린티정', ingredient: '감기 증상 완화 복합성분', use: '콧물, 기침, 발열 등 감기 증상' },
      { name: '테라플루', ingredient: '아세트아미노펜 등 복합성분', use: '몸살감기, 코감기 증상 완화' },
      { name: '판콜에이', ingredient: '복합 감기 성분', use: '기침, 콧물, 발열 완화' },
      { name: '원비에스', ingredient: '감기 증상 완화 성분', use: '초기 감기 증상 완화' }
    ]
  },
  digestion: {
    category: '소화제',
    medicines: [
      { name: '훼스탈골드', ingredient: '소화효소', use: '소화불량, 더부룩함' },
      { name: '베아제', ingredient: '소화효소', use: '과식 후 소화 개선' },
      { name: '닥터베아제', ingredient: '복합 소화효소', use: '복부 불편감 완화' },
      { name: '까스활명수', ingredient: '생약 성분', use: '속 더부룩함, 소화불량' },
      { name: '베나치오', ingredient: '소화 관련 생약 성분', use: '체함 증상 완화' }
    ]
  },
  wound: {
    category: '상처 치료제',
    medicines: [
      { name: '후시딘', ingredient: '퓨시드산', use: '상처 부위 감염 예방' },
      { name: '마데카솔', ingredient: '센텔라아시아티카 성분', use: '상처 회복 보조' },
      { name: '오라메디', ingredient: '트리암시놀론 성분', use: '구내염 증상 완화' },
      { name: '애니밴', ingredient: '구강 보호 성분', use: '구강 내 상처 보호' }
    ]
  },
  muscle: {
    category: '근육통·관절 통증 완화제',
    medicines: [
      { name: '신신파스 아렉스', ingredient: '소염진통 성분', use: '근육통, 관절통 완화' },
      { name: '케토톱', ingredient: '케토프로펜', use: '관절 및 근육 통증 완화' },
      { name: '멘소래담', ingredient: '멘톨 등', use: '근육통 완화' }
    ]
  },
  allergy: {
    category: '알레르기 증상 완화제',
    medicines: [
      { name: '지르텍', ingredient: '세티리진', use: '콧물, 재채기, 가려움 완화' },
      { name: '클라리틴', ingredient: '로라타딘', use: '알레르기 비염 증상 완화' },
      { name: '알러지 콕시캅', ingredient: '항히스타민제', use: '알레르기 증상 완화' },
      { name: '세티리진', ingredient: '항히스타민제', use: '재채기, 가려움, 콧물 완화' }
    ]
  },
  cough: {
    category: '기침·가래 완화제',
    medicines: [
      { name: '코푸시럽', ingredient: '진해거담 성분', use: '기침 완화' },
      { name: '가래 제거제', ingredient: '구아이페네신', use: '가래 배출 도움' },
      { name: '네스프레소캡슐', ingredient: '기침 완화 보조 성분', use: '기침 증상 보조' }
    ]
  },
  respiratory: {
    category: '호흡기 보조제',
    medicines: [
      { name: '휴먼가스', ingredient: '호흡기 보조 성분', use: '호흡기 불편감 완화' },
      { name: '가스모', ingredient: '기관지 보조 성분', use: '호흡기 편안함' }
    ]
  },
  vitamins: {
    category: '면역·영양 보조제',
    medicines: [
      { name: '비타민C', ingredient: '아스코르브산', use: '면역 보조' },
      { name: '멀티비타민', ingredient: '다양한 비타민', use: '전반적 영양 보조' }
    ]
  }
};

const startBtn = document.getElementById('startBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const themeBtn = document.getElementById('themeBtn');
const painSlider = document.getElementById('painSlider');
const painValue = document.getElementById('painValue');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('symptomSearch');
const resultCard = document.getElementById('resultCard');
const resultDiseases = document.getElementById('resultDiseases');
const resultRisk = document.getElementById('resultRisk');
const resultManagement = document.getElementById('resultManagement');
const resultHospital = document.getElementById('resultHospital');
const resultDrugs = document.getElementById('resultDrugs');
const resultWarning = document.getElementById('resultWarning');
const emergencyNotice = document.getElementById('emergencyNotice');
const surveyForm = document.getElementById('surveyForm');
const thankYou = document.getElementById('thankYou');
const ratingRows = document.querySelectorAll('.star-row');

function init() {
  bindThemeToggle();
  bindSearch();
  bindReset();
  bindAnalyze();
  bindRatings();
  bindSurveySubmit();
  renderAdminPage();
  if (painSlider && painValue) {
    painSlider.addEventListener('input', () => {
      painValue.textContent = painSlider.value;
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      document.getElementById('symptomForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function bindThemeToggle() {
  if (!themeBtn) return;
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ 밝게' : '🌙 어두움';
  });
}

function bindSearch() {
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.symptom-group').forEach((group) => {
      const items = group.querySelectorAll('.symptom-item');
      let visibleCount = 0;

      items.forEach((item) => {
        const label = item.textContent.toLowerCase();
        const matches = !term || label.includes(term);
        item.classList.toggle('hidden', !matches);
        if (matches) visibleCount += 1;
      });

      group.classList.toggle('hidden', !visibleCount);
    });
  });
}

function bindReset() {
  if (!resetBtn) return;
  resetBtn.addEventListener('click', () => {
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      if (el.type === 'checkbox') el.checked = false;
      else if (el.type === 'range') el.value = 5;
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    });
    if (painValue) painValue.textContent = '5';
    if (resultCard) resultCard.classList.add('hidden');
    if (thankYou) thankYou.classList.add('hidden');
  });
}

function bindRatings() {
  ratingRows.forEach((row) => {
    row.innerHTML = '';
    for (let i = 1; i <= 5; i += 1) {
      const star = document.createElement('button');
      star.type = 'button';
      star.className = 'star';
      star.textContent = '★';
      star.dataset.value = String(i);
      star.addEventListener('click', () => {
        row.querySelectorAll('.star').forEach((item, index) => {
          item.classList.toggle('active', index < i);
        });
      });
      row.appendChild(star);
    }
  });
}

function getSelectedSymptoms() {
  return Array.from(document.querySelectorAll('.symptom-item input:checked')).map((input) => input.value);
}

function buildHealthResult(symptoms, temperature, duration, painLevel) {
  const symptomSet = symptoms.map((item) => item.trim());
  const pain = Number(painLevel || 0);

  const fever = symptomSet.includes('발열');
  const cough = symptomSet.includes('기침');
  const runnyNose = symptomSet.includes('콧물');
  const soreThroat = symptomSet.includes('인후통');
  const sneezing = symptomSet.includes('재채기');
  const itching = symptomSet.includes('가려움');
  const abdominalPain = symptomSet.includes('복통');
  const diarrhea = symptomSet.includes('설사');
  const nausea = symptomSet.includes('메스꺼움');
  const vomiting = symptomSet.includes('구토');
  const chestPain = symptomSet.includes('흉통');
  const dyspnea = symptomSet.includes('호흡곤란');
  const chestTightness = symptomSet.includes('가슴 답답함');
  const faint = symptomSet.includes('실신');
  const lossOfConsciousness = symptomSet.includes('의식 저하');
  const headache = symptomSet.includes('두통');
  const dizziness = symptomSet.includes('어지러움');
  const musclePain = symptomSet.includes('근육통');
  const rash = symptomSet.includes('발진');
  const eyeRedness = symptomSet.includes('눈 충혈');
  const painfulUrination = symptomSet.includes('배뇨 시 통증');
  const frequentUrination = symptomSet.includes('잦은 소변');
  const palpitation = symptomSet.includes('심장이 빨리 뜀');
  const highFever = temperature >= 39;

  const points = {
    '발열': 1,
    '기침': 1,
    '콧물': 1,
    '인후통': 1,
    '두통': 1,
    '복통': 2,
    '설사': 2,
    '구토': 2,
    '흉통': 8,
    '호흡곤란': 8,
    '실신': 10,
    '의식 저하': 10
  };

  let riskScore = 0;
  if (fever) riskScore += 1;
  if (cough) riskScore += 1;
  if (abdominalPain) riskScore += 1;
  if (diarrhea) riskScore += 1;
  if (highFever) riskScore += 2;
  if (chestPain) riskScore += 3;
  if (dyspnea) riskScore += 3;
  if (faint) riskScore += 5;
  if (lossOfConsciousness) riskScore += 5;
  if (pain >= 7) riskScore += 1;

  symptomSet.forEach((symptom) => {
    if (points[symptom]) riskScore += points[symptom];
  });

  if (temperature >= 41) riskScore += 10;
  if ((temperature >= 39 && duration === '4–7일') || duration === '1주 이상') riskScore += 5;

  let riskLabel = '낮음';
  if (riskScore >= 15) riskLabel = '응급';
  else if (riskScore >= 8) riskLabel = '높음';
  else if (riskScore >= 4) riskLabel = '보통';

  const conditions = [];
  const management = [];
  const hospitalNotes = [];
  const warnings = [];
  const emergency = [];
  const meds = [];

  if (cough && runnyNose && soreThroat) {
    conditions.push('감기 또는 상기도 감염 가능성');
    management.push('충분한 휴식', '수분 섭취', '실내 습도 유지');
    hospitalNotes.push('증상이 3일 이상 지속되면 병원 상담을 권장합니다.');
    meds.push('타이레놀 (아세트아미노펜 성분)', '판피린큐 (종합감기약)');
  }

  if (fever && musclePain && highFever) {
    conditions.push('독감 가능성');
    management.push('따뜻한 물을 충분히 마시고 휴식을 취하세요.', '몸을 과도하게 움직이지 마세요.');
    hospitalNotes.push('고열이 지속되거나 심한 통증이 있으면 병원 진료가 필요합니다.');
    meds.push('타이레놀 (아세트아미노펜 성분)', '이부프로펜 성분 해열진통제');
    warnings.push('고열과 심한 몸살이 지속되면 진료를 권장합니다.');
  }

  if (sneezing && runnyNose && itching) {
    conditions.push('알레르기 비염 가능성');
    management.push('알레르기 유발 환경 피하기', '실내 먼지와 꽃가루 노출을 줄이세요.');
    hospitalNotes.push('증상이 반복되면 내과 또는 알레르기 전문 진료를 권장합니다.');
    meds.push('지르텍 (세티리진 성분)', '클라리틴 (로라타딘 성분)');
  }

  if (abdominalPain && diarrhea) {
    conditions.push('장염 가능성');
    management.push('충분한 수분 섭취', '자극적인 음식 피하기');
    hospitalNotes.push('혈변, 심한 탈수 증상 또는 고열이 있으면 병원 방문을 권장합니다.');
    meds.push('아세트아미노펜');
  }

  if (cough && symptomSet.includes('가래')) {
    conditions.push('기관지 자극 가능성');
    meds.push('덱스트로메토르판 성분 진해제', '구아이페네신 성분 거담제');
    management.push('따뜻한 물을 자주 마시세요.', '실내 공기를 촉촉하게 유지하세요.');
  }

  if (painfulUrination && frequentUrination) {
    conditions.push('요로감염 가능성');
    management.push('충분한 수분 섭취', '배뇨 통증이 심하면 진료를 받으세요.');
    hospitalNotes.push('요로감염은 증상이 지속되면 의료기관 진료가 필요합니다.');
    meds.push('아세트아미노펜');
  }

  if (chestPain && dyspnea) {
    conditions.push('즉시 병원 방문 권장');
    emergency.push('호흡곤란과 흉통이 함께 있으면 즉시 병원이나 응급실을 방문하세요.');
    hospitalNotes.push('심장 관련 응급 상황일 수 있으므로 신속한 진료가 필요합니다.');
    meds.push('아세트아미노펜');
  }

  if (chestPain && palpitation) {
    conditions.push('심혈관 질환 가능성');
    hospitalNotes.push('심장이 빨리 뛰고 흉통이 있으면 심장 질환 가능성을 고려해 병원을 방문하세요.');
    warnings.push('심한 통증이 있거나 호흡곤란이 있을 경우 응급실을 방문하세요.');
  }

  if (lossOfConsciousness) {
    conditions.push('의식 저하');
    emergency.push('의식 저하가 있으면 응급실 방문이 필요합니다.');
    hospitalNotes.push('의식 저하가 있으면 즉시 응급 진료가 필요합니다.');
  }

  if (faint) {
    conditions.push('실신');
    emergency.push('실신이 있으면 응급실을 방문하세요.');
    hospitalNotes.push('실신은 원인이 다양하므로 즉시 병원 진료가 필요합니다.');
  }

  if (dyspnea && chestTightness) {
    conditions.push('응급');
    emergency.push('호흡곤란과 가슴 답답함이 함께 있으면 즉시 병원을 방문하세요.');
    hospitalNotes.push('응급 증상일 수 있으므로 서둘러 진료를 받으세요.');
  }

  if (rash && itching) {
    conditions.push('피부 알레르기');
    management.push('긁지 않도록 주의하세요.', '가려움이 심하면 병원 진료를 받으세요.');
    hospitalNotes.push('발진과 가려움이 있으면 진료가 필요할 수 있습니다.');
    meds.push('로라타딘');
  }

  if (eyeRedness && fever) {
    conditions.push('안과 또는 내과 진료 권장');
    hospitalNotes.push('눈 충혈과 발열이 함께 있으면 안과 또는 내과 진료를 권장합니다.');
  }

  if (headache && dizziness) {
    conditions.push('충분한 휴식 및 병원 상담 권장');
    hospitalNotes.push('두통과 어지러움이 함께 있으면 충분한 휴식과 병원 상담이 필요합니다.');
    meds.push('아세트아미노펜');
  }

  if (temperature >= 39 && (duration === '4–7일' || duration === '1주 이상')) {
    conditions.push('병원 방문 권장');
    hospitalNotes.push('39도 이상 발열이 3일 이상 지속되면 병원 방문을 권장합니다.');
  }

  return {
    conditions: conditions.length ? Array.from(new Set(conditions)) : ['일반적인 건강 상태를 확인해볼 수 있습니다.'],
    riskScore,
    riskLabel,
    management: management.length ? management : ['충분한 수분 섭취와 휴식을 권장합니다.'],
    hospitalNotes: hospitalNotes.length ? hospitalNotes : ['증상이 지속되면 병원을 방문해 진료를 받는 것이 안전합니다.'],
    meds: meds.length ? Array.from(new Set(meds)) : ['일반적인 의약품은 의료진 상담 후 선택하세요.'],
    warnings: warnings.length ? warnings : ['증상이 심해지면 의료진 상담을 받으세요.'],
    emergency: emergency.length ? emergency : []
  };
}

function bindAnalyze() {
  if (!analyzeBtn) return;
  analyzeBtn.addEventListener('click', () => {
    const symptoms = getSelectedSymptoms();
    const temperature = Number(document.getElementById('tempInput').value || 0);
    const duration = document.getElementById('durationSelect').value;
    const painLevel = Number(document.getElementById('painSlider').value || 0);

    if (!symptoms.length) {
      alert('최소 하나 이상의 증상을 선택해 주세요.');
      return;
    }

    if (loader) loader.classList.add('show');
    setTimeout(() => {
      if (loader) loader.classList.remove('show');
      const result = buildHealthResult(symptoms, temperature, duration, painLevel);
      renderResult(result);
      if (resultCard) resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  });
}

function selectMedicineSuggestions(result) {
  const meds = [];

  if (result.conditions.some((item) => item.includes('감기') || item.includes('상기도'))) {
    meds.push(...medicineData.cold.medicines.map((item) => `${item.name} (${item.ingredient})`));
  }

  if (result.conditions.some((item) => item.includes('독감') || item.includes('근육통'))) {
    meds.push(...medicineData.painFever.medicines.map((item) => `${item.name} (${item.ingredient})`));
  }

  if (result.conditions.some((item) => item.includes('알레르기'))) {
    meds.push(...medicineData.allergy.medicines.map((item) => `${item.name} (${item.ingredient})`));
  }

  if (result.conditions.some((item) => item.includes('기관지') || item.includes('기침'))) {
    meds.push(...medicineData.cough.medicines.map((item) => `${item.name} (${item.ingredient})`));
  }

  if (result.conditions.some((item) => item.includes('장염') || item.includes('복통'))) {
    meds.push(...medicineData.digestion.medicines.map((item) => `${item.name} (${item.ingredient})`));
  }

  if (result.conditions.some((item) => item.includes('심혈관') || item.includes('응급'))) {
    meds.push(...medicineData.respiratory.medicines.map((item) => `${item.name} (${item.ingredient})`));
  }

  return [...new Set(meds)].slice(0, 6);
}

function renderResult(result) {
  if (!resultCard) return;
  resultCard.classList.remove('hidden');
  resultDiseases.textContent = result.conditions.join(', ');
  resultRisk.textContent = `${result.riskLabel} (${result.riskScore}점)`;
  resultManagement.innerHTML = `<ul>${result.management.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  resultHospital.innerHTML = `<ul>${result.hospitalNotes.map((item) => `<li>${item}</li>`).join('')}</ul>`;

  const selectedMeds = selectMedicineSuggestions(result);
  resultDrugs.textContent = selectedMeds.length ? selectedMeds.join(', ') : '해당되는 일반의약품 정보가 없습니다.';
  resultWarning.textContent = result.warnings.join(' ');

  if (result.riskLabel === '응급' || result.emergency.length) {
    resultCard.classList.add('emergency');
    if (emergencyNotice) {
      emergencyNotice.classList.remove('hidden');
      emergencyNotice.textContent = '⚠ 응급 증상이 감지되었습니다. 즉시 가까운 응급실을 방문하세요.';
    }
  } else {
    resultCard.classList.remove('emergency');
    if (emergencyNotice) emergencyNotice.classList.add('hidden');
  }
}

function bindSurveySubmit() {
  if (!surveyForm) return;
  surveyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const answers = {};
    ratingRows.forEach((row) => {
      const key = row.dataset.question;
      const selected = row.querySelector('.star.active');
      answers[key] = selected ? Number(selected.dataset.value) : 0;
    });

    const comment = document.getElementById('commentInput').value.trim();
    if (Object.values(answers).some((value) => value === 0)) {
      alert('모든 별점 항목을 선택해 주세요.');
      return;
    }

    const payload = {
      createdAt: new Date().toISOString(),
      ...answers,
      comment
    };

    saveSurveyResponse(payload);
    renderAdminPage();
    if (thankYou) thankYou.classList.remove('hidden');
    surveyForm.reset();
    bindRatings();
  });
}

function saveSurveyResponse(response) {
  const stored = getStoredResponses();
  stored.responses.push(response);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

function getStoredResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SURVEY;
  } catch (error) {
    return DEFAULT_SURVEY;
  }
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function renderAdminPage() {
  const responseCount = document.getElementById('responseCount');
  const avgSatisfaction = document.getElementById('avgSatisfaction');
  const avgTrust = document.getElementById('avgTrust');
  const surveyTableBody = document.getElementById('surveyTableBody');

  if (!responseCount || !avgSatisfaction || !avgTrust || !surveyTableBody) return;

  const stored = getStoredResponses();
  const responses = stored.responses || [];
  responseCount.textContent = String(responses.length);

  if (!responses.length) {
    avgSatisfaction.textContent = '0.0';
    avgTrust.textContent = '0.0';
    surveyTableBody.innerHTML = '<tr><td colspan="8">저장된 응답이 없습니다.</td></tr>';
    drawBarChart([], document.getElementById('barChart'));
    drawPieChart([], document.getElementById('pieChart'));
    return;
  }

  const satisfaction = average(responses.map((item) => (item.ease + item.understand + item.helpful) / 3));
  const trust = average(responses.map((item) => item.trust));
  avgSatisfaction.textContent = satisfaction.toFixed(1);
  avgTrust.textContent = trust.toFixed(1);

  surveyTableBody.innerHTML = responses
    .map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${new Date(item.createdAt).toLocaleString('ko-KR')}</td>
        <td>${item.ease}</td>
        <td>${item.understand}</td>
        <td>${item.helpful}</td>
        <td>${item.trust}</td>
        <td>${item.similarity}</td>
        <td>${item.comment || '-'}</td>
      </tr>
    `)
    .join('');

  drawBarChart(responses, document.getElementById('barChart'));
  drawPieChart(responses, document.getElementById('pieChart'));
}

function drawBarChart(responses, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const labels = ['사용성', '이해도', '도움됨', '신뢰도'];
  const data = responses.length
    ? [
        average(responses.map((item) => item.ease)),
        average(responses.map((item) => item.understand)),
        average(responses.map((item) => item.helpful)),
        average(responses.map((item) => item.trust))
      ]
    : [0, 0, 0, 0];

  const max = Math.max(...data, 5);
  const chartHeight = 180;
  const startX = 70;
  const barWidth = 70;
  const gap = 18;

  ctx.fillStyle = '#2f80ed';
  labels.forEach((label, index) => {
    const barHeight = (data[index] / max) * chartHeight;
    const x = startX + index * (barWidth * 2 + gap * 2);
    const y = 230 - barHeight;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = '#1b2b40';
    ctx.font = '12px sans-serif';
    ctx.fillText(label, x, 245);
    ctx.fillText(data[index].toFixed(1), x, y - 6);
    ctx.fillStyle = '#2f80ed';
  });
}

function drawPieChart(responses, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const total = responses.length || 1;
  const trustCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  responses.forEach((item) => {
    trustCounts[item.trust] += 1;
  });

  const colors = ['#2f80ed', '#6bb5ff', '#8fd0ff', '#b9ddff', '#dff2ff'];
  let startAngle = -Math.PI / 2;
  const centerX = 180;
  const centerY = 130;
  const radius = 74;

  Object.entries(trustCounts).forEach(([key, value], index) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    startAngle += slice;
  });

  ctx.fillStyle = '#1b2b40';
  ctx.font = '12px sans-serif';
  ctx.fillText('신뢰도 분포', 20, 20);
  if (!responses.length) {
    ctx.fillText('분석할 데이터가 없습니다.', 120, 132);
  }
}

function downloadCsv() {
  const stored = getStoredResponses();
  const rows = stored.responses || [];
  const header = ['createdAt', 'ease', 'understand', 'helpful', 'trust', 'similarity', 'comment'];
  const csv = [header.join(',')]
    .concat(rows.map((row) => [
      row.createdAt,
      row.ease,
      row.understand,
      row.helpful,
      row.trust,
      row.similarity,
      `"${(row.comment || '').replace(/"/g, '""')}"`
    ].join(',')))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'survey-data.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function deleteStoredData() {
  if (window.confirm('모든 설문 데이터를 삭제하시겠습니까?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderAdminPage();
  }
}

const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const deleteDataBtn = document.getElementById('deleteDataBtn');
if (downloadCsvBtn) downloadCsvBtn.addEventListener('click', downloadCsv);
if (deleteDataBtn) deleteDataBtn.addEventListener('click', deleteStoredData);

init();
