/*
 * Simple timer implementation
 * @author Goran Antic
 */

Timer = function (container) {
    this.container = container;
}

Timer.prototype = {
    startTime: null,
    container: null,
    timerIntervalVar: null,
    maxSeconds: 999,

    constructor: Timer,
    
    start: function () {
        this.startTime = new Date();
        this.container.innerText = 0;
        this.timerIntervalVar = setInterval(bind(this,this.reTime, 500));
    },
    reTime: function(){
        var currentTime = new Date();
        var timeDiff = Math.abs(currentTime.getTime() - this.startTime.getTime());
        var seconds = Math.floor(timeDiff / 1000);
        if (seconds < this.maxSeconds) {
            var timeStrLen = ("" + seconds).length;
            for (var i = 0; i < 3 - timeStrLen; i++) {
                seconds = "0" + seconds;
            }
            this.container.innerHTML = "Timer: " + seconds;
        }
        else {
            //I would say it's an easter egg, but since this is open source, I don't know...
            this.container.innerHTML = "You are taking too long, I quit! <br/><br/> Kind regards,<br/> timer.";
            this.stop();
        }
        

    },
    stop: function () {
        clearInterval(this.timerIntervalVar);
    }
}