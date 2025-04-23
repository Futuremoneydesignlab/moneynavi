// script.js
class DiagnosisApp {
  constructor() {
    this.steps = document.querySelectorAll('.input-card');
    this.currentStep = 0;
    this.userData = {};
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateProgress();
  }

  setupEventListeners() {
    document.querySelectorAll('.modern-input').forEach(input => {
      input.addEventListener('input', this.handleInput.bind(this));
    });

    document.querySelector('.next-button').addEventListener('click', this.nextStep.bind(this));
  }

  handleInput(e) {
    const input = e.target;
    const value = parseInt(input.value);
    const category = input.dataset.category;

    if (value >= 0 && value <= 200000) {
      this.userData[category] = value;
      this.updateComparisonVisualization(value);
      this.toggleNextButton();
    }
  }

  updateComparisonVisualization(value) {
    const average = 23500;
    const userBar = document.querySelector('.user-bar');
    const averageBar = document.querySelector('.average-bar');
    
    const maxHeight = 150;
    const userHeight = Math.min((value / 100000) * maxHeight, maxHeight);
    const averageHeight = Math.min((average / 100000) * maxHeight, maxHeight);

    userBar.style.height = `${userHeight}px`;
    averageBar.style.height = `${averageHeight}px`;
  }

  toggleNextButton() {
    const button = document.querySelector('.next-button');
    button.classList.toggle('disabled', !this.isValidInput());
  }

  isValidInput() {
    return this.userData.insurance > 0;
  }

  nextStep() {
    if (!this.isValidInput()) return;

    this.steps[this.currentStep].classList.remove('active');
    this.currentStep++;
    
    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep].classList.add('active');
      this.updateProgress();
    } else {
      this.completeDiagnosis();
    }
  }

  updateProgress() {
    const progress = (this.currentStep + 1) / this.steps.length * 100;
    document.querySelector('.progress-thumb').style.width = `${progress}%`;
  }

  completeDiagnosis() {
    // 診断結果処理
    localStorage.setItem('diagnosisResult', JSON.stringify(this.userData));
    window.location.href = 'result.html';
  }
}

// アプリ起動
document.addEventListener('DOMContentLoaded', () => {
  new DiagnosisApp();
});