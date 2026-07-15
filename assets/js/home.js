(function() {
var nav = document.getElementById('site-nav');
if (!nav) return;
var threshold = 8;             // start collapsing the instant scroll begins
var ticking = false;
function update() {
if (window.scrollY > threshold) nav.classList.add('is-scrolled');
else nav.classList.remove('is-scrolled');
ticking = false;
}
window.addEventListener('scroll', function() {
if (!ticking) {
window.requestAnimationFrame(update);
ticking = true;
}
}, { passive: true });
update();
})();
(function() {
var links = document.querySelectorAll('[data-scroll-top]');
links.forEach(function(link) {
link.addEventListener('click', function(e) {
e.preventDefault();
window.scrollTo({ top: 0, behavior: 'smooth' });
var panel = document.getElementById('nav-mobile-panel');
if (panel) panel.classList.remove('is-open');
var toggle = document.querySelector('.nav-mobile-toggle');
if (toggle) toggle.classList.remove('is-open');
});
});
})();
;
(function() {
const timeline = document.getElementById('timeline');
if (!timeline) return;
const steps = Array.from(timeline.querySelectorAll('.timeline-step'));
if (!steps.length) return;
const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('is-visible');
}
});
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
steps.forEach(step => revealObserver.observe(step));
let ticking = false;
function update() {
const viewportCenter = window.innerHeight / 2;
let activeIdx = -1;
let closestDist = Infinity;
steps.forEach((step, i) => {
const rect = step.getBoundingClientRect();
const stepCenter = rect.top + rect.height / 2;
const dist = Math.abs(stepCenter - viewportCenter);
if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
if (dist < closestDist) {
closestDist = dist;
activeIdx = i;
}
}
});
steps.forEach((step, i) => {
step.classList.toggle('is-active', i === activeIdx);
});
const tRect = timeline.getBoundingClientRect();
const tHeight = timeline.offsetHeight;
const traveled = (viewportCenter - tRect.top);
let progress = traveled / tHeight;
if (progress < 0) progress = 0;
if (progress > 1) progress = 1;
timeline.style.setProperty('--rail-progress', (progress * 100).toFixed(2) + '%');
ticking = false;
}
function onScroll() {
if (!ticking) {
window.requestAnimationFrame(update);
ticking = true;
}
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
setTimeout(update, 80);
})();
(function() {
const cards = document.querySelectorAll('.stat-card');
if (!cards.length) return;
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
function animateNumber(el, target, decimals, duration) {
const start = performance.now();
function frame(now) {
const elapsed = now - start;
const t = Math.min(elapsed / duration, 1);
const eased = easeOutCubic(t);
const current = target * eased;
el.textContent = current.toFixed(decimals);
if (t < 1) requestAnimationFrame(frame);
else el.textContent = target.toFixed(decimals);
}
requestAnimationFrame(frame);
}
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && !entry.target.dataset.counted) {
entry.target.dataset.counted = 'true';
entry.target.classList.add('is-visible');
const numEl = entry.target.querySelector('.number');
if (numEl) {
const target = parseFloat(numEl.dataset.count);
const decimals = parseInt(numEl.dataset.decimals || '0', 10);
const cards = Array.from(document.querySelectorAll('.stat-card'));
const idx = cards.indexOf(entry.target);
setTimeout(() => animateNumber(numEl, target, decimals, 1800), idx * 180);
}
}
});
}, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });
cards.forEach(card => observer.observe(card));
})();
(function() {
const cells = document.querySelectorAll('.step-cell');
if (!cells.length) return;
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && !entry.target.dataset.revealed) {
entry.target.dataset.revealed = 'true';
const all = Array.from(document.querySelectorAll('.step-cell'));
const idx = all.indexOf(entry.target);
setTimeout(() => entry.target.classList.add('is-visible'), idx * 220);
}
});
}, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
cells.forEach(cell => observer.observe(cell));
})();
(function() {
const ctas = document.querySelectorAll('.section-cta');
if (!ctas.length) return;
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && !entry.target.dataset.revealed) {
entry.target.dataset.revealed = 'true';
entry.target.classList.add('is-visible');
}
});
}, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
ctas.forEach(cta => observer.observe(cta));
})();
(function() {
const viewport = document.getElementById('testimonials-carousel');
const track    = document.getElementById('testimonials-track');
const prevBtn  = document.getElementById('carousel-prev');
const nextBtn  = document.getElementById('carousel-next');
const dotsBox  = document.getElementById('carousel-dots');
if (!viewport || !track || !prevBtn || !nextBtn) return;
const cards = Array.from(track.querySelectorAll('.testimonial-card'));
const dots  = dotsBox ? Array.from(dotsBox.querySelectorAll('.carousel-dot')) : [];
if (!cards.length) return;
let index = 0;
function applyState() {
if (!cards.length) return;
const firstRect = cards[0].getBoundingClientRect();
const cardW = firstRect.width;
const gap = parseFloat(getComputedStyle(track).columnGap) ||
parseFloat(getComputedStyle(track).gap) || 0;
const step = cardW + gap;
const viewportW = viewport.clientWidth;
const trackPaddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
const tx = (viewportW / 2) - (trackPaddingLeft + index * step + cardW / 2);
track.style.setProperty('--slide-x', tx + 'px');
cards.forEach((card, i) => {
card.classList.toggle('is-active',   i === index);
card.classList.toggle('is-inactive', i !== index);
});
dots.forEach((dot, i) => {
dot.classList.toggle('is-active', i === index);
});
prevBtn.disabled = (index === 0);
nextBtn.disabled = (index === cards.length - 1);
}
function goTo(i) {
index = Math.max(0, Math.min(cards.length - 1, i));
applyState();
}
prevBtn.addEventListener('click', () => goTo(index - 1));
nextBtn.addEventListener('click', () => goTo(index + 1));
dots.forEach(dot => {
dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx, 10)));
});
cards.forEach((card, i) => {
card.addEventListener('click', (e) => {
if (i !== index) {
e.stopPropagation();
goTo(i);
}
});
});
viewport.addEventListener('keydown', (e) => {
if (e.key === 'ArrowLeft') goTo(index - 1);
else if (e.key === 'ArrowRight') goTo(index + 1);
});
viewport.setAttribute('tabindex', '0');
let resizeTicking = false;
window.addEventListener('resize', () => {
if (!resizeTicking) {
window.requestAnimationFrame(() => { applyState(); resizeTicking = false; });
resizeTicking = true;
}
}, { passive: true });
requestAnimationFrame(applyState);
setTimeout(applyState, 120);
})();
;
(function() {
const headline = document.querySelector('.statement-text');
if (!headline) return;
const lines = headline.querySelectorAll('.line');
if (!lines.length) return;
let totalWordIdx = 0;
const PER_WORD_DELAY_MS = 70;
const BASE_DELAY_MS = 60;
lines.forEach(line => {
const items = [];
line.childNodes.forEach(node => {
if (node.nodeType === Node.TEXT_NODE) {
const text = node.textContent;
if (text) items.push({ text, isAccent: false });
} else if (node.nodeType === Node.ELEMENT_NODE) {
if (node.classList.contains('line-inner')) {
node.childNodes.forEach(inner => {
if (inner.nodeType === Node.TEXT_NODE) {
if (inner.textContent) items.push({ text: inner.textContent, isAccent: false });
} else if (inner.nodeType === Node.ELEMENT_NODE) {
const accent = inner.classList && inner.classList.contains('accent');
items.push({ text: inner.textContent || '', isAccent: accent });
}
});
} else {
const accent = node.classList && node.classList.contains('accent');
items.push({ text: node.textContent || '', isAccent: accent });
}
}
});
line.innerHTML = '';
items.forEach(item => {
const parts = item.text.split(/(\s+)/);
parts.forEach(part => {
if (!part) return;
if (/^\s+$/.test(part)) {
line.appendChild(document.createTextNode(' '));
} else {
const wordEl = document.createElement('span');
wordEl.className = 'word';
const innerEl = document.createElement('span');
innerEl.className = 'word-inner' + (item.isAccent ? ' accent' : '');
innerEl.textContent = part;
innerEl.style.transitionDelay =
(BASE_DELAY_MS + totalWordIdx * PER_WORD_DELAY_MS) + 'ms';
wordEl.appendChild(innerEl);
line.appendChild(wordEl);
totalWordIdx++;
}
});
});
});
const revealOnce = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
headline.classList.add('is-revealed');
revealOnce.disconnect();
}
});
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
revealOnce.observe(headline);
})();
(function cloneLogoMarquee() {
const track = document.querySelector('.logo-band-track');
if (!track) return;
Array.from(track.children).forEach(node => {
const clone = node.cloneNode(true);
clone.setAttribute('aria-hidden', 'true');
track.appendChild(clone);
});
const firstSet = track.querySelector('.logo-set');
const setShift = () => {
if (!firstSet) return;
const w = firstSet.getBoundingClientRect().width;
if (w > 0) track.style.setProperty('--logo-shift', w + 'px');
};
setShift();
window.addEventListener('load', setShift);
if ('ResizeObserver' in window) {
let raf;
new ResizeObserver(() => {
cancelAnimationFrame(raf);
raf = requestAnimationFrame(setShift);
}).observe(track);
} else {
window.addEventListener('resize', setShift);
}
})();
;
(function() {
var section = document.querySelector('.partners-section');
if (!section) return;
if ((window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'))) return;
var lastY = window.scrollY, lastT = performance.now();
var velocity = 0, skew = 0, active = false;
var MAX_SKEW = 10, SENSITIVITY = 8, FRICTION = 0.86;
function onScroll() {
var now = performance.now();
var dy = window.scrollY - lastY;
var dt = Math.max(1, now - lastT);
var v = dy / dt;
velocity = velocity * 0.4 + v * 0.6;
lastY = window.scrollY; lastT = now;
if (!active) { active = true; requestAnimationFrame(loop); }
}
function loop() {
var target = velocity * SENSITIVITY;
if (target >  MAX_SKEW) target =  MAX_SKEW;
if (target < -MAX_SKEW) target = -MAX_SKEW;
skew = skew + (target - skew) * 0.25;
section.style.setProperty('--m-skew', skew.toFixed(2) + 'deg');
velocity *= FRICTION;
if (Math.abs(velocity) < 0.001 && Math.abs(skew) < 0.05) {
skew = 0;
section.style.setProperty('--m-skew', '0deg');
active = false; return;
}
requestAnimationFrame(loop);
}
window.addEventListener('scroll', onScroll, { passive: true });
})();
;
(function footerInit() {
var wrap = document.getElementById('footer-wordmark');
var text = wrap ? wrap.querySelector('.wordmark-text') : null;
if (wrap && text) {
var fit = function () {
var available = wrap.clientWidth;
if (!available) return;
var REF = 100;
text.style.fontSize = REF + 'px';
var w = text.scrollWidth;
if (w > 0) {
text.style.fontSize = (available / w * REF * 0.985) + 'px';
}
};
fit();
window.addEventListener('load', fit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
if ('ResizeObserver' in window) {
var raf;
new ResizeObserver(function () {
cancelAnimationFrame(raf);
raf = requestAnimationFrame(fit);
}).observe(wrap);
} else {
window.addEventListener('resize', fit);
}
}
var targets = [
document.getElementById('footer-cta-card'),
document.getElementById('footer-wordmark'),
document.getElementById('footer-links')
].filter(Boolean);
if (!targets.length) return;
if (!('IntersectionObserver' in window)) {
targets.forEach(function (t) { t.classList.add('is-in'); });
return;
}
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add('is-in');
io.unobserve(entry.target);
}
});
}, { threshold: 0.18 });
targets.forEach(function (t) { io.observe(t); });
})();
;
(function () {
function initShader(canvas) {
if (!canvas) return;
var hero = canvas.closest('section') || canvas.parentElement;
var reduceMotion = window.matchMedia &&
(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'));
var gl = null, program = null, buffer = null;
var vShader = null, fShader = null;
var uni = {};
var rafId = null, running = false, startTime = 0;
var COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;
var DPR_CAP = COARSE ? 1.25 : 2;
// The fx-shader spans a multi-thousand-px zone — full-res fbm there is the single
// biggest GPU cost on weak machines, and soft clouds upscale invisibly.
var IS_FX = canvas.classList.contains('fx-shader');
if (IS_FX) DPR_CAP = 1.25;
var mouse = { x: 0.0, y: 0.15 };          // current (eased)
var mouseTarget = { x: 0.0, y: 0.15 };    // latest input
var VERT = [
'attribute vec2 a_position;',
'void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }'
].join('\n');
var FRAG = [
'precision highp float;',
'uniform vec2  u_resolution;',
'uniform float u_time;',
'uniform vec2  u_mouse;',
'uniform float u_speed;',
'uniform float u_intensity;',
'float random(vec2 st){',
'  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);',
'}',
'float noise(vec2 st){',
'  vec2 i = floor(st); vec2 f = fract(st);',
'  float a = random(i);',
'  float b = random(i + vec2(1.0,0.0));',
'  float c = random(i + vec2(0.0,1.0));',
'  float d = random(i + vec2(1.0,1.0));',
'  vec2 u = f*f*(3.0-2.0*f);',
'  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.y*u.x;',
'}',
'float fbm(vec2 st){',
'  float v = 0.0; float amp = 0.5;',
'  for (int i = 0; i < 5; i++){',     // fixed octaves — fast + glitch-free
'    v += amp * noise(st);',
'    st *= 2.0; amp *= 0.5;',
'  }',
'  return v;',
'}',
'void main(){',
'  vec2 st = gl_FragCoord.xy / u_resolution.xy;',                 // 0..1 screen
'  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy)',
'            / min(u_resolution.x, u_resolution.y);',             // aspect-correct
'  float t = u_time * u_speed * 0.1;',
'  // subtle pointer warp — gentle, never distracting',
'  float mdist = distance(uv, u_mouse);',
'  float warp = smoothstep(0.6, 0.0, mdist) * 0.12;',
'  vec2 p = uv * 1.25 + vec2(t, t * 0.5) + warp;',
'  float n = fbm(p);',
'  // soften + lift into a pleasant range',
'  n = clamp(n * 1.15, 0.0, 1.0);',
'  // ---- brand palette ramp ----',
'  vec3 deepBlue  = vec3(0.047, 0.118, 0.380);',  // deeper than brand for shadow
'  vec3 brandBlue = vec3(0.071, 0.169, 0.561);',  // #122B8F
'  vec3 midBlue   = vec3(0.173, 0.337, 0.863);',  // #2C56DC
'  vec3 lightBlue = vec3(0.588, 0.824, 1.000);',  // #96D2FF
'  vec3 white     = vec3(1.0, 1.0, 1.0);',
'  vec3 col = mix(deepBlue,  brandBlue, smoothstep(0.00, 0.45, n));',
'  col = mix(col,           midBlue,   smoothstep(0.45, 0.72, n));',
'  col = mix(col,           lightBlue, smoothstep(0.72, 0.90, n));',
'  col = mix(col,           white,     smoothstep(0.92, 1.00, n) * 0.85);',
'  // ---- left-side legibility bias (headline lives on the left) ----',
'  float lightMask = smoothstep(0.28, 0.86, st.x);',
'  vec3 deepSide = mix(deepBlue, brandBlue, n * 0.55);',
'  col = mix(col, deepSide, (1.0 - lightMask) * 0.50);',
'  // ---- soft depth: gentle top lift, deeper base ----',
'  col *= mix(0.86, 1.06, smoothstep(0.0, 0.65, 1.0 - st.y));',
'  // mild radial vignette for premium falloff',
'  float vig = 1.0 - smoothstep(0.55, 1.35, length(uv));',
'  col *= mix(0.82, 1.0, vig);',
'  col *= u_intensity;',
'  gl_FragColor = vec4(col, 1.0);',
'}'
].join('\n');
function compile(src, type) {
var s = gl.createShader(type);
gl.shaderSource(s, src);
gl.compileShader(s);
if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
gl.deleteShader(s);
return null;
}
return s;
}
function initGL() {
try {
gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false }) ||
canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
} catch (e) { gl = null; }
if (!gl) return false;   // CSS gradient fallback remains visible
vShader = compile(VERT, gl.VERTEX_SHADER);
fShader = compile(FRAG, gl.FRAGMENT_SHADER);
if (!vShader || !fShader) return false;
program = gl.createProgram();
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
gl.useProgram(program);
buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER,
new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
var loc = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(loc);
gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
uni.resolution = gl.getUniformLocation(program, 'u_resolution');
uni.time       = gl.getUniformLocation(program, 'u_time');
uni.mouse      = gl.getUniformLocation(program, 'u_mouse');
uni.speed      = gl.getUniformLocation(program, 'u_speed');
uni.intensity  = gl.getUniformLocation(program, 'u_intensity');
return true;
}
function resize() {
if (!gl) return;
var dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
var w = canvas.clientWidth * dpr, h = canvas.clientHeight * dpr;
var LIMIT = 6000, biggest = Math.max(w, h);
if (biggest > LIMIT) { var s = LIMIT / biggest; w *= s; h *= s; }
var MAXPIX = (COARSE || IS_FX) ? 2500000 : 7000000;
if (w * h > MAXPIX) { var s2 = Math.sqrt(MAXPIX / (w * h)); w *= s2; h *= s2; }
w = Math.max(1, Math.round(w));
h = Math.max(1, Math.round(h));
if (canvas.width !== w || canvas.height !== h) {
canvas.width = w;
canvas.height = h;
gl.viewport(0, 0, w, h);
}
}
function draw(now) {
if (!gl || !program) return;
resize();
mouse.x += (mouseTarget.x - mouse.x) * 0.05;
mouse.y += (mouseTarget.y - mouse.y) * 0.05;
gl.uniform2f(uni.resolution, canvas.width, canvas.height);
gl.uniform1f(uni.time, (now - startTime) * 0.001);
gl.uniform2f(uni.mouse, mouse.x, mouse.y);
gl.uniform1f(uni.speed, 0.42);
gl.uniform1f(uni.intensity, 1.0);
gl.drawArrays(gl.TRIANGLES, 0, 6);
}
function loop(now) {
if (!running) return;
draw(now);
rafId = requestAnimationFrame(loop);
}
function start() {
if (running || !gl || reduceMotion) return;
running = true;
startTime = performance.now() - 0; // keep continuity
rafId = requestAnimationFrame(function (n) { startTime = n - 0; loop(n); });
}
function stop() {
running = false;
if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
}
var lastMove = 0;
function onPointer(e) {
var now = performance.now();
if (now - lastMove < 16) return;   // ~60fps cap
lastMove = now;
var rect = canvas.getBoundingClientRect();
if (!rect.width || !rect.height) return;
var cx = (typeof e.clientX === 'number') ? e.clientX
: (e.touches && e.touches[0] ? e.touches[0].clientX : null);
var cy = (typeof e.clientY === 'number') ? e.clientY
: (e.touches && e.touches[0] ? e.touches[0].clientY : null);
if (cx === null || cy === null) return;
mouseTarget.x = ((cx - rect.left) / rect.width) * 2.0 - 1.0;
mouseTarget.y = -(((cy - rect.top) / rect.height) * 2.0 - 1.0);
}
function bootstrap() {
if (!initGL()) return; // fallback gradient stays — no errors, no blank
resize();
if ('IntersectionObserver' in window) {
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (en) {
if (en.isIntersecting) start();
});
}, { threshold: 0.01 });
io.observe(hero);
} else {
start();
}
document.addEventListener('visibilitychange', function () {
if (document.hidden) stop();
else if (isHeroVisible()) start();
});
if ('ResizeObserver' in window) {
new ResizeObserver(function () {
resize();
if (reduceMotion) draw(performance.now()); // repaint single static frame
}).observe(hero);
}
window.addEventListener('resize', function () {
resize();
if (reduceMotion) draw(performance.now());
}, { passive: true });
window.addEventListener('pointermove', onPointer, { passive: true });
canvas.addEventListener('webglcontextlost', function (e) {
e.preventDefault(); stop();
}, false);
canvas.addEventListener('webglcontextrestored', function () {
if (initGL()) { resize(); if (!reduceMotion && isHeroVisible()) start();
else draw(performance.now()); }
}, false);
if (reduceMotion) {
draw(performance.now());   // one calm static frame, no animation
} else {
start();
}
}
function isHeroVisible() {
var r = hero.getBoundingClientRect();
return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
}
bootstrap();
}
function runShaders() { if (document.documentElement.classList.contains('low-power')) return; Array.prototype.forEach.call(document.querySelectorAll('.hero-shader, .fx-shader'), initShader); }
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', runShaders);
} else {
runShaders();
}
})();
;
(function () {
const sec = document.querySelector('.capabilities-section');
if (!sec) return;
if (window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'))) {
sec.classList.add('is-visible');
return;
}
if (!('IntersectionObserver' in window)) { sec.classList.add('is-visible'); return; }
const io = new IntersectionObserver(function (entries) {
entries.forEach(function (e) {
if (e.isIntersecting) { sec.classList.add('is-visible'); io.disconnect(); }
});
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
io.observe(sec);
})();
;
(function () {
var rows = document.querySelectorAll('[data-compare-row]');
if (!rows.length) return;
if (window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'))) {
rows.forEach(function (r) { r.classList.add('is-visible'); });
return;
}
if (!('IntersectionObserver' in window)) {
rows.forEach(function (r) { r.classList.add('is-visible'); });
return;
}
var io = new IntersectionObserver(function (entries) {
entries.forEach(function (e) {
if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
});
}, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });
rows.forEach(function (r) { io.observe(r); });
})();
;
(function () {
'use strict';
if (!window.gsap) return;
var reduceMotion = window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'));
var finePointer  = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
gsap.registerPlugin(ScrollTrigger);
var lenis = null;
if (!reduceMotion && finePointer && !document.documentElement.classList.contains('low-power') && window.Lenis) {
lenis = new Lenis({
lerp: 0.105,
wheelMultiplier: 1,
anchors: { offset: -90 },     
smoothWheel: true
});
window.lenis = lenis;
document.documentElement.style.scrollBehavior = 'auto';
document.documentElement.classList.add('lenis-smooth');
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
gsap.ticker.lagSmoothing(0);
var nativeScrollTo = window.scrollTo.bind(window);
window.scrollTo = function () {
var a = arguments[0];
if (a && typeof a === 'object' && a.behavior === 'smooth') {
lenis.scrollTo(typeof a.top === 'number' ? a.top : 0, { duration: 1.1 });
} else {
nativeScrollTo.apply(window, arguments);
}
};
}
function wrapMaskLine(el) {
if (!el || el.querySelector('.mask-inner')) return null;
var inner = document.createElement('span');
inner.className = 'mask-inner';
while (el.firstChild) inner.appendChild(el.firstChild);
el.appendChild(inner);
el.classList.add('mask-line');
return inner;
}
// Per-character variant of splitWords. Emits the same .w/.wi mask pair so the reveal
// matches the section titles, with each word wrapped in .cw to keep it unbreakable.
// Screen readers get the original string via aria-label — without it they announce
// the inline-block letters one at a time.
function splitChars(el) {
if (!el || el.classList.contains('wsplit')) {
return el ? Array.prototype.slice.call(el.querySelectorAll('.wi')) : [];
}
var out = [];
var label = el.textContent.replace(/\s+/g, ' ').trim();
function processNode(node, parent) {
if (node.nodeType === Node.TEXT_NODE) {
var parts = node.textContent.split(/(\s+)/);
parts.forEach(function (part) {
if (!part) return;
if (/^\s+$/.test(part)) {
parent.appendChild(document.createTextNode(part));
} else {
var word = document.createElement('span');
word.className = 'cw';
part.split('').forEach(function (ch) {
var w = document.createElement('span');
w.className = 'w';
var wi = document.createElement('span');
wi.className = 'wi';
wi.textContent = ch;
w.appendChild(wi);
word.appendChild(w);
out.push(wi);
});
parent.appendChild(word);
}
});
} else if (node.nodeType === Node.ELEMENT_NODE) {
if (node.tagName === 'BR') {
parent.appendChild(node.cloneNode(false));
} else {
var clone = node.cloneNode(false);
parent.appendChild(clone);
Array.prototype.slice.call(node.childNodes).forEach(function (child) {
processNode(child, clone);
});
}
}
}
var source = Array.prototype.slice.call(el.childNodes);
var frag = document.createDocumentFragment();
source.forEach(function (n) { processNode(n, frag); });
el.innerHTML = '';
el.appendChild(frag);
el.classList.add('wsplit');
if (label) {
el.setAttribute('aria-label', label);
Array.prototype.forEach.call(el.children, function (c) { c.setAttribute('aria-hidden', 'true'); });
}
return out;
}
function splitWords(el) {
if (!el || el.classList.contains('wsplit')) {
return el ? Array.prototype.slice.call(el.querySelectorAll('.wi')) : [];
}
var out = [];
function processNode(node, parent) {
if (node.nodeType === Node.TEXT_NODE) {
var parts = node.textContent.split(/(\s+)/);
parts.forEach(function (part) {
if (!part) return;
if (/^\s+$/.test(part)) {
parent.appendChild(document.createTextNode(part));
} else {
var w = document.createElement('span');
w.className = 'w';
var wi = document.createElement('span');
wi.className = 'wi';
wi.textContent = part;
w.appendChild(wi);
parent.appendChild(w);
out.push(wi);
}
});
} else if (node.nodeType === Node.ELEMENT_NODE) {
if (node.tagName === 'BR') {
parent.appendChild(node.cloneNode(false));
} else {
var clone = node.cloneNode(false);
parent.appendChild(clone);
Array.prototype.slice.call(node.childNodes).forEach(function (child) {
processNode(child, clone);
});
}
}
}
var source = Array.prototype.slice.call(el.childNodes);
var frag = document.createDocumentFragment();
source.forEach(function (n) { processNode(n, frag); });
el.innerHTML = '';
el.appendChild(frag);
el.classList.add('wsplit');
return out;
}
var pre = document.getElementById('preloader');
function killPreloader() {
if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
}
function heroEntrance(overlap) {
var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
var line1 = wrapMaskLine(document.querySelector('.headline .line-1'));
var line2 = wrapMaskLine(document.querySelector('.headline .line-2'));
var cols  = gsap.utils.toArray('.hero-right .col');
gsap.set(['.eyebrow', '.cta-row'], { opacity: 0, y: 26 });
gsap.set('.headline .line-1', { opacity: 1 });
gsap.set('.headline .line-2', { opacity: 1 });
if (line1) gsap.set(line1, { yPercent: 115 });
if (line2) gsap.set(line2, { yPercent: 115 });
if (cols.length) gsap.set(cols, { opacity: 0, y: 110 });
gsap.set('#site-nav', { opacity: 0, y: -56 });
tl.to('.eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.05);
if (line1) tl.to(line1, { yPercent: 0, duration: 1.05 }, 0.12);
if (line2) tl.to(line2, { yPercent: 0, duration: 1.15 }, 0.24);
tl.to('.cta-row', { opacity: 1, y: 0, duration: 0.9 }, 0.58);
if (cols.length) {
tl.to(cols, { opacity: 1, y: 0, duration: 1.25, stagger: 0.12, ease: 'power3.out' }, 0.3);
}
tl.to('#site-nav', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.55);
return tl;
}
function runIntro() {
if (reduceMotion || !pre) {
killPreloader();
if (!reduceMotion) heroEntrance();
return;
}
if (lenis) lenis.stop();
document.documentElement.classList.add('lenis-stopped');
var counter = { v: 0 };
var countEl = document.getElementById('preloader-count');
var barEl   = document.getElementById('preloader-bar-fill');
var ready   = false;
var minTimeDone = false;
var readyPromise = Promise.race([
Promise.all([
(document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(),
new Promise(function (res) {
if (document.readyState === 'complete') res();
else window.addEventListener('load', res, { once: true });
})
]),
new Promise(function (res) { setTimeout(res, 1800); })
]);
readyPromise.then(function () { ready = true; tryFinish(); });
gsap.to(counter, {
v: 90, duration: 0.85, ease: 'power2.out',
onUpdate: function () {
if (countEl) countEl.textContent = Math.round(counter.v);
if (barEl) barEl.style.transform = 'scaleX(' + (counter.v / 100) + ')';
},
onComplete: function () { minTimeDone = true; tryFinish(); }
});
var finished = false;
function tryFinish() {
if (finished || !ready || !minTimeDone) return;
finished = true;
var out = gsap.timeline();
out.call(function () {
killPreloader();
if (lenis) lenis.start();
document.documentElement.classList.remove('lenis-stopped');
ScrollTrigger.refresh();
}, [], 1.7);
out.to(counter, {
v: 100, duration: 0.35, ease: 'power1.in',
onUpdate: function () {
if (countEl) countEl.textContent = Math.round(counter.v);
if (barEl) barEl.style.transform = 'scaleX(' + (counter.v / 100) + ')';
}
});
out.to('.preloader-center', { yPercent: -28, opacity: 0, duration: 0.55, ease: 'power3.in' }, 0.28);
out.to('#preloader-count',  { opacity: 0, duration: 0.35 }, 0.28);
out.to('.preloader-panel.top',    { yPercent: -101, duration: 0.95, ease: 'power4.inOut' }, 0.62);
out.to('.preloader-panel.bottom', { yPercent:  101, duration: 0.95, ease: 'power4.inOut' }, 0.70);
out.add(heroEntrance(), 0.92);
}
}
function initScrollFX() {
if (reduceMotion) return;
var hero = document.querySelector('.hero');
if (hero) {
gsap.to('.hero-content', {
yPercent: -16, ease: 'none',
scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
});
// from-opacity is stated explicitly: this runs before the intro, when .eyebrow is still
// at its CSS base of 0, so an inferred start would strand it invisible on scroll-up.
gsap.fromTo('.hero-content > :not(.cta-row):not(.subhead)',
{ opacity: 1 },
{
opacity: 0.35, ease: 'none', immediateRender: false,
scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('.hero-shader', {
scale: 1.12, ease: 'none',
scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
});
[['.hero-right .col-1', -7], ['.hero-right .col-2', 9], ['.hero-right .col-3', -11]]
.forEach(function (pair) {
if (!document.querySelector(pair[0])) return;
gsap.to(pair[0], {
yPercent: pair[1], ease: 'none',
scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
});
});
}
var headlineTargets = [
'.roles-title',
'.capabilities-head h2',
'.timeline-head h2',
'.compare-title',
'.about-title',
'.testimonials-head h2',
'.cta-headline'
];
headlineTargets.forEach(function (sel) {
var el = document.querySelector(sel);
if (!el) return;
var words = splitWords(el);
if (!words.length) return;
gsap.set(words, { yPercent: 115 });
gsap.to(words, {
yPercent: 0,
duration: 0.9,
ease: 'power4.out',
stagger: 0.055,
scrollTrigger: { trigger: el, start: 'top 84%', once: true },
onComplete: function () { el.classList.add('is-revealed'); }
});
});
(function () {
var sub = document.querySelector('.subhead');
if (sub) {
var subWords = splitWords(sub);
if (subWords.length) {
gsap.set(sub, { opacity: 1 });
gsap.set(subWords, { yPercent: 115 });
gsap.to(subWords, {
yPercent: 0,
duration: 0.42,
ease: 'power3.out',
stagger: 0.014,
delay: 0.3,
onComplete: function () { sub.classList.add('is-revealed'); }
});
}
}
})();
[].forEach(function (sel) {
var el = document.querySelector(sel);
if (!el) return;
gsap.fromTo(el, { opacity: 0, y: 18 }, {
opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
scrollTrigger: { trigger: el, start: 'top 88%', once: true }
});
});
var aboutParas = gsap.utils.toArray('.about-reveal');
if (aboutParas.length) {
gsap.fromTo(aboutParas,
{ opacity: 0, y: 28 },
{
opacity: 1, y: 0,
duration: 1.15, ease: 'power3.out', stagger: 0.18,
scrollTrigger: { trigger: '.about-text', start: 'top 82%', once: true }
}
);
}
// Each card reveals on its own trigger: card lifts, title snaps in letter by letter
// (same mask reveal as the section titles), paragraph fades up behind it.
// once:true — never replays, never re-hides.
var capCards = gsap.utils.toArray('.cap-card');
capCards.forEach(function (card, i) {
var title = card.querySelector('h3');
var para  = card.querySelector('p');
var icon  = card.querySelector('.cap-icon');
var chars = title ? splitChars(title) : [];
gsap.set(card, { opacity: 0, y: 40 });
if (icon) gsap.set(icon, { opacity: 0, y: 12, scale: 0.94 });
if (chars.length) gsap.set(chars, { yPercent: 115 });
if (para) gsap.set(para, { opacity: 0, y: 12 });
var tl = gsap.timeline({
delay: i * 0.06,
scrollTrigger: { trigger: card, start: 'top 88%', once: true }
});
tl.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0);
if (icon) {
tl.to(icon, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 0.02);
}
if (chars.length) {
tl.to(chars, {
yPercent: 0, duration: 0.5, ease: 'power4.out', stagger: 0.018,
onComplete: function () { title.classList.add('is-revealed'); }
}, 0.1);
}
if (para) {
tl.to(para, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.22);
}
});
var ctaCard = document.getElementById('footer-cta-card');
if (ctaCard) {
gsap.fromTo(ctaCard, { scale: 0.94, y: 44 }, {
scale: 1, y: 0, duration: 1.1, ease: 'power3.out',
scrollTrigger: { trigger: ctaCard, start: 'top 88%', once: true }
});
}
}
function initMagnetics() {
return;
}
initScrollFX();
initMagnetics();
runIntro();
if (document.fonts && document.fonts.ready) {
document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
}
})();
;
(function(){function dup(sel){document.querySelectorAll(sel).forEach(function(t){var h=t.innerHTML;t.insertAdjacentHTML('beforeend',h);});}dup('.col-track');dup('.partners-track');})();
;
(function(){
var nav = document.getElementById('site-nav');
var burger = document.getElementById('nav-burger');
var panel = document.getElementById('nav-mobile-panel');
if (!nav || !burger || !panel) return;
if (panel.parentElement !== document.body) document.body.appendChild(panel);
function setOpen(open){
if (open) {
nav.classList.add('is-open');
panel.classList.add('is-open');
burger.setAttribute('aria-expanded','true');
burger.setAttribute('aria-label','Close menu');
document.documentElement.classList.add('is-menu-locked');
document.body.classList.add('is-menu-locked');
} else {
nav.classList.remove('is-open');
panel.classList.remove('is-open');
burger.setAttribute('aria-expanded','false');
burger.setAttribute('aria-label','Open menu');
document.documentElement.classList.remove('is-menu-locked');
document.body.classList.remove('is-menu-locked');
}
}
burger.addEventListener('click', function(e){
e.preventDefault(); e.stopPropagation();
setOpen(!nav.classList.contains('is-open'));
});
panel.querySelectorAll('.nav-mobile-link, .nav-mobile-cta').forEach(function(a){
a.addEventListener('click', function(){ setOpen(false); });
});
var backdrop = panel.querySelector('.nav-mobile-backdrop');
if (backdrop) backdrop.addEventListener('click', function(){ setOpen(false); });
document.addEventListener('keydown', function(e){
if (e.key === 'Escape' && nav.classList.contains('is-open')) {
setOpen(false); burger.focus();
}
});
var mq = window.matchMedia('(min-width: 881px)');
function onResize(){ if (mq.matches && nav.classList.contains('is-open')) setOpen(false); }
if (mq.addEventListener) mq.addEventListener('change', onResize);
else mq.addListener(onResize);
})();
;
(function(){
var heads=document.querySelectorAll('.role-head');
heads.forEach(function(btn){
btn.addEventListener('click',function(){
var li=btn.closest('.role-item');
var open=li.classList.toggle('is-open');
btn.setAttribute('aria-expanded',open?'true':'false');
});
});
})();
;
(function () {
  var card = document.querySelector('.testimonial-card--video[data-yt]');
  if (!card) return;
  var id = card.getAttribute('data-yt');
  var watchUrl = 'https://www.youtube.com/watch?v=' + id;
  var isHosted = location.protocol === 'http:' || location.protocol === 'https:';
  var started = false;

  // YouTube's player cannot validate a null origin (file:// pages), which surfaces as
  // "Error 153 / Video player configuration error". Send those viewers to YouTube instead.
  if (!isHosted) card.classList.add('is-offsite');

  function play(e) {
    if (started) return;
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!isHosted) { window.open(watchUrl, '_blank', 'noopener'); return; }
    started = true;
    var media = card.querySelector('.tcard-media') || card;
    var f = document.createElement('iframe');
    f.className = 'testimonial-embed';
    f.title = 'Video testimonial from Yanal at Peace Collective';
    f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    f.setAttribute('allowfullscreen', '');
    f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&origin=' + encodeURIComponent(location.origin);
    media.appendChild(f);
    card.classList.add('is-playing');
    if (window.gsap) { gsap.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }); }
  }
  var btn = card.querySelector('.play-button');
  if (btn) btn.addEventListener('click', play);
  card.addEventListener('click', play);
})();
