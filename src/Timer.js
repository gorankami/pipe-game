/*
 * Simple timer implementation
 * @author Goran Antic
 */
import {
  bind
} from "./Common"


export default class Timer {
  constructor(container) {
    this.startTime = null;
    this.container = null;
    this.timerIntervalVar = null;
    this.maxSeconds = 999;
    this.container = container;
  }

  start() {
    this.startTime = new Date();
    this.container.innerText = 0;
    this.timerIntervalVar = setInterval(bind(this, this.reTime, 500));
  }

  reTime() {
    let currentTime = new Date();
    let timeDiff = Math.abs(currentTime.getTime() - this.startTime.getTime());
    let seconds = Math.floor(timeDiff / 1000);
    if (seconds < this.maxSeconds) {
      let timeStrLen = ("" + seconds).length;
      for (let i = 0; i < 3 - timeStrLen; i++) {
        seconds = "0" + seconds;
      }
      this.container.innerHTML = "Timer: " + seconds;
    } else {
      //I would say it's an easter egg, but since this is open source, I don't know...
      this.container.innerHTML = "You are taking too long, I quit! <br/><br/> Kind regards,<br/> timer.";
      this.stop();
    }
  }

  stop() {
    clearInterval(this.timerIntervalVar);
  }
}