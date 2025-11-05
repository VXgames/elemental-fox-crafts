# Elemental Fox Crafts — Local Preview

Quick commands to preview the static site locally (Windows PowerShell):

- Serve with Python (no install required):

```powershell
python -m http.server 8000
# then open http://localhost:8000/index.html
```

- Use the npm script (uses npx to run live-server without installing globally):

```powershell
npm run start
```

Notes:
- If the stylesheet fails to load you'll see a visible banner at the top of the page. This helps diagnose path/server issues.
- Add image assets under `assets/images/` and reference them with relative paths (e.g. `assets/images/copper-spoon.jpg`).
