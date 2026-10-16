(() => {
  const appName = document.querySelector("#app-name");
  const downloadLink = document.querySelector("#download-now");
  const countdownLabel = document.querySelector("#countdown");
  const countdownIntro = document.querySelector("#countdown-intro");
  const continueLabel = document.querySelector("#continue-label");
  const status = document.querySelector("#download-status");
  const cancelButton = document.querySelector("#cancel-download");
  const error = document.querySelector("#download-error");

  if (
    !appName ||
    !downloadLink ||
    !countdownLabel ||
    !countdownIntro ||
    !continueLabel ||
    !status ||
    !cancelButton ||
    !error
  ) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const name = params.get("app");
  const file = params.get("file");

  const localInstallerPattern =
    /^\.\/downloads\/(?:[A-Za-z0-9_-][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.exe$/i;
  const githubReleaseAssetPattern =
    /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/releases\/download\/[^/?#]+\/[^/?#]+(?:\?[^#]*)?$/i;
  const githubReleasePagePattern =
    /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/releases(?:\/(?:tag|latest)(?:\/[^/?#]+)?)?\/?$/i;
  const isLocalInstaller = Boolean(file && localInstallerPattern.test(file));
  const isGithubReleaseAsset = Boolean(file && githubReleaseAssetPattern.test(file));
  const isGithubReleasePage = Boolean(file && githubReleasePagePattern.test(file));

  if (!isLocalInstaller && !isGithubReleaseAsset && !isGithubReleasePage) {
    status.hidden = true;
    cancelButton.hidden = true;
    error.hidden = false;
    return;
  }

  appName.textContent = name || "This app";
  downloadLink.href = file;
  if (isLocalInstaller) {
    downloadLink.setAttribute("download", file.split("/").pop());
  } else if (isGithubReleaseAsset) {
    countdownIntro.textContent = "Your download will start automatically in";
    continueLabel.textContent = "Download now";
  } else {
    countdownIntro.textContent = "The GitHub release page will open automatically in";
    continueLabel.textContent = "Open release page";
  }

  let secondsRemaining = 8;
  const timer = window.setInterval(() => {
    secondsRemaining -= 1;
    countdownLabel.textContent = String(secondsRemaining);

    if (secondsRemaining <= 0) {
      window.clearInterval(timer);
      status.textContent = isGithubReleasePage
        ? "Opening the GitHub release page."
        : "Starting download...";
      window.location.assign(file);
    }
  }, 1000);

  downloadLink.addEventListener("click", () => {
    window.clearInterval(timer);
    status.textContent = isGithubReleasePage
      ? "Opening the GitHub release page."
      : "Download requested. Check your browser’s downloads if it does not start.";
    cancelButton.hidden = true;
  });

  cancelButton.addEventListener("click", () => {
    window.clearInterval(timer);
    status.textContent = "Automatic download paused. Use “Download now” if you still want to continue.";
    cancelButton.disabled = true;
    cancelButton.textContent = "Automatic download paused";
  });
})();
