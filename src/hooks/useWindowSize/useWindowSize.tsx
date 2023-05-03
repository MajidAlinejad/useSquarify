import { useLayoutEffect, useState } from "react";

export function useHTMLElementSize(ref: HTMLElement | null) {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([ref?.clientWidth || 0, ref?.clientHeight || 0]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [ref]);
  return size;
}
