import { useCallback, useEffect, useState } from "react";
import defaultBarangayLogo from "../assets/img/brgy_logo.jpg";

const BARANGAY_LOGO_STORAGE_KEY = "barangay-system-logo";
const BARANGAY_LOGO_EVENT = "barangay-logo-updated";

const getStoredLogo = (): string => {
  if (typeof window === "undefined") {
    return defaultBarangayLogo;
  }

  const storedLogo = localStorage.getItem(BARANGAY_LOGO_STORAGE_KEY);
  if (!storedLogo || !storedLogo.trim()) {
    return defaultBarangayLogo;
  }

  return storedLogo;
};

export const useBarangayLogo = () => {
  const [logoSrc, setLogoSrcState] = useState<string>(() => getStoredLogo());

  const setLogoSrc = useCallback((nextLogo: string) => {
    const normalizedLogo = nextLogo?.trim() ? nextLogo : defaultBarangayLogo;

    setLogoSrcState(normalizedLogo);

    if (typeof window === "undefined") {
      return;
    }

    if (normalizedLogo === defaultBarangayLogo) {
      localStorage.removeItem(BARANGAY_LOGO_STORAGE_KEY);
    } else {
      localStorage.setItem(BARANGAY_LOGO_STORAGE_KEY, normalizedLogo);
    }

    window.dispatchEvent(
      new CustomEvent<string>(BARANGAY_LOGO_EVENT, {
        detail: normalizedLogo,
      }),
    );
  }, []);

  const resetLogoSrc = useCallback(() => {
    setLogoSrc(defaultBarangayLogo);
  }, [setLogoSrc]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === BARANGAY_LOGO_STORAGE_KEY) {
        setLogoSrcState(getStoredLogo());
      }
    };

    const handleCustomLogoUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (typeof customEvent.detail === "string" && customEvent.detail) {
        setLogoSrcState(customEvent.detail);
      } else {
        setLogoSrcState(getStoredLogo());
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      BARANGAY_LOGO_EVENT,
      handleCustomLogoUpdate as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        BARANGAY_LOGO_EVENT,
        handleCustomLogoUpdate as EventListener,
      );
    };
  }, []);

  return {
    logoSrc,
    setLogoSrc,
    resetLogoSrc,
    defaultLogoSrc: defaultBarangayLogo,
  };
};
