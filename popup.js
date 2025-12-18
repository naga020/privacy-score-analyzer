document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("lastAnalysis", ({ lastAnalysis }) => {
    if (!lastAnalysis) {
      document.getElementById("score").textContent = "No data yet.";
      return;
    }

    document.getElementById("score").textContent = lastAnalysis.score + "/100";

    document.getElementById("https").textContent = lastAnalysis.https ? "Yes" : "No";
    document.getElementById("policy").textContent = lastAnalysis.hasPrivacyPolicy ? "Yes" : "No";
    document.getElementById("thirdParty").textContent = lastAnalysis.thirdPartyScriptCount;

    document.getElementById("trackers").textContent =
      lastAnalysis.trackersFound.length > 0
        ? lastAnalysis.trackersFound.join(", ")
        : "None";
  });
});
