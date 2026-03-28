(function () {
    'use strict';

    var initialized = false;
    var widgetInitialized = false;

    function setStatus(root, message) {
        var statusEl = root.querySelector('.translate-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    function setActiveButton(root, langCode) {
        var buttons = root.querySelectorAll('.translate-btn');
        buttons.forEach(function (button) {
            var isActive = button.getAttribute('data-lang') === langCode;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function getTranslateCombo() {
        return document.querySelector('.goog-te-combo') || document.querySelector('select.goog-te-combo');
    }

    function applyLanguage(root, storageKey, langCode) {
        var maxAttempts = 150;
        var attempts = 0;

        var poll = setInterval(function () {
            var combo = getTranslateCombo();
            if (combo) {
                combo.value = langCode;
                combo.dispatchEvent(new Event('change'));
                localStorage.setItem(storageKey, langCode);
                setActiveButton(root, langCode);
                setStatus(root, 'Language: ' + langCode.toUpperCase());
                clearInterval(poll);
                return;
            }

            attempts += 1;
            if (attempts >= maxAttempts) {
                clearInterval(poll);
                setStatus(root, 'Translator unavailable or blocked.');
            }
        }, 100);
    }

    function initTranslateWidget(root, pageLanguage, includedLanguages) {
        if (widgetInitialized) {
            return true;
        }

        if (!window.google || !window.google.translate) {
            setStatus(root, 'Translator unavailable.');
            return false;
        }

        new google.translate.TranslateElement(
            {
                pageLanguage: pageLanguage,
                includedLanguages: includedLanguages,
                autoDisplay: false,
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            },
            'google_translate_element'
        );

        widgetInitialized = true;
        return true;
    }

    function bindButtons(root, storageKey) {
        var buttons = root.querySelectorAll('.translate-btn');
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var langCode = button.getAttribute('data-lang');
                if (!langCode) {
                    return;
                }

                if (!getTranslateCombo()) {
                    var pageLanguage = root.getAttribute('data-page-language') || 'en';
                    var includedLanguages = root.getAttribute('data-included-languages') || 'en,es,fr';
                    initTranslateWidget(root, pageLanguage, includedLanguages);
                }

                applyLanguage(root, storageKey, langCode);
            });
        });
    }

    function initializeTranslateHeader() {
        if (initialized) {
            return;
        }

        var root = document.querySelector('[data-translate-root]');
        if (!root) {
            return;
        }

        var storageKey = root.getAttribute('data-storage-key') || 'umabot_lang_pref';
        var pageLanguage = root.getAttribute('data-page-language') || 'en';
        var includedLanguages = root.getAttribute('data-included-languages') || 'en,es,fr';

        bindButtons(root, storageKey);
        setStatus(root, 'Loading translator...');

        if (!initTranslateWidget(root, pageLanguage, includedLanguages)) {
            return;
        }

        var preferredLanguage = localStorage.getItem(storageKey) || pageLanguage;
        applyLanguage(root, storageKey, preferredLanguage);
        initialized = true;
    }

    window.googleTranslateElementInit = function () {
        initializeTranslateHeader();
    };

    document.addEventListener('DOMContentLoaded', function () {
        var root = document.querySelector('[data-translate-root]');
        if (!root) {
            return;
        }

        var defaultLang = root.getAttribute('data-page-language') || 'en';
        setActiveButton(root, defaultLang);
        setStatus(root, 'Loading translator...');
    });
})();
