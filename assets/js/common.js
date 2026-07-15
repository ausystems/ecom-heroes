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