const DEFAULT_LANGUAGE = 'ru';
let currentLanguage = DEFAULT_LANGUAGE;

function locale() {
    return (window.PROFILE_LOCALES && window.PROFILE_LOCALES[currentLanguage]) || window.PROFILE_LOCALES[DEFAULT_LANGUAGE];
}

function t(key) {
    const dict = locale();
    return dict[key] || window.PROFILE_LOCALES[DEFAULT_LANGUAGE][key] || key;
}

function updateLanguageToggleLabel() {
    const toggle = document.getElementById('languageToggle');
    const select = document.getElementById('languageSelect');

    if (!toggle) {
        return;
    }

    if (select && select.selectedOptions && select.selectedOptions.length > 0) {
        toggle.textContent = select.selectedOptions[0].textContent;
        return;
    }

    toggle.textContent = currentLanguage.toUpperCase();
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t('pageTitle');

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        node.textContent = t(node.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
        node.placeholder = t(node.dataset.i18nPlaceholder);
    });

    updateLanguageToggleLabel();

    const savedStats = document.getElementById('compressionStats').dataset.stats;
    if (savedStats) {
        const parsed = JSON.parse(savedStats);
        updateCompressionStats(parsed.original, parsed.compressed);
    }
}

function setLanguage(nextLanguage) {
    if (!window.PROFILE_LOCALES[nextLanguage]) {
        return;
    }

    currentLanguage = nextLanguage;
    localStorage.setItem('profile-language', nextLanguage);
    applyTranslations();
}

function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function uint8ArrayToBase64(array) {
    return btoa(String.fromCharCode.apply(null, array));
}

function showStatus(message, isError = false) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = 'status ' + (isError ? 'error' : 'success');

    setTimeout(() => {
        statusElement.className = 'status';
    }, 10000);
}

function updateCompressionStats(original, compressed) {
    const originalSize = original.length;
    const compressedSize = compressed.length;
    const savings = originalSize - compressedSize;
    const savingsPercent = Math.round((savings / originalSize) * 100);

    document.getElementById('compressionStats').dataset.stats = JSON.stringify({ original, compressed });
    document.getElementById('compressionStats').textContent =
        `📊 ${t('statsLabel')}: ${originalSize} → ${compressedSize} символов (сэкономлено ${savings} символов, ${savingsPercent}%)`;
}

function optimizeJsonStructure(json) {
    if (Array.isArray(json)) {
        return json.map(item => optimizeJsonStructure(item));
    }

    if (json && typeof json === 'object') {
        const result = {};

        for (const key in json) {
            const value = json[key];

            if (Array.isArray(value) && value.length === 0) continue;
            if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) continue;

            if (key === 'direction' && value === 0) continue;
            if (key === 'enabled' && value === true) continue;
            if (key === 'connections' && Object.keys(value).length === 0) continue;

            result[key] = optimizeJsonStructure(value);
        }

        return result;
    }

    return json;
}

function compressBlueprint() {
    const originalCode = document.getElementById('originalBlueprint').value.trim();

    if (!originalCode) {
        showStatus(t('statusEmptyBlueprint'), true);
        return;
    }

    try {
        if (!originalCode.startsWith('0')) {
            showStatus(t('statusInvalidBlueprint'), true);
            return;
        }

        const base64 = originalCode.slice(1);
        const byteArray = base64ToUint8Array(base64);
        const jsonString = pako.inflate(byteArray, {
            to: 'string'
        });
        const json = JSON.parse(jsonString);
        const optimizedJsonStructure = optimizeJsonStructure(json);
        const optimizedJsonString = JSON.stringify(optimizedJsonStructure);

        let bestCompressedData = null;
        let minSize = Infinity;

        for (let level = 6; level <= 9; level++) {
            for (let memLevel = 8; memLevel <= 9; memLevel++) {
                const options = {
                    level,
                    memLevel,
                    strategy: 0
                };

                const compressed = pako.deflate(optimizedJsonString, options);
                const base64Result = uint8ArrayToBase64(compressed);

                if (base64Result.length < minSize) {
                    minSize = base64Result.length;
                    bestCompressedData = compressed;
                }
            }
        }

        const compressedBase64 = uint8ArrayToBase64(bestCompressedData);
        const compressedBlueprint = '0' + compressedBase64;
        document.getElementById('compressedBlueprint').value = compressedBlueprint;
        updateCompressionStats(originalCode, compressedBlueprint);
        showStatus(t('statusCompressed'));
    } catch (e) {
        showStatus(t('statusCompressError') + e.message, true);
    }
}

function decompressBlueprint() {
    const compressedCode = document.getElementById('compressedBlueprint').value.trim();

    if (!compressedCode) {
        showStatus(t('statusNoCompressed'), true);
        return;
    }

    try {
        if (!compressedCode.startsWith('0')) {
            showStatus(t('statusInvalidBlueprint'), true);
            return;
        }

        const base64 = compressedCode.slice(1);
        const byteArray = base64ToUint8Array(base64);
        const jsonString = pako.inflate(byteArray, {
            to: 'string'
        });
        JSON.parse(jsonString);

        showStatus(t('statusVerified'));
    } catch (e) {
        showStatus(t('statusVerifyError') + e.message, true);
    }
}

function copyCompressedBlueprint() {
    const compressedField = document.getElementById('compressedBlueprint');
    compressedField.select();
    document.execCommand('copy');
    showStatus(t('statusCopied'));
}

function clearFields() {
    document.getElementById('originalBlueprint').value = '';
    document.getElementById('compressedBlueprint').value = '';
    document.getElementById('compressionStats').textContent = '';
    document.getElementById('compressionStats').dataset.stats = '';
    document.getElementById('status').className = 'status';
}

function setupLanguageSelector() {
    const toggle = document.getElementById('languageToggle');
    const panel = document.getElementById('languagePanel');
    const select = document.getElementById('languageSelect');

    toggle.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.language-switcher')) {
            panel.hidden = true;
        }
    });

    const handleLanguageSelect = (event) => {
        setLanguage(event.target.value);
        panel.hidden = true;
    };

    select.addEventListener('change', handleLanguageSelect);
    select.addEventListener('input', handleLanguageSelect);
    select.addEventListener('blur', () => {
        panel.hidden = true;
    });

    const savedLanguage = localStorage.getItem('profile-language');
    if (savedLanguage && window.PROFILE_LOCALES[savedLanguage]) {
        currentLanguage = savedLanguage;
    }

    select.value = currentLanguage;
    applyTranslations();
}

function setupActions() {
    document.getElementById('compressButton').addEventListener('click', compressBlueprint);
    document.getElementById('clearButton').addEventListener('click', clearFields);
    document.getElementById('copyButton').addEventListener('click', copyCompressedBlueprint);
    document.getElementById('verifyButton').addEventListener('click', decompressBlueprint);
}

document.addEventListener('DOMContentLoaded', () => {
    setupActions();
    setupLanguageSelector();
});
