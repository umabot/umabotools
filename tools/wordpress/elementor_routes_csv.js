// Direct Google Sheets CSV -> Elementor routes renderer.
// Paste this inside an Elementor HTML widget inside a <script> tag,
// or load it through a WordPress custom code feature.

(function () {
    var ROUTES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBEEF3jrmrtbNwWBrkVedMy4DG4gT512gpEC8K3q7O97ZE9Mn9OfnDVE0F0yLh5C1lFB-cQ7owZcJR/pub?gid=0&single=true&output=csv';
    var ROUTES_MOUNT_SELECTOR = '#routes-track';
    var HERO_IMAGE_BASE_URL = 'https://innovumabot.com/wp-content/uploads/2026/03/';
    var STYLE_ID = 'club-routes-inline-styles';
    var ALLOWED_BG_CLASSES = {
        'placeholder-bg-1': true,
        'placeholder-bg-2': true,
        'placeholder-bg-3': true,
        'placeholder-bg-4': true
    };

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = '' +
            '.club-routes-list {' +
                'display: flex;' +
                'gap: 24px;' +
                'overflow-x: auto;' +
                'overflow-y: hidden;' +
                'scroll-behavior: smooth;' +
                'scroll-snap-type: x mandatory;' +
                'padding-bottom: 12px;' +
                '-webkit-overflow-scrolling: touch;' +
            '}' +
            '.club-routes-list::-webkit-scrollbar {' +
                'height: 8px;' +
            '}' +
            '.club-routes-list::-webkit-scrollbar-track {' +
                'background: transparent;' +
            '}' +
            '.club-routes-list::-webkit-scrollbar-thumb {' +
                'background: #d1d5db;' +
                'border-radius: 4px;' +
            '}' +
            '.club-routes-list::-webkit-scrollbar-thumb:hover {' +
                'background: #9ca3af;' +
            '}' +
            '.club-route-card {' +
                'display: flex;' +
                'flex-direction: column;' +
                'gap: 18px;' +
                'padding: 24px;' +
                'border: 1px solid rgba(20, 20, 20, 0.08);' +
                'border-radius: 24px;' +
                'background: #ffffff;' +
                'box-shadow: 0 18px 40px rgba(16, 24, 40, 0.08);' +
                'min-height: 100%;' +
                'min-width: 320px;' +
                'flex: 0 0 320px;' +
                'scroll-snap-align: start;' +
            '}' +
            '.club-route-card__hero {' +
                'height: 120px;' +
                'border-radius: 18px;' +
                'background: linear-gradient(135deg, #dceeff 0%, #f4f7fb 100%);' +
            '}' +
            '.club-route-card__hero-wrap {' +
                'position: relative;' +
            '}' +
            '.club-route-card__hero.placeholder-bg-1 {' +
                'background: linear-gradient(135deg, #d7f0e8 0%, #effaf6 100%);' +
            '}' +
            '.club-route-card__hero.placeholder-bg-2 {' +
                'background: linear-gradient(135deg, #f8e3d5 0%, #fff5ee 100%);' +
            '}' +
            '.club-route-card__hero.placeholder-bg-3 {' +
                'background: linear-gradient(135deg, #e2e6ff 0%, #f5f7ff 100%);' +
            '}' +
            '.club-route-card__hero.placeholder-bg-4 {' +
                'background: linear-gradient(135deg, #f3e0ef 0%, #fff4fc 100%);' +
            '}' +
            '.club-route-card__index {' +
                'position: absolute;' +
                'left: 14px;' +
                'bottom: 10px;' +
                'font-family: Sora, sans-serif;' +
                'font-size: 2.8rem;' +
                'font-weight: 700;' +
                'line-height: 1;' +
                'letter-spacing: 0.06em;' +
                'text-transform: uppercase;' +
                'color: #C9EB55;' +
                'text-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);' +
                'pointer-events: none;' +
            '}' +
            '.club-route-card__title {' +
                'margin: 0;' +
                'font-family: Poppins, sans-serif;' +
                'font-size: 1.35rem;' +
                'line-height: 1.2;' +
                'color: #111827;' +
            '}' +
            '.club-route-card__meta {' +
                'display: flex;' +
                'flex-wrap: wrap;' +
                'gap: 10px;' +
            '}' +
            '.club-route-card__meta-item {' +
                'display: inline-flex;' +
                'align-items: center;' +
                'padding: 8px 12px;' +
                'border-radius: 999px;' +
                'background: #f3f4f6;' +
                'font-size: 0.9rem;' +
                'line-height: 1;' +
                'color: #374151;' +
            '}' +
            '.club-route-card__desc {' +
                'margin: 0;' +
                'font-size: 0.98rem;' +
                'line-height: 1.65;' +
                'color: #4b5563;' +
            '}' +
            '.club-route-card__button {' +
                'display: inline-flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'padding: 12px 18px;' +
                'border-radius: 999px;' +
                'background: #111827;' +
                'color: #ffffff;' +
                'font-weight: 600;' +
                'text-decoration: none;' +
                'width: fit-content;' +
            '}' +
            '.club-route-card__button:hover,' +
            '.club-route-card__button:focus {' +
                'background: #1f2937;' +
                'color: #ffffff;' +
            '}' +
            '.club-routes-message {' +
                'padding: 24px;' +
                'border-radius: 18px;' +
                'background: #f9fafb;' +
                'text-align: center;' +
                'color: #4b5563;' +
            '}' +
            '.club-routes-message.is-error {' +
                'background: #fef2f2;' +
                'color: #b91c1c;' +
            '}' +
            '@media (max-width: 767px) {' +
                '.club-route-card {' +
                    'padding: 20px;' +
                    'min-width: 300px;' +
                    'flex: 0 0 300px;' +
                '}' +
            '}';
        document.head.appendChild(style);
    }

    function splitCSVLine(line) {
        var result = [];
        var current = '';
        var inQuote = false;
        var index;

        for (index = 0; index < line.length; index += 1) {
            var char = line.charAt(index);
            var nextChar = line.charAt(index + 1);

            if (char === '"') {
                if (inQuote && nextChar === '"') {
                    current += '"';
                    index += 1;
                } else {
                    inQuote = !inQuote;
                }
            } else if (char === ',' && !inQuote) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    function normalizeHeader(value) {
        return (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function mapRouteValue(route, header, value) {
        if (header.indexOf('title') !== -1) {
            route.title = value;
        } else if (header.indexOf('date') !== -1) {
            route.date = value;
        } else if (header.indexOf('time') !== -1) {
            route.time = value;
        } else if (header.indexOf('distance') !== -1) {
            route.distance = value;
        } else if (header.indexOf('desc') !== -1) {
            route.desc = value;
        } else if (header.indexOf('bgclass') !== -1) {
            route.bgClass = value;
        } else if (header.indexOf('strava') !== -1 || header === 'link' || header.indexOf('url') !== -1) {
            route.link = value;
        }
    }

    function parseCSV(csvText) {
        var lines = csvText.trim().split(/\r?\n/);
        var headers;
        var routes = [];
        var lineIndex;

        if (lines.length < 2) {
            return routes;
        }

        headers = splitCSVLine(lines[0]).map(normalizeHeader);

        for (lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
            var line = lines[lineIndex];
            var values;
            var route;
            var headerIndex;

            if (!line.trim()) {
                continue;
            }

            values = splitCSVLine(line);
            route = {};

            for (headerIndex = 0; headerIndex < Math.min(headers.length, values.length); headerIndex += 1) {
                mapRouteValue(route, headers[headerIndex], values[headerIndex]);
            }

            if (route.title || route.desc || route.date || route.time || route.distance) {
                routes.push(route);
            }
        }

        return routes;
    }

    function createElement(tagName, className, text) {
        var element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (typeof text === 'string') {
            element.textContent = text;
        }
        return element;
    }

    function getSafeBgClass(bgClass) {
        return ALLOWED_BG_CLASSES[bgClass] ? bgClass : 'placeholder-bg-1';
    }

    function buildHeroImageUrl(bgClass) {
        if (!HERO_IMAGE_BASE_URL) {
            return '';
        }

        return HERO_IMAGE_BASE_URL + bgClass + '.png';
    }

    function applyHeroImageIfAvailable(heroElement, bgClass) {
        var imageUrl = buildHeroImageUrl(bgClass);
        var imageLoader;

        if (!imageUrl) {
            return;
        }

        imageLoader = new Image();
        imageLoader.onload = function () {
            heroElement.style.backgroundImage = 'url(' + imageUrl + ')';
            heroElement.style.backgroundSize = 'cover';
            heroElement.style.backgroundPosition = 'center';
            heroElement.style.backgroundRepeat = 'no-repeat';
        };
        imageLoader.onerror = function () {
            // Keep gradient class fallback when image is missing.
        };
        imageLoader.src = imageUrl;
    }

    function appendMetaItem(container, value) {
        if (!value) {
            return;
        }

        container.appendChild(createElement('span', 'club-route-card__meta-item', value));
    }

    function formatDistance(value) {
        if (!value) {
            return '';
        }

        var trimmed = String(value).trim();
        if (!trimmed) {
            return '';
        }

        if (/\bkm\b/i.test(trimmed)) {
            return trimmed;
        }

        return trimmed + ' km';
    }

    function createRouteCard(route, index) {
        var card = createElement('article', 'club-route-card');
        var heroWrap = createElement('div', 'club-route-card__hero-wrap');
        var safeBgClass = getSafeBgClass(route.bgClass);
        var hero = createElement('div', 'club-route-card__hero ' + safeBgClass);
        var badge = createElement('div', 'club-route-card__index', String(index + 1).padStart(2, '0'));
        var title = createElement('h4', 'club-route-card__title', route.title || 'Sin titulo');
        var meta = createElement('div', 'club-route-card__meta');
        var desc = createElement('p', 'club-route-card__desc', route.desc || '');

        hero.setAttribute('role', 'img');
        hero.setAttribute('aria-label', route.title || 'Ruta');
        applyHeroImageIfAvailable(hero, safeBgClass);

        appendMetaItem(meta, route.date);
        appendMetaItem(meta, route.time);
        appendMetaItem(meta, formatDistance(route.distance));

        heroWrap.appendChild(hero);
        heroWrap.appendChild(badge);

        card.appendChild(heroWrap);
        card.appendChild(title);

        if (meta.childNodes.length > 0) {
            card.appendChild(meta);
        }

        if (route.desc) {
            card.appendChild(desc);
        }

        if (route.link) {
            var button = createElement('a', 'club-route-card__button', 'Ver en Strava');
            button.href = route.link;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            card.appendChild(button);
        }

        return card;
    }

    function renderMessage(mount, text, isError) {
        var message = createElement('div', 'club-routes-message' + (isError ? ' is-error' : ''), text);
        mount.innerHTML = '';
        mount.appendChild(message);
    }

    function renderRoutes(mount, routes) {
        var list = createElement('div', 'club-routes-list');

        mount.innerHTML = '';

        if (!routes.length) {
            renderMessage(mount, 'No hay rutas programadas proximamente.', false);
            return;
        }

        routes.forEach(function (route, index) {
            list.appendChild(createRouteCard(route, index));
        });

        mount.appendChild(list);
    }

    function loadRoutes() {
        var mount = document.querySelector(ROUTES_MOUNT_SELECTOR);

        if (!mount) {
            return;
        }

        ensureStyles();
        renderMessage(mount, 'Cargando rutas...', false);

        fetch(ROUTES_CSV_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(function (csvText) {
                var routes = parseCSV(csvText);
                renderRoutes(mount, routes);
            })
            .catch(function (error) {
                console.error('Error fetching routes:', error);
                renderMessage(mount, 'Error cargando las rutas.', true);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadRoutes);
    } else {
        loadRoutes();
    }
}());