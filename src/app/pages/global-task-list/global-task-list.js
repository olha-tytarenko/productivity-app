const globalTaskListTemplate = require('./global-task-list.hbs');

export class GlobalTaskList {
  constructor(element) {
    this.element = element;
  }

  render() {
    this.element.innerHTML = globalTaskListTemplate();
  }
}