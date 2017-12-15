import { EventBus } from '../../event-bus';

const globalTaskListLinkTemplate = require('./global-task-list-link.hbs');

export class GlobalTaskListLink {
  constructor(element) {
    this.element = element;
    this.isGlobalTaskListOpen = false;
    this.removeMode = false;
    this.eventBus = new EventBus();
  }

  render() {
    console.log('render link');
    this.element.innerHTML += globalTaskListLinkTemplate();
    this.addListeners();
  }

  addListeners() {
    const link = document.getElementsByClassName('global-list-link')[0];
    const arrowSpan = document.getElementById('arrow');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.isGlobalTaskListOpen) {
        console.log(this.eventBus);
        this.eventBus.dispatch('hideGlobalTaskList');
        arrowSpan.className = 'icon-global-list-arrow-right';
        this.isGlobalTaskListOpen = false;
      } else {
        this.eventBus.dispatch('showGlobalTaskList', this.removeMode);
        this.isGlobalTaskListOpen = true;
        arrowSpan.className = 'icon-global-list-arrow-down';
      }
    });
  }
}