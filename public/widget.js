(function () {
  "use strict";

  var script = document.currentScript ||
    document.querySelector("script[data-widget-id]");
  if (!script) return;

  var widgetId = script.getAttribute("data-widget-id");
  if (!widgetId) return;

  // Derive base URL from the script src so it works on any domain
  var scriptSrc = script.src;
  var baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf("/"));

  var messages = [];
  var loading = false;
  var open = false;
  var config = null;

  // ── Fetch client config ────────────────────────────────────────────────────

  function init() {
    fetch(baseUrl + "/api/widget-config?widgetId=" + encodeURIComponent(widgetId))
      .then(function (r) { return r.json(); })
      .then(function (cfg) {
        config = cfg;
        messages = [{ role: "assistant", content: cfg.greeting }];
        buildUI();
      })
      .catch(function () {
        // Silently fail — don't break the client's site
      });
  }

  // ── Build UI ───────────────────────────────────────────────────────────────

  function buildUI() {
    var accent = config.accentColor || "#E11D2A";
    var bg = config.bgColor || "#0a0a0a";
    var textLight = "#ececef";
    var bubbleBg = "#161616";
    var borderColor = "#242424";

    // Inject styles
    var style = document.createElement("style");
    style.textContent = [
      "@keyframes _unrvld_fadeIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}",
      "@keyframes _unrvld_blink{0%,80%,100%{opacity:.2}40%{opacity:1}}",
      "@keyframes _unrvld_pulse{0%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 " + accent + "55}70%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 16px " + accent + "00}100%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 " + accent + "00}}",
      "._unrvld_dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:" + accent + ";animation:_unrvld_blink 1.2s infinite;}",
      "._unrvld_dot:nth-child(2){animation-delay:.2s}",
      "._unrvld_dot:nth-child(3){animation-delay:.4s}",
      "._unrvld_panel{animation:_unrvld_fadeIn .2s ease}",
      "._unrvld_scroll::-webkit-scrollbar{width:4px}",
      "._unrvld_scroll::-webkit-scrollbar-track{background:transparent}",
      "._unrvld_scroll::-webkit-scrollbar-thumb{background:#333;border-radius:2px}",
      "._unrvld_fab{transition:transform .15s ease;cursor:pointer;animation:_unrvld_pulse 2.6s infinite}",
      "._unrvld_fab:hover{transform:scale(1.07)}",
      "._unrvld_input{outline:none!important;box-sizing:border-box}",
      "._unrvld_send:hover{opacity:.85}",
      "._unrvld_msg{word-break:break-word;white-space:pre-wrap}",
    ].join("");
    document.head.appendChild(style);

    // FAB button
    var fab = el("button", {
      className: "_unrvld_fab",
      title: "Chat with us",
      style: css({
        position: "fixed", bottom: "24px", right: "24px", zIndex: "2147483647",
        width: "60px", height: "60px", borderRadius: "50%",
        background: accent, border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,.5)",
      }),
    });
    fab.innerHTML = chatIcon("#fff");
    fab.addEventListener("click", togglePanel);
    document.body.appendChild(fab);

    // Panel
    var panel = el("div", {
      className: "_unrvld_panel",
      style: css({
        display: "none", flexDirection: "column",
        position: "fixed", bottom: "100px", right: "24px", zIndex: "2147483646",
        width: "420px", maxWidth: "calc(100vw - 40px)",
        height: "600px", maxHeight: "calc(100vh - 130px)",
        background: bg, borderRadius: "18px",
        border: "1px solid " + borderColor,
        boxShadow: "0 8px 48px rgba(0,0,0,.75)",
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
        overflow: "hidden",
      }),
    });

    // Header
    var header = el("div", {
      style: css({
        padding: "15px 18px", borderBottom: "1px solid " + borderColor,
        display: "flex", alignItems: "center", gap: "10px", flexShrink: "0",
      }),
    });
    var avatar = el("div", {
      style: css({
        width: "34px", height: "34px", borderRadius: "50%", background: accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px",
        flexShrink: "0",
      }),
    });
    avatar.textContent = (config.name || "AI").charAt(0).toUpperCase();
    var headerText = el("div");
    var headerName = el("div", { style: css({ color: "#fff", fontSize: "14px", fontWeight: "600" }) });
    headerName.textContent = config.name || "UNRVLD";
    var headerSub = el("div", { style: css({ color: "#7a7a7a", fontSize: "11.5px" }) });
    headerSub.textContent = "Online now";
    headerText.appendChild(headerName);
    headerText.appendChild(headerSub);
    header.appendChild(avatar);
    header.appendChild(headerText);
    panel.appendChild(header);

    // Messages area
    var msgArea = el("div", {
      className: "_unrvld_scroll",
      style: css({
        flex: "1", overflowY: "auto", padding: "18px 16px",
        display: "flex", flexDirection: "column", gap: "10px",
      }),
    });
    panel.appendChild(msgArea);

    // Input area
    var inputArea = el("div", {
      style: css({
        padding: "12px 14px", borderTop: "1px solid " + borderColor,
        display: "flex", gap: "8px", alignItems: "flex-end", flexShrink: "0",
      }),
    });
    var textarea = el("textarea", {
      className: "_unrvld_input",
      placeholder: "Type a message...",
      rows: "1",
      style: css({
        flex: "1", background: bubbleBg, border: "1px solid #2c2c2c",
        borderRadius: "10px", color: textLight, fontSize: "14px",
        padding: "10px 13px", resize: "none", fontFamily: "inherit",
        lineHeight: "1.5", maxHeight: "110px", overflowY: "auto",
      }),
    });
    var sendBtn = el("button", {
      className: "_unrvld_send",
      title: "Send",
      style: css({
        width: "38px", height: "38px", borderRadius: "10px",
        background: "#222", border: "none", cursor: "default",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: "0", transition: "background .15s ease",
      }),
    });
    sendBtn.innerHTML = sendIcon("#555");

    textarea.addEventListener("input", function () {
      updateSendBtn();
    });
    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    sendBtn.addEventListener("click", sendMessage);

    inputArea.appendChild(textarea);
    inputArea.appendChild(sendBtn);
    panel.appendChild(inputArea);
    document.body.appendChild(panel);

    // Teaser bubble — auto-pops so visitors see it's a live chat, not just a button
    var teaser = el("div", {
      style: css({
        position: "fixed", bottom: "100px", right: "24px", zIndex: "2147483646",
        maxWidth: "250px", background: bubbleBg, color: textLight,
        border: "1px solid " + accent, borderRadius: "16px 16px 4px 16px",
        padding: "13px 34px 13px 15px", fontSize: "14px", lineHeight: "1.5",
        boxShadow: "0 10px 36px rgba(0,0,0,.6)", cursor: "pointer",
        display: "none",
      }),
    });
    teaser.textContent = config.teaser || "Got a project in mind? Let's talk.";
    var teaserClose = el("div", {
      title: "Dismiss",
      style: css({
        position: "absolute", top: "6px", right: "10px",
        color: "#888", fontSize: "17px", lineHeight: "1", cursor: "pointer",
      }),
    });
    teaserClose.innerHTML = "&times;";
    teaser.appendChild(teaserClose);
    document.body.appendChild(teaser);

    teaser.addEventListener("click", function () { hideTeaser(); if (!open) togglePanel(); });
    teaserClose.addEventListener("click", function (e) { e.stopPropagation(); hideTeaser(); });

    // Pop the teaser shortly after load, unless the visitor already opened the chat
    setTimeout(function () {
      if (!open) { teaser.style.display = "block"; teaser.classList.add("_unrvld_panel"); }
    }, 1400);

    // ── Internal helpers ─────────────────────────────────────────────────────

    function hideTeaser() {
      teaser.style.display = "none";
    }

    function togglePanel() {
      open = !open;
      if (open) {
        hideTeaser();
        panel.style.display = "flex";
        panel.classList.remove("_unrvld_panel");
        void panel.offsetWidth; // reflow to retrigger animation
        panel.classList.add("_unrvld_panel");
        fab.innerHTML = closeIcon("#fff");
        renderMessages();
        setTimeout(function () { textarea.focus(); }, 50);
      } else {
        panel.style.display = "none";
        fab.innerHTML = chatIcon("#fff");
      }
    }

    function renderMessages() {
      msgArea.innerHTML = "";
      messages.forEach(function (msg) {
        var isUser = msg.role === "user";
        var row = el("div", {
          style: css({ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }),
        });
        var bubble = el("div", {
          className: "_unrvld_msg",
          style: css({
            maxWidth: "82%", padding: "10px 14px",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: isUser ? accent : bubbleBg,
            color: isUser ? "#fff" : textLight,
            fontSize: "14px", lineHeight: "1.55",
          }),
        });
        bubble.textContent = msg.content;
        row.appendChild(bubble);
        msgArea.appendChild(row);
      });
      if (loading) {
        var dotsRow = el("div", { style: css({ display: "flex" }) });
        var dotsBubble = el("div", {
          style: css({
            padding: "11px 15px", borderRadius: "16px 16px 16px 4px",
            background: bubbleBg, display: "flex", gap: "5px", alignItems: "center",
          }),
        });
        for (var i = 0; i < 3; i++) {
          dotsBubble.appendChild(el("span", { className: "_unrvld_dot" }));
        }
        dotsRow.appendChild(dotsBubble);
        msgArea.appendChild(dotsRow);
      }
      msgArea.scrollTop = msgArea.scrollHeight;
    }

    function updateSendBtn() {
      var hasText = textarea.value.trim().length > 0;
      sendBtn.style.background = (hasText && !loading) ? accent : "#222";
      sendBtn.style.cursor = (hasText && !loading) ? "pointer" : "default";
      sendBtn.innerHTML = sendIcon((hasText && !loading) ? "#fff" : "#555");
    }

    function sendMessage() {
      var text = textarea.value.trim();
      if (!text || loading) return;
      messages.push({ role: "user", content: text });
      textarea.value = "";
      loading = true;
      updateSendBtn();
      renderMessages();

      fetch(baseUrl + "/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          widgetId: widgetId,
          messages: messages.map(function (m) { return { role: m.role, content: m.content }; }),
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          messages.push({ role: "assistant", content: data.text });
        })
        .catch(function () {
          messages.push({ role: "assistant", content: "Something went wrong — please try again." });
        })
        .finally(function () {
          loading = false;
          updateSendBtn();
          renderMessages();
        });
    }

    // Initial render
    renderMessages();
  }

  // ── DOM helpers ───────────────────────────────────────────────────────────────

  function el(tag, props) {
    var node = document.createElement(tag);
    if (!props) return node;
    Object.keys(props).forEach(function (k) {
      if (k === "style") { node.style.cssText = props[k]; }
      else { node[k] = props[k]; }
    });
    return node;
  }

  function css(obj) {
    return Object.keys(obj).map(function (k) {
      var prop = k.replace(/([A-Z])/g, function (m) { return "-" + m.toLowerCase(); });
      return prop + ":" + obj[k];
    }).join(";");
  }

  function chatIcon(color) {
    return '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="' + color + '"/></svg>';
  }

  function closeIcon(color) {
    return '<svg width="22" height="22" viewBox="0 0 20 20" fill="none"><line x1="4" y1="4" x2="16" y2="16" stroke="' + color + '" stroke-width="2.2" stroke-linecap="round"/><line x1="16" y1="4" x2="4" y2="16" stroke="' + color + '" stroke-width="2.2" stroke-linecap="round"/></svg>';
  }

  function sendIcon(color) {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="' + color + '"/></svg>';
  }

  // ── Start ──────────────────────────────────────────────────────────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
