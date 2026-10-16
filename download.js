(() => {
  const appName = document.querySelector("#app-name");
  const downloadLink = document.querySelector("#download-now");
  const countdownLabel = document.querySelector("#countdown");
  const status = document.querySelector("#download-status");
  const cancelButton = document.querySelector("#cancel-download");
  const error = document.querySelector("#download-error");

  if (!appName || !downloadLink || !countdownLabel || !status || !cancelButton || !error) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const name = params.get("app");
  const file = params.get("file");

  if (!file || !/^\.\/downloads\/[A-Za-z0-9][A-Za-z0-9._-]*\.exe$/i.test(file)) {
    status.hidden = true;
    cancelButton.hidden = true;
    error.hidden = false;
    return;
  }

  appName.textContent = name || "This app";
  downloadLink.href = file;
  downloadLink.setAttribute("download", file.slice("./downloads/".length));

  let secondsRemaining = 8;
  const timer = window.setInterval(() => {
    secondsRemaining -= 1;
    countdownLabel.textContent = String(secondsRemaining);

    if (secondsRemaining <= 0) {
      window.clearInterval(timer);
      window.location.assign(file);
    }
  }, 1000);

  cancelButton.addEventListener("click", () => {
    window.clearInterval(timer);
    status.textContent = "Automatic download paused. Use “Download now” if you still want to continue.";
    cancelButton.disabled = true;
    cancelButton.textContent = "Automatic download paused";
  });
})();
