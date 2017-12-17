
import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
import { GlobalTaskListView } from '../../pages/global-task-list/global-task-list-view';

import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Tasks } from '../../components/tasks/tasks';
import { Tabs } from '../../components/tabs/tabs';
import { EventBus } from '../../event-bus';
import { Observer } from '../../observer';
import { tasksToDo, tasksDone, tasksRemove, tasksDoneRemove } from './data';

const taskListTemplate = require('./tasks-list.hbs');

export class TasksListView {
  constructor(element, model) {
    this.taskListHTML = taskListTemplate();
    this.eventBus = new EventBus();

    this.element = element;
    this.dailyTaskListHeading = new DailyTaskListHeading(this.element);
    this.globalTaskList = new GlobalTaskList(new GlobalTaskListView(element), model);
    this.task = new Tasks();
    this.isToDoRendered = false;
    this.removeMode = false;


    this.renderDoneEvent = new Observer(this);
    this.renderToDoEvent = new Observer(this);
    this.eventBus.registerEventHandler('showRemoveTasksMode', this.showRemoveMode.bind(this));
    this.eventBus.registerEventHandler('hideRemovedTasks', this.hideRemovedTasks.bind(this));
    this.eventBus.registerEventHandler('renderOneTask', this.renderOneTask.bind(this));
  }

  renderToDo(tasks) {
    if (this.isToDoRendered) {
      if (tasks.removeMode) {
        this.showRemoveMode();
      } else {
        this.hideRemoveMode();
      }
    } else {
      this.addTabs(tasks.removeMode);
      this.element.innerHTML = taskListTemplate({ heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML() });
      this.globalTaskList.renderGlobalList.call(this.globalTaskList, tasks.removeMode);
      this.addListeners();
      this.isToDoRendered = true;
    }
  }

  renderDone(tasks) {
    this.addTabs(tasks.removeMode);
    this.element.innerHTML = taskListTemplate({ heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML() });
    this.addListeners();
  }

  hideRemoveMode() {
    const checkboxes = Array.from(document.getElementsByClassName('checkbox-move-to-trash'));
    const trashLabels = Array.from(document.getElementsByClassName('label-move-to-trash'));
    const dateLabels = Array.from(document.getElementsByClassName('date'));
    checkboxes.forEach((checkbox) => {
      checkbox.classList.remove('checkbox-move-to-trash');
      checkbox.classList.add('checkbox-none');
    });

    dateLabels.forEach(label => label.classList.remove('display-none'));
    trashLabels.forEach(label => label.classList.add('display-none'));
    this.removeMode = false;
  }

  showRemoveMode() {
    const checkboxes = Array.from(document.getElementsByClassName('checkbox-none'));
    const trashLabels = Array.from(document.getElementsByClassName('label-move-to-trash'));
    const dateLabels = Array.from(document.getElementsByClassName('date'));
    checkboxes.forEach((checkbox) => {
      checkbox.classList.add('checkbox-move-to-trash');
      checkbox.classList.remove('checkbox-none');
    });

    trashLabels.forEach(label => label.classList.remove('display-none'));
    dateLabels.forEach(label => label.classList.add('display-none'));
    this.removeMode = true;
  }

  addListeners() {
    this.dailyTaskListHeading.addListeners();
    this.tabs.addListeners();
  }

  hideRemovedTasks(ids) {
    const tasks = Array.from(document.getElementsByClassName('task'));
    const tasksForHiding = tasks.filter(task => ~ids.indexOf(task.dataset.id));
    tasksForHiding.forEach(task => task.classList.add('display-none'));
    this.eventBus.dispatch('clearCheckedTasksQuantity');
    this.eventBus.dispatch('hideEmptyGroup');
  }

  renderOneTask(task) {
    const tasks = new Tasks();
    const tasksHTML = tasks.getTasksHTML({tasksList: [task]});
    console.log(tasksHTML);
    document.getElementsByClassName('task-list')[0].insertAdjacentHTML('beforeend', tasksHTML);
  }


  addTabs() {
    this.tabs = new Tabs(
      [
        {
          name: 'To Do',
          id: 'toDo',
          handler: (e) => {
            e.preventDefault();
            this.renderToDoEvent.notify(this.removeMode);
          }
        },
        {
          name: 'Done',
          id: 'done',
          handler: (e) => {
            e.preventDefault();
            this.isToDoRendered = false;
            this.renderDoneEvent.notify(this.removeMode);
          }
        }
      ]
    );
  }
}