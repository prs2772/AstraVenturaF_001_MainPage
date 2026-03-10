export function isBrowser(): boolean {
    try {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    } catch {
        return false;
    }
}

export const StorageUtil = {
    get(key: string): string | null {
        if (!isBrowser()) return null;
        return localStorage.getItem(key);
    },
    set(key: string, value: string): void {
        if (!isBrowser()) return;
        localStorage.setItem(key, value);
    },
    remove(key: string): void {
        if (!isBrowser()) return;
        localStorage.removeItem(key);
    },
    clear(): void {
        if (!isBrowser()) return;
        localStorage.clear();
    }
};