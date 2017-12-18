
import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
import { GlobalTaskListView } from '../../pages/global-task-list/global-task-list-view';
import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Tasks } from '../../components/tasks/tasks';
import { Tabs } from '../../components/tabs/tabs';
import { EventBus } from '../../event-bus';
import { Observer } from '../../observer';

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
    this.eventBus.registerEventHandler('renderEditedTask', this.renderEditedTask.bind(this));
    this.eventBus.registerEventHandler('setToDoRenderedState', this.setToDoRenderedState.bind(this));
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
      this.element.innerHTML = taskListTemplate({ heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML(), selectAllTabs: this.selectAllTabs.getTabsHTML()});
      this.globalTaskList.renderGlobalList.call(this.globalTaskList, this.removeMode);
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
    document.getElementsByClassName('links-container')[0].classList.add('right-alignment');
    document.getElementById('selectDailyTasks').classList.add('display-none');
    document.getElementById('selectGlobalList').classList.add('display-none');
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

    document.getElementById('selectDailyTasks').classList.remove('display-none');
    document.getElementsByClassName('links-container')[0].classList.remove('right-alignment');

    document.getElementById('selectGlobalList').classList.remove('display-none');
    
  }

  addListeners() {
    this.dailyTaskListHeading.addListeners();
    this.tabs.addListeners();
    this.selectAllTabs.addListeners();
  }

  hideRemovedTasks(ids) {
    const tasks = Array.from(document.getElementsByClassName('task'));
    const tasksForHiding = tasks.filter(task => ~ids.indexOf(task.dataset.id));
    tasksForHiding.forEach(task => {
      const taskParent = task.closest('ul');
      taskParent.removeChild(task);
    });
    this.eventBus.dispatch('clearCheckedTasksQuantity');
    this.eventBus.dispatch('hideEmptyGroup');
  }

  renderOneTask(id) {
    const taskLi = Array.from(document.getElementsByClassName('task')).filter(li => li.dataset.id === id);
    const newLi = taskLi.cloneNode(true);
    newLi.classList.remove('display-none');
    newLi.getElementsByClassName('icon-arrows-up')[0].classList.add('display-none');
    const date = newLi.getElementsByClassName('date')[0];
    date.classList.remove('date-day');
    date.innerText = 'Today';
    document.getElementsByClassName('task-list')[0].insertAdjacentElement('beforeend', newLi);
    taskLi.closest('ul').removeChild(taskLi);
    this.eventBus.dispatch('addListenerForNewTask', id);
  }

  renderEditedTask(task) {
    const taskLi = Array.from(document.getElementsByClassName('task')).find((li) => li.dataset.id === task.id);
    taskLi.className = `task ${task.category} ${task.priority}`;
    taskLi.getElementsByClassName('estimation')[0].innerText = task.estimation;
    taskLi.getElementsByTagName('h2')[0].innerText = task.heading;
    taskLi.getElementsByTagName('p')[0].innerText = task.taskDescription;
  }

  setToDoRenderedState(state) {
    this.isToDoRendered = state;
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
      ], 'toDoSwitcher'
    );

    this.selectAllTabs = new Tabs(
      [
        {
          name: 'Select All',
          id: 'selectAll',
          handler: (e) => {
            e.preventDefault();
            const taskList = document.getElementsByClassName('task-list')[0];
            const tasks = Array.from(taskList.getElementsByClassName('task'));
            const labels = Array.from(taskList.getElementsByClassName('label-move-to-trash'));
            labels.forEach((label, index) => {
              const currentCheckbox = label.previousElementSibling;
              currentCheckbox.checked = true;
              this.eventBus.dispatch('incrementRemoveTaskQuantity');
              this.eventBus.dispatch('saveCheckedTasks', tasks[index].dataset.id);
            });
          }
        },
        {
          name: 'Deselect All',
          id: 'deselectAll',
          handler: (e) => {
            e.preventDefault();
            const taskList = document.getElementsByClassName('task-list')[0];
            const tasks = Array.from(taskList.getElementsByClassName('task'));
            const labels = Array.from(taskList.getElementsByClassName('label-move-to-trash'));
            labels.forEach((label, index) => {
              const currentCheckbox = label.previousElementSibling;
              currentCheckbox.checked = false;
              this.eventBus.dispatch('decrementRemoveTaskQuantity');
              this.eventBus.dispatch('removeCheckedTask', tasks[index].dataset.id);
            });
          }
        }
      ], 'selectDailyTasks', 'display-none'
    );
  }
}