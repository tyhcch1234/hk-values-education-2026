/* 價值觀教育 · 資料站 —— 零依賴前端邏輯 */
(function () {
  "use strict";

  var bar = document.getElementById("pg");
  var busy = false;
  function onScroll() {
    if (busy) return;
    busy = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
      if (bar) bar.style.width = Math.min(100, Math.max(0, p * 100)) + "%";
      busy = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var links = [].slice.call(document.querySelectorAll("#navlinks a"));
  var targets = links.map(function (a) {
    var el = document.querySelector(a.getAttribute("href"));
    return el ? { a: a, el: el } : null;
  }).filter(Boolean);

  if ("IntersectionObserver" in window && targets.length) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
      });
      var best = null, top = 0;
      targets.forEach(function (t) {
        var v = seen[t.el.id] || 0;
        if (v > top) { top = v; best = t; }
      });
      if (best) links.forEach(function (l) { l.classList.toggle("active", l === best.a); });
    }, { rootMargin: "-72px 0px -55% 0px", threshold: [0, 0.12, 0.35, 0.7] });
    targets.forEach(function (t) { io.observe(t.el); });
  }

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();
