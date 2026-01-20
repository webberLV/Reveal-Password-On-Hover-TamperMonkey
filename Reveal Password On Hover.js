// ==UserScript==
// @name         Reveal Password On Hover
// @namespace    https://greasyfork.org/en/scripts/563194-reveal-password-on-hover
// @match        *://*/*
// @description  Temporarily shows password text while the field is focused or hovered
// @author       webberLV
// @license      MIT
// @version      1.2
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  const FLAG = "showpassBound";

  function setType(el, type) {
    try {
      if (el && el.tagName === "INPUT" && el.type !== type) el.type = type;
    } catch (_) {}
  }

  function bind(input) {
    if (!input || input.tagName !== "INPUT") return;
    if (input.dataset[FLAG]) return;
    if (input.type !== "password") return;

    input.dataset[FLAG] = "1";

    // Focus behavior
    input.addEventListener("focusin", () => setType(input, "text"), true);
    input.addEventListener("focusout", () => setType(input, "password"), true);

    // Hover behavior
    input.addEventListener("mouseenter", () => setType(input, "text"), true);
    input.addEventListener("mouseleave", () => {
      if (document.activeElement !== input) setType(input, "password");
    }, true);

    // Some sites rewrite attributes after input; keep it stable while active/hovered.
    const keep = () => {
      const hovered = input.matches(":hover");
      const focused = document.activeElement === input;
      if (hovered || focused) setType(input, "text");
    };
    input.addEventListener("input", keep, true);
    input.addEventListener("keydown", keep, true);
  }

  function scan(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("input[type='password']").forEach(bind);
  }

  scan(document);

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n && n.nodeType === 1) {
          if (n.matches?.("input[type='password']")) bind(n);
          scan(n);
        }
      }
    }
  });

  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
