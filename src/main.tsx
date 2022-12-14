import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/antd.css";

const ws = new WebSocket("ws://" + window.location.hostname + ":8080");

export let isGamepadConnected = false;
export let gamepadIndex = 0;

export const getIsGamepadConnected = () => {
  return isGamepadConnected;
};

export const getGamepadIndex = () => {
  return gamepadIndex;
};

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
  return Math.abs(value) < 20 ? 0 : value;
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

export const createGamepadValue = (gamepad: Gamepad, all = false) => {
  const valueArr: { index: string; value: number }[] = [];

  // gamepad.buttons.forEach((button, index) => {
  //   if (index === 6) {
  //     valueArr.push({
  //       index: index.toString(),
  //       // value: 700 + Math.floor(button.value * 300),
  //       value: Math.floor(button.value * 1000),
  //     });
  //   } else {
  //     valueArr.push({
  //       index: index.toString(),
  //       value: Math.floor(button.value * 1000),
  //     });
  //   }
  // });

  gamepad.axes.forEach((axis, index) => {
    valueArr.push({
      index: "a" + index,
      value: deadZone(Math.floor(axis * 70)),
    });
  });

  const changeValue = all ? valueArr : getChangeValue(valueArr, gamepadValueArr);

  gamepadValueArr = valueArr;

  return changeValue;
};

const formatGamepadValue = (value: { index: string; value: number }[]) =>
  value
    .map((item) => {
      return `${item.index}:${item.value}`;
    })
    .join(",");

const scanGamepad = (all = false) => {
  if (isGamepadConnected) {
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (gamepad) {
      let gamepadValue = formatGamepadValue(createGamepadValue(gamepad, all));
      if (gamepadValue) {
        console.log(gamepadValue);
        ws.send(gamepadValue + ";");
      }
    }
  }
};

let cont = 0;
setInterval(() => {
  // 每五次发送一次
  if (cont % 5 === 0) {
    scanGamepad(true);
  } else {
    scanGamepad();
  }
  cont++;
  if (cont > 1000) {
    cont = 0;
  }
}, 100);

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
