(function () {
    'use strict';

    // ── DATA: Members ──
    var members = [
        { name: "Carlos Martínez", role: "Presidente", initials: "CM" },
        { name: "Laura Rodríguez", role: "Vicepresidenta", initials: "LR" },
        { name: "Pablo García", role: "Coordinador de Rutas", initials: "PG" },
        { name: "Ana Fernández", role: "Tesorera", initials: "AF" },
        { name: "Miguel Sánchez", role: "Comunicación", initials: "MS" },
        { name: "Elena López", role: "Mecánica del Club", initials: "EL" }
    ];

    // ── DATA: Routes ──
    // Routes are loaded from Google Sheets CSV (client-side fetch)

    // ── Utility: show toast message ──
    function showToast(message) {
        var toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(function () {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // ── Utility: check Google Translate loaded ──
    function checkScriptLoad() {
        if (typeof google === 'undefined' || typeof google.translate === 'undefined') {
            var banner = document.getElementById('error-banner');
            if (banner) banner.style.display = 'block';
        }
    }

    // ── RENDER: Members ──
    function renderMembers() {
        var grid = document.getElementById('members-grid');
        if (!grid) return;
        
        grid.innerHTML = ''; // Clear existing
        members.forEach(function(m) {
            var card = document.createElement('div');
            card.className = 'member-card';
            card.innerHTML = 
                '<div class="member-avatar">' + m.initials + '</div>' +
                '<h3>' + m.name + '</h3>' +
                '<p class="member-role">' + m.role + '</p>';
            grid.appendChild(card);
        });
    }

    // ── DATA: Routes (Google Sheets CSV) ──
    var ROUTES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSBEEF3jrmrtbNwWBrkVedMy4DG4gT512gpEC8K3q7O97ZE9Mn9OfnDVE0F0yLh5C1lFB-cQ7owZcJR/pub?gid=0&single=true&output=csv';

    // ── Utility: Parse CSV ──
    function parseCSV(csvText) {
        var lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) return []; // Header + at least one row

        // Helper to split CSV line respecting quotes
        function splitCSVLine(line) {
            var result = [];
            var current = '';
            var inQuote = false;
            for (var i = 0; i < line.length; i++) {
                var char = line[i];
                if (char === '"') { inQuote = !inQuote; }
                else if (char === ',' && !inQuote) {
                    result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            return result;
        }

        var headers = splitCSVLine(lines[0]);
        var routes = [];

        for (var i = 1; i < lines.length; i++) {
            var line = lines[i];
            if (!line.trim()) continue;
            
            var values = splitCSVLine(line);
            
            if (values.length > 0) {
                var route = {};
                // Map values to headers ensuring case-insensitivity
                for (var j = 0; j < Math.min(headers.length, values.length); j++) {
                    var header = headers[j].toLowerCase().replace(/[^a-z0-9]/g, '');
                    var val = values[j];
                    
                    if (header.includes('title')) route.title = val;
                    else if (header.includes('date')) route.date = val;
                    else if (header.includes('time')) route.time = val;
                    else if (header.includes('distance')) route.distance = val;
                    else if (header.includes('desc')) route.desc = val;
                    else if (header.includes('bgclass')) route.bgClass = val;
                }
                routes.push(route);
            }
        }
        return routes;
    }

    // ── RENDER: Routes ──
    function renderRoutes() {
        var track = document.getElementById('routes-track');
        if (!track) return;

        // Show loading state
        track.innerHTML = '<div style="text-align:center; padding: 2rem; color: #666;">Cargando rutas...</div>';

        fetch(ROUTES_CSV_URL)
            .then(function (response) {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(function (csvText) {
                var routes = parseCSV(csvText);

                track.innerHTML = ''; // Clear loading

                if (routes.length === 0) {
                    track.innerHTML = '<div style="text-align:center; width:100%; padding:2rem;">No hay rutas programadas próximamente.</div>';
                    return;
                }

                routes.forEach(function (r) {
                    var card = document.createElement('div');
                    card.className = 'route-card';
                    card.innerHTML =
                        '<div class="route-img ' + (r.bgClass || 'placeholder-bg-1') + '" role="img" aria-label="' + (r.title || 'Ruta') + '"></div>' +
                        '<div class="route-info">' +
                            '<h3>' + (r.title || 'Sin título') + '</h3>' +
                            '<div class="route-meta">' +
                                '<span data-icon-small="calendar">' + (r.date || '-') + '</span>' +
                                '<span data-icon-small="clock">' + (r.time || '-') + '</span>' +
                                '<span data-icon-small="ruler">' + (r.distance || '-') + '</span>' +
                            '</div>' +
                            '<p>' + (r.desc || '') + '</p>' +
                        '</div>';
                    track.appendChild(card);
                });

                // Re-initialize icons for the new dynamic content
                initIcons();
            })
            .catch(function (error) {
                console.error('Error fetching routes:', error);
                track.innerHTML = '<div style="text-align:center; width:100%; padding:2rem; color: #d32f2f;">Error cargando las rutas.</div>';
            });
    }

    // ── Lucide Icons Initialization ──
    function initIcons() {
        // Feature cards
        document.querySelectorAll('.feature-icon[data-icon]').forEach(function (el) {
            var iconName = el.getAttribute('data-icon');
            if (iconName && !el.querySelector('svg')) {
                 var svg = document.createElement('i');
                 svg.setAttribute('data-lucide', iconName);
                 el.appendChild(svg);
            }
        });

        // Route meta icons - need to run after renderRoutes
        document.querySelectorAll('[data-icon-small]').forEach(function (el) {
            var iconName = el.getAttribute('data-icon-small');
            if (iconName && !el.querySelector('svg')) {
                var svg = document.createElement('i');
                svg.setAttribute('data-lucide', iconName);
                svg.style.width = '14px';
                svg.style.height = '14px';
                el.prepend(svg);
            }
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // ── Hero Carousel ──
    function initHeroCarousel() {
        var slides = document.querySelectorAll('.hero-slide');
        var dotsContainer = document.getElementById('hero-dots');
        
        if (!slides.length || !dotsContainer) return;

        var currentIndex = 0;
        var totalSlides = slides.length;
        var autoplayTimer = null;

        // Clear existing dots
        dotsContainer.innerHTML = '';

        // Create dots
        for (var i = 0; i < totalSlides; i++) {
            var dot = document.createElement('button');
            dot.classList.add('hero-dot');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dotsContainer.children[currentIndex].classList.remove('active');
            currentIndex = (index + totalSlides) % totalSlides;
            slides[currentIndex].classList.add('active');
            dotsContainer.children[currentIndex].classList.add('active');
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(function () {
                goToSlide(currentIndex + 1);
            }, 5000);
        }

        function stopAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
        }

        // Arrow buttons
        var prevBtn = document.getElementById('hero-prev');
        var nextBtn = document.getElementById('hero-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goToSlide(currentIndex - 1);
                startAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goToSlide(currentIndex + 1);
                startAutoplay();
            });
        }

        // Dot buttons
        dotsContainer.addEventListener('click', function (e) {
            var dot = e.target.closest('.hero-dot');
            if (!dot) return;
            goToSlide(parseInt(dot.dataset.index, 10));
            startAutoplay();
        });

        startAutoplay();
    }

    // ── Language Switcher (Google Translate) ──
    function initLanguageSwitcher() {
        function changeLanguage(langCode) {
            document.querySelectorAll('.lang-btn').forEach(function (btn) {
                btn.classList.toggle('active', btn.dataset.lang === langCode);
            });

            var attempts = 0;
            var maxAttempts = 50;

            var poll = setInterval(function () {
                var combo = document.querySelector('.goog-te-combo');
                attempts++;

                if (combo) {
                    combo.value = langCode;
                    combo.dispatchEvent(new Event('change'));
                    localStorage.setItem('club_lang_pref', langCode);
                    clearInterval(poll);
                } else if (attempts >= maxAttempts) {
                    checkScriptLoad();
                    clearInterval(poll);
                }
            }, 100);
        }

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                changeLanguage(btn.dataset.lang);
            });
        });

        // Restore saved preference
        var saved = localStorage.getItem('club_lang_pref') || 'es';
        setTimeout(function () {
            if (saved !== 'es') {
                changeLanguage(saved);
            }
        }, 500);

        setTimeout(checkScriptLoad, 3000);
    }

    // ── Mobile Navigation Toggle ──
    function initMobileNav() {
        var btn = document.getElementById('hamburger-btn');
        var linksContainer = document.getElementById('nav-links');

        if (!btn || !linksContainer) return;

        btn.addEventListener('click', function () {
            linksContainer.classList.toggle('open');
        });

        // Close menu when clicking a nav link
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.addEventListener('click', function () {
                linksContainer.classList.remove('open');
            });
        });
    }

    // ── Contact Form Handler ──
    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        // Add clear button listener if it exists (optional enhancement for future)
        // ...

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Get form data
            var formData = new FormData(form);
            var data = {};
            // Using Array.from for compatibility or simple iteration
            // But formData.forEach is widely supported in modern browsers
            data.name = formData.get('name');
            data.email = formData.get('email');
            data.message = formData.get('message');
            data.timestamp = new Date().toISOString();

            // Save to localStorage
            try {
                var messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
                messages.push(data);
                localStorage.setItem('contact_messages', JSON.stringify(messages));
                console.log('Message saved to localStorage:', data);
            } catch (err) {
                console.error('Error saving to localStorage:', err);
            }

            // Show success feedback
            showToast('¡Mensaje enviado! Gracias por contactarnos.');
            form.reset();
        });
    }

    // ── Past Routes Link ──
    function initPastRoutes() {
        var link = document.getElementById('past-routes-link');
        if (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                showToast('Sección de rutas anteriores — próximamente.');
            });
        }
    }

    // ── Boot ──
    document.addEventListener('DOMContentLoaded', function () {
        renderMembers();
        renderRoutes();
        initIcons(); // Must run AFTER render functions to catch new icons
        initHeroCarousel();
        initLanguageSwitcher();
        initMobileNav();
        initContactForm();
        initPastRoutes();
    });
})();