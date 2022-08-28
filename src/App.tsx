import { useInterval } from "./hooks/useInterval";
import { useForceUpdate } from "./hooks/useForceUpdate";
import { Button, List, Progress } from "antd";
import {
  getGamepadIndex,
  getGamepad,
  getIsGamepadConnected,
  setGamepadIndex,
  createGamepadValue,
} from "./main";
import "./App.css";

function App() {
  const isGamepadConnected = getIsGamepadConnected();
  const gamepadIndex = getGamepadIndex();
  const forceUpdate = useForceUpdate();

  useInterval(forceUpdate, 100);

  const gamepad = getGamepad();

  // 震动手柄
  const vibrate = () => {
    console.log("震动手柄", gamepad);
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
          <List
            bordered
            dataSource={navigator.getGamepads().filter((i) => i)}
            renderItem={(gamepad) => {
              if (!gamepad) return null;
              return (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => {
                        setGamepadIndex(gamepad.index);
                      }}
                    >
                      {gamepadIndex === gamepad.index ? "已选中" : "选中"}
                    </Button>,
                    <Button onClick={vibrate}>震动</Button>,
                  ]}
                >
                  <List.Item.Meta title={`${gamepad.index}号手柄`} description={gamepad.id} />
                </List.Item>
              );
            }}
          />

          {gamepad && (
            <>
              <div>
                控制器已连接于 {gamepad.index} 位: {gamepad.id}. {gamepad.buttons.length}个按钮,{" "}
                {gamepad.axes.length}个轴.{" "}
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: "20px" }}
              >
                {createGamepadValue(gamepad, true).map((item) => {
                  if (item.index.indexOf("a") !== -1) {
                    return (
                      <div>
                        <div>{item.index}</div>
                        <Progress
                          percent={item.value / 20 + 50}
                          showInfo={false}
                          strokeColor={item.value > 0 ? "green" : "red"}
                        />
                      </div>
                    );
                  }
                  return (
                    <div>
                      <div>{item.index}</div>
                      <Progress showInfo={false} percent={item.value / 10} width={80} />
                    </div>
                  );
                })}
              </div>
              {/* 五个一列 */}
              {/* <pre>{JSON.stringify(createGamepadValue(gamepad, true).slice(0, 5), null, 0)}</pre>
              <pre>{JSON.stringify(createGamepadValue(gamepad, true).slice(5, 10), null, 0)}</pre>
              <pre>{JSON.stringify(createGamepadValue(gamepad, true).slice(10, 15), null, 0)}</pre>
              <pre>{JSON.stringify(createGamepadValue(gamepad, true).slice(15, 20), null, 0)}</pre>
              <pre>{JSON.stringify(createGamepadValue(gamepad, true).slice(20, 25), null, 0)}</pre> */}
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
