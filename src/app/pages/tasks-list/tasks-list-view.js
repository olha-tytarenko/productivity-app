
import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
import { GlobalTaskListView } from '../../pages/global-task-list/global-task-list-view';

import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Tasks } from '../../components/tasks/tasks';
import { Tabs } from '../../components/tabs/tabs';
import  { EventBus } from '../../event-bus';
import  { Observer } from '../../observer';
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


    this.renderDoneEvent = new Observer(this);
    this.renderToDoEvent = new Observer(this);
    this.eventBus.registerEventHandler('showRemoveTasksMode', this.renderToDoEvent.notify.bind(this.renderToDoEvent, true));
  }

  renderToDo(tasks) {
    console.log(this.globalTaskList);
    this.addTabs(tasks.removeMode);
    this.element.innerHTML = taskListTemplate({heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML()});
    this.globalTaskList.renderGlobalList(tasks.removeMode);
    this.addListeners(tasks.removeMode);
  }

  renderDone(tasks) {
    this.addTabs(tasks.removeMode);
    this.element.innerHTML = taskListTemplate({heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML()});
    this.addListeners(tasks.removeMode);
  }

  addListeners(removeMode) {
    this.dailyTaskListHeading.addListeners();
    this.tabs.addListeners(removeMode);

    if(removeMode) {
      const labelsMoveToTrash = Array.from(document.getElementsByClassName('label-move-to-trash'));
      console.log(labelsMoveToTrash);
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
  }

  addTabs(removeMode) {
    this.tabs = new Tabs(
      [
        {
          name: 'To Do',
          id: 'toDo',
          handler: (e) => {
            e.preventDefault();
            this.renderToDoEvent.notify(removeMode);
          }
        },
        {
          name: 'Done',
          id: 'done',
          handler: (e) => {
            e.preventDefault();
            this.renderDoneEvent.notify(removeMode);
          }
        }
      ]
    );
  }
}