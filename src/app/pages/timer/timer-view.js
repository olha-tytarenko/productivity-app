import { Observer } from '../../observer';
import { eventBus } from '../../event-bus';
import { router } from '../../router';
import { NotificationMessage } from '../../components/notification-message/notification-message';
import $ from 'jquery';
import timerTemplate from './timer.hbs';

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

    $('.go-back').tooltip();
    $('.go-next').tooltip();
    
    this.addListeners();
  }

  addListeners() {
    const startBtn = document.getElementsByClassName('start')[0];
    const failBtn = document.getElementsByClassName('fail')[0];
    const finishBtn = document.getElementsByClassName('finish')[0];
    const finishTaskBtn = document.getElementsByClassName('finish-task')[0];
    const startPomodoroBtn = Array.from(document.getElementsByClassName('start-pomodoro'));
    const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const singleStartPomodoro = document.getElementById('singleStartPomodoro');
    const btnsTimerInProgress = document.getElementById('btnsTimerInProgress');
    const goToTaskList = document.getElementsByClassName('go-back')[0];
    const goToReports = document.getElementsByClassName('go-next')[0];
    const addPomodoroBtn = document.getElementsByClassName('add')[0];

    goToTaskList.addEventListener('click', (event) => {
      event.preventDefault();

      router.navigate('#tasks-list');
    });

    goToReports.addEventListener('click', (event) => {
      event.preventDefault();

      router.navigate('#reports');
    });
    
    startBtn.addEventListener('click', () => {
      const goBackArrow = document.getElementsByClassName('go-back')[0];
      
      goBackArrow.classList.add('display-none');

      if (this.task.estimation < 5) {
        document.getElementsByClassName('add')[0].classList.remove('display-none');
      }
      
      eventBus.dispatch('showHideHeader');
      this.workIteration();
    });
    
    
    failBtn.addEventListener('click', () => {
      const pomodoros = Array.from(document.getElementsByClassName('checkbox'));
      const failedPomodoro = pomodoros.filter(checkbox => !checkbox.checked)[0];
      failedPomodoro.checked = true;
      failedPomodoro.classList.add('failed');
      singleStartPomodoro.classList.remove('display-none');
      btnsTimerInProgress.classList.add('display-none');
      
      this.break('failed');

      document.getElementsByClassName('add')[0].classList.add('display-none');
    });
    
    startPomodoroBtn.forEach(btn => {
      const btnsBreakAfterTime = document.getElementById('btnsBreakAfterTime');

      btn.addEventListener('click', () => {
        singleStartPomodoro.classList.add('display-none');
        btnsBreakAfterTime.classList.add('display-none');
        btnsTimerInProgress.classList.remove('display-none');

        if (this.task.estimation < 5) {
          document.getElementsByClassName('add')[0].classList.remove('display-none');
        }

        this.workIteration();
      });
    });

    finishBtn.addEventListener('click', () => {
      const unfinishedPomodoro = pomodoros.filter(checkbox => !checkbox.checked);

      if (!this.isTaskFinished()) {
        unfinishedPomodoro[0].checked = true;

        this.break();
      } else {    
        unfinishedPomodoro[0].checked = true;
        this.finishTask();
      }

      document.getElementsByClassName('add')[0].classList.add('display-none');
    });

    finishTaskBtn.addEventListener('click', () => {
      const unfinishedPomodoro = pomodoros.filter((checkbox) => {
        return !checkbox.checked && !checkbox.nextSibling.classList.contains('display-none');
      });

      unfinishedPomodoro.forEach((checkbox) => {
        checkbox.checked = true;
      });

      this.finishTask();
    });

    addPomodoroBtn.addEventListener('click', () => {
      console.log(pomodoros);
      pomodoros.filter(checkbox => checkbox.nextSibling.classList.contains('display-none'))[0].nextSibling.classList.remove('display-none');
      this.task.estimation++;

      if (this.task.estimation === 5) {
        document.getElementsByClassName('add')[0].classList.add('display-none');
      }
    });
  }


  startTimer(duration, nextAction) {
    const timeLeft = document.getElementsByClassName('time-left')[0];
    const mask = document.getElementsByClassName('mask')[0];
    const filler = document.getElementsByClassName('filler')[0];
    const spinner = document.getElementsByClassName('spinner')[0];
    const durationTime = `${duration * 60}s`;

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
    }, 1000 * 60);

    if (nextAction === 'break') {
      this.timeout = setTimeout(() => {
        this.checkPomodoro();
        this.break();
      }, duration * 1000 * 60);
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

  break(breakType) {
    const workIterationCount = +sessionStorage.getItem('workIterationCount');
    const settings = JSON.parse(sessionStorage.getItem('settings'));
    const btnsBreakAfterTime = document.getElementById('btnsBreakAfterTime');
    const breakMark = document.getElementsByClassName('break-mark')[0];
    let duration = 0;
    
    breakMark.classList.remove('display-none');

    if (breakType !== 'failed') {
      const btnsTimerInProgress = document.getElementById('btnsTimerInProgress');
  
      btnsTimerInProgress.classList.add('display-none');
      btnsBreakAfterTime.classList.remove('display-none');
    }

    if (workIterationCount % settings.workIteration === 0) {
      duration = settings.longBreak;
    } else {
      duration = settings.shortBreak;
    }
    
    if (this.isTaskFinished()) {
      const startPomodoro = btnsBreakAfterTime.getElementsByClassName('start-pomodoro')[0];
      const singleStartPomodoro = document.getElementById('singleStartPomodoro');

      btnsBreakAfterTime.classList.remove('display-none');
      btnsBreakAfterTime.style.justifyContent = 'center';
      startPomodoro.classList.add('display-none');
      singleStartPomodoro.classList.add('display-none');

      setTimeout(() => {
        this.finishTask();     
      }, duration * 1000 * 60);
    }

    this.startTimer(duration, 'workIteration');
  }

  workIteration() {
    const workIterationCount = +sessionStorage.getItem('workIterationCount');
    const currentWorkIteration = +sessionStorage.getItem('currentWorkIteration');
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    if (currentWorkIteration < this.task.estimation) {
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
      sessionStorage.setItem('currentWorkIteration', currentWorkIteration + 1);
      if (currentWorkIteration < this.task.estimation) {
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
    return unfinishedPomodoro.length === 0;
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
    const btnsBreakAfterTime = document.getElementById('btnsBreakAfterTime');

    timerBlock.classList.remove('in-process');
    timerBlock.classList.add('completed');
    breakMark.classList.add('display-none');
    minutes.classList.add('display-none');
    timeLeft.classList.add('display-none');
    btnsTimerInProgress.classList.add('display-none');
    btnsBreakAfterTime.classList.add('display-none');
    document.getElementsByClassName('go-back')[0].classList.remove('display-none');
    document.getElementsByClassName('go-next')[0].classList.remove('display-none');
    document.getElementsByClassName('completed-task')[0].classList.remove('display-none');
    clearInterval(this.changeTimeLeft);
    clearTimeout(this.timeout);
    sessionStorage.setItem('currentWorkIteration', '0');
    eventBus.dispatch('showHideHeader');
    this.completeAnimation();
    this.showNotification();
    this.saveFinishedTask();
  }

  saveFinishedTask() {
    const attempts = this.getFailedSuccessAttemptsQuantity();
    const taskDescription = {
      taskId: document.getElementsByClassName('timer-section')[0].dataset.id,
      failedAttempQuantity: attempts.failedAttempQuantity,
      successfulAttemptQuantity: attempts.successfulAttemptQuantity
      
    };

    this.changeTaskStateEvent.notify(taskDescription);
  }

  getFailedSuccessAttemptsQuantity() {
    let failedAttempQuantity = 0;
    let successfulAttemptQuantity = 0;
    const allPomodoros = Array.from(document.getElementsByClassName('checkbox'));
    const usedPomodoros = allPomodoros.filter(checkbox => checkbox.checked);

    usedPomodoros.forEach((checkbox) => {
      if (checkbox.classList.contains('failed')) {
        failedAttempQuantity++;
      } else {
        successfulAttemptQuantity++;
      }
    });

    return {
      failedAttempQuantity: failedAttempQuantity,
      successfulAttemptQuantity: successfulAttemptQuantity
    };
  }

  showNotification() {
    const notification = new NotificationMessage();
    const attempts = this.getFailedSuccessAttemptsQuantity();

    if (attempts.failedAttempQuantity === 0) {
      notification.showMessage({type: 'success', message: 'Task successfully completed'});
    } else if (attempts.failedAttempQuantity > attempts.successfulAttemptQuantity) {
      notification.showMessage({type: 'error', message: 'Task failed'});
    } else {
      notification.showMessage({type: 'info', message: 'Task completed'});
    }
  }
}