import { useEffect, useRef } from "react";

export const useInterval = (callback: (...args: any[]) => void, delay: number) => {
  const savedCallback = useRef<(...args: any[]) => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
