(function () {
  console.log("Content script running on:", window.location.href);

  function isHttps() {
    return window.location.protocol === "https:";
  }

  function hasPrivacyPolicyLink() {
    const links = Array.from(document.querySelectorAll("a"));
    return links.some(a =>
      /privacy/i.test(a.textContent) || /privacy/i.test(a.href)
    );
  }

  function countThirdPartyScripts() {
    const scripts = Array.from(document.scripts);
    const currentDomain = window.location.hostname;
    return scripts.filter(script => {
      if (!script.src) return false;
      try {
        const url = new URL(script.src);
        return url.hostname !== currentDomain;
      } catch (e) {
        return false;
      }
    }).length;
  }

  function detectTrackingDomains() {
    const trackers = ["google-analytics.com", "doubleclick.net", "facebook.com"];
    const scripts = Array.from(document.scripts);
    const found = new Set();

    scripts.forEach(script => {
      if (!script.src) return;
      trackers.forEach(t => {
        if (script.src.includes(t)) {
          found.add(t);
        }
      });
    });

    return Array.from(found);
  }

  const analysis = {
    url: window.location.href,
    https: isHttps(),
    hasPrivacyPolicy: hasPrivacyPolicyLink(),
    thirdPartyScriptCount: countThirdPartyScripts(),
    trackersFound: detectTrackingDomains()
  };

  chrome.runtime.sendMessage({ type: "PRIVACY_ANALYSIS", data: analysis });
})();
