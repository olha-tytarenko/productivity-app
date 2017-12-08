
import { GlobalTaskListLink } from '../../components/global-task-list-link/global-task-list-link';
import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Task } from '../../components/task/task';
import { Tabs } from '../../components/tabs/tabs';
import { tasksToDo, tasksDone, tasksRemove, tasksDoneRemove } from './data';

const taskListTemplate = require('./tasks-list.hbs');

export class TaskListView {
  constructor(element, eventBus) {
    this.taskListHTML = taskListTemplate();
    this.eventBus = eventBus;
    this.eventBus.registerEventHandler('showRemoveTasksMode', this.renderRemoveModeToDo.bind(this));
    console.log(this.eventBus);
    this.element = element;
    this.globalTaskListLink = new GlobalTaskListLink(this.element);
    this.dailyTaskListHeading = new DailyTaskListHeading(this.element);
    this.task = new Task();
    this.tabs = new Tabs(
      [
        {
          name: 'To Do',
          id: 'toDo',
          handler: (e) => {
            e.preventDefault();
            this.renderToDo();
          }
        },
        {
          name: 'Done',
          id: 'done',
          handler: (e) => {
            e.preventDefault();
            this.renderDone();
          }
        }
      ]
    );

    this.tabsRemoveMode = new Tabs(
      [
        {
          name: 'To Do',
          id: 'toDo',
          handler: (e) => {
            e.preventDefault();
            this.renderRemoveModeToDo();
          }
        },
        {
          name: 'Done',
          id: 'done',
          handler: (e) => {
            e.preventDefault();
            this.renderRemoveModeDone();
          }
        }
      ]
    );


  }

  render() {
    document.title = 'Task list';
    this.globalTaskListLink.removeMode = false;
    this.element.innerHTML = taskListTemplate({removeMode:false, heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasksToDo), tabs: this.tabs.getTabsHTML()});
    this.globalTaskListLink.render();
    this.addListeners();
  }

  renderToDo() {
    this.element.innerHTML = taskListTemplate({removeMode:false, heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasksToDo), tabs: this.tabs.getTabsHTML()});
    this.globalTaskListLink.render();
    this.globalTaskListLink.isGlobalTaskListOpen = false;
    this.addListeners(false);
  }

  renderDone() {
    this.element.innerHTML = taskListTemplate({removeMode:false, heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasksDone), tabs: this.tabs.getTabsHTML()});
    this.addListeners(false);
  }

  renderRemoveModeToDo() {
    this.element.innerHTML = taskListTemplate({removeMode: true, heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasksRemove), tabs: this.tabsRemoveMode.getTabsHTML()});
    this.globalTaskListLink.isGlobalTaskListOpen = false;
    this.globalTaskListLink.removeMode = true;
    this.globalTaskListLink.render();

    this.addListeners(true);
  }

  renderRemoveModeDone() {
    this.element.innerHTML = taskListTemplate({removeMode: true, heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasksDoneRemove), tabs: this.tabsRemoveMode.getTabsHTML()});
    this.addListeners(true);
  }

  addListeners(removeMode) {
    this.dailyTaskListHeading.addListeners();

    if (removeMode) {
      this.tabsRemoveMode.addListeners();
    } else {
      this.tabs.addListeners();
    }
  }
}