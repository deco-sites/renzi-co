import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";

function useMedia(query: string, defaultValue: boolean): boolean {
  const mediaQuery = IS_BROWSER ? window.matchMedia(query) : null;
  const matches = useSignal(IS_BROWSER ? mediaQuery?.matches : defaultValue);

  useEffect(() => {
    if (!IS_BROWSER) return;

    const updateMatches = (e: MediaQueryListEvent) => {
      matches.value = e.matches;
    };

    mediaQuery?.addEventListener("change", updateMatches);

    return () => {
      mediaQuery?.removeEventListener("change", updateMatches);
    };
  }, [IS_BROWSER, mediaQuery]);

  return matches.value ?? defaultValue;
}

export default useMedia;