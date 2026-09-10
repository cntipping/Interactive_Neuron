export const HOVER_DELAY_MS = 600;

/** A still cursor previews after 600 ms; movement cancels and restarts. */
export function createHoverPreview(show: (part: number | null) => void, delay = HOVER_DELAY_MS) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return {
    cancel() { clearTimeout(timer); timer = undefined; show(null); },
    move(part: number | null) {
      clearTimeout(timer); show(null);
      if (part !== null) timer = setTimeout(() => { timer = undefined; show(part); }, delay);
    },
    dispose() { clearTimeout(timer); timer = undefined; },
  };
}
