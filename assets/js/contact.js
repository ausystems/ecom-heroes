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
(function () {
if (typeof gsap === 'undefined') return;
gsap.fromTo('.about-description',
{ opacity: 0, y: 22 },
{ opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
scrollTrigger: { trigger: '.about-description', start: 'top 88%', once: true } }
);
gsap.fromTo('.about-cta > *',
{ opacity: 0, y: 16 },
{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
scrollTrigger: { trigger: '.about-cta', start: 'top 92%', once: true } }
);
gsap.fromTo('.world-map-image',
{ opacity: 0, y: 12 },
{ opacity: 1, y: 0, duration: 1.0, ease: 'power3.out',
scrollTrigger: { trigger: '.about-stage', start: 'top 85%', once: true } }
);
})();
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
(function () {
var canvas = document.querySelector('.hero-shader');
if (document.documentElement.classList.contains('low-power')) return;
if (!canvas) return;
var hero = canvas.closest('.hero') || canvas.parentElement;
var reduceMotion = window.matchMedia &&
(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'));
var gl = null, program = null, buffer = null;
var vShader = null, fShader = null;
var uni = {};
var rafId = null, running = false, startTime = 0;
var COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;
var DPR_CAP = COARSE ? 1.25 : 2;
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
var w = Math.max(1, Math.round(canvas.clientWidth  * dpr));
var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
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
if (en.isIntersecting) start(); else stop();
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
} else if (isHeroVisible()) {
start();
}
}
function isHeroVisible() {
var r = hero.getBoundingClientRect();
return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', bootstrap);
} else {
bootstrap();
}
})();
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