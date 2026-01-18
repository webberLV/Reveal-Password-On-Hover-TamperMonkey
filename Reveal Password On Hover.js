// ==UserScript==
// @name         Show Password On Focus
// @match        *://*/*
// @description  Show password when focus on password field
// @author       webberLV
// @license      MIT
// @version      1.1
// ==/UserScript==

(function () {
  "use strict";

  function applyToField(field) {
    if (field.dataset.showpass) return;
    field.dataset.showpass = "true";

    field.addEventListener("focus", function () {
      try { this.type = "text"; } catch (e) {}
    });

    field.addEventListener("blur", function () {
      try { this.type = "password"; } catch (e) {}
    });
  }

  function scan() {
    document.querySelectorAll("input[type='password']").forEach(applyToField);
  }

  // Initial scan
  scan();

  // Watch for dynamically added inputs
  new MutationObserver(scan).observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
})();
