import { useEffect } from "react";

const useLocalStorage = (callback: (ev: StorageEvent) => void) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, [callback]);
};

export default useLocalStorage;
