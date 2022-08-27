import { useCallback, useEffect, useRef, useState } from "react";
import { useInterval } from "./hooks/useInterval";
import { useEvent } from "./hooks/useEvent";
import { useForceUpdate } from "./hooks/useForceUpdate";
import "./App.css";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [gamepadIndex, setGamepadIndex] = useState(0);
  const { send } = useWebSocket("ws://localhost:8080");

  useEvent("gamepadconnected", function (e) {
    setIsGamepadConnected(true);
    console.log(
      `控制器已连接于 ${e.gamepad.index} 位: ${e.gamepad.id}. ${e.gamepad.buttons.length}个按钮, ${e.gamepad.axes.length}个轴.`,
      e.gamepad
    );
  });

  useEvent("gamepaddisconnected", function (e) {
    setIsGamepadConnected(false);
    console.log(`控制器已从 ${e.gamepad.index} 位断开: ${e.gamepad.id}.`);
  });

  const getGamepad = (): Gamepad | null => {
    if (isGamepadConnected) {
      const gamepad = navigator.getGamepads()[gamepadIndex];
      return gamepad;
    }
    return null;
  };

  // const scanGamepad = () => {
  //   getGamepad();
  // };

  const forceUpdate = useForceUpdate();

  useInterval(forceUpdate, 100);

  const gamepad = getGamepad();

  useEffect(() => {
    if (gamepad?.buttons[13].pressed) {
      send("down\r");
    }
    if (gamepad?.buttons[12].pressed) {
      send("up\r");
    }
  }, [gamepad]);

  // console.log(gamepad);

  // 震动手柄
  const vibrate = () => {
    if (gamepad) {
      (gamepad as any).vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 200,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
      });
    }
  };

  return (
    <div className="App">
      {isGamepadConnected ? (
        <>
          <ul>
            {navigator.getGamepads().map(
              (gamepad) =>
                gamepad && (
                  <li key={gamepad.id}>
                    {gamepad.index}:{gamepad.id}
                    <button
                      className={gamepad.index === gamepadIndex ? "active" : ""}
                      onClick={() => {
                        setGamepadIndex(gamepad.index);
                      }}
                    >
                      使用
                    </button>
                    <button onClick={vibrate}>震动</button>
                  </li>
                )
            )}
          </ul>
          {gamepad && (
            <>
              <div>
                控制器已连接于 {gamepad.index} 位: {gamepad.id}. {gamepad.buttons.length}个按钮,{" "}
                {gamepad.axes.length}个轴.{" "}
              </div>
              <pre>
                {JSON.stringify(
                  gamepad?.buttons.map((button, index) => {
                    return {
                      index: index,
                      pressed: button.pressed,
                      touched: button.touched,
                      value: button.value,
                    };
                  }),
                  null,
                  2
                )}
              </pre>
            </>
          )}
        </>
      ) : (
        "请先连接手柄并按任意键激活"
      )}
    </div>
  );
}

export default App;
