export { };

declare global {
    interface Window {
        electronAPI?: {
            getRssi: () => Promise<number>;
            isElectron: boolean;
        };
    }
}
