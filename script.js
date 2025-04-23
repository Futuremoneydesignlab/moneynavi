// --- 状態管理 ---
class DiagnosisEngine {
constructor(totalSteps = 3) {
this.currentStep = 1;
this.totalSteps = totalSteps;
this.userData = {};
this.sessionStart = Date.now();
this.observers = [];
}

subscribe(callback) {
this.observers.push(callback);
}

notify(event) {
this.observers.forEach(cb => cb(event));
}

updateInput(field, value) {
this.userData[field] = parseInt(value) || 0;
this.notify({ type: 'INPUT_UPDATE', field, value });
}

nextStep() {
this.currentStep++;
this.notify({ type: 'STEP_CHANGE', currentStep: this.currentStep });

if (this.currentStep > this.totalSteps) {
this.complete();
}
}

complete() {
const result = {
...this.userData,
duration: Date.now() - this.sessionStart
};
localStorage.setItem('diagnosisResult', JSON.stringify(result));
window.location.href = 'result.html';
}
}

// --- 入力バリデーション ---
class ValidationSystem {
static rules = {
insurance: { min: 0, max: 100000, required: true },
// 追加フィールドもここで定義可能
};

static validate(field, value) {
const rule = this.rules[field];
const val = parseInt(value) || 0;
const isValid = val >= rule.min && val <= rule.max;
const msg = !isValid
? val < rule.min
? `最小値は¥${rule.min}`
: `最大値は¥${rule.max}`
: '';
return { isValid, message: msg };
}
}

// --- アニメーション管理 ---
class AnimationManager {
static play(el, type) {
const anims = {
bounce: [
{ transform: 'translateY(0)' },
{ transform: 'translateY(-6px)' },
{ transform: 'translateY(0)' }
]
};
if (anims[type]) {
el.animate(anims[type], { duration: 500, easing: 'ease-out' });
}
}
}

// --- パフォーマンス監視 ---
class PerformanceMonitor {
constructor() {
this.metrics = {
inputDelay: [],
stepTime: []
};
this.stepStart = Date.now();
}

logInputDelay(ms) {
this.metrics.inputDelay.push(ms);
}

logStepTime() {
const duration = Date.now() - this.stepStart;
this.metrics.stepTime.push(duration);
this.stepStart = Date.now();
}

getStats() {
const avg = arr => arr.reduce((a,b) => a+b,0) / arr.length || 0;
return {
avgInputDelay: avg(this.metrics.inputDelay),
avgStepTime: avg(this.metrics.stepTime)
};
}
}

// --- エラーハンドラー ---
class ErrorHandler {
static handle(error) {
console.error('ERROR:', error);
document.body.insertAdjacentHTML('afterbegin', `
<div class="global-error">
<p>問題が発生しました。再読み込みしてください。</p>
<button onclick="location.reload()">再読み込み</button>
</div>
`);
navigator.sendBeacon('/error-log', JSON.stringify({
message: error.message,
stack: error.stack,
time: new Date().toISOString()
}));
}
}

// --- UIイベント統合 ---
const engine = new DiagnosisEngine();
const perf = new PerformanceMonitor();

engine.subscribe((event) => {
if (event.type === 'INPUT_UPDATE') {
const { field, value } = event;
const feedback = document.querySelector('.real-time-feedback');
const comparison = document.querySelector('.difference-indicator');
const average = parseInt(document.querySelector(`#${field}`)?.dataset.average || 0);
const diff = value - average;

if (feedback) {
feedback.textContent =
diff > 0
? `📉 平均より¥${diff.toLocaleString()}超過`
: `📈 ¥${Math.abs(diff).toLocaleString()}節約中`;
feedback.style.color = diff > 0 ? '#e91e63' : '#00c853';
AnimationManager.play(feedback, 'bounce');
}

if (comparison) {
comparison.innerHTML = diff > 0
? `<span class="badge red">超過中</span>`
: `<span class="badge green">節約中</span>`;
}

const validation = ValidationSystem.validate(field, value);
const nextBtn = document.querySelector('.next-button');
nextBtn.disabled = !validation.isValid;
}

if (event.type === 'STEP_CHANGE') {
document.querySelectorAll('.chat-step').forEach(e => e.classList.remove('active'));
const nextStep = document.querySelector(`.chat-step[data-step="${event.currentStep}"]`);
if (nextStep) nextStep.classList.add('active');

const fill = document.querySelector('.progress-fill');
if (fill) fill.style.width = `${(event.currentStep / engine.totalSteps) * 100}%`;

perf.logStepTime();
}
});

// --- イベントバインディング ---
window.addEventListener('DOMContentLoaded', () => {
const input = document.querySelector('input');
input.addEventListener('input', (e) => {
const delayStart = Date.now();
const value = e.target.value;
const field = e.target.dataset.category;
engine.updateInput(field, value);
perf.logInputDelay(Date.now() - delayStart);
});

document.querySelector('.next-button').addEventListener('click', () => {
engine.nextStep();
});

document.querySelector('.share-prompt')?.addEventListener('click', () => {
document.getElementById('shareModal').style.display = 'flex';
startCountdown();
});

document.querySelectorAll('.twitter-share, .line-share').forEach(btn => {
btn.addEventListener('click', () => {
const url = encodeURIComponent(window.location.href);
const txt = encodeURIComponent("未来家計スコア診断やってみた！");
if (btn.classList.contains('twitter-share')) {
window.open(`https://twitter.com/intent/tweet?text=${txt}&url=${url}`);
} else {
window.open(`https://social-plugins.line.me/lineit/share?url=${url}`);
}
});
});

updateUserCount();
setInterval(updateUserCount, 5000);
});

// --- カウントダウン（シェア特典） ---
function startCountdown() {
const el = document.querySelector('.countdown');
let time = parseInt(el.dataset.time || '600');
const timer = setInterval(() => {
const min = Math.floor(time / 60);
const sec = (time % 60).toString().padStart(2, '0');
el.textContent = `${min}:${sec}`;
if (--time <= 0) clearInterval(timer);
}, 1000);
}

// --- ソーシャルプルーフ演出 ---
let fakeCount = 12345;
function updateUserCount() {
fakeCount += Math.floor(Math.random() * 4) + 1;
const el = document.getElementById('userCount');
if (el) el.textContent = fakeCount.toLocaleString();
}

// --- エラーキャッチ ---
window.addEventListener('error', (e) => ErrorHandler.handle(e.error));