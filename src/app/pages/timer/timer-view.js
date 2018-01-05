import {Observer} from '../../observer';
import { EventBus } from '../../event-bus';

const timerTemplate = require('./timer.hbs');

export class TimerView {
  constructor(element) {
    this.element = element;
    this.changeTaskStateEvent = new Observer(this);
    this.changeTimeLeft = null;
    this.timeout = null;
    this.task = {};
    this.eventBus = new EventBus();
  }

  render(task) {
    this.task = task;
    this.element.innerHTML = timerTemplate(task);
    const estimation = Array.from(document.getElementsByClassName('checkbox'));
    estimation.filter((checkbox, index) => index >= task.estimation).forEach(checkbox => {
      checkbox.nextSibling.classList.add('display-none');
    });
    this.addListeners();
  }

  addListeners() {
    const startBtn = document.getElementsByClassName('start')[0];
    const timerBlock = document.getElementsByClassName('timer')[0];
    const failBtn = document.getElementsByClassName('fail')[0];
    const finishBtn = document.getElementsByClassName('finish')[0];
    const finishTaskBtn = document.getElementsByClassName('finish-task')[0];
    const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const startPomodoroBtn = Array.from(document.getElementsByClassName('start-pomodoro'));
    const breakMark = document.getElementsByClassName('break-mark')[0];
    const singleStartPomodoro = document.getElementById('singleStartPomodoro');
    const settings = JSON.parse(sessionStorage.getItem('settings'));
    const btnsTimerInProgress = document.getElementById('btnsTimerInProgress');
    const btnsBreakAfterTime = document.getElementById('btnsBreakAfterTime');
    const minutes = document.getElementsByClassName('min')[0];
    const goBackArrow = document.getElementsByClassName('go-back')[0];

    startBtn.addEventListener('click', () => {
      this.eventBus.dispatch('showHideHeader');
      goBackArrow.classList.add('display-none');

      this.workIteration();
    });


    failBtn.addEventListener('click', () => {
      const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
      const failedPomodoro = pomodoros.filter(checkbox => !checkbox.checked)[0];
      failedPomodoro.checked = true;
      failedPomodoro.classList.add('failed');
      breakMark.classList.remove('display-none');
      singleStartPomodoro.classList.remove('display-none');
      btnsTimerInProgress.classList.add('display-none');
      this.startTimer(settings.shortBreak);
    });

    startPomodoroBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        singleStartPomodoro.classList.add('display-none');
        btnsBreakAfterTime.classList.add('display-none');
        btnsTimerInProgress.classList.remove('display-none');

        this.workIteration();
      });
    });

    finishBtn.addEventListener('click', () => {
      const unfinishedPomodoro = pomodoros.filter(checkbox => !checkbox.checked);
      if (!this.isTaskFinished()) {
        btnsBreakAfterTime.classList.remove('display-none');
        btnsTimerInProgress.classList.add('display-none');
        unfinishedPomodoro[0].checked = true;


        this.startTimer(settings.shortBreak);
      } else {
        const taskId = document.getElementsByClassName('timer-section')[0].dataset.id;
        const timeLeft = document.getElementsByClassName('time-left')[0];

        unfinishedPomodoro[0].checked = true;
        // timerBlock.classList.remove('in-process');
        // timerBlock.classList.add('completed');
        // breakMark.classList.add('display-none');
        // minutes.classList.add('display-none');
        // timeLeft.classList.add('display-none');
        // btnsTimerInProgress.classList.add('display-none');

        document.getElementsByClassName('completed-task')[0].classList.remove('display-none');

        this.finishTask();

        // this.changeTaskStateEvent.notify(taskId);
      }
    });

    finishTaskBtn.addEventListener('click', () => {

      const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
      const unfinishedPomodoro = pomodoros.filter((checkbox) => {
        return !checkbox.checked && !checkbox.nextSibling.classList.contains('display-none');
      });

      unfinishedPomodoro.forEach((checkbox) => {
        checkbox.checked = true;
      });

      this.finishTask();
    });
  }


  startTimer(duration, nextAction) {
    const timeLeft = document.getElementsByClassName('time-left')[0];
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];
    const durationTime = `${duration}s`;

    clearInterval(this.changeTimeLeft);
    clearTimeout(this.timeout);
    this.resetAnimation();

    mask.style.animationDuration = durationTime;
    filler.style.animationDuration = durationTime;
    spinner.style.animationDuration = durationTime;
    timeLeft.innerText = duration;

    this.changeTimeLeft = setInterval(() => {
      if (+timeLeft.innerText - 1 < 0) {
        clearInterval(this.changeTimeLeft);
      } else {
        timeLeft.innerText = +timeLeft.innerText - 1;
      }
    }, 1000);

    if (nextAction === 'break') {
      this.timeout = setTimeout(() => {
        this.checkPomodoro();
        this.break();
      }, duration * 1000);
    }
  }

  resetAnimation() {
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];

    mask.classList.remove('mask');
    filler.classList.remove('filler');
    spinner.classList.remove('spinner');

    void mask.offsetWidth;
    void filler.offsetWidth;
    void spinner.offsetWidth;

    mask.classList.add('mask');
    filler.classList.add('filler');
    spinner.classList.add('spinner');
  }

  break() {
    const workIterationCount = +sessionStorage.getItem('workIterationCount');
    const btnsTimerInProgress = document.getElementById('btnsTimerInProgress');
    const btnsBreakAfterTime = document.getElementById('btnsBreakAfterTime');
    const breakMark = document.getElementsByClassName('break-mark')[0];
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    breakMark.classList.remove('display-none');
    btnsTimerInProgress.classList.add('display-none');
    btnsBreakAfterTime.classList.remove('display-none');

    if (this.isTaskFinished()) {
      const startPomodoro = btnsBreakAfterTime.getElementsByClassName('start-pomodoro')[0];
      btnsBreakAfterTime.style.justifyContent = 'center';
      startPomodoro.classList.add('display-none');
    }

    if (workIterationCount === settings.workIteration) {
      this.startTimer(settings.longBreak, 'workIteration');
    } else {
      this.startTimer(settings.shortBreak, 'workIteration');
    }
  }

  workIteration() {
    const workIterationCount = +sessionStorage.getItem('workIterationCount');
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    if (workIterationCount < this.task.estimation) {
      const startBtn = document.getElementsByClassName('start')[0];
      const timerBlock = document.getElementsByClassName('timer')[0];
      const btnsTimerInProgress = document.getElementById('btnsTimerInProgress');
      const timerWrapper = document.getElementsByClassName('timer-wrapper')[0];
      const timeDiv = document.getElementsByClassName('time')[0];
      const breakMark = document.getElementsByClassName('break-mark')[0];

      breakMark.classList.add('display-none');
      startBtn.classList.add('display-none');
      timerBlock.classList.add('in-process');
      btnsTimerInProgress.classList.remove('display-none');
      timerWrapper.classList.remove('display-none');
      timeDiv.classList.remove('display-none');
      sessionStorage.setItem('workIterationCount', workIterationCount + 1);
      if (workIterationCount < this.task.estimation) {
        this.startTimer(settings.workTime, 'break');
      }
    }
  }

  checkPomodoro() {
    const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const unfinishedPomodoro = pomodoros.filter(checkbox => !checkbox.checked);
    unfinishedPomodoro[0].checked = true;
  }

  isTaskFinished() {
    const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const unfinishedPomodoro = pomodoros.filter((checkbox) => {
      return !checkbox.checked && !checkbox.nextSibling.classList.contains('display-none');
    });
    return unfinishedPomodoro.length <= 1;
  }

  completeAnimation() {
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];

    mask.style.animationDuration = '0s';
    filler.style.animationDuration = '0s';
    spinner.style.animationDuration = '0s';
  }

  finishTask() {
    const timerBlock = document.getElementsByClassName('timer')[0];
    const breakMark = document.getElementsByClassName('break-mark')[0];
    const btnsTimerInProgress = document.getElementById('btnsTimerInProgress');
    const minutes = document.getElementsByClassName('min')[0];
    const timeLeft = document.getElementsByClassName('time-left')[0];

    timerBlock.classList.remove('in-process');
    timerBlock.classList.add('completed');
    breakMark.classList.add('display-none');
    minutes.classList.add('display-none');
    timeLeft.classList.add('display-none');
    btnsTimerInProgress.classList.add('display-none');
    document.getElementsByClassName('go-back')[0].classList.remove('display-none');
    document.getElementsByClassName('go-next')[0].classList.remove('display-none');
    clearInterval(this.changeTimeLeft);
    clearTimeout(this.timeout);
    this.eventBus.dispatch('showHideHeader');
    this.completeAnimation();
  }
}