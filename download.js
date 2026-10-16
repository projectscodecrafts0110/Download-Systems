(() => {
  const appName = document.querySelector("#app-name");
  const downloadLink = document.querySelector("#download-now");
  const countdownLabel = document.querySelector("#countdown");
  const countdownIntro = document.querySelector("#countdown-intro");
  const continueLabel = document.querySelector("#continue-label");
  const accessForm = document.querySelector("#access-form");
  const accessPassword = document.querySelector("#access-password");
  const accessFeedback = document.querySelector("#access-feedback");
  const downloadUnlocked = document.querySelector("#download-unlocked");
  const status = document.querySelector("#download-status");
  const cancelButton = document.querySelector("#cancel-download");
  const error = document.querySelector("#download-error");

  if (
    !appName ||
    !downloadLink ||
    !countdownLabel ||
    !countdownIntro ||
    !continueLabel ||
    !accessForm ||
    !accessPassword ||
    !accessFeedback ||
    !downloadUnlocked ||
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
    accessForm.hidden = true;
    cancelButton.hidden = true;
    error.hidden = false;
    downloadUnlocked.hidden = false;
    return;
  }

  appName.textContent = name || "This app";
  if (isLocalInstaller) {
    downloadLink.dataset.filename = file.split("/").pop();
  } else if (isGithubReleaseAsset) {
    countdownIntro.textContent = "Your download will start automatically in";
    continueLabel.textContent = "Download now";
  } else {
    countdownIntro.textContent = "The GitHub release page will open automatically in";
    continueLabel.textContent = "Open release page";
  }

  let timer;
  const startCountdown = () => {
    let secondsRemaining = 8;
    status.hidden = false;
    countdownLabel.textContent = String(secondsRemaining);
    timer = window.setInterval(() => {
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
  };

  accessForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const expectedHash = window.DOWNLOAD_PASSWORD_HASH;

    if (!expectedHash || expectedHash === "REPLACE_WITH_SHA256_HASH") {
      accessFeedback.textContent =
        "Download access has not been configured. Contact the repository maintainer.";
      return;
    }

    try {
      const passwordBytes = new TextEncoder().encode(accessPassword.value);
      const digest = await window.crypto.subtle.digest("SHA-256", passwordBytes);
      const actualHash = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      if (actualHash !== expectedHash.toLowerCase()) {
        accessFeedback.textContent = "That password was not accepted. Please try again.";
        accessPassword.select();
        return;
      }

      accessFeedback.textContent = "";
      accessForm.hidden = true;
      downloadUnlocked.hidden = false;
      downloadLink.href = file;
      if (isLocalInstaller) {
        downloadLink.setAttribute("download", downloadLink.dataset.filename);
      }
      startCountdown();
    } catch (cause) {
      console.error("Could not verify the download password.", cause);
      accessFeedback.textContent =
        "Password verification is unavailable in this browser. Please open this page over HTTPS and try again.";
    }
  });

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
