let lastAnalysis = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PRIVACY_ANALYSIS") {
    const analysis = message.data;
    const score = computePrivacyScore(analysis);

    lastAnalysis = { ...analysis, score };
    chrome.storage.local.set({ lastAnalysis });

    console.log("Background received:", analysis);
    console.log("Computed score:", score);
  }
});

function computePrivacyScore(a) {
  let score = 100;

  if (!a.https) score -= 30;
  if (!a.hasPrivacyPolicy) score -= 10;

  if (a.thirdPartyScriptCount > 0 && a.thirdPartyScriptCount <= 5) {
    score -= 10;
  } else if (a.thirdPartyScriptCount > 5) {
    score -= 25;
  }

  if (a.trackersFound.length > 0) {
    score -= 20;
  }

  return Math.max(score, 0);
}
