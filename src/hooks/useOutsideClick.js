import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef(null);

  useEffect(
    function () {
      if (!handler) {
        // console.log(handler);
        return;
      }
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) handler();
        // console.log(ref.current?.contains(e.target));
        // console.log(e.target);
      }
      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
