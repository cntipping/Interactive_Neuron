/** A still cursor previews after 1.5 seconds; movement cancels and restarts. */
export function createHoverPreview(show: (part: number | null) => void, delay = 1500) {
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
