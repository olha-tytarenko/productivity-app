import { Observer } from '../../observer';

const timerTemplate = require('./timer.hbs');

export class TimerView {
  constructor(element) {
    this.element = element;
    this.changeTaskStateEvent = new Observer(this);
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
    const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const startPomodoroBtn = document.getElementsByClassName('start-pomodoro')[0];
    const btnGroup = document.getElementsByClassName('btn-group')[0];
    const processBlock = document.getElementsByClassName('process')[0];

    startBtn.addEventListener('click', () => {
      startBtn.classList.add('display-none');
      timerBlock.classList.add('in-process');
      processBlock.classList.remove('display-none');
      btnGroup.classList.remove('display-none');
    });



    failBtn.addEventListener('click', () => {
      const failedPomodoro = pomodoros.filter(checkbox => !checkbox.checked)[0];
      failedPomodoro.checked = true;
      failedPomodoro.classList.add('failed');
      startPomodoroBtn.classList.remove('display-none');
      btnGroup.classList.add('display-none');
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
}