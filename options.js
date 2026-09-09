// Options page functionality

const autoSearch = document.getElementById('autoSearch');
const notifications = document.getElementById('notifications');
const includeAuctions = document.getElementById('includeAuctions');
const updateFrequency = document.getElementById('updateFrequency');
const cacheSize = document.getElementById('cacheSize');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const clearCache = document.getElementById('clearCache');
const clearHistory = document.getElementById('clearHistory');
const clearSaved = document.getElementById('clearSaved');
const viewSaved = document.getElementById('viewSaved');
const exportData = document.getElementById('exportData');
const status = document.getElementById('status');

// Default settings
const defaultSettings = {
    autoSearch: true,
    notifications: true,
    includeAuctions: false,
    updateFrequency: 'hourly',
    cacheSize: 7
};

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);

function loadSettings() {
    chrome.storage.local.get(defaultSettings, (settings) => {
        autoSearch.checked = settings.autoSearch;
        notifications.checked = settings.notifications;
        includeAuctions.checked = settings.includeAuctions;
        updateFrequency.value = settings.updateFrequency;
        cacheSize.value = settings.cacheSize;
    });
}

// Save settings
saveBtn.addEventListener('click', () => {
    const settings = {
        autoSearch: autoSearch.checked,
        notifications: notifications.checked,
        includeAuctions: includeAuctions.checked,
        updateFrequency: updateFrequency.value,
        cacheSize: parseInt(cacheSize.value)
    };

    chrome.storage.local.set(settings, () => {
        showStatus('✅ Settings saved successfully!');
    });
});

// Reset to defaults
resetBtn.addEventListener('click', () => {
    if (confirm('Reset all settings to defaults?')) {
        chrome.storage.local.set(defaultSettings, () => {
            loadSettings();
            showStatus('✅ Settings reset to defaults!');
        });
    }
});

// Clear cache
clearCache.addEventListener('click', () => {
    if (confirm('Clear all cached search results?')) {
        chrome.storage.local.remove('searchCache', () => {
            showStatus('✅ Cache cleared!');
        });
    }
});

// Clear history
clearHistory.addEventListener('click', () => {
    if (confirm('Clear all search history?')) {
        chrome.storage.local.set({ searchHistory: [] }, () => {
            showStatus('✅ Search history cleared!');
        });
    }
});

// Clear saved properties
clearSaved.addEventListener('click', () => {
    if (confirm('Delete all saved properties? This cannot be undone.')) {
        chrome.storage.local.set({ savedProperties: [] }, () => {
            showStatus('✅ All saved properties deleted!');
        });
    }
});

// View saved properties
viewSaved.addEventListener('click', () => {
    chrome.storage.local.get(['savedProperties'], (result) => {
        const saved = result.savedProperties || [];
        if (saved.length === 0) {
            alert('No saved properties yet!');
        } else {
            const list = saved.map((p, i) => `${i + 1}. ${p.title} (Saved: ${p.savedAt})`).join('\n');
            alert(`Saved Properties:\n\n${list}`);
        }
    });
});

// Export data
exportData.addEventListener('click', () => {
    chrome.storage.local.get(null, (data) => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nz-properties-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showStatus('✅ Data exported successfully!');
    });
});

function showStatus(message) {
    status.textContent = message;
    setTimeout(() => {
        status.textContent = '';
    }, 3000);
}
