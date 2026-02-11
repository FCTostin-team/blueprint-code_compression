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

    document.getElementById('compressionStats').textContent =
        `📊 СТАТИСТИКА: ${originalSize} → ${compressedSize} символов (сэкономлено ${savings} символов, ${savingsPercent}%)`;
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
        showStatus('ОШИБКА: Вставьте код чертежа!', true);
        return;
    }

    try {
        if (!originalCode.startsWith('0')) {
            showStatus('ОШИБКА: Неверный формат чертежа. Код должен начинаться с "0"', true);
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
                    level: level,
                    memLevel: memLevel,
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
        showStatus('✅ Чертеж успешно сжат и оптимизирован!');
    } catch (e) {
        showStatus('❌ ОШИБКА: ' + e.message, true);
    }
}

function decompressBlueprint() {
    const compressedCode = document.getElementById('compressedBlueprint').value.trim();

    if (!compressedCode) {
        showStatus('ОШИБКА: Нет сжатого чертежа для проверки!', true);
        return;
    }

    try {
        if (!compressedCode.startsWith('0')) {
            showStatus('ОШИБКА: Неверный формат чертежа. Код должен начинаться с "0"', true);
            return;
        }

        const base64 = compressedCode.slice(1);
        const byteArray = base64ToUint8Array(base64);
        const jsonString = pako.inflate(byteArray, {
            to: 'string'
        });
        const json = JSON.parse(jsonString);

        showStatus('✅ Проверка успешна! Чертеж работоспособен.');
    } catch (e) {
        showStatus('❌ ОШИБКА при проверке: ' + e.message, true);
    }
}

function copyCompressedBlueprint() {
    const compressedField = document.getElementById('compressedBlueprint');
    compressedField.select();
    document.execCommand('copy');
    showStatus('✅ Чертеж скопирован в буфер обмена!');
}

function clearFields() {
    document.getElementById('originalBlueprint').value = '';
    document.getElementById('compressedBlueprint').value = '';
    document.getElementById('compressionStats').textContent = '';
    document.getElementById('status').className = 'status';
}
