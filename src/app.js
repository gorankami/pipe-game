import Timer from "./Timer"
import Context2D from "./pipes/Context2D"

let gameContext = null;
let timer = null;

function initGame() {
  const canvas = document.getElementById("game");
  gameContext = new Context2D(canvas, 10, 10);
  gameContext.start();
  canvas.addEventListener(
    "contextmenu",
    function (event) {
      event.preventDefault();
    },
    false
  );

  gameContext.canvas.addEventListener("mousedown", canvasClick, false);
  gameContext.canvas.addEventListener("touchstart", canvasTouch, false);
}

function initTimer() {
  const timerContainer = document.getElementById("timer");
  timer = new Timer(timerContainer);
  timer.start();
}

//events
function canvasClick(event) {
  event.preventDefault();
  gameContext.click(event.button, event.clientX, event.clientY, onWin);
}

function canvasTouch(event) {
  event.preventDefault();
  gameContext.click(
    0,
    event.touches[0].pageX,
    event.touches[0].pageY,
    onWin
  );
}

function onWin() {
  gameContext.canvas.removeEventListener("mousedown", canvasClick, false);
  gameContext.canvas.removeEventListener(
    "touchstart",
    canvasTouch,
    false
  );
}

window.onload = function () {
  initGame();
  initTimer();
};