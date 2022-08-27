import { useInterval } from "./hooks/useInterval";
import { useForceUpdate } from "./hooks/useForceUpdate";
import { gamepadIndex, getGamepad, isGamepadConnected, setGamepadIndex } from "./main";
import "./App.css";

function App() {
  const forceUpdate = useForceUpdate();

  useInterval(forceUpdate, 100);

  const gamepad = getGamepad();

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
