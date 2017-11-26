class Vouter {
  constructor(options) {
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.step = options.step;
    this.element = options.element;

    this.valueElement = this.element.getElementByClassName('value')[0];
    this.decreaseButton = this.element.getElementByClassName('decrease')[0];
    this.increaseButton = this.element.getElementByClassName('increase')[0];

    this.decreaseButton.addEventListener('click', this.decrease);
    this.increaseButton.addEventListener('click', this.increase);
  }

  increase() {
    const newValue = parseInt(this.valueElement.innerText) + this.step;
    if (newValue <= this.maxValue) {
      this.valueElement.innerText = newValue;
    }
  }

  decrease() {
    const newValue = parseInt(this.valueElement.innerText) - this.step;
    if (newValue >= this.minValue) {
      this.valueElement.innerText = newValue;
    }
  }
}
