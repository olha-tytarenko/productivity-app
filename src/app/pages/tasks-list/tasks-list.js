import { TaskListView } from './view';

const taskListTemplate = require('./tasks-list.hbs');

export class TasksList {
  constructor(element, router, eventBus) {
    this.element = element;
    this.taskListView = new TaskListView(element, eventBus);
    this.router = router;

    this.router.add('#tasks-list', this.taskListView.render.bind(this.taskListView));
  }
}