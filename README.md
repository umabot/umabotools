# umabotools

A collection of web-based tools and games.

## GitHub Pages Setup

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

### How it works

1. **index.html** - The main landing page that automatically redirects to spaceinvaders.html
2. **spaceinvaders.html** - A fully functional Space Invaders game built in HTML/CSS/JavaScript
3. **GitHub Actions Workflow** - Automatically deploys the site when changes are pushed to the main branch

### Accessing the Site

Once GitHub Pages is enabled in the repository settings, the site will be available at:
```
https://umabot.github.io/umabotools/
```

### Setup Instructions

To enable GitHub Pages for this repository:

1. Go to the repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy the site when changes are pushed to the main branch

### Local Development

Simply open `index.html` or `spaceinvaders.html` in your web browser to test locally.

## Games

### Space Invaders
A classic arcade-style Space Invaders game featuring:
- Retro pixel art graphics
- Smooth gameplay with progressive difficulty
- Mobile-friendly touch controls
- Particle effects and animations

**Controls:**
- Desktop: Arrow keys to move, Spacebar to shoot
- Mobile: Touch controls at the bottom of the screen