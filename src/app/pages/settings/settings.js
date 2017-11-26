class Vouter {
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

const workTimeRender = (action) => {
  const workTimeDivs = Array.from(document.getElementsByClassName('work-time-div'));
  
  workTimeDivs.forEach((div) => {
      const flexGrowValue = +window.getComputedStyle(div).flexGrow;
      div.style.flexGrow = (action === 'decrease') ? flexGrowValue - 0.5 : flexGrowValue + 0.5;
    });


};

const longBreakRender = (action) => {
  console.log('longBreakRender');
  const longBreakDiv = document.getElementsByClassName('long-break-div')[0];
  const widthValue = parseInt(window.getComputedStyle(longBreakDiv).width);
  longBreakDiv.style.width = (action === 'decrease') ? `${widthValue - 7}px` : `${widthValue + 7}px`;
};

const workIterationRender = (action) => {

  const workTimeDivs = Array.from(document.getElementsByClassName('work-time-div'));
  const shortBreakDivs = Array.from(document.getElementsByClassName('short-break-div'));
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
};

const shortBreakRender = (action) => {
  const shortBreakDivs = Array.from(document.getElementsByClassName('short-break-div'));

  shortBreakDivs.forEach((div) => {
    const flexGrowValue = +window.getComputedStyle(div).flexGrow;
    div.style.flexGrow = (action === 'decrease') ? flexGrowValue - 0.1 : flexGrowValue + 0.1;
  });
};

const workTimeVouterOptions = {
  minValue: 15,
  maxValue: 25,
  step: 5,
  element: document.getElementById('workTime'),
  render: workTimeRender
};
const workTimeVouter = new Vouter(workTimeVouterOptions);

const longBreakVouterOptions = {
  minValue: 15,
  maxValue: 30,
  step: 5,
  element: document.getElementById('longBreak'),
  render: longBreakRender
};
const longBreakVouter = new Vouter(longBreakVouterOptions);


const workIterationVouterOptions = {
  minValue: 2,
  maxValue: 5,
  step: 1,
  element: document.getElementById('workIteration'),
  render: workIterationRender
};
const workIterationVouter = new Vouter(workIterationVouterOptions);

const shortBreakVouterOptions = {
  minValue: 3,
  maxValue: 5,
  step: 1,
  element: document.getElementById('shortBreak'),
  render: shortBreakRender
};
const shortBreakVouter = new Vouter(shortBreakVouterOptions);
