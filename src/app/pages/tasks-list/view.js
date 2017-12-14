
import { GlobalTaskListLink } from '../../components/global-task-list-link/global-task-list-link';
import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Tasks } from '../../components/tasks/tasks';
import { Tabs } from '../../components/tabs/tabs';
import { tasksToDo, tasksDone, tasksRemove, tasksDoneRemove } from './data';

const taskListTemplate = require('./tasks-list.hbs');

export class TaskListView {
  constructor(element, eventBus) {
    this.taskListHTML = taskListTemplate();
    this.eventBus = eventBus;
    this.eventBus.registerEventHandler('showRemoveTasksMode', this.renderRemoveModeToDo.bind(this));
    this.element = element;
    this.globalTaskListLink = new GlobalTaskListLink(this.element);
    this.dailyTaskListHeading = new DailyTaskListHeading(this.element);
    this.task = new Tasks();
    this.addTabs();
  }

  render() {
    document.title = 'Tasks list';
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
    this.globalTaskListLink.removeMode = true;
    this.globalTaskListLink.render();

    this.addListenersRemoveMode(true);
  }

  renderRemoveModeDone() {
    this.element.innerHTML = taskListTemplate({removeMode: true, heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasksDoneRemove), tabs: this.tabsRemoveMode.getTabsHTML()});
    this.addListenersRemoveMode(true);
  }

  addListeners(removeMode) {
    this.dailyTaskListHeading.addListeners();
    this.tabs.addListeners();
  }

  addListenersRemoveMode() {
    this.dailyTaskListHeading.addListeners();
    this.tabsRemoveMode.addListeners();

    const labelsMoveToTrash = Array.from(document.getElementsByClassName('label-move-to-trash'));

    labelsMoveToTrash.forEach((label) => {
      label.addEventListener('click', (event) => {
        const currentCheckbox = event.target.previousElementSibling;
        currentCheckbox.checked = !currentCheckbox.checked;
        if (currentCheckbox.checked) {
          this.eventBus.dispatch('incrementRemoveTaskQuantity');
        } else {
          this.eventBus.dispatch('decrementRemoveTaskQuantity');
        }
      });
    });
  }

  addTabs() {
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
}