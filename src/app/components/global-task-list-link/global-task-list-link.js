import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
const globalTaskListLinkTemplate = require('./global-task-list-link.hbs');

export class GlobalTaskListLink {
  constructor(element) {
    this.element = element;
  }

  render() {
    this.element.innerHTML += globalTaskListLinkTemplate();
    this.addListeners();
  }

  addListeners() {
    const link = document.getElementsByClassName('global-list-link')[0];
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const globalTaskList = new GlobalTaskList(this.element);
      globalTaskList.render();
    });
  }
}