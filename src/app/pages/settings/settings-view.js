import { Tabs } from '../../components/tabs/tabs';

const pomodorosSettingsTemplate = require('./pomodoros-settings.hbs');
const settingsCategoriesTemplate = require('./settings-categories.hbs');

export class SettingsView {
  constructor(element, router) {
    this.element = element;
    this.router = router;
    this.tabs = new Tabs(
      [
        {
          name: 'Settings',
          id: 'pomodorosTab',
          handler: (e) => {
            e.preventDefault();
            this.renderSettings();
          }
        },
        {
          name: 'Categories',
          id: 'categoriesTab',
          handler: (e) => {
            e.preventDefault();
            this.renderCategories();
          }
        }
      ]
    );
  }


  renderSettings() {
    document.title = 'Settings';
    this.element.innerHTML = pomodorosSettingsTemplate({tabs: this.tabs.getTabsHTML()});
    renderGraph();
    this.addListeners();
  }

  renderCategories() {
    this.element.innerHTML = settingsCategoriesTemplate({tabs: this.tabs.getTabsHTML()});
    this.addListeners();
  }

  addListeners() {
    this.tabs.addListeners();

    const goToTask = document.getElementsByClassName('go-to-task')[0];
    goToTask.addEventListener('click', (event) => {
      event.preventDefault();
      this.router.navigate('#tasks-list');
    });
  }
}



class Voter {
  constructor(options) {
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.step = options.step;
    this.element = options.element;
    this.render = options.render;

    this.valueElement = this.element.getElementsByClassName('value')[0];
    this.decreaseButton = this.element.getElementsByClassName('decrease')[0];
    this.increaseButton = this.element.getElementsByClassName('increase')[0];

    this.decreaseButton.addEventListener('click', this.decrease.bind(this));
    this.increaseButton.addEventListener('click', this.increase.bind(this));
  }

  increase() {
    const newValue = parseInt(this.valueElement.innerText) + this.step;
    if (newValue <= this.maxValue) {
      this.valueElement.innerText = newValue;
      this.render('increase');
    }
  }

  decrease() {
    const newValue = parseInt(this.valueElement.innerText) - this.step;
    if (newValue >= this.minValue) {
      this.valueElement.innerText = newValue;
      this.render('decrease');
    }
  }
}

// VARIABLES

function renderGraph() {

  const workTime = document.getElementById('workTimeValue');
  const workIteration = document.getElementById('workIterationValue');
  const shortBreak = document.getElementById('shortBreakValue');
  const longBreak = document.getElementById('longBreakValue');

  const workTimeDivs = Array.from(document.getElementsByClassName('work-time-div'));
  const longBreakDiv = document.getElementsByClassName('long-break-div')[0];
  const shortBreakDivs = Array.from(document.getElementsByClassName('short-break-div'));

  // FUNCTIONS

  const getPercentage = () => {
    const totalTime = (+workTime.innerText * +workIteration.innerText + +shortBreak.innerText * (+workIteration.innerText - 1)) * 2 + +longBreak.innerText;

    return (100 / totalTime);
  };

  const renderScale = () => {
    const scaleItems = Array.from(document.getElementsByClassName('scale-item'));
    const totalTime = +workTime.innerText * +workIteration.innerText + +shortBreak.innerText * (+workIteration.innerText - 1);

    const endCycleTime = document.getElementsByClassName('end-cycle')[0];
    const hours = `${Math.floor((totalTime * 2 + +longBreak.innerText) / 60)}h`;
    const minutes = ` ${(totalTime * 2 + +longBreak.innerText) % 60}m`;
    endCycleTime.innerText = hours + minutes;

    scaleItems.forEach((item, index) => {
      if ((index + 1) * 30 < (totalTime * 2 + +longBreak.innerText)) {
        item.style.left = `calc(${((index + 1) * 30) * getPercentage()}% - ${parseInt(window.getComputedStyle(item).width) - 5}px)`;
      } else {
        item.classList.add('display-none');
      }
    });
  };

  const firstCycle = () => {
    const firstCycleElem = document.getElementsByClassName('first-cycle')[0];
    const firstCycleMin = (+workTime.innerText * +workIteration.innerText + +shortBreak.innerText * (+workIteration.innerText - 1)) * 2 + +longBreak.innerText;
    firstCycleElem.innerText = `First cycle: ${Math.floor(firstCycleMin / 60)}h ${firstCycleMin % 60}m`;
  };

  const workTimeRender = (action) => {
    workTimeDivs.forEach((div) => {
      div.style.width = `${+workTime.innerText * getPercentage()}%`;
    });
  };


  const longBreakRender = (action) => {
    longBreakDiv.style.width = `${+longBreak.innerText * getPercentage()}%`;
  };

  const shortBreakRender = (action) => {
    shortBreakDivs.forEach((div) => {
      div.style.width = `${+shortBreak.innerText * getPercentage()}%`;
    });
  };

  const renderAll = (action) => {
    workTimeRender(action);
    shortBreakRender(action);
    longBreakRender(action);
    firstCycle();
    renderScale();
  };

  const workIterationRender = (action) => {
    let workTimeDivsFiltered = [];
    let shortBreakDivsFiltered = [];

    if (action === 'decrease') {
      workTimeDivsFiltered = workTimeDivs.filter((div) => {
        return !div.classList.contains('display-none');
      });

      shortBreakDivsFiltered = shortBreakDivs.filter((div) => {
        return !div.classList.contains('display-none');
      });

    } else {
      workTimeDivsFiltered = workTimeDivs.filter((div) => {
        return div.classList.contains('display-none');
      });

      shortBreakDivsFiltered = shortBreakDivs.filter((div) => {
        return div.classList.contains('display-none');
      });
    }

    workTimeDivsFiltered[0].classList.toggle('display-none');
    workTimeDivsFiltered[workTimeDivsFiltered.length - 1].classList.toggle('display-none');
    shortBreakDivsFiltered[0].classList.toggle('display-none');
    shortBreakDivsFiltered[shortBreakDivsFiltered.length - 1].classList.toggle('display-none');


    renderAll(action);
    renderScale();
  };

  // VOTER OBJECTS

  const workTimeVoterOptions = {
    minValue: 15,
    maxValue: 25,
    step: 5,
    element: document.getElementById('workTime'),
    render: renderAll
  };
  const workTimeVoter = new Voter(workTimeVoterOptions);

  const longBreakVoterOptions = {
    minValue: 15,
    maxValue: 30,
    step: 5,
    element: document.getElementById('longBreak'),
    render: renderAll
  };
  const longBreakVoter = new Voter(longBreakVoterOptions);


  const workIterationVoterOptions = {
    minValue: 2,
    maxValue: 5,
    step: 1,
    element: document.getElementById('workIteration'),
    render: workIterationRender
  };
  const workIterationVoter = new Voter(workIterationVoterOptions);

  const shortBreakVoterOptions = {
    minValue: 3,
    maxValue: 5,
    step: 1,
    element: document.getElementById('shortBreak'),
    render: renderAll
  };
  const shortBreakVoter = new Voter(shortBreakVoterOptions);

  renderScale();
}