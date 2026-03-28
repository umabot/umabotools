(function () {
    'use strict';

    var initialized = false;
    var buttonsBound = false;
    var widgetInitialized = false;
    var apiLoadFailed = false;
    var apiLoadPromise = null;

    var DEFAULT_API_URL = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    var API_LOAD_TIMEOUT_MS = 8000;
    var COMBO_POLL_MAX_ATTEMPTS = 150;
    var COMBO_POLL_INTERVAL_MS = 100;

    function isDebugEnabled(root) {
        return root && root.getAttribute('data-translate-debug') === 'true';
    }

    function debugLog(root, message) {
        if (isDebugEnabled(root)) {
            console.log('[translate-header] ' + message);
        }
    }

    function isTranslateApiReady() {
        return !!(
            window.google &&
            window.google.translate &&
            window.google.translate.TranslateElement
        );
    }

    function getApiUrl(root) {
        return (root && root.getAttribute('data-google-translate-src')) || DEFAULT_API_URL;
    }

    function getDiagnosticMessage(root, kind) {
        var message;
        switch (kind) {
            case 'script-error':
                message = 'Translation service blocked or unavailable. Check ad blocker, privacy settings, or network policy.';
                break;
            case 'script-timeout':
                message = 'Translation service did not respond. Network or browser policy may be blocking translate.google.com.';
                break;
            case 'api-missing':
                message = 'Google Translate API unavailable after script load.';
                break;
            case 'combo-missing':
                message = 'Translator loaded, but language control did not initialize.';
                break;
            default:
                message = 'Translator unavailable.';
        }

        if (window.location && window.location.protocol === 'file:') {
            message += ' If this is opened in a restricted preview, try opening directly in your browser.';
        }

        return message;
    }

    function setStatus(root, message, isError) {
        var statusEl = root.querySelector('.translate-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.classList.toggle('error', !!isError);
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

    function ensureTranslateApi(root) {
        if (isTranslateApiReady()) {
            debugLog(root, 'Google Translate API already available.');
            return Promise.resolve(true);
        }

        if (apiLoadPromise) {
            debugLog(root, 'Waiting for existing Google Translate API load.');
            return apiLoadPromise;
        }

        debugLog(root, 'Loading Google Translate API script.');
        apiLoadPromise = new Promise(function (resolve) {
            var settled = false;
            var script = document.querySelector('script[src*="translate_a/element.js"]');
            var scriptUrl = getApiUrl(root);

            function finalize(success, failureKind) {
                if (settled) {
                    return;
                }

                settled = true;
                if (!success) {
                    apiLoadFailed = true;
                    setStatus(root, getDiagnosticMessage(root, failureKind), true);
                    debugLog(root, 'API load failed: ' + failureKind);
                } else {
                    debugLog(root, 'API load succeeded.');
                }

                resolve(success);
            }

            function onLoad() {
                if (isTranslateApiReady()) {
                    finalize(true);
                    return;
                }

                setTimeout(function () {
                    finalize(isTranslateApiReady(), 'api-missing');
                }, 50);
            }

            var timeoutId = setTimeout(function () {
                finalize(false, 'script-timeout');
            }, API_LOAD_TIMEOUT_MS);

            function finalizeWithTimeoutClear(success, failureKind) {
                clearTimeout(timeoutId);
                finalize(success, failureKind);
            }

            function onError() {
                finalizeWithTimeoutClear(false, 'script-error');
            }

            function onLoadWithTimeoutClear() {
                clearTimeout(timeoutId);
                onLoad();
            }

            if (!script) {
                script = document.createElement('script');
                script.src = scriptUrl;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            }

            script.addEventListener('load', onLoadWithTimeoutClear, { once: true });
            script.addEventListener('error', onError, { once: true });

            if (script.readyState === 'complete') {
                onLoadWithTimeoutClear();
            }
        });

        return apiLoadPromise;
    }

    function applyLanguage(root, storageKey, langCode, pageLanguage) {
        var attempts = 0;

        var poll = setInterval(function () {
            var combo = getTranslateCombo();
            if (combo) {
                combo.value = langCode;
                combo.dispatchEvent(new Event('change'));
                localStorage.setItem(storageKey, langCode);
                setActiveButton(root, langCode);
                setStatus(root, 'Language: ' + langCode.toUpperCase(), false);
                clearInterval(poll);
                return;
            }

            attempts += 1;
            if (attempts >= COMBO_POLL_MAX_ATTEMPTS) {
                clearInterval(poll);

                if (langCode === pageLanguage) {
                    localStorage.setItem(storageKey, langCode);
                    setActiveButton(root, langCode);
                    setStatus(root, 'Language: ' + langCode.toUpperCase(), false);
                    return;
                }

                if (apiLoadFailed) {
                    setStatus(root, getDiagnosticMessage(root, 'script-error'), true);
                } else if (!isTranslateApiReady()) {
                    setStatus(root, getDiagnosticMessage(root, 'api-missing'), true);
                } else {
                    setStatus(root, getDiagnosticMessage(root, 'combo-missing'), true);
                }
            }
        }, COMBO_POLL_INTERVAL_MS);
    }

    // Waits for the widget to be ready (created by the googleTranslateElementInit callback).
    // Does NOT call new TranslateElement() itself — that must happen synchronously in the callback.
    function ensureWidgetInitialized(root) {
        if (widgetInitialized) {
            return Promise.resolve(true);
        }

        // Start loading the API script if not already started; the callback will create the widget.
        return ensureTranslateApi(root).then(function (ready) {
            if (!ready) {
                return false;
            }
            // The callback fires synchronously during script execution, before the load
            // event resolves this promise, so widgetInitialized should already be true here.
            return widgetInitialized;
        });
    }

    function bindButtons(root, storageKey, pageLanguage, includedLanguages) {
        if (buttonsBound) {
            return;
        }

        var buttons = root.querySelectorAll('.translate-btn');
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                var langCode = button.getAttribute('data-lang');
                if (!langCode) {
                    return;
                }

                setActiveButton(root, langCode);
                setStatus(root, 'Loading translator...', false);

                ensureWidgetInitialized(root).then(function (ready) {
                    if (!ready && langCode !== pageLanguage) {
                        return;
                    }

                    applyLanguage(root, storageKey, langCode, pageLanguage);
                });
            });
        });

        buttonsBound = true;
    }

    // Applies the user's saved language preference after the widget has been created.
    function applyInitialLanguage() {
        if (initialized) {
            return;
        }
        initialized = true;

        var root = document.querySelector('[data-translate-root]');
        if (!root) {
            return;
        }

        var storageKey = root.getAttribute('data-storage-key') || 'umabot_lang_pref';
        var pageLanguage = root.getAttribute('data-page-language') || 'en';
        var preferredLanguage = localStorage.getItem(storageKey) || pageLanguage;

        applyLanguage(root, storageKey, preferredLanguage, pageLanguage);
    }

    // Google calls this when translate_a/element.js is fully loaded.
    // new TranslateElement() MUST be called synchronously here — Google's init window
    // is only open during this callback. Deferring it to a Promise.then() is too late.
    window.googleTranslateElementInit = function () {
        var root = document.querySelector('[data-translate-root]');
        debugLog(root, 'googleTranslateElementInit callback fired.');

        if (widgetInitialized) {
            return;
        }

        var pageLanguage = root ? (root.getAttribute('data-page-language') || 'en') : 'en';
        var includedLanguages = root ? (root.getAttribute('data-included-languages') || 'en,es,fr') : 'en,es,fr';

        try {
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
            debugLog(root, 'TranslateElement created successfully.');
        } catch (error) {
            debugLog(root, 'TranslateElement init error: ' + (error && error.message ? error.message : String(error)));
            if (root) {
                setStatus(root, getDiagnosticMessage(root, 'combo-missing'), true);
            }
            return;
        }

        applyInitialLanguage();
    };

    document.addEventListener('DOMContentLoaded', function () {
        var root = document.querySelector('[data-translate-root]');
        if (!root) {
            return;
        }

        var storageKey = root.getAttribute('data-storage-key') || 'umabot_lang_pref';
        var pageLanguage = root.getAttribute('data-page-language') || 'en';
        var includedLanguages = root.getAttribute('data-included-languages') || 'en,es,fr';

        setActiveButton(root, pageLanguage);
        setStatus(root, 'Loading translator...', false);
        bindButtons(root, storageKey, pageLanguage, includedLanguages);

        // Kick off API script loading. Widget creation and language application
        // happen inside window.googleTranslateElementInit when Google calls it back.
        ensureTranslateApi(root);
    });
})();
