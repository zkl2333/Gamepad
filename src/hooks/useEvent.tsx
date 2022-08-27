import { useEffect } from "react";

export const useEvent = (event: string, callback: (...args: any[]) => void) => {
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
};
