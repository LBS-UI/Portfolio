# LumiberStudio Website

A personal portfolio website for LumiberStudio to showcase your projects and creations.

## How to use

1. Download all the files (index.html, styles.css, script.js).
2. Keep them in the same folder.
3. Open `index.html` in any web browser (double-click it).

## How to customize

### Adding / Editing Projects

Open `index.html` in a text editor (Notepad, VS Code, etc.) and find the section starting with:

```html
<div class="project-grid">
```

Each project is a `.project-card`. Copy and paste a card block to add more.

To add a real image instead of the colored gradient:

1. Put your image file (e.g. `project1.jpg`) in the same folder.
2. Change the project image div from:

```html
<div class="project-img" style="background: linear-gradient(...);"></div>
```

to:

```html
<div class="project-img" style="background-image: url('project1.jpg');"></div>
```

Or use an `<img>` tag inside the card if you prefer.

Edit the `<h3>`, `<p>`, and `<span class="tag">` with your own project title, description, and category.

### Changing Colors / Text

- Edit text directly in `index.html`.
- Colors and layout are in `styles.css`. The main accent color is purple (`#a78bfa`).

### Making it live

- Free options: GitHub Pages, Netlify, Vercel, or Neocities.
- Just upload the three files.

Enjoy your studio site!
