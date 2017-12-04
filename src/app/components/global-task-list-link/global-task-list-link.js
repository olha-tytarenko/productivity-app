import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
import { Router } from '../../router';

const globalTaskListLinkTemplate = require('./global-task-list-link.hbs');
const router = new Router();

export class GlobalTaskListLink {
  constructor(element) {
    this.element = element;
    this.isGlobalTaskListOpen = false;
    this.removeMode = false;
  }

  render() {
    this.element.innerHTML += globalTaskListLinkTemplate();
    this.addListeners();
  }

  addListeners() {
    const link = document.getElementsByClassName('global-list-link')[0];
    const arrowSpan = document.getElementById('arrow');
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const globalTaskList = new GlobalTaskList(this.element);
      if (this.isGlobalTaskListOpen) {
        globalTaskList.remove();
        arrowSpan.className = 'icon-global-list-arrow-right';
        this.isGlobalTaskListOpen = false;
      } else {
        globalTaskList.render(this.removeMode);
        this.isGlobalTaskListOpen = true;
        arrowSpan.className = 'icon-global-list-arrow-down';
      }
    });
  }
}