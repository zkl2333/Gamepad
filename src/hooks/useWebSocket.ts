import { useRef, useLayoutEffect } from "react";

export const useWebSocket = (url = "ws://localhost:8080") => {
  const ws = useRef<WebSocket | null>(null);
  //启动
  useLayoutEffect(() => {
    ws.current = new WebSocket(url);
    return () => {
      ws.current?.close();
    };
  }, [ws]);

  return {
    send: (data: any) => ws.current?.send(data),
    close: () => ws.current?.close(),
    onmessage: (cb: (data: any) => void) => {
      if (ws.current) {
        ws.current.onmessage = (e) => {
          cb(e.data);
        };
      }
    },
  };
};
