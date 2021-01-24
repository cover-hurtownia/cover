import { useState, useEffect } from "/js/lib/PreactHooks.js";

const WINDOW_STORAGE = "WINDOW_STORAGE";

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const item = window.localStorage.getItem(key);
        
        try {
            return item ? JSON.parse(item) : initialValue;
        }
        catch (_) {
            return initialValue;
        }
    });

    useEffect(() => {
        const onStorage = event => {
            if (event.key === key) {
                setValue(JSON.parse(event.newValue));
            }
        };

        const onWindowStorage = event => {
            if (event.detail.key === key) {
                setValue(event.detail.value);
            }
        };
        
        window.addEventListener("storage", onStorage);
        window.addEventListener(WINDOW_STORAGE, onWindowStorage);

        return () => {
            window.removeEventListener("storage", onStorage, {});
            window.removeEventListener(WINDOW_STORAGE, onWindowStorage);
        };
    }, [])

    return [value, (nextValue) => {
        const finalValue = nextValue instanceof Function ? nextValue(value) : nextValue;

        setValue(finalValue);
        window.dispatchEvent(new CustomEvent(WINDOW_STORAGE, { detail: { key, value: finalValue } }));
        window.localStorage.setItem(key, JSON.stringify(finalValue));
    }];
};

export default useLocalStorage;