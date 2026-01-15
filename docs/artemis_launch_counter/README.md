# Artemis Launch Counter Documentation

This document describes how to update the content for the **Artemis Launch Counter** web page (`artemis_launch_counter.html`).

## 1. Updating the Hero Photo Pool

The background image of the "Hero" (top) section is randomized on every page load. You can add or remove images by modifying the `photoPool` array in the JavaScript section of the file.

### Location in Code
Look for the `// HERO PHOTO POOL` comment block inside the `<script>` tag.

### Data Structure
Each photo is an object with the following properties:
- `url`: Direct link to the image file (JPG/PNG). High resolution recommended.
- `desc`: A short description of the image (used for alt text and credits).
- `link`: A URL to the source page or credit for the image.

### Example
To add a new photo, append this object to the `photoPool` array:

```javascript
{
    url: "https://example.com/path/to/image.jpg",
    desc: "Description of the photo",
    link: "https://example.com/source-page"
}
```

## 2. Updating the News Pool

The "Mission Intelligence & Updates" section displays 5 random news cards from a larger pool of news items.

### Location in Code
Look for the `// NEWS POOL` comment block inside the `<script>` tag.

### Data Structure
Each news item is an object with the following properties:
- `source`: The name of the publisher or source (e.g., "NASA Blogs").
- `title`: The headline of the news item.
- `text`: A short summary or excerpt of the news.
- `link`: Direct URL to the full article.

### Example
To add a new news item, append this object to the `newsPool` array:

```javascript
{
    source: "SpaceNews Daily",
    title: "New Artemis Milestones Reached",
    text: "Engineers have successfully completed the latest round of safety checks for the Orion capsule.",
    link: "https://example.com/article-url"
}
```
