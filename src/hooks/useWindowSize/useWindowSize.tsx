import { useLayoutEffect, useState } from "react";

export function useHTMLElementSize(ref: HTMLElement | null, onTime?: boolean) {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    if (ref) {
      function updateSize() {
        setSize([ref?.clientWidth || 0, ref?.clientHeight || 0]);
      }
      window.addEventListener("resize", updateSize);
      const observe = new ResizeObserver(updateSize);
      observe.observe(ref);
      updateSize();
      return () => {
        window.removeEventListener("resize", updateSize);
        observe.disconnect();
      };
    }
  }, [ref]);
  return size;
}
