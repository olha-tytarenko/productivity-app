
import { GlobalTaskList } from '../../pages/global-task-list/global-task-list';
import { GlobalTaskListView } from '../../pages/global-task-list/global-task-list-view';
import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Tasks } from '../../components/tasks/tasks';
import { Tabs } from '../../components/tabs/tabs';
import { eventBus } from '../../event-bus';
import { Observer } from '../../observer';
import { notification } from '../../components/notification-message/notification-message';

require('../../tooltip.js');

const taskListTemplate = require('./tasks-list.hbs');
const dragFirstTaskTemplate = require('./drag-first-task.hbs');
const addFirstTaskTemplate = require('./add-first-task.hbs');

export class TasksListView {
  constructor(element, model) {
    this.taskListHTML = taskListTemplate();

    this.element = element;
    this.dailyTaskListHeading = new DailyTaskListHeading(this.element);
    this.globalTaskList = new GlobalTaskList(new GlobalTaskListView(element), model);
    this.task = new Tasks();
    this.isToDoRendered = false;
    this.removeMode = false;


    this.renderDoneEvent = new Observer(this);
    this.renderToDoEvent = new Observer(this);
    eventBus.registerEventHandler('showRemoveTasksMode', this.showRemoveMode.bind(this));
    eventBus.registerEventHandler('hideRemovedTasks', this.hideRemovedTasks.bind(this));
    eventBus.registerEventHandler('renderOneTask', this.renderOneTask.bind(this));
    eventBus.registerEventHandler('renderEditedTask', this.renderEditedTask.bind(this));
    eventBus.registerEventHandler('setToDoRenderedState', this.setToDoRenderedState.bind(this));
    eventBus.registerEventHandler('changeRenderedState', this.changeRenderedState.bind(this));
  }

  renderToDo(tasks) {
    if (this.isToDoRendered) {
      if (tasks.removeMode) {
        this.showRemoveMode();
      } else {
        this.hideRemoveMode();
        // eventBus.dispatch('clearCheckedTasksQuantity');
      }
    } else {
      this.addTabs(tasks.removeMode);

      if (tasks.tasksList.length) { 
        this.element.innerHTML = taskListTemplate({ heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML(), selectAllTabs: this.selectAllTabs.getTabsHTML()});
      } else {
        this.element.innerHTML = dragFirstTaskTemplate({ heading: this.dailyTaskListHeading.getHTML(), tabs: this.tabs.getTabsHTML(), selectAllTabs: this.selectAllTabs.getTabsHTML()});
      }

      this.isToDoRendered = true;
      this.globalTaskList.renderGlobalList.call(this.globalTaskList, this.removeMode);
      document.getElementById('toDo').classList.add('active');
      document.getElementById('done').classList.remove('active'); 
      $('#addNewTask').tooltip();
      this.addListeners();
    }
  }

  renderDone(tasks) {
    this.addTabs(tasks.removeMode);

    this.element.innerHTML = taskListTemplate({ heading: this.dailyTaskListHeading.getHTML(), tasks: this.task.getTasksHTML(tasks), tabs: this.tabs.getTabsHTML() });
    document.getElementById('toDo').classList.remove('active');
    document.getElementById('done').classList.add('active');
    this.tabs.addListeners();
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
    const selectedTasksToRemove = JSON.parse(sessionStorage.getItem('tasksToRemove'));

    checkboxes.forEach((checkbox) => {
      checkbox.classList.add('checkbox-move-to-trash');
      checkbox.classList.remove('checkbox-none');
    });

    if (selectedTasksToRemove.length) {
      const tasks = Array.from(document.getElementsByClassName('task'));
      const tasksToRemove = tasks.filter((task) => {
        return ~selectedTasksToRemove.indexOf(task.dataset.id);
      });

      tasksToRemove.forEach((task) => {
        task.getElementsByClassName('checkbox-move-to-trash')[0].checked = true;
      });
    }

    trashLabels.forEach(label => label.classList.remove('display-none'));
    dateLabels.forEach(label => label.classList.add('display-none'));
    this.removeMode = true;

    document.getElementById('selectDailyTasks').classList.remove('display-none');
    document.getElementsByClassName('links-container')[0].classList.remove('right-alignment');

    if (!document.getElementsByClassName('global-tasks')[0].classList.contains('display-none')) {
      document.getElementById('selectGlobalList').classList.remove('display-none');
    }

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
    eventBus.dispatch('clearCheckedTasksQuantity');
    eventBus.dispatch('hideEmptyGroup');
    notification.showMessage({type:'success', message:'Task(s) was successfully removed'});
  }

  renderAddFirstTask() {
    this.element.innerHTML =  this.dailyTaskListHeading.getHTML();
    this.element.innerHTML += addFirstTaskTemplate();
    this.dailyTaskListHeading.addListeners();
  }

  renderOneTask(id) {
    const taskLi = Array.from(document.getElementsByClassName('task')).filter(li => li.dataset.id === id)[0];
    const newLi = taskLi.cloneNode(true);
    newLi.classList.remove('display-none');
    newLi.getElementsByClassName('icon-arrows-up')[0].classList.add('display-none');
    const date = newLi.getElementsByClassName('date')[0];
    date.classList.remove('date-day');
    date.innerText = 'Today';
    const taskList = document.getElementsByClassName('task-list')[0];
    const message = document.getElementsByClassName('message')[0];
    if (message) {
      message.classList.add('display-none');
    }
    taskList.insertAdjacentElement('beforeend', newLi);
    taskLi.closest('ul').removeChild(taskLi);
    $('.edit-task').tooltip();
    $('.icon-tomato').tooltip();
    eventBus.dispatch('addListenerForNewTask', id);
  }

  renderEditedTask(task) {
    const taskLi = Array.from(document.getElementsByClassName('task')).find((li) => li.dataset.id === task.id);
    if (task.category !== task.oldCategory && !task.isActive) {
      taskLi.closest('ul').removeChild(taskLi);
      eventBus.dispatch('renderNewTask', task);
    } else {
      taskLi.className = `task ${task.category} ${task.priority}`;
      taskLi.getElementsByClassName('estimation')[0].innerText = task.estimation;
      taskLi.getElementsByTagName('h2')[0].innerText = task.heading;
      taskLi.getElementsByTagName('p')[0].innerText = task.taskDescription;
    }
  }

  setToDoRenderedState(state) {
    this.isToDoRendered = state;
  }

  changeRenderedState(state) {
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
            document.getElementById('toDo').classList.add('active');
            document.getElementById('done').classList.remove('active');
          }
        },
        {
          name: 'Done',
          id: 'done',
          handler: (e) => {
            e.preventDefault();
            this.isToDoRendered = false;
            this.renderDoneEvent.notify(this.removeMode);
           
            eventBus.dispatch('closeGlobalList');  
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
            const checkboxes = labels.map(label => label.previousElementSibling);
            if (!checkboxes.every(checkbox => checkbox.checked)) {
              checkboxes.forEach((checkbox, index) => {
                if (!checkbox.checked) {
                  checkbox.checked = true;
                  eventBus.dispatch('incrementRemoveTaskQuantity');
                  eventBus.dispatch('saveCheckedTasks', tasks[index].dataset.id);
                }
              });
            }
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
              eventBus.dispatch('decrementRemoveTaskQuantity');
              eventBus.dispatch('removeCheckedTask', tasks[index].dataset.id);
            });
          }
        }
      ], 'selectDailyTasks', 'display-none'
    );
  }
}