// script.js：UI改善版＋リアルタイムフィードバック

let currentStep = 1;
const totalSteps = 5;
const cards = document.querySelectorAll('.question-card');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('current');

function updateProgress() {
  progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
  progressText.textContent = currentStep;
  cards.forEach((card, index) => {
    card.classList.toggle('active', index === currentStep - 1);
  });
  prevBtn.disabled = currentStep === 1;
  nextBtn.textContent = currentStep === totalSteps ? '診断結果を見る →' : '次へ →';
}

nextBtn.addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    updateProgress();
  } else {
    showResult();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    updateProgress();
  }
});

document.querySelectorAll('.bubble-option').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    const selected = document.querySelectorAll('.bubble-option.selected');
    if (selected.length > 3) {
      selected[0].classList.remove('selected');
    }
  });
});

const slider = document.getElementById('housingPercent');
const sliderValue = document.getElementById('housingValue');

function updateSliderValue() {
  const value = slider.value;
  sliderValue.textContent = value;
  const benchmark = 30;
  const diff = value - benchmark;
  const color = diff > 5 ? '#e74c3c' : diff < -5 ? '#2ecc71' : '#f1c40f';
  slider.style.setProperty('--thumb-color', color);
}

slider.addEventListener('input', updateSliderValue);

function showResult() {
  const housingPercent = slider.value;
  const categories = Array.from(document.querySelectorAll('.bubble-option.selected')).map(btn => btn.dataset.category);

  const message = `\n🏠 住居費：${housingPercent}%\n💸 気になる支出：${categories.join(', ')}`;
  alert(`診断完了！\n${message}`);
}

updateProgress();
updateSliderValue();
