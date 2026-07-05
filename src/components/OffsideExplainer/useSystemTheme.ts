"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import type { Theme } from "./types";

export function useSystemTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [hasThemeOverride, setHasThemeOverride] = useState(false);
  const applyTheme = useCallback((nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme;
    setThemeState(nextTheme);
  }, []);

  useLayoutEffect(() => {
    if (hasThemeOverride) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => applyTheme(getMediaQueryTheme(mediaQuery));

    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);

    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, [applyTheme, hasThemeOverride]);

  const setTheme = (nextTheme: Theme) => {
    setHasThemeOverride(true);
    applyTheme(nextTheme);
  };

  return { setTheme, theme };
}

function getMediaQueryTheme(mediaQuery: MediaQueryList): Theme {
  return mediaQuery.matches ? "dark" : "light";
}
