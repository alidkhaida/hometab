export interface Shortcut {
    id: string;
    title: string;
    url: string;
    icon?: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
    { id: '1', title: 'YouTube', url: 'https://youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
    { id: '2', title: 'Jellyfin', url: 'http://localhost:8096', icon: '/favicon.ico' }, // Placeholder default
    { id: '3', title: 'Twitch', url: 'https://twitch.tv', icon: 'https://www.twitch.tv/favicon.ico' },
    { id: '4', title: 'Plex', url: 'https://app.plex.tv', icon: 'https://www.plex.tv/favicon.ico' }
];

export class Launcher {
    private shortcuts: Shortcut[] = [];
    private customGreeting: string | null = null;
    private storageKey = 'hometab_shortcuts';
    private greetingKey = 'hometab_greeting';

    constructor() {
        this.loadShortcuts();
        this.loadGreeting();
    }

    async loadGreeting() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            const result = await chrome.storage.local.get(this.greetingKey);
            this.customGreeting = (result[this.greetingKey] as string) || null;
        } else {
            const stored = localStorage.getItem(this.greetingKey);
            this.customGreeting = stored || null;
        }
        return this.customGreeting;
    }

    async saveGreeting(text: string | null) {
        this.customGreeting = text;
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            await chrome.storage.local.set({ [this.greetingKey]: this.customGreeting });
        } else {
            if (text) localStorage.setItem(this.greetingKey, text);
            else localStorage.removeItem(this.greetingKey);
        }
    }

    getGreeting() {
        return this.customGreeting;
    }

    async loadShortcuts() {
        // Check if running as extension
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            const result = await chrome.storage.local.get(this.storageKey);
            this.shortcuts = (result[this.storageKey] as Shortcut[]) || DEFAULT_SHORTCUTS;
        } else {
            // Fallback to localStorage for PWA/Basic Web
            const stored = localStorage.getItem(this.storageKey);
            this.shortcuts = stored ? JSON.parse(stored) : DEFAULT_SHORTCUTS;
        }
        return this.shortcuts;
    }

    async saveShortcuts() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            await chrome.storage.local.set({ [this.storageKey]: this.shortcuts });
        } else {
            localStorage.setItem(this.storageKey, JSON.stringify(this.shortcuts));
        }
    }

    getShortcuts() {
        return this.shortcuts;
    }

    addShortcut(shortcut: Shortcut) {
        this.shortcuts.push(shortcut);
        this.saveShortcuts();
    }

    updateShortcut(shortcut: Shortcut) {
        const index = this.shortcuts.findIndex(s => s.id === shortcut.id);
        if (index !== -1) {
            this.shortcuts[index] = shortcut;
            this.saveShortcuts();
        }
    }

    removeShortcut(id: string) {
        this.shortcuts = this.shortcuts.filter(s => s.id !== id);
        this.saveShortcuts();
    }

    async getMetadata(urlStr: string): Promise<{ title: string, icon: string }> {
        try {
            const url = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
            const domain = url.hostname;

            // Icon: Google Favicon Service (Reliable fallback)
            const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

            // Title: Use domain as fallback, simplistic for now avoids CORS proxy complexity
            // In a real extension, we could fetch(url) and parse <title>, but that's surprisingly complex due to CSP
            let title = domain.replace('www.', '').split('.')[0];
            title = title.charAt(0).toUpperCase() + title.slice(1);

            return { title, icon };
        } catch (e) {
            return { title: 'Shortcut', icon: '/vite.svg' };
        }
    }
}
