/* ============================================================================
   GLITCH ARTWORKS — SHARED CORE  (glitch-core.js)
   Injects the chrome (orbs, header+nav, day/night toggle, footer, lightning)
   into every page so the markup lives in exactly one place.

   Per-page use — just two lines in <head>, plus the accent:
     <link rel="stylesheet" href="glitch-core.css">
     <script defer src="glitch-core.js"></script>
     <style>:root{ --accent:#ff7f00; }</style>

   Optional overrides (set BEFORE the script runs):
     window.GLITCH = { active:'architecture', footerRight:'…' };
   Active nav is auto-detected from the filename if not given.

   Pages can listen for theme changes:
     window.addEventListener('glitch:themechange', e => { e.detail.day });
   ============================================================================ */
(function () {
  "use strict";

  var CFG = window.GLITCH || {};

  /* ── Which page is this? ──────────────────────────────────────────────── */
  var activeKey = (CFG.active || currentFile()).replace(/\.html$/i, "").toLowerCase();
  var GALLERY  = ["branding", "uiux", "digitalart", "art"];   // full-bleed image galleries (layout only)
  var CATEGORY = GALLERY.concat(["3d", "architecture"]);      // all six categories
  var isGallery  = GALLERY.indexOf(activeKey) !== -1;
  var isCategory = CATEGORY.indexOf(activeKey) !== -1;

  /* ── Apply saved theme — every page supports day/night ────────────────── */
  var savedDay = false;
  try { savedDay = localStorage.getItem("glitch-theme") === "day"; } catch (e) {}
  if (isGallery) savedDay = false;   // galleries are dark-only
  document.documentElement.classList.toggle("day", savedDay);

  /* ── Category pages: the cursor takes the page's own accent colour ────── */
  if (isCategory) document.documentElement.style.setProperty("--cursor-col", "var(--accent-eff)");
  if (isGallery) document.documentElement.classList.add("is-gallery");

  /* ── Canonical nav — relative links so it works on GitHub Pages ────────── */
  var NAV = [
    { label: "Branding",    href: "branding.html",     cat: "var(--cat-branding)" },
    { label: "UI/UX",       href: "uiux.html",         cat: "var(--cat-uiux)" },
    { label: "Digital Art", href: "digitalart.html",   cat: "var(--cat-digital)" },
    { label: "Art",         href: "art.html",          cat: "var(--cat-art)" },
    { label: "3D",          href: "3d.html",           cat: "var(--cat-3d)" },
    { label: "Architecture",href: "architecture.html", cat: "var(--cat-arch)" },
    { label: "Contact",     href: "contact.html",      cat: "var(--util-red)" }
  ];

  var SOCIAL = [
    { cls: "soc-ig", title: "Instagram", href: "https://www.instagram.com/glitchartworks/",
      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.5" cy="6.5" r="1.2"/></svg>' },
    { cls: "soc-fb", title: "Facebook", href: "https://www.facebook.com/glitchartworks",
      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
    { cls: "soc-wa", title: "WhatsApp", href: "https://api.whatsapp.com/send?phone=%2B60183514961",
      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' },
    { cls: "soc-li", title: "LinkedIn", href: "http://www.linkedin.com/in/nishaanthiny-shanmuggam-188259233",
      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>' },
    { cls: "soc-tt", title: "TikTok", href: "https://www.tiktok.com/@glitchartworks",
      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.67a8.16 8.16 0 0 0 4.77 1.52V7.74a4.85 4.85 0 0 1-1-.05z"/></svg>' }
  ];

  var HOME_ICON = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M10 2.5L2 9.5h2V17h5v-4h2v4h5V9.5h2L10 2.5z"/></svg>';

  var BOLT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 765.89 730.83" style="height:90vh;width:auto;filter:drop-shadow(0 0 30px #ff2200) drop-shadow(0 0 80px #ff4400) drop-shadow(0 0 120px rgba(255,60,0,0.5));"><path d="M339.87,359.6s-3.8,5.58-13.9,14c-.13.11-.57.47-1.26.7-1.25.43-2.94.28-3.88-.61-.99-.94-.93-2.48-.89-3.34.69-13.67,2.22-21.81,2.22-21.81.1-.52.15-.77.18-.95,1.37-7.14,20.58-102.86,69.77-347.37l-.57-.21c-27.53,131.91-55.05,263.82-82.58,395.72.13-.08.27-.15.4-.23,3.39-3.66,5.97-6.7,7.55-8.61,2.35-2.83,8.63-9.64,21.2-23.26.76-.83,2.25-2.4,3.22-2.01,1.47.59.86,5.3.65,6.9-1.22,9.43-42.22,213.27-72.26,362.16.26.05.53.11.79.16,27.53-131.91,55.05-263.82,82.58-395.72-.24-.07-.48-.14-.72-.21-1.92,5.15-5.98,15.11-12.5,24.7Z" fill="#ff3300"/><path d="M339.87,359.6s-3.8,5.58-13.9,14c-.13.11-.57.47-1.26.7-1.25.43-2.94.28-3.88-.61-.99-.94-.93-2.48-.89-3.34.69-13.67,2.22-21.81,2.22-21.81.1-.52.15-.77.18-.95,1.37-7.14,20.58-102.86,69.77-347.37l-.57-.21c-27.53,131.91-55.05,263.82-82.58,395.72.13-.08.27-.15.4-.23,3.39-3.66,5.97-6.7,7.55-8.61,2.35-2.83,8.63-9.64,21.2-23.26.76-.83,2.25-2.4,3.22-2.01,1.47.59.86,5.3.65,6.9-1.22,9.43-42.22,213.27-72.26,362.16.26.05.53.11.79.16,27.53-131.91,55.05-263.82,82.58-395.72-.24-.07-.48-.14-.72-.21-1.92,5.15-5.98,15.11-12.5,24.7Z" fill="white" opacity="0.4"/></svg>';

  function currentFile() {
    var p = location.pathname.split("/").pop().toLowerCase();
    if (!p || p === "index.html") return "index.html";
    return p;
  }

  function buildHeader() {
    var active = (CFG.active || currentFile()).replace(/\.html$/i, "").toLowerCase();
    var navHTML = NAV.map(function (n) {
      var isActive = n.href.replace(/\.html$/i, "").toLowerCase() === active;
      var style = n.cat ? ' style="--cat:' + n.cat + '"' : "";
      return '<a class="nav-link' + (isActive ? " active" : "") + '" href="' + n.href + '"' + style + '>' + n.label + "</a>";
    }).join("");

    var socHTML = SOCIAL.map(function (s) {
      return '<a class="soc-icon ' + s.cls + '" href="' + s.href + '" target="_blank" rel="noopener" title="' + s.title + '">' + s.svg + "</a>";
    }).join("");

    var homeActive = active === "index.html" ? " active" : "";
    var header = document.createElement("header");
    header.innerHTML =
      '<div class="hdr-left">' +
        '<a href="index.html" class="hdr-logo' + homeActive + '" title="Home">' + HOME_ICON + "</a>" +
        "<nav>" + navHTML + "</nav>" +
      "</div>" +
      '<div class="hdr-right">' + socHTML + "</div>";
    return header;
  }

  function buildToggle() {
    var btn = document.createElement("button");
    btn.className = "theme-float";
    btn.id = "themeToggle";
    btn.title = "Toggle day/night";
    btn.setAttribute("aria-label", "Toggle day/night");
    btn.innerHTML = '<div class="theme-float-knob" id="themeKnob">' + (savedDay ? "\u2600\uFE0F" : "\uD83C\uDF19") + "</div>";
    btn.addEventListener("click", function () {
      var day = !document.documentElement.classList.contains("day");
      document.documentElement.classList.toggle("day", day);
      document.getElementById("themeKnob").textContent = day ? "\u2600\uFE0F" : "\uD83C\uDF19";
      try { localStorage.setItem("glitch-theme", day ? "day" : "night"); } catch (e) {}
      window.dispatchEvent(new CustomEvent("glitch:themechange", { detail: { day: day } }));
    });
    return btn;
  }

  function buildFooter() {
    var f = document.createElement("footer");
    f.innerHTML =
      '<span class="foot-l">' + (CFG.footerLeft || "\u00A9 2026 Glitch Artworks \u2014 Nishan. Penang \u00B7 Kuala Lumpur") + "</span>" +
      '<span class="foot-c">' + (CFG.footerCenter || "All works are copyrighted") + "</span>" +
      '<span class="foot-r">' + (CFG.footerRight || "Architect by training. Artist by nature.") + "</span>";
    return f;
  }

  /* ── Stars: shared client / coursework badges ─────────────────────────── */
  function starSVG(isHw) {
    var col = isHw ? "#4a9eff" : "#ff8c42";
    return '<svg viewBox="0 0 20 20" fill="' + col + '" xmlns="http://www.w3.org/2000/svg"><path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.27l-4.78 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z"/></svg>';
  }
  var scTimer;
  function showStarCard(el, isHw) {
    var card = document.getElementById("starCard");
    if (!card) return;
    clearTimeout(scTimer);
    var r = el.getBoundingClientRect();
    card.className = "star-card show " + (isHw ? "hw" : "rc");
    document.getElementById("starCardLabel").textContent = isHw ? "Class Project" : "Real Client";
    document.getElementById("starCardMsg").textContent = isHw
      ? "Academic assignment \u2014 designed to brief, executed to portfolio standard."
      : "Commissioned by a real client. Delivered and applied in production.";
    var left = r.right + 10, top = r.top - 10;
    if (left + 290 > window.innerWidth) left = r.left - 295;
    if (top + 90 > window.innerHeight) top = window.innerHeight - 100;
    card.style.left = left + "px";
    card.style.top = top + "px";
    scTimer = setTimeout(function () { card.classList.remove("show"); }, 3500);
  }
  /* Public: returns a wired star <span> (or null). type = "hw" | "rc". */
  function makeStar(type, extraClass) {
    if (type !== "hw" && type !== "rc") return null;
    var isHw = type === "hw";
    var span = document.createElement("span");
    span.className = "star-badge " + type + (extraClass ? " " + extraClass : "");
    span.innerHTML = starSVG(isHw);
    span.setAttribute("data-cursor-hover", "");
    span.addEventListener("click", function (e) { e.stopPropagation(); showStarCard(span, isHw); });
    return span;
  }

  function buildLightning() {
    var wrap = document.createElement("div");
    wrap.id = "lightning";
    wrap.innerHTML = BOLT + '<div id="lightning-msg">\u26A1 nice try \u2014 this work is protected \u26A1</div>';
    return wrap;
  }

  function wireProtection(lightning) {
    var t;
    function strike() {
      clearTimeout(t);
      lightning.classList.remove("strike");
      void lightning.offsetWidth;
      lightning.classList.add("strike");
      t = setTimeout(function () { lightning.classList.remove("strike"); }, 1400);
    }
    document.addEventListener("contextmenu", function (e) { if (e.target.tagName === "IMG") { e.preventDefault(); strike(); } });
    document.addEventListener("dragstart",   function (e) { if (e.target.tagName === "IMG") { e.preventDefault(); strike(); } });
  }

  var injected = false;
  function inject() {
    if (injected) return;          // idempotent: guard against double DOMContentLoaded / double include
    injected = true;
    var body = document.body;

    if (!document.querySelector(".orb")) {
      var o1 = document.createElement("div"); o1.className = "orb orb1";
      var o2 = document.createElement("div"); o2.className = "orb orb2";
      body.insertBefore(o2, body.firstChild);
      body.insertBefore(o1, body.firstChild);
    }

    if (!isGallery) body.insertBefore(buildToggle(), body.firstChild);  // dark-only galleries get no toggle
    body.insertBefore(buildHeader(), body.firstChild);

    if (!document.querySelector("footer")) body.appendChild(buildFooter());

    var lightning = buildLightning();
    body.appendChild(lightning);
    wireProtection(lightning);

    if (!document.getElementById("starCard")) {
      var sc = document.createElement("div");
      sc.className = "star-card";
      sc.id = "starCard";
      sc.innerHTML = '<span class="star-card-label" id="starCardLabel"></span><p class="star-card-msg" id="starCardMsg"></p>';
      body.appendChild(sc);
    }
    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest(".star-badge")) {
        var c = document.getElementById("starCard");
        if (c) c.classList.remove("show");
      }
    });

    initCursor();
  }

  function initCursor() {
    if (document.getElementById("cursor")) return;
    if (!window.matchMedia || !window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;

    var cur = document.createElement("div");
    cur.id = "cursor";
    cur.innerHTML = '<div class="ring"></div><div class="dot"></div>';
    var glow = document.createElement("div");
    glow.id = "cursor-glow";
    document.body.appendChild(cur);
    document.body.appendChild(glow);

    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, gx = cx, gy = cy;
    document.addEventListener("mousemove", function (e) {
      cx = e.clientX; cy = e.clientY;
      cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      glow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", function () { glow.style.opacity = "0"; });
    (function anim() {
      gx += (cx - gx) * 0.09; gy += (cy - gy) * 0.09;
      glow.style.left = gx + "px"; glow.style.top = gy + "px";
      requestAnimationFrame(anim);
    })();

    var SEL = "a,button,input,select,textarea,[role=button],.nav-link,.soc-icon,.hdr-logo,.theme-float,[data-cursor-hover]";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(SEL)) cur.classList.add("hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(SEL)) cur.classList.remove("hover");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }

  /* Expose shared helpers for per-page galleries to use. */
  window.GLITCH = window.GLITCH || {};
  window.GLITCH.makeStar = makeStar;
  window.GLITCH.showStarCard = showStarCard;
  window.GLITCH.starSVG = starSVG;
})();
