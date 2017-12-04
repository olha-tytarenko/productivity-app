// import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
const dailyTaskListHeading = require('./daily-task-list-heading.hbs');

export class DailyTaskListHeading {
  constructor(element) {
    this.element = element;
  }

  render() {
    this.element.innerHTML += dailyTaskListHeading();
    this.addListeners();
  }

  getHTML() {
    return dailyTaskListHeading();
  }

  addListeners() {
  }
}