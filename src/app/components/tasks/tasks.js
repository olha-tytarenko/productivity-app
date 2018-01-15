import taskTemplate from './tasks.hbs';

export class Tasks {
  constructor() { }

  getTasksHTML(tasks) {
    return taskTemplate(tasks);
  }

  addListeners() {
  }
}