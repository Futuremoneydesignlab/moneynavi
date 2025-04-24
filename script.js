let currentStep = 1;
const totalSteps = 5;
const cards = document.querySelectorAll('.question-card');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressText = document.getElementById('current-step');
const slider = document.getElementById('housingPercent');
const housingValue = document.getElementById('housingValue');
const housingFeedback = document.getElementById('housingFeedback');

function updateProgress() {
  cards.forEach((card, idx) => card.classList.toggle('active', idx === currentStep - 1));
  document.querySelectorAll('.progress-step').forEach((step, idx) => {
    step.classList.toggle('active', idx === currentStep - 1);
  });
  progressText.textContent = currentStep;
  prevBtn.disabled = currentStep === 1;
}

nextBtn.addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    updateProgress();
  } else {
    saveUserProfile();
    window.location.href = 'result.html';
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    updateProgress();
  }
});

slider.addEventListener('input', () => {
  const value = slider.value;
  housingValue.textContent = value;
  const diff = value - 30;
  housingFeedback.textContent = diff > 0 ? `平均より+${diff}%` : `${Math.abs(diff)}%節約中`;
  housingFeedback.style.color = diff > 0 ? '#e74c3c' : '#2ecc71';
});

document.getElementById('insuranceCost').addEventListener('input', e => {
  const value = parseInt(e.target.value.replace(/,/g, '')) || 0;
  const avg = 23500;
  const percent = Math.min(value / (avg * 1.5) * 100, 100);
  document.querySelector('.insurance .user-bar').style.width = `${percent}%`;
});

function saveUserProfile() {
  const insuranceCost = parseInt(document.getElementById('insuranceCost').value || 0);
  const housingPercent = parseInt(document.getElementById('housingPercent').value || 0);

  const userProfile = {
    insuranceCost,
    housingPercent,
    insuranceScore: Math.round((insuranceCost / 23500) * 100),
    saving: document.querySelector('input[name="saving"]:checked')?.value || '',
    invest: document.querySelector('input[name="invest"]:checked')?.value || '',
    resultMethod: document.querySelector('input[name="result"]:checked')?.value || ''
  };

  localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

updateProgress();
