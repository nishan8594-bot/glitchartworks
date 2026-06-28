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
  var GALLERY  = ["branding", "uiux", "digitalart", "art", "3d"];   // full-bleed image galleries (layout only)
  var CATEGORY = GALLERY.concat(["3d", "architecture"]);      // all six categories
  var isGallery  = GALLERY.indexOf(activeKey) !== -1;
  var isCategory = CATEGORY.indexOf(activeKey) !== -1;

  /* ── Apply saved theme — every page supports day/night ────────────────── */
  var savedDay = false;
  try { savedDay = localStorage.getItem("glitch-theme") === "day"; } catch (e) {}
  document.documentElement.classList.toggle("day", savedDay);

  /* ── Category pages: the cursor takes the page's own accent colour ────── */
  if (isCategory) document.documentElement.style.setProperty("--cursor-col", "var(--accent-eff)");
  else document.documentElement.classList.add("plain-cursor");
  if (isGallery) document.documentElement.classList.add("is-gallery");

  /* ── Canonical nav — relative links so it works on GitHub Pages ────────── */
  var NAV = [
    { label: "Branding",    href: "branding",     cat: "var(--cat-branding)" },
    { label: "UI/UX",       href: "uiux",         cat: "var(--cat-uiux)" },
    { label: "Digital Art", href: "digitalart",   cat: "var(--cat-digital)" },
    { label: "Art",         href: "art",          cat: "var(--cat-art)" },
    { label: "3D",          href: "3d",           cat: "var(--cat-3d)" },
    { label: "Architecture",href: "architecture", cat: "var(--cat-arch)" }
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
    { cls: "soc-yt", title: "YouTube", href: "http://www.youtube.com/@glitchartworks",
      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" opacity="0.9"/></svg>' },
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

    var homeActive = (active === "index.html" || active === "home") ? " active" : "";
    var header = document.createElement("header");
    header.innerHTML =
      '<div class="hdr-left">' +
        '<a href="/" class="hdr-logo' + homeActive + '" title="Home">' + HOME_ICON + "</a>" +
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
    var SUN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.3M12 19.1v2.3M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.6 12h2.3M19.1 12h2.3M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"/></svg>'; var MOON = '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M21 12.8A8.6 8.6 0 1 1 11.2 3a6.9 6.9 0 0 0 9.8 9.8Z"/></svg>'; btn.innerHTML = (savedDay ? SUN : MOON);
    btn.addEventListener("click", function () {
      var day = !document.documentElement.classList.contains("day");
      document.documentElement.classList.toggle("day", day);
      btn.innerHTML = day ? SUN : MOON;
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

  /* ── Stars: client (orange) / class (blue, pulse) / personal (blue) ─────── */
  var STAR = {
    rc: { col: "#ff8c42", label: "Real Client",   msg: "Commissioned by a real client. Delivered and applied in production." },
    hw: { col: "#4a9eff", label: "Class Project",  msg: "Academic assignment \u2014 designed to brief, executed to portfolio standard." },
    pw: { col: "#4a9eff", label: "Personal Work",  msg: "Self-initiated personal work \u2014 made to explore, not to brief." }
  };
  function starSVG(col) {
    return '<svg viewBox="0 0 20 20" fill="' + col + '" xmlns="http://www.w3.org/2000/svg"><path d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.27l-4.78 2.51.91-5.32L2.27 6.62l5.34-.78L10 1z"/></svg>';
  }
  var scTimer, scHideTimer;
  function showStarCard(el, type, autoHide) {
    var d = STAR[type], card = document.getElementById("starCard");
    if (!d || !card) return;
    clearTimeout(scTimer);
    clearTimeout(scHideTimer);
    var r = el.getBoundingClientRect();
    card.className = "star-card show " + type;
    document.getElementById("starCardLabel").textContent = d.label;
    document.getElementById("starCardMsg").textContent = d.msg;
    var left = r.right + 10, top = r.top - 10;
    if (left + 290 > window.innerWidth) left = r.left - 295;
    if (top + 90 > window.innerHeight) top = window.innerHeight - 100;
    card.style.left = left + "px";
    card.style.top = top + "px";
    if (autoHide) scTimer = setTimeout(function () { card.classList.remove("show"); }, 3500);
  }
  function hideStarCard() {
    clearTimeout(scHideTimer);
    scHideTimer = setTimeout(function () {
      var c = document.getElementById("starCard");
      if (c) c.classList.remove("show");
    }, 80);
  }
  /* Public: returns a wired star <span> (or null). type = "rc" | "hw" | "pw". */
  function makeStar(type, extraClass) {
    var d = STAR[type];
    if (!d) return null;
    var span = document.createElement("span");
    span.className = "star-badge " + type + (extraClass ? " " + extraClass : "");
    span.innerHTML = starSVG(d.col);
    span.setAttribute("data-cursor-hover", "");
    span.addEventListener("click", function (e) { e.stopPropagation(); showStarCard(span, type, true); });
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

  function buildContactOrb() {
    if (document.getElementById("contactOrb")) return null;
    var ringText = "HIRE ME   \u03DF   OPEN FOR WORK   \u03DF   LET\u2019S MAKE SOMETHING REAL   \u03DF   ";
    var SEND = '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>';
    var BOLT = '<svg viewBox="0 0 119.79 432.72" width="8" height="28" fill="currentColor" aria-hidden="true"><path d="Layer_1"/></svg>';
    var MAIL = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></svg>';
    var WA = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>';
    var LI = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>';
    var o = document.createElement("div");
    o.className = "contact-orb";
    o.id = "contactOrb";
    o.innerHTML =
      '<div class="orb-ring" aria-hidden="true"><svg class="orb-ring-svg" viewBox="0 0 220 220">' +
        '<defs><path id="orbTextPath" d="M110,110 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0"/></defs>' +
        '<text class="orb-ring-text"><textPath href="#orbTextPath" startOffset="0" textLength="540" lengthAdjust="spacing">' + ringText + '</textPath></text>' +
      '</svg></div>' +
      '<a class="orb-sat orb-sat-1" href="mailto:nishan.glitch@gmail.com" aria-label="Email">' + MAIL + '</a>' +
      '<a class="orb-sat orb-sat-2" href="https://api.whatsapp.com/send?phone=%2B60183514961" target="_blank" rel="noopener" aria-label="WhatsApp">' + WA + '</a>' +
      '<a class="orb-sat orb-sat-3" href="https://www.linkedin.com/in/nishaanthiny-shanmuggam-188259233" target="_blank" rel="noopener" aria-label="LinkedIn">' + LI + '</a>' +
      '<div class="orb-cta" id="orbCta"><span class="orb-cta-txt" id="orbCtaTxt">Hire me</span></div>' +
      '<button class="orb-core" id="orbCore" type="button" aria-label="Contact" aria-expanded="false"><span class="orb-icon">' + BOLT + '</span></button>';
    return o;
  }
  function wireContactOrb(orb) {
    if (!orb) return;
    var core = orb.querySelector("#orbCore");
    function set(open) {
      orb.classList.toggle("open", open);
      core.setAttribute("aria-expanded", open ? "true" : "false");
    }
    core.addEventListener("click", function (e) { e.stopPropagation(); set(!orb.classList.contains("open")); });
    document.addEventListener("click", function (e) {
      if (orb.classList.contains("open") && (!e.target.closest || !e.target.closest(".contact-orb"))) set(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });

    var ctas = ["Hire me", "Let\u2019s talk", "Open for work", "Got a project?", "Work with me", "Available now"];
    var ctaTxt = orb.querySelector("#orbCtaTxt"), ci = 0;
    setInterval(function () {
      if (orb.classList.contains("open")) return;
      ci = (ci + 1) % ctas.length;
      ctaTxt.style.opacity = "0";
      setTimeout(function () { ctaTxt.textContent = ctas[ci]; ctaTxt.style.opacity = "1"; }, 350);
    }, 3600);
    var ctaEl = orb.querySelector("#orbCta");
    if (ctaEl) ctaEl.addEventListener("click", function (e) { e.stopPropagation(); set(true); });
  }

  var injected = false;
  function inject() {
    if (injected) return;          // idempotent: guard against double DOMContentLoaded / double include
    injected = true;
    var body = document.body;

    if (!document.querySelector(".orb2")) {
      var o2 = document.createElement("div"); o2.className = "orb orb2";
      body.insertBefore(o2, body.firstChild);
    }
    if (!document.querySelector(".orb1")) {
      var o1 = document.createElement("div"); o1.className = "orb orb1";
      body.insertBefore(o1, body.firstChild);
    }

    if (!document.querySelector(".scanline")) {
      var sl = document.createElement("div"); sl.className = "scanline";
      body.insertBefore(sl, body.firstChild);
    }

    if (!document.querySelector('link[rel="icon"]')) {
      var GLITCH_FAVICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#0d0d0c"/><g transform="translate(39.5,12) scale(0.1756)"><path fill="#2bff88" d="Layer_1"/></g></svg>';
      var fav = document.createElement("link");
      fav.rel = "icon"; fav.type = "image/svg+xml";
      fav.href = "data:image/svg+xml," + encodeURIComponent(GLITCH_FAVICON);
      document.head.appendChild(fav);
    }

    body.insertBefore(buildToggle(), body.firstChild);   // standard on every page
    body.insertBefore(buildHeader(), body.firstChild);

    if (!document.querySelector("footer")) body.appendChild(buildFooter());

    if (!document.getElementById("contactOrb")) {
      var orb = buildContactOrb();
      body.appendChild(orb);
      wireContactOrb(orb);
    }

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

    /* Hover to reveal the star card — works for badges built by core OR by a
       page's own gallery script, since this delegates on the document and the
       card text is identical to the click path. */
    document.addEventListener("mouseover", function (e) {
      var b = e.target.closest && e.target.closest(".star-badge");
      if (b) showStarCard(b, b.classList.contains("hw") ? "hw" : b.classList.contains("pw") ? "pw" : "rc", false);
    });
    document.addEventListener("mouseout", function (e) {
      var b = e.target.closest && e.target.closest(".star-badge");
      if (b) hideStarCard();
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
