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
    version: "1.2.0",
    category: "Productivity",
    status: "Available",
    icon: "✎",
    iconBackground: "#e8eee4",
    downloadUrl: "./downloads/Tiny-Notes-Setup.exe",
  },
];
```

- `name`, `description`, and `downloadUrl` describe the app and its download. For an installer stored in this repository, use its path relative to the site, such as `./downloads/Tiny-Notes-Setup.exe`. You can also link to a GitHub Release page.
- `platforms` is an array, for example `["Windows"]` or `["Windows", "macOS"]`. Its values become the platform filters.
- `version`, `category`, `status`, `icon`, and `iconBackground` are optional.
- Put the `.exe` in the repository (for example, in a `downloads` folder) and use the matching path in `downloadUrl`. GitHub limits individual repository files to 100 MB; use GitHub Releases for larger installers.

## Publish with GitHub Pages

1. Create a GitHub repository and upload these files to its root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your default branch and the **/(root)** folder, then save.
5. GitHub Pages will provide the published site URL on that settings page.

Changes pushed to the selected branch publish automatically.
