import { useEffect } from "react";

export function useKey(keys, action, shouldListen = true) {
  useEffect(
    function () {
      if (!shouldListen) return;

      function callback(e) {
        // console.log(e);
        const { ctrlKey, shiftKey, altKey, code } = e;
        // console.log(code, keys.key);
        // Ctrl + any key
        if (
          ctrlKey === keys.ctrl &&
          !altKey &&
          !shiftKey &&
          code.toLowerCase() === keys.key?.toLowerCase()
        ) {
          // console.log("ctrl + any key");?
          e.preventDefault();
          action();
          return;
        }

        // Shift + any key
        if (
          shiftKey === keys.shift &&
          !ctrlKey &&
          !altKey &&
          code.toLowerCase() === keys.key.toLowerCase()
        ) {
          e.preventDefault();
          // console.log("shift + any key");
          action();
          return;
        }

        // Any single key
        if (
          code.toLowerCase() === keys.key.toLowerCase() &&
          !ctrlKey &&
          !shiftKey &&
          !altKey
        ) {
          e.preventDefault();
          // console.log(code.toLowerCase(), keys.key.toLowerCase());
          action();
          document.activeElement.blur();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, keys.alt, keys.ctrl, keys.shift, keys.key, shouldListen]
  );
}
