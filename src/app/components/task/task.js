const taskTemplate = require('./task.hbs');

export class Task {
  constructor() { }

  getTasksHTML(tasks) {
    return taskTemplate(tasks);
  }

  addListeners() {
  }
}