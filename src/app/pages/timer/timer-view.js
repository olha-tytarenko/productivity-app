import { Observer } from '../../observer';

const timerTemplate = require('./timer.hbs');

export class TimerView {
  constructor(element) {
    this.element = element;
    this.changeTaskStateEvent = new Observer(this);
    this.changeTimeLeft = null;
  }

  render(task) {
    this.element.innerHTML = timerTemplate(task);
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
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];
    const breakMark = document.getElementsByClassName('break-mark')[0];

    const settings = JSON.parse(sessionStorage.getItem('settings'));
    console.log(settings);

    startBtn.addEventListener('click', () => {
      startBtn.classList.add('display-none');
      timerBlock.classList.add('in-process');
      btnGroup.classList.remove('display-none');
      timerWrapper.classList.remove('display-none');
      const workTime = `${settings.workTime}s`;
      mask.style.animationDuration = workTime;
      filler.style.animationDuration = workTime;
      spinner.style.animationDuration = workTime;

      const timeLeft = document.getElementsByClassName('time-left')[0];
      timeLeft.innerText = settings.workTime;
      const min = document.getElementsByClassName('min')[0];
      min.innerText = 'min';

      breakMark.classList.add('display-none');

      this.changeTimeLeft = setInterval(() => {
        timeLeft.innerText = +timeLeft.innerText - 1;
      }, 1000);

      setTimeout(() => {
        clearInterval(this.changeTimeLeft);
        this.resetAnimation();
        this.breakAnimation();
      }, settings.workTime*1000);
    });



    failBtn.addEventListener('click', () => {
      const failedPomodoro = pomodoros.filter(checkbox => !checkbox.checked)[0];
      failedPomodoro.checked = true;
      failedPomodoro.classList.add('failed');
      startPomodoroBtn.classList.remove('display-none');
      btnGroup.classList.add('display-none');
      btnGroup.classList.remove('display-none');
      failBtn.classList.add('display-none');
      finishBtn.classList.add('display-none');
      finishTaskBtn.classList.remove('display-none');

      // animation
      clearInterval(this.changeTimeLeft);
      this.resetAnimation();
      this.breakAnimation();
    });

    startPomodoroBtn.addEventListener('click', () => {
      btnGroup.classList.remove('display-none');
      startPomodoroBtn.classList.add('display-none');
    });

    finishBtn.addEventListener('click', () => {
      const unfinishedPomodoro = pomodoros.filter(checkbox => !checkbox.checked);
      if (unfinishedPomodoro.length > 1) {
        btnGroup.classList.add('display-none');
        startPomodoroBtn.classList.remove('display-none');
        unfinishedPomodoro[0].checked = true;
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

  breakAnimation() {
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];
    const breakMark = document.getElementsByClassName('break-mark')[0];
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    breakMark.classList.remove('display-none');
    const shortBreakTime = `${settings.shortBreak}s`;
    mask.style.animationDuration = shortBreakTime;
    filler.style.animationDuration = shortBreakTime;
    spinner.style.animationDuration = shortBreakTime;
    const timeLeft = document.getElementsByClassName('time-left')[0];
    timeLeft.innerText = settings.shortBreak;

    this.changeTimeLeft = setInterval(() => {
      timeLeft.innerText = +timeLeft.innerText - 1;
    }, 1000);

    setTimeout(() => {
      clearInterval(this.changeTimeLeft);
    }, settings.shortBreak*1000);
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
}