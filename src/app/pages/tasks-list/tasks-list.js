import { Router } from '../../router';
import { GlobalTaskListLink } from '../../components/global-task-list-link/global-task-list-link';
import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Task } from '../../components/task/task';
import { tasksToDo, tasksDone, tasksRemove } from './data';

const router = new Router();
const taskListTemplate = require('./tasks-list.hbs');

export class TasksList {
  constructor(element) {
    this.element = element;
    this.router = router;
    this.globalTaskListLink = new GlobalTaskListLink(this.element);
    this.dailyTaskListHeading = new DailyTaskListHeading(this.element);
    this.router.add('#task-list', this.render.bind(this));
    this.router.add('#remove-tasks', this.renderRemoveMode.bind(this));
    this.task = new Task();
  }

  render() {
    document.title = 'Task list';
    this.globalTaskListLink.removeMode = false;
    this.globalTaskListLink.isGlobalTaskListOpen = false;
    this.element.innerHTML = taskListTemplate({removeMode:false, heading: this.dailyTaskListHeading.getHTML(), tasks : this.task.getTasksHTML(tasksToDo)});
    this.globalTaskListLink.render();
    this.addListeners();
  }

  renderToDo() {
    const dailyTasksList = document.getElementsByClassName('daily-tasks')[0];
    dailyTasksList.innerHTML = taskListTemplate({removeMode:false, heading: this.dailyTaskListHeading.getHTML(), tasks : this.task.getTasksHTML(tasksToDo)});
    this.addListeners();
  }

  renderDone() {
    const dailyTasksList = document.getElementsByClassName('daily-tasks')[0];
    dailyTasksList.innerHTML = taskListTemplate({removeMode:false, heading: this.dailyTaskListHeading.getHTML(), tasks : this.task.getTasksHTML(tasksDone)});
    this.addListeners();
  }

  renderRemoveMode() {
    this.element.innerHTML = taskListTemplate({removeMode: true, heading: this.dailyTaskListHeading.getHTML(), tasks : this.task.getTasksHTML(tasksRemove)});
    this.globalTaskListLink.isGlobalTaskListOpen = false;
    this.globalTaskListLink.removeMode = true;
    this.globalTaskListLink.render();

    this.addListeners();
  }

  addListeners() {

    const toDo = document.getElementById('toDo');
    const done = document.getElementById('done');

    toDo.addEventListener('click', (event) => {
      event.preventDefault();
      this.renderToDo();
    });

    done.addEventListener('click', (event) => {
      event.preventDefault();
      this.renderDone();
    });
  }
}