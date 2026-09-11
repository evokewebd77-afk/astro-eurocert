(function () {
  if (window.__sophiaWidgetLoaded) return;
  window.__sophiaWidgetLoaded = true;

  var SRC = "https://eurocert-chatbot-frontend.vercel.app/";
  var IFRAME_ID = "sofia-widget-iframe";
  var CSS_ID = "sofia-widget-css";
  var CLOSED = 340;
  var wired = false;
  var mode = "closed";
  var wantW = CLOSED;
  var wantH = CLOSED;

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
    "#sofia-widget-iframe,#sophia-chatbot-iframe{",
    "position:fixed!important;",
    "border:none!important;",
    "background:transparent!important;",
    "z-index:999999!important;",
    "overflow:hidden!important;",
    "box-sizing:border-box!important;",
    "transition:width .25s ease,height .25s ease,transform .25s ease,bottom .25s ease,right .25s ease!important",
    "}"
  ].join("");

  function iframeEl() {
    return (
      document.getElementById(IFRAME_ID) ||
      document.getElementById("sophia-chatbot-iframe")
    );
  }

  function floats() {
    return document.querySelectorAll(
      "#ec-float-dock, .ft-float, div.fixed.bottom-8.right-8.z-50"
    );
  }

  function viewport() {
    var vv = window.visualViewport;
    return {
      w: Math.round((vv && vv.width) || window.innerWidth || document.documentElement.clientWidth || 1200),
      h: Math.round((vv && vv.height) || window.innerHeight || document.documentElement.clientHeight || 800)
    };
  }

  function isMobile() {
    return viewport().w < 768;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function closedFootprint(vp) {
    var pad = vp.w < 768 ? 10 : 20;
    var maxSide;
    if (vp.w < 400) maxSide = 112;
    else if (vp.w < 768) maxSide = 128;
    else if (vp.w < 1100) maxSide = 200;
    else maxSide = 240;
    maxSide = Math.min(maxSide, vp.w - pad * 2, Math.floor(vp.h * 0.28));
    maxSide = clamp(maxSide, 96, CLOSED);
    return {
      scale: maxSide / CLOSED,
      side: maxSide,
      pad: pad
    };
  }

  function openFootprint(vp) {
    var pad = isMobile() ? 0 : 16;
    var w = wantW;
    var h = wantH;

    if (mode === "fullscreen" || isMobile()) {
      if (isMobile()) {
        return { w: vp.w, h: vp.h, pad: 0, full: true };
      }
      w = Math.max(360, Math.round(vp.w * 0.5));
      h = Math.max(480, Math.round(vp.h * 0.75));
    }

    w = clamp(w, 280, vp.w - pad * 2);
    h = clamp(h, 360, vp.h - pad * 2);
    return { w: w, h: h, pad: pad, full: false };
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

  function applySize() {
    var iframe = iframeEl();
    if (!iframe) return;

    var vp = viewport();
    var openNow = mode !== "closed";

    if (!openNow) {
      var closed = closedFootprint(vp);
      iframe.style.bottom = closed.pad + "px";
      iframe.style.right = closed.pad + "px";
      iframe.style.top = "auto";
      iframe.style.left = "auto";
      iframe.style.width = CLOSED + "px";
      iframe.style.height = CLOSED + "px";
      iframe.style.maxWidth = "none";
      iframe.style.maxHeight = "none";
      iframe.style.minWidth = "0";
      iframe.style.minHeight = "0";
      iframe.style.transform = "scale(" + closed.scale + ")";
      iframe.style.transformOrigin = "bottom right";
      liftFloats(closed.side, closed.pad);
    } else {
      var openBox = openFootprint(vp);
      iframe.style.transform = "none";
      iframe.style.transformOrigin = "bottom right";
      iframe.style.width = openBox.w + "px";
      iframe.style.height = openBox.h + "px";
      iframe.style.maxWidth = openBox.full ? "100vw" : "calc(100vw - " + openBox.pad * 2 + "px)";
      iframe.style.maxHeight = openBox.full ? "100dvh" : "calc(100dvh - " + openBox.pad * 2 + "px)";
      iframe.style.minWidth = "0";
      iframe.style.minHeight = "0";
      if (openBox.full) {
        iframe.style.bottom = "0px";
        iframe.style.right = "0px";
        iframe.style.top = "0px";
        iframe.style.left = "0px";
      } else {
        iframe.style.bottom = openBox.pad + "px";
        iframe.style.right = openBox.pad + "px";
        iframe.style.top = "auto";
        iframe.style.left = "auto";
      }
      liftFloats(openBox.h, openBox.pad || 16);
    }

    iframe.style.position = "fixed";
    iframe.style.border = "none";
    iframe.style.background = "transparent";
    iframe.style.zIndex = "999999";
    iframe.style.transition = "width 0.25s ease, height 0.25s ease, transform 0.25s ease";

    if (document.body) document.body.classList.toggle("sofia-open", openNow);
    document.documentElement.style.overflow = openNow && isMobile() ? "hidden" : "";
  }

  function ensureCss() {
    if (document.getElementById(CSS_ID)) return;
    var style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function onMessage(event) {
    var data = event.data;
    if (!data || data.type !== "resize") return;
    if (data.source !== "sofia-widget" && data.source !== "sophia-widget") return;

    if (!data.open) {
      mode = "closed";
      wantW = typeof data.width === "number" && data.width > 0 ? data.width : CLOSED;
      wantH = typeof data.height === "number" && data.height > 0 ? data.height : CLOSED;
    } else if (data.fullscreen) {
      mode = "fullscreen";
      wantW = typeof data.width === "number" && data.width > 0 ? data.width : Math.round(viewport().w * 0.5);
      wantH = typeof data.height === "number" && data.height > 0 ? data.height : Math.round(viewport().h * 0.75);
    } else {
      mode = "open";
      wantW = typeof data.width === "number" && data.width > 0 ? data.width : 400;
      wantH = typeof data.height === "number" && data.height > 0 ? data.height : 650;
    }
    applySize();
  }

  function wire() {
    if (wired) return;
    wired = true;
    window.addEventListener("message", onMessage);
    window.addEventListener("resize", applySize);
    window.addEventListener("orientationchange", function () {
      setTimeout(applySize, 100);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", applySize);
      window.visualViewport.addEventListener("scroll", applySize);
    }
  }

  function mount() {
    if (!document.body) return;
    ensureCss();

    var oldWrap = document.getElementById("sophia-chatbot-wrap");
    var iframe = iframeEl();

    if (oldWrap) {
      var nested = oldWrap.querySelector("iframe");
      if (nested && !iframe) iframe = nested;
      if (iframe && iframe.parentNode === oldWrap) document.body.appendChild(iframe);
      if (oldWrap.parentNode) oldWrap.parentNode.removeChild(oldWrap);
    }

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = IFRAME_ID;
      iframe.src = SRC;
      iframe.title = "SOFIA Chat Widget";
      iframe.setAttribute("allow", "microphone");
      iframe.setAttribute(
        "style",
        "position:fixed;bottom:20px;right:20px;width:340px;height:340px;border:none;background:transparent;z-index:999999;transform-origin:bottom right;"
      );
      document.body.appendChild(iframe);
    } else {
      iframe.id = IFRAME_ID;
      iframe.title = "SOFIA Chat Widget";
      iframe.setAttribute("allow", "microphone");
      if (!iframe.getAttribute("src")) iframe.src = SRC;
    }

    wire();
    applySize();
  }

  function boot() {
    mount();
    setTimeout(mount, 300);
    setTimeout(mount, 1200);
    setInterval(function () {
      if (!iframeEl()) mount();
      else applySize();
    }, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  window.addEventListener("load", function () {
    setTimeout(mount, 50);
  });
})();

