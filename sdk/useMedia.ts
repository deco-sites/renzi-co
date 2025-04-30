import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";

function useMedia(query: string, defaultValue: boolean): boolean {
  const mediaQuery = IS_BROWSER ? window.matchMedia(query) : null;
  const [matches, setMatches] = useState(
    IS_BROWSER ? mediaQuery?.matches : defaultValue,
  );

  useEffect(() => {
    if (!IS_BROWSER) return;

    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery?.addEventListener("change", updateMatches);

    return () => {
      mediaQuery?.removeEventListener("change", updateMatches);
    };
  }, [IS_BROWSER, mediaQuery]);

  return matches ?? defaultValue;
}

export default useMedia;