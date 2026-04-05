# Austine Jaison Mangan - Portfolio

This is a personal portfolio website built with clean HTML, CSS, and Vanilla JavaScript. It features a minimalist engineering aesthetic, a dark/light mode toggle, intersection observer scroll animations, and a dynamic typewriter effect.

## Project Structure

- `index.html` - The single page HTML structure
- `style.css` - All custom styles and CSS variables
- `script.js` - Interaction logic (theme toggle, animations, filtering)
- `images/` - Directory for images (Drop `profile.jpg` here)
- `resumes/` - Directory for resumes (Drop `engineering.pdf` and `operations.pdf` here)

## How to Run Locally

You can serve this project locally using Python or Node.js.

**Using Python:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using Node.js (npx):**
```bash
npx serve
```
Then visit `http://localhost:3000` (or whatever port `serve` selects).

## How to Deploy to Netlify

1. Create a free account on [Netlify](https://www.netlify.com/).
2. On your team dashboard, click **Add new site** > **Deploy manually**.
3. Drag and drop the entire `Portfolio` folder into the upload box.
4. Your site will be live instantly!

## How to Deploy to GitHub Pages

1. Create a new public repository on GitHub (e.g., `austinemangan.github.io` or `portfolio`).
2. Upload all the contents of this folder (`index.html`, `style.css`, etc.) to the repository.
3. Go to the repository **Settings** > **Pages**.
4. Under **Source**, select `Deploy from a branch`.
5. Under **Branch**, select `main` (or `master`) and `/ (root)` folder, then click **Save**.
6. Wait a few minutes, and your site will be live at the provided GitHub Pages URL.
