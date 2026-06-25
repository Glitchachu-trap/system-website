# Alter Gallery Website

A simple static website to feature a person's alters with pictures and artwork.

## Files
- `index.html` — main page structure
- `styles.css` — styling and responsive layout
- `script.js` — alter and artwork data rendering

## Customize
1. Replace image URLs in `script.js` with local or hosted pictures.
2. Update the `alters` and `artPieces` arrays with names, roles, and descriptions.
3. Change colors or typography in `styles.css` to match the artwork.

## Usage
Open `index.html` in a browser to view the site.

## Deploy to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Push this project to GitHub (replace `<username>` and `<repo>`):

```powershell
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin 
git push -u origin main
```

3. The included GitHub Actions workflow (`.github/workflows/pages.yml`) will upload and deploy the site to GitHub Pages automatically on push to `main`.

4. After the workflow completes, your site will be available at `https://<username>.github.io/<repo>/` (or the repository root Pages URL shown in the repository's Pages settings).

If you prefer to serve from the `gh-pages` branch or use a different flow, I can add that instead.