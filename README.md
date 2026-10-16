# Deskdrop

A responsive, static app shelf that works with GitHub Pages. No build step or dependencies are needed.

## Add an app

Edit `apps.js` and add an object to `window.APP_LIST`:

```js
window.APP_LIST = [
  {
    name: "Tiny Notes",
    description: "A quiet place for quick thoughts and small reminders.",
    platforms: ["Windows"],
    releases: [
      {
        version: "1.2.0",
        date: "2026-10-16",
        notes: ["Added quick search.", "Fixed a startup issue."],
        downloadUrl: "./downloads/Tiny-Notes-1.2.0-Setup.exe",
      },
      {
        version: "1.1.0",
        date: "2026-09-28",
        notes: ["First public preview."],
        downloadUrl: "./downloads/Tiny-Notes-1.1.0-Setup.exe",
      },
    ],
    category: "Productivity",
    status: "Available",
    icon: "✎",
    iconBackground: "#e8eee4",
  },
];
```

- Put releases in newest-first order. The first release is treated as the latest; the app card shows its version and download button. Visitors can expand **Release history** to read notes or download an older version.
- Each release needs a `version` and can include a `date` (`YYYY-MM-DD`), a `notes` array, and a `downloadUrl`.
- For installers stored in this repository, use their path relative to the site, such as `./downloads/Tiny-Notes/1.2.0/Setup.exe`. You can also use a GitHub Releases URL such as `https://github.com/OWNER/REPOSITORY/releases/tag/v1.2.0`.
- `platforms` is an array, for example `["Windows"]` or `["Windows", "macOS"]`. Its values become the platform filters.
- `category`, `status`, `icon`, and `iconBackground` are optional.
- Keep each version's installer at a distinct path so adding a newer release does not replace older downloads. GitHub limits individual repository files to 100 MB; use GitHub Releases for larger installers.
- Download buttons for local `.exe` files open a testing reminder first, then start the download after eight seconds. Visitors can download immediately or cancel the automatic download. Keep the reminder accurate for the app's current testing status.
- Older app entries using top-level `version` and `downloadUrl` are still supported; add a `releases` array when you want to track release history.

## Publish with GitHub Pages

1. Create a GitHub repository and upload these files to its root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your default branch and the **/(root)** folder, then save.
5. GitHub Pages will provide the published site URL on that settings page.

Changes pushed to the selected branch publish automatically.
