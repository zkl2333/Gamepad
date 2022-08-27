import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const ws = new WebSocket("ws://localhost:8080");

export let isGamepadConnected = false;
export let gamepadIndex = 0;

export const setGamepadIndex = (index: number) => {
  gamepadIndex = index;
};

window.addEventListener("gamepadconnected", function (e) {
  isGamepadConnected = true;
  console.log(
    `控制器已连接于 ${e.gamepad.index} 位: ${e.gamepad.id}. ${e.gamepad.buttons.length}个按钮, ${e.gamepad.axes.length}个轴.`,
    e.gamepad
  );
});

window.addEventListener("gamepaddisconnected", function (e) {
  isGamepadConnected = false;
  console.log(`控制器已从 ${e.gamepad.index} 位断开: ${e.gamepad.id}.`);
});

// 死区
const deadZone = (value: number) => {
  return Math.abs(value) < 200 ? 0 : value;
};

type GamepadValue = { index: string; value: number };

// 递归提取变化的值
const getChangeValue = (arr1: GamepadValue[], arr2: GamepadValue[]): GamepadValue[] => {
  const result: GamepadValue[] = [];
  arr1.forEach((item) => {
    const target = arr2.find((i) => i.index === item.index);
    if (target) {
      if (item.value !== target.value) {
        result.push(item);
      }
    } else {
      result.push(item);
    }
  });
  return result;
};

let gamepadValueArr: { index: string; value: number }[] = [];

const createGamepadValue = (gamepad: Gamepad) => {
  const valueArr: { index: string; value: number }[] = [];

  gamepad.buttons.forEach((button, index) => {
    if (index === 6) {
      valueArr.push({
        index: index.toString(),
        value: 700 + Math.floor(button.value * 300),
      });
    } else {
      valueArr.push({
        index: index.toString(),
        value: Math.floor(button.value * 1000),
      });
    }
  });

  gamepad.axes.forEach((axis, index) => {
    valueArr.push({
      index: "a" + index,
      value: deadZone(Math.floor(axis * 1000)),
    });
  });

  const changeValue = getChangeValue(valueArr, gamepadValueArr);

  gamepadValueArr = valueArr;

  return changeValue
    .map((item) => {
      return `${item.index}:${item.value}`;
    })
    .join(",");
};

const scanGamepad = () => {
  if (isGamepadConnected) {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (gamepad) {
      let gamepadValue = createGamepadValue(gamepad);
      if (gamepadValue) {
        console.log(gamepadValue);
        ws.send(gamepadValue + ",");
      }
    }
  }
};

setInterval(scanGamepad, 100);

export const getGamepad = (): Gamepad | null => {
  if (isGamepadConnected) {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    return gamepad;
  }
  return null;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
