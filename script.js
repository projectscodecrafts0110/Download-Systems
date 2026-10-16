(() => {
  const apps = Array.isArray(window.APP_LIST) ? window.APP_LIST : [];
  const grid = document.querySelector("#app-grid");
  const filters = document.querySelector("#filters");
  const searchInput = document.querySelector("#search");
  const count = document.querySelector("#app-count");

  if (!grid || !filters || !searchInput || !count) return;

  const platforms = ["All", ...new Set(apps.flatMap((app) => app.platforms || []))];
  let activePlatform = "All";

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[character];
    });

  const getReleases = (app) => {
    if (Array.isArray(app.releases)) {
      return app.releases.filter((release) => release && release.version);
    }
    return app.version
      ? [
          {
            version: app.version,
            date: app.releaseDate,
            notes: app.releaseNotes,
            downloadUrl: app.downloadUrl,
          },
        ]
      : [];
  };

  const getDownloadHref = (appName, downloadUrl) =>
    `./download.html?${new URLSearchParams({
      app: appName || "Desktop app",
      file: downloadUrl,
    }).toString()}`;

  const renderRelease = (release, index, appName) => {
    const notes = Array.isArray(release.notes)
      ? release.notes
      : typeof release.notes === "string"
        ? [release.notes]
        : [];

    return `
      <li class="release-entry">
        <div class="release-heading">
          <strong>v${escapeHtml(release.version)}</strong>
          ${index === 0 ? '<span class="latest-badge">LATEST</span>' : ""}
          ${release.date ? `<time>${escapeHtml(release.date)}</time>` : ""}
        </div>
        ${notes.length
          ? `<ul class="release-notes">${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>`
          : ""}
        ${release.downloadUrl
          ? `<a class="release-download" href="${escapeHtml(getDownloadHref(appName, release.downloadUrl))}">Download this version <span aria-hidden="true">↓</span></a>`
          : '<span class="release-unavailable">Download unavailable</span>'}
      </li>`;
  };

  const renderFilters = () => {
    filters.innerHTML = platforms
      .map(
        (platform) => `
          <button class="filter-button${platform === activePlatform ? " is-active" : ""}"
            type="button" data-platform="${escapeHtml(platform)}"
            aria-pressed="${platform === activePlatform}">
            ${escapeHtml(platform)}
          </button>`
      )
      .join("");
  };

  const renderCard = (app) => {
    const platformLabel = (app.platforms || []).join(" · ");
    const status = app.status || "Available";
    const icon = app.icon || "▦";
    const releases = getReleases(app);
    const latestRelease = releases[0];
    const appName = app.name || "Untitled app";
    const downloadHref = latestRelease?.downloadUrl
      ? getDownloadHref(appName, latestRelease.downloadUrl)
      : "#";
    const isDownloadable = Boolean(latestRelease?.downloadUrl);

    return `
      <article class="app-card">
        <div class="card-topline">
          <div class="app-icon" style="--icon-bg: ${escapeHtml(app.iconBackground || "#e8eee4")}">
            <span aria-hidden="true">${escapeHtml(icon)}</span>
          </div>
          <span class="app-status${status.toLowerCase() === "in progress" ? " status-progress" : ""}">
            <span></span>${escapeHtml(status)}
          </span>
        </div>
        <div class="card-content">
          <div class="app-meta">
            <span>${escapeHtml(platformLabel || "Desktop")}</span>
            ${latestRelease?.version ? `<span class="meta-divider">·</span><span>v${escapeHtml(latestRelease.version)}</span>` : ""}
          </div>
          <h3>${escapeHtml(appName)}</h3>
          <p>${escapeHtml(app.description || "")}</p>
        </div>
        <div class="card-bottom">
          <span class="app-category">${escapeHtml(app.category || "Utility")}</span>
          <a class="download-link${isDownloadable ? "" : " link-disabled"}"
            href="${escapeHtml(downloadHref)}"${isDownloadable ? "" : ' aria-disabled="true" tabindex="-1"'}
            ${isDownloadable ? `aria-label="Get ${escapeHtml(app.name || "app")}"` : 'aria-label="Download link not set" title="Add a downloadUrl in apps.js"'} >
            ${isDownloadable ? "Get app" : "Coming soon"}
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
              <path d="M8 2.5v7m0 0 2.7-2.7M8 9.5 5.3 6.8M3 10.5v2A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
        </div>
        ${releases.length
          ? `<details class="release-history">
              <summary>Release history <span>(${releases.length})</span></summary>
              <ol>${releases.map((release, index) => renderRelease(release, index, appName)).join("")}</ol>
            </details>`
          : ""}
      </article>`;
  };

  const render = () => {
    const query = searchInput.value.trim().toLowerCase();
    const matchingApps = apps.filter((app) => {
      const matchesPlatform =
        activePlatform === "All" || (app.platforms || []).includes(activePlatform);
      const searchableText = [
        app.name,
        app.description,
        app.category,
        ...(app.platforms || []),
      ]
        .join(" ")
        .toLowerCase();
      return matchesPlatform && searchableText.includes(query);
    });

    count.textContent = `${matchingApps.length} ${matchingApps.length === 1 ? "APP" : "APPS"}`;
    if (matchingApps.length) {
      grid.classList.remove("is-empty");
      grid.innerHTML = matchingApps.map(renderCard).join("");
      return;
    }

    grid.classList.add("is-empty");
    grid.innerHTML = apps.length
      ? `<div class="empty-state"><span aria-hidden="true">⌕</span><h3>No apps found</h3><p>Try another search or choose a different platform.</p></div>`
      : `<div class="empty-state"><span aria-hidden="true">✳</span><h3>Your collection starts here.</h3><p>Add your first app to <code>apps.js</code> and it’ll show up here.</p></div>`;
  };

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-platform]");
    if (!button) return;
    activePlatform = button.dataset.platform;
    renderFilters();
    render();
  });

  searchInput.addEventListener("input", render);
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName) &&
      !document.activeElement?.isContentEditable
    ) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  renderFilters();
  render();
})();
