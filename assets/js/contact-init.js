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
gsap.set(['.eyebrow', '.subhead', '.cta-row'], { opacity: 0, y: 26 });
gsap.set('.headline .line-1', { opacity: 1 });
gsap.set('.headline .line-2', { opacity: 1 });
if (line1) gsap.set(line1, { yPercent: 115 });
if (line2) gsap.set(line2, { yPercent: 115 });
if (cols.length) gsap.set(cols, { opacity: 0, y: 110 });
gsap.set('#site-nav', { opacity: 0, y: -56 });
tl.to('.eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.05);
if (line1) tl.to(line1, { yPercent: 0, duration: 1.05 }, 0.12);
if (line2) tl.to(line2, { yPercent: 0, duration: 1.15 }, 0.24);
tl.to('.subhead', { opacity: 1, y: 0, duration: 0.9 }, 0.46);
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
yPercent: -16, opacity: 0.35, ease: 'none',
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
var capCards = gsap.utils.toArray('.cap-card');
if (capCards.length) {
gsap.set(capCards, { opacity: 0, y: 54 });
gsap.to(capCards, {
opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.12,
scrollTrigger: { trigger: '.capabilities-grid', start: 'top 82%', once: true }
});
}
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
(function(){function dup(sel){document.querySelectorAll(sel).forEach(function(t){var h=t.innerHTML;t.insertAdjacentHTML('beforeend',h);});}dup('.col-track');dup('.partners-track');})();
(function () {
var stage = document.getElementById('contact-form-stage');
var card  = document.getElementById('contact-form-card');
if (!stage || !card) return;
var reduceMotion = window.matchMedia && (window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('low-power'));
if (reduceMotion) return;
if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) return;
var mouseX = 0, mouseY = 0, targetMX = 0, targetMY = 0, raf = null;
function update() {
raf = null;
mouseX += (targetMX - mouseX) * 0.10;
mouseY += (targetMY - mouseY) * 0.10;
var ry = mouseX * 5;
var rx = -mouseY * 4;
card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(0)';
if (Math.abs(targetMX - mouseX) > 0.005 || Math.abs(targetMY - mouseY) > 0.005) {
raf = requestAnimationFrame(update);
}
}
function schedule() { if (raf == null) raf = requestAnimationFrame(update); }
stage.addEventListener('mousemove', function (e) {
var rect = stage.getBoundingClientRect();
targetMX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
targetMY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
schedule();
}, { passive: true });
stage.addEventListener('mouseleave', function () { targetMX = 0; targetMY = 0; schedule(); });
})();
(function () {
var form = document.getElementById('contact-form-el');
var success = document.getElementById('form-success');
if (!form || !success) return;
form.addEventListener('submit', function (e) {
e.preventDefault();
var fields = [form.querySelector('#cf-name'), form.querySelector('#cf-email'), form.querySelector('#cf-message')];
var ok = true;
fields.forEach(function (el) {
if (!el.value.trim()) { ok = false; el.style.borderColor = '#ff5d5d'; el.style.boxShadow = '0 0 0 4px rgba(255,93,93,0.20)'; }
else { el.style.borderColor = ''; el.style.boxShadow = ''; }
});
if (!ok) return;
form.style.display = 'none';
success.classList.add('is-visible');
var anchor = document.getElementById('contact-form-card');
if (anchor && anchor.scrollIntoView) anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
})();
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