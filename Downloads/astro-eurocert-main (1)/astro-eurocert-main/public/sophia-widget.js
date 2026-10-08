(function () {
  if (window.__sophiaWidgetLoaded) return;
  window.__sophiaWidgetLoaded = true;

  var BOOT = "/sofia-boot.html?v=2";
  var FALLBACK = "https://eurocert-chatbot-frontend.vercel.app/";
  var IFRAME_ID = "sofia-widget-iframe";
  var CSS_ID = "sofia-widget-css";
  var ROOT_ID = "sofia-root";
  var BACKDROP_ID = "sofia-popup-backdrop";
  var CARD_ID = "sofia-popup-card";
  var SOFIA_VIDEO = '<video src="https://eurocert-chatbot-frontend.vercel.app/assets/sofiavideo-DXURDz3P.mp4" poster="/sofia-portrait.png" autoplay loop muted playsinline preload="auto"></video>';
  var wired = false;

  function isHomePath(path) {
    if (!path) return false;
    var p = path;
    if (p === "/") return true;
    if (p === "/index.html") return true;
    if (p.length > 1 && p.endsWith("/index.html")) return true;
    if (p.endsWith("/") && p.length > 1) {
      p = p.slice(0, -1);
    }
    if (p === "") return true;
    return false;
  }

  var isHome = isHomePath(location.pathname);
  // mode: "centered" = hero modal, "docked" = bottom-right small, "closed" = launcher only
  var mode = isHome ? "closed" : "docked";
  var seenOpen = false;
  var userClosed = isHome ? true : false;
  var usedFallback = false;
  var autoStarted = false;
  var autoOpenWanted = isHome ? false : !window.__sofiaDidAutoOpen;
  if (isHome) {
    window.__sofiaDidAutoOpen = true;
  }

  /*
   * IMPORTANT: The iframe is NEVER moved between parents after initial placement.
   * Moving an iframe in the DOM causes it to reload, losing all chat state.
   * Instead we toggle #sofia-stage visibility and use CSS to override the
   * iframe position when in "docked" mode via the .sofia-docked class on #sofia-root.
   */
  var CSS = [
    ":root{--sofia-h:180px;--sofia-gap:12px;--sofia-edge:16px}",
    "#ec-float-dock,footer.footer-premium > div.fixed.bottom-8.right-8,div.fixed.bottom-8.right-8.z-50,.ft-float{",
    "bottom:calc(var(--sofia-h) + var(--sofia-gap) + env(safe-area-inset-bottom,0px))!important;",
    "right:var(--sofia-edge)!important;",
    "z-index:999990!important;",
    "transition:bottom .25s ease,right .25s ease,opacity .2s ease!important}",
    "body.sofia-open #ec-float-dock,",
    "body.sofia-open footer.footer-premium > div.fixed.bottom-8.right-8,",
    "body.sofia-open div.fixed.bottom-8.right-8.z-50,",
    "body.sofia-open .ft-float{opacity:0!important;pointer-events:none!important;visibility:hidden!important}",

    /* Root layer */
    "#sofia-root{position:fixed;inset:0;z-index:999998;pointer-events:none}",

    /* Backdrop */
    "#sofia-popup-backdrop{position:fixed;inset:0;z-index:999998;margin:0;padding:0;border:0;width:100%;height:100%;",
    "background:rgba(4,9,20,.55);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);",
    "cursor:pointer;display:none;pointer-events:auto;transition:opacity .25s ease}",

    /* Stage = centered hero modal shell */
    "#sofia-stage{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;display:none;",
    "width:min(980px,calc(100vw - 64px));height:min(620px,86dvh);background:#fff;border-radius:28px;overflow:hidden;",
    "box-shadow:0 0 0 1px rgba(200,168,75,.55),0 30px 80px rgba(0,0,0,.55),0 8px 24px rgba(0,0,0,.3);",
    "border:0;pointer-events:auto;flex-direction:row;transition:all .3s ease}",
    "#sofia-stage.is-open{display:flex}",

    /* Portrait panel inside stage */
    "#sofia-portrait{position:relative;flex:0 0 40%;max-width:420px;min-width:220px;overflow:hidden;background:#0c1a45}",
    "#sofia-portrait:after{content:'';position:absolute;top:0;right:0;bottom:0;width:1px;background:rgba(200,168,75,.45)}",
    "#sofia-portrait img,#sofia-portrait video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 22%}",

    /* Chat slot fills the right half of the stage */
    "#sofia-chat-slot{position:relative;flex:1;min-width:0;min-height:0;background:#fff;overflow:hidden}",

    /* The iframe lives ALWAYS inside #sofia-chat-slot */
    "#sofia-widget-iframe,#sophia-chatbot-iframe{",
    "border:none!important;background:#fff!important;",
    "overflow:hidden!important;box-sizing:border-box!important;pointer-events:auto!important}",

    "#sofia-chat-slot #sofia-widget-iframe,#sofia-chat-slot #sophia-chatbot-iframe{",
    "position:absolute!important;inset:0!important;width:100%!important;height:100%!important;",
    "z-index:1!important;transform:none!important;border-radius:0!important;box-shadow:none!important;",
    "transition:none!important}",

    /*
     * DOCKED MODE: when #sofia-root has .sofia-docked class:
     * - hide the stage backdrop, portrait, and stage shell
     * - pull the iframe out of the stage flow via fixed positioning
     *   WITHOUT reparenting (it stays inside #sofia-chat-slot)
     * We achieve this by making #sofia-stage transparent + tiny +
     * making the iframe break out of clip with position:fixed overrides.
     */
    "#sofia-root.sofia-docked #sofia-popup-backdrop{display:none!important}",
    "#sofia-root.sofia-docked #sofia-stage{",
    "width:1px!important;height:1px!important;overflow:visible!important;",
    "background:transparent!important;box-shadow:none!important;border-radius:0!important;",
    "top:auto!important;left:auto!important;bottom:0!important;right:0!important;",
    "transform:none!important;display:block!important}",
    "#sofia-root.sofia-docked #sofia-portrait{display:none!important}",
    "#sofia-root.sofia-docked #sofia-chat-slot{",
    "position:fixed!important;right:20px!important;bottom:20px!important;",
    "width:min(340px,calc(100vw - 32px))!important;height:min(600px,calc(100dvh - 36px))!important;",
    "border-radius:20px!important;overflow:hidden!important;flex:none!important;",
    "box-shadow:0 16px 48px rgba(0,0,0,0.38),0 0 0 1px rgba(200,168,75,0.45)!important;",
    "background:#fff!important;z-index:999999!important;pointer-events:auto!important}",
    "#sofia-root.sofia-docked #sofia-chat-slot #sofia-widget-iframe,",
    "#sofia-root.sofia-docked #sofia-chat-slot #sophia-chatbot-iframe{",
    "position:absolute!important;inset:0!important;width:100%!important;height:100%!important;",
    "border-radius:0!important;z-index:1!important}",
    "@media(max-width:520px){#sofia-root.sofia-docked #sofia-chat-slot{right:10px!important;bottom:10px!important;width:calc(100vw - 20px)!important;height:min(560px,calc(100dvh - 20px))!important;border-radius:16px!important}}",

    /* Loading card */
    "#sofia-popup-card{position:absolute;inset:0;z-index:2;display:none;align-items:center;justify-content:center;",
    "flex-direction:column;gap:12px;background:#fff;color:#142033;pointer-events:none;",
    "font-family:Georgia,'Times New Roman',serif;text-align:center;padding:28px}",
    "#sofia-popup-card strong{font-size:22px;letter-spacing:.18em;font-weight:700}",
    "#sofia-popup-card span{font-family:system-ui,sans-serif;font-size:13px;letter-spacing:.04em;color:#5c6b80}",
    ".sofia-popup-spinner{width:36px;height:36px;border-radius:50%;border:2px solid rgba(200,168,75,.25);border-top-color:#C8A84B;animation:sofia-spin .8s linear infinite}",
    "@keyframes sofia-spin{to{transform:rotate(360deg)}}",

    /* Launcher button (avatar bottom-right) shown when closed */
    "#sofia-launcher{position:fixed;right:16px;bottom:16px;z-index:999999;width:190px;margin:0;padding:0;border:0;background:transparent;cursor:pointer;display:none;pointer-events:auto;flex-direction:column;align-items:flex-end}",
    "#sofia-launcher.is-on{display:flex}",
    ".sofia-ask{position:relative;margin:0 46px 6px 0;padding:7px 12px 8px;border-radius:999px;background:linear-gradient(180deg,#1e3054 0%,#0d1829 100%);box-shadow:0 0 0 1px rgba(200,168,75,.9),0 0 0 3px rgba(200,168,75,.22),0 6px 16px rgba(0,0,0,.4);pointer-events:none;text-align:center;animation:sofia-bubble 2.6s ease-in-out infinite}",
    ".sofia-ask strong{display:block;color:#C8A84B;font-family:system-ui,sans-serif;font-size:11px;font-weight:800;line-height:1.15;letter-spacing:.01em}",
    ".sofia-ask em{display:block;margin-top:2px;color:rgba(255,255,255,.92);font-style:normal;font-family:system-ui,sans-serif;font-size:10px;font-weight:500;line-height:1.15}",
    ".sofia-ask:after{content:'';position:absolute;right:16px;bottom:-6px;width:10px;height:10px;background:#0d1829;border-right:1.5px solid rgba(200,168,75,.9);border-bottom:1.5px solid rgba(200,168,75,.9);transform:rotate(45deg)}",
    ".sofia-face{position:relative;width:112px;height:124px;border-radius:12px;overflow:hidden;border:2px solid #c8a84b;box-shadow:0 0 14px rgba(200,168,75,.35),0 8px 18px rgba(0,0,0,.35);background:#0c1a45}",
    ".sofia-face img,.sofia-face video{width:100%;height:100%;object-fit:cover;object-position:center 12%;display:block}",
    ".sofia-ping{position:absolute;top:6px;right:6px;width:16px;height:16px;border-radius:50%;background:#ff8c00;color:#fff;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font:700 10px/1 system-ui,sans-serif;box-shadow:0 0 0 2px rgba(255,140,0,.3),0 0 8px rgba(255,140,0,.55)}",
    "@keyframes sofia-bubble{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}",
    "@media(max-width:520px){#sofia-launcher{width:122px;right:10px;bottom:10px}.sofia-face{width:58px;height:64px;border-radius:10px}.sofia-ask{margin:0 22px 5px 0;padding:5px 9px 6px}.sofia-ask strong{font-size:9.5px}.sofia-ask em{font-size:8.5px}.sofia-ask:after{right:12px;bottom:-5px;width:8px;height:8px}.sofia-ping{top:4px;right:4px;width:13px;height:13px;font-size:8px;border-width:1.5px}}",

    /* Mobile stage adjustments */
    "@media(max-width:700px){#sofia-stage{width:min(380px,calc(100vw - 24px));height:min(640px,calc(100dvh - 120px));border-radius:18px;flex-direction:column}",
    "#sofia-portrait{flex:0 0 100px;max-width:none;min-width:0;width:100%}",
    "#sofia-portrait img,#sofia-portrait video{object-position:center 32%}",
    "#sofia-portrait:after{top:auto;left:0;width:auto;height:1px}",
    "#sofia-stage.sofia-typing #sofia-portrait{display:none}}",

    "@media(prefers-reduced-motion:reduce){.sofia-popup-spinner{animation:none!important}}"
  ].join("");

  function iframeEl() {
    return document.getElementById(IFRAME_ID) || document.getElementById("sophia-chatbot-iframe");
  }
  function backdropEl() { return document.getElementById(BACKDROP_ID); }
  function cardEl() { return document.getElementById(CARD_ID); }
  function stageEl() { return document.getElementById("sofia-stage"); }
  function slotEl() { return document.getElementById("sofia-chat-slot"); }
  function launcherEl() { return document.getElementById("sofia-launcher"); }
  function rootEl() { return document.getElementById(ROOT_ID); }

  function floats() {
    return document.querySelectorAll("#ec-float-dock, .ft-float, div.fixed.bottom-8.right-8.z-50");
  }

  function viewport() {
    var vv = window.visualViewport;
    return {
      w: Math.round((vv && vv.width) || window.innerWidth || document.documentElement.clientWidth || 1200),
      h: Math.round((vv && vv.height) || window.innerHeight || document.documentElement.clientHeight || 800)
    };
  }

  function isMobile() { return viewport().w < 768; }

  function headerBottom() {
    var header = document.querySelector("nav.nav-glass") || document.querySelector("header");
    if (!header) return 0;
    var r = header.getBoundingClientRect();
    return r.bottom > 0 && r.bottom < 200 ? Math.round(r.bottom) : 0;
  }

  function centerBox(vp) {
    if (vp.w < 700) {
      var vv = window.visualViewport;
      if (vv && vv.height < window.innerHeight * 0.8) {
        return { w: vp.w - 16, h: vp.h - 16, radius: 14, cy: vv.offsetTop + vp.h / 2, typing: true };
      }
      return { w: Math.min(380, vp.w - 24), h: Math.min(640, vp.h - 120), radius: 18, cy: vp.h / 2 };
    }
    var w = Math.min(980, vp.w - 64);
    var top = headerBottom() + 20;
    var room = vp.h - top - 24;
    if (room >= 460) {
      var h = Math.min(620, room);
      return { w: w, h: h, radius: 28, cy: top + room / 2 };
    }
    return { w: w, h: Math.min(620, vp.h - 32), radius: 28, cy: vp.h / 2 };
  }

  function liftFloats(visualH, edge) {
    var gap = isMobile() ? 10 : 12;
    document.documentElement.style.setProperty("--sofia-h", visualH + "px");
    document.documentElement.style.setProperty("--sofia-gap", gap + "px");
    document.documentElement.style.setProperty("--sofia-edge", edge + "px");
    var onFostac = location.pathname.indexOf("/training/fostac") !== -1;
    floats().forEach(function (el) {
      if (onFostac && !el.classList.contains("ft-float")) {
        el.style.setProperty("display", "none", "important");
        return;
      }
      el.removeAttribute("hidden");
      el.removeAttribute("aria-hidden");
      el.style.setProperty("bottom", visualH + gap + "px", "important");
      el.style.setProperty("right", edge + "px", "important");
      if (mode !== "closed") {
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("pointer-events", "none", "important");
      } else {
        el.style.removeProperty("visibility");
        el.style.removeProperty("pointer-events");
      }
    });
  }

  function widgetDoc() {
    var iframe = iframeEl();
    if (!iframe) return null;
    try { return iframe.contentDocument; } catch (e) { return null; }
  }

  function closeChat() {
    userClosed = true;
    window.__sofiaDidAutoOpen = true;
    seenOpen = true;
    mode = "closed";
    applySize();
  }

  function minimizeToDock() {
    window.__sofiaDidAutoOpen = true;
    seenOpen = true;
    mode = "docked";
    applySize();
  }

  function reopen() {
    userClosed = false;
    mode = "docked";
    seenOpen = true;
    applySize();
    setTimeout(function () {
      var doc = widgetDoc();
      var btn = doc && doc.querySelector("button.widget-fab, button.avatar-fab");
      if (btn) btn.click();
    }, 60);
  }

  function bindInnerClose() {
    var doc = widgetDoc();
    if (!doc || doc.documentElement.__sofiaCloseBound) return;
    doc.documentElement.__sofiaCloseBound = true;
    doc.addEventListener("click", function (event) {
      var target = event.target;
      var btn = target && target.closest && target.closest("button.close-btn");
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      closeChat();
    }, true);
  }

  function flattenChatChrome() {
    var doc = widgetDoc();
    if (!doc || doc.getElementById("sofia-split-css")) return;
    var style = doc.createElement("style");
    style.id = "sofia-split-css";
    style.textContent = ".widget-iframe-root .chat-window{border-radius:0!important;box-shadow:none!important;height:100%!important}";
    (doc.head || doc.documentElement).appendChild(style);
  }

  function pokeOpen() {
    flattenChatChrome();
    bindInnerClose();
    if (!autoOpenWanted || seenOpen || userClosed || usedFallback) return;
    var doc = widgetDoc();
    if (!doc) return;
    var btn = doc.querySelector("button.widget-fab, button.avatar-fab");
    if (!btn) return;
    btn.click();
  }

  function applySize() {
    var iframe = iframeEl();
    if (!iframe) return;
    var backdrop = backdropEl();
    var card = cardEl();
    var stage = stageEl();
    var launcher = launcherEl();
    var root = rootEl();
    var vp = viewport();

    flattenChatChrome();
    bindInnerClose();

    // ── CENTERED (only after the user clicks Maximize) ────────────────────
    if (mode === "centered") {
      if (root) root.classList.remove("sofia-docked");
      var box = centerBox(vp);
      if (backdrop) backdrop.style.display = "block";
      if (stage) {
        stage.classList.add("is-open");
        stage.style.width = box.w + "px";
        stage.style.height = box.h + "px";
        stage.style.borderRadius = box.radius + "px";
        stage.style.top = Math.round(box.cy) + "px";
        stage.classList.toggle("sofia-typing", !!box.typing);
      }
      if (card) card.style.display = seenOpen ? "none" : "flex";
      if (launcher) launcher.classList.remove("is-on");
      iframe.style.display = "block";
      iframe.style.visibility = seenOpen ? "visible" : "hidden";
      iframe.style.opacity = seenOpen ? "1" : "0";
      liftFloats(box.h, 16);
      if (document.body) document.body.classList.add("sofia-open");
      document.documentElement.style.overflow = "hidden";
      return;
    }

    // ── DOCKED (Small bottom-right widget) ───────────────────────────────
    if (mode === "docked") {
      if (root) root.classList.add("sofia-docked");
      if (backdrop) backdrop.style.display = "none";
      if (card) card.style.display = seenOpen ? "none" : "flex";
      if (stage) {
        stage.classList.remove("is-open");
        // Stage stays in DOM but goes invisible via CSS; chat-slot breaks out via position:fixed
      }
      if (launcher) launcher.classList.remove("is-on");
      iframe.style.display = "block";
      iframe.style.visibility = "visible";
      iframe.style.opacity = "1";
      var edge = vp.w <= 520 ? 10 : 20;
      var h = vp.w <= 520 ? 108 : 640;
      liftFloats(h, edge);
      if (document.body) document.body.classList.remove("sofia-open");
      document.documentElement.style.overflow = "";
      return;
    }

    // ── CLOSED (Launcher only) ────────────────────────────────────────────
    if (root) root.classList.remove("sofia-docked");
    if (backdrop) backdrop.style.display = "none";
    if (card) card.style.display = "none";
    if (stage) stage.classList.remove("is-open");
    if (launcher) launcher.classList.add("is-on");
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    iframe.style.opacity = "0";
    liftFloats(vp.w <= 520 ? 108 : 200, vp.w <= 520 ? 10 : 16);
    if (document.body) document.body.classList.remove("sofia-open");
    document.documentElement.style.overflow = "";
  }

  function ensureCss() {
    if (document.getElementById(CSS_ID)) return;
    var style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureShell() {
    var root = rootEl();
    if (!root) {
      root = document.createElement("div");
      root.id = ROOT_ID;
      root.setAttribute("data-astro-transition-persist", "sofia-root");
      document.body.appendChild(root);
    }

    if (!backdropEl()) {
      var backdrop = document.createElement("button");
      backdrop.id = BACKDROP_ID;
      backdrop.type = "button";
      backdrop.setAttribute("aria-label", "Minimize chat");
      backdrop.addEventListener("click", minimizeToDock);
      root.appendChild(backdrop);
    }

    if (!stageEl()) {
      var stage = document.createElement("div");
      stage.id = "sofia-stage";
      stage.setAttribute("role", "dialog");
      stage.setAttribute("aria-label", "Sofia chat");
      stage.innerHTML = '<div id="sofia-portrait" aria-hidden="true">' + SOFIA_VIDEO + '</div><div id="sofia-chat-slot"></div>';
      root.appendChild(stage);
    }

    var launcherMarkup = '<span class="sofia-ask"><strong>Got Questions?</strong><em>Ask SOFIA</em></span><span class="sofia-face">' + SOFIA_VIDEO + '<span class="sofia-ping">!</span></span>';
    var launcher = launcherEl();
    if (!launcher) {
      launcher = document.createElement("button");
      launcher.id = "sofia-launcher";
      launcher.type = "button";
      launcher.setAttribute("aria-label", "Open Sofia chat");
      launcher.innerHTML = launcherMarkup;
      launcher.addEventListener("click", reopen);
      root.appendChild(launcher);
    } else if (!launcher.querySelector(".sofia-ask")) {
      launcher.innerHTML = launcherMarkup;
    }

    if (!cardEl()) {
      var card = document.createElement("div");
      card.id = CARD_ID;
      card.setAttribute("aria-hidden", "true");
      card.innerHTML = '<div class="sofia-popup-spinner"></div><strong>SOFIA</strong><span>Opening chat…</span>';
      var slot = slotEl();
      (slot || root).appendChild(card);
    }

    return root;
  }

  function onMessage(event) {
    var data = event.data;
    if (!data) return;

    if (data.source === "sofia-boot" && data.type === "boot-error") {
      var iframe = iframeEl();
      if (iframe && !usedFallback) {
        usedFallback = true;
        userClosed = true;
        iframe.src = FALLBACK;
      }
      applySize();
      return;
    }

    if (data.type !== "resize") return;
    if (data.source !== "sofia-widget" && data.source !== "sophia-widget") return;

    if (!data.open) {
      // close-btn clicked inside widget → show launcher
      closeChat();
      return;
    }

    seenOpen = true;
    window.__sofiaDidAutoOpen = true;

    if (data.fullscreen) {
      // Maximize button clicked → hero centered modal
      mode = "centered";
    } else {
      // Minimize button clicked → small bottom-right dock
      mode = "docked";
    }
    applySize();
  }

  /*
   * Astro <ViewTransitions /> swaps pages WITHOUT reloading, so this script
   * only ever runs once per browser session. On every client-side navigation
   * we must re-evaluate the path and demote "centered" back to docked/closed,
   * otherwise a maximized chat keeps covering the newly opened page.
   */
  function onPageNavigation() {
    isHome = isHomePath(location.pathname);
    if (isHome) {
      mode = "closed";
      userClosed = true;
    } else if (mode === "centered") {
      mode = "docked";
    }
    applySize();
  }

  function wire() {
    if (wired) return;
    wired = true;
    document.addEventListener("astro:page-load", onPageNavigation);
    window.addEventListener("message", onMessage);
    window.addEventListener("resize", applySize);
    window.addEventListener("orientationchange", function () { setTimeout(applySize, 100); });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mode === "centered") minimizeToDock();
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", applySize);
      window.visualViewport.addEventListener("scroll", applySize);
    }
  }

  function mount() {
    if (!document.body) return;
    ensureCss();
    wire();
    var root = ensureShell();

    var oldWrap = document.getElementById("sophia-chatbot-wrap");
    var iframe = iframeEl();

    if (oldWrap) {
      var nested = oldWrap.querySelector("iframe");
      if (nested && !iframe) iframe = nested;
      if (iframe && iframe.parentNode === oldWrap) {
        var slot = slotEl();
        (slot || root).appendChild(iframe);
      }
      if (oldWrap.parentNode) oldWrap.parentNode.removeChild(oldWrap);
    }

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = IFRAME_ID;
      iframe.title = "SOFIA Chat";
      iframe.setAttribute("allow", "microphone");
      var src = BOOT;
      if (autoOpenWanted && !autoStarted && !isHome) src += (src.indexOf("?") >= 0 ? "&" : "?") + "open=1";
      autoStarted = true;
      if (autoOpenWanted && !isHome) window.__sofiaDidAutoOpen = true;
      iframe.src = src;
      // Always place inside chat-slot so it never needs to move
      var slot = slotEl();
      (slot || root).appendChild(iframe);
    }

    applySize();
    pokeOpen();
  }

  function boot() {
    mount();
    setTimeout(mount, 300);
    setTimeout(mount, 1200);
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (!iframeEl()) mount();
      else { applySize(); pokeOpen(); }
      if (seenOpen || userClosed || tries > 80) clearInterval(timer);
    }, 150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () { setTimeout(mount, 50); });
})();
