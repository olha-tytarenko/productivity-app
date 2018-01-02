import { Observer } from '../../observer';

const timerTemplate = require('./timer.hbs');

export class TimerView {
  constructor(element) {
    this.element = element;
    this.changeTaskStateEvent = new Observer(this);
    this.changeTimeLeft = null;
    this.timeout = null;
    this.task = {};
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
    const startPomodoroBtn = document.getElementsByClassName('start-pomodoro')[0];
    const btnGroup = document.getElementsByClassName('btn-group')[0];
    const processBlock = document.getElementsByClassName('process')[0];
    const timerWrapper = document.getElementsByClassName('timer-wrapper')[0];
    const timeDiv = document.getElementsByClassName('time')[0];
    const breakMark = document.getElementsByClassName('break-mark')[0];
    // const mask = document.getElementsByClassName('mask')[0];
    // const filler = document.getElementsByClassName('filler')[0];
    // const spinner = document.getElementsByClassName('spinner')[0];

    const settings = JSON.parse(sessionStorage.getItem('settings'));

    startBtn.addEventListener('click', () => {
      this.workIteration();
    });



    failBtn.addEventListener('click', () => {
      const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
      const failedPomodoro = pomodoros.filter(checkbox => !checkbox.checked)[0];
      failedPomodoro.checked = true;
      breakMark.classList.remove('display-none');
      failedPomodoro.classList.add('failed');
      failBtn.classList.add('display-none');
      finishBtn.classList.add('display-none');
      finishTaskBtn.classList.add('display-none');
      startPomodoroBtn.classList.remove('display-none');
      // clearTimeout(this.timeout);
      // this.break();

      this.startTimer(settings.shortBreak);
    });

    startPomodoroBtn.addEventListener('click', () => {
      btnGroup.classList.remove('display-none');
      startPomodoroBtn.classList.add('display-none');
      clearTimeout(this.timeout);
      this.workIteration();
    });

    finishBtn.addEventListener('click', () => {
      const unfinishedPomodoro = pomodoros.filter(checkbox => !checkbox.checked);
      if (unfinishedPomodoro.length > 1) {
        btnGroup.classList.add('display-none');
        startPomodoroBtn.classList.remove('display-none');
        unfinishedPomodoro[0].checked = true;

        this.resetAnimation();
        this.startTimer(settings.shortBreak, this.startTimer.bind(this, settings.shortBreak));
      } else {
        unfinishedPomodoro[0].checked = true;
        timerBlock.classList.remove('in-process');
        timerBlock.classList.add('completed');
        processBlock.classList.add('display-none');
        document.getElementById('completed').classList.remove('display-none');
        btnGroup.classList.add('display-none');
        document.getElementsByClassName('go-next')[0].classList.remove('display-none');
        const taskId = document.getElementsByClassName('timer-section')[0].dataset.id;
        this.changeTaskStateEvent.notify(taskId);
      }
    });
  }


  startTimer(duration, nextAction) {
    console.log(duration);
    clearInterval(this.changeTimeLeft);
    this.resetAnimation();

    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];

    const shortBreakTime = `${duration}s`;
    mask.style.animationDuration = shortBreakTime;
    filler.style.animationDuration = shortBreakTime;
    spinner.style.animationDuration = shortBreakTime;
    const timeLeft = document.getElementsByClassName('time-left')[0];
    timeLeft.innerText = duration;

    this.changeTimeLeft = setInterval(() => {
      timeLeft.innerText = +timeLeft.innerText - 1;
    }, 1000);

    if (nextAction === 'break') {
      this.timeout = setTimeout(() => {
        clearInterval(this.changeTimeLeft);
        this.checkPomodoro();
        this.break();
      }, duration * 1000);
    } else {
      this.timeout = setTimeout(() => {
        clearInterval(this.changeTimeLeft);
      }, duration * 1000);
    }
    // this.timeout = setTimeout(() => {
    //   clearInterval(this.changeTimeLeft);
    //   this.resetAnimation();
    //   switch (nextAction) {
    //   case 'break':
    //     this.checkPomodoro();
    //     this.break();
    //     break;
    //   case 'workIteration':
    //     this.workIteration();
    //     break;
    //   default:
    //     break;
    //   }
    // }, duration * 1000);
  }

  resetAnimation() {
    const timerBlock = document.getElementsByClassName('timer-wrapper')[0];
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];

    timerBlock.removeChild(mask);
    timerBlock.removeChild(filler);
    timerBlock.removeChild(spinner);

    const newMask = document.createElement('div');
    const newFiller = document.createElement('div');
    const newSpinner = document.createElement('div');

    newMask.classList.add('mask');
    newFiller.classList.add('pie');
    newFiller.classList.add('filler');
    newSpinner.classList.add('pie');
    newSpinner.classList.add('spinner');

    timerBlock.appendChild(newSpinner);
    timerBlock.appendChild(newFiller);
    timerBlock.appendChild(newMask);
  }

  break() {
    const workIterationCount = +sessionStorage.getItem('workIterationCount');
    if (workIterationCount < this.task.estimation) {
      const failBtn = document.getElementsByClassName('fail')[0];
      const finishBtn = document.getElementsByClassName('finish')[0];
      const finishTaskBtn = document.getElementsByClassName('finish-task')[0];
      const startPomodoroBtn = document.getElementsByClassName('start-pomodoro')[0];
      const btnGroup = document.getElementsByClassName('btn-group')[0];
      const breakMark = document.getElementsByClassName('break-mark')[0];
      const settings = JSON.parse(sessionStorage.getItem('settings'));
  
      breakMark.classList.remove('display-none');
  
      startPomodoroBtn.classList.remove('display-none');
      btnGroup.classList.remove('display-none');
      failBtn.classList.add('display-none');
      finishBtn.classList.add('display-none');
      finishTaskBtn.classList.remove('display-none');
      if (workIterationCount === settings.workIteration) {
        this.startTimer(settings.longBreak, 'workIteration');
      } else {
        this.startTimer(settings.shortBreak, 'workIteration');
      }
    }
  }

  workIteration() {
    const workIterationCount = +sessionStorage.getItem('workIterationCount');
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    if (workIterationCount < this.task.estimation) {
      const startBtn = document.getElementsByClassName('start')[0];
      const timerBlock = document.getElementsByClassName('timer')[0];
      const btnGroup = document.getElementsByClassName('btn-group')[0];
      const timerWrapper = document.getElementsByClassName('timer-wrapper')[0];
      const timeDiv = document.getElementsByClassName('time')[0];
      const breakMark = document.getElementsByClassName('break-mark')[0];

      breakMark.classList.add('display-none');

      startBtn.classList.add('display-none');
      timerBlock.classList.add('in-process');
      btnGroup.classList.remove('display-none');
      timerWrapper.classList.remove('display-none');
      timeDiv.classList.remove('display-none');
      sessionStorage.setItem('workIterationCount', workIterationCount + 1);
      if (workIterationCount < this.task.estimation){
        this.startTimer(settings.workTime, 'break');      
      }
    }
  }

  checkPomodoro() {
    const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const unfinishedPomodoro = pomodoros.filter(checkbox => !checkbox.checked);
    unfinishedPomodoro[0].checked = true;
  }
}