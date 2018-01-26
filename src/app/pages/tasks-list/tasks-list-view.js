import {GlobalTaskList} from '../../pages/global-task-list/global-task-list';
import {GlobalTaskListView} from '../../pages/global-task-list/global-task-list-view';
import {DailyTaskListHeading} from '../../components/daily-task-list-heading/daily-task-list-heading';
import {Tasks} from '../../components/tasks/tasks';
import {Tabs} from '../../components/tabs/tabs';
import {eventBus} from '../../event-bus';
import {Observer} from '../../observer';
import {notification} from '../../components/notification-message/notification-message';
import taskListTemplate from './tasks-list.hbs';
import dragFirstTaskTemplate from './drag-first-task.hbs';
import addFirstTaskTemplate from './add-first-task.hbs';
import excellentMessageTemplate from './excellent-message.hbs';
import { getShortMonthName } from '../../helpers/date-formatting';

require('../../tooltip.js');

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
    if (!this.isToDoRendered) {
      this.addTabs(tasks.removeMode);

      if (tasks.tasksList.length) {
        this.element.innerHTML = taskListTemplate({
          heading: this.dailyTaskListHeading.getHTML(),
          tasks: this.task.getTasksHTML(tasks),
          tabs: this.tabs.getTabsHTML(),
          selectAllTabs: this.selectAllTabs.getTabsHTML()
        });
      } else {
        this.element.innerHTML = dragFirstTaskTemplate({
          heading: this.dailyTaskListHeading.getHTML(),
          tabs: this.tabs.getTabsHTML(),
          selectAllTabs: this.selectAllTabs.getTabsHTML()
        });
      }

      this.initializeToDoList(tasks.removeMode);
    }

    if (tasks.removeMode) {
      this.showRemoveMode();
    } else {
      this.hideRemoveMode();
    }
  }

  renderExcellentMessage(removeMode) {
    this.addTabs(removeMode);
    this.element.innerHTML = excellentMessageTemplate({
      heading: this.dailyTaskListHeading.getHTML(),
      tabs: this.tabs.getTabsHTML(),
      selectAllTabs: this.selectAllTabs.getTabsHTML()
    });

    this.initializeToDoList(removeMode);
  }

  initializeToDoList(removeMode) {
    this.isToDoRendered = true;
    this.removeMode = removeMode;
    this.globalTaskList.renderGlobalList.call(this.globalTaskList, this.removeMode);
    document.getElementById('toDo').classList.add('active');
    document.getElementById('done').classList.remove('active');
    $('#addNewTask').tooltip();
    this.addListeners();
  }

  renderDone(tasks) {
    this.addTabs(tasks.removeMode);

    this.element.innerHTML = taskListTemplate({
      heading: this.dailyTaskListHeading.getHTML(),
      tasks: this.task.getTasksHTML(tasks),
      tabs: this.tabs.getTabsHTML(),
      selectAllTabs: this.selectAllTabs.getTabsHTML()
    });
    if (tasks.removeMode) {
      this.showRemoveMode();
    } else {
      this.hideRemoveMode();
    }

    document.getElementById('toDo').classList.remove('active');
    document.getElementById('done').classList.add('active');
    this.tabs.addListeners();
    this.selectAllTabs.addListeners();
    this.addListenersToDoneList();
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
    if (document.getElementById('selectGlobalList')) {
      document.getElementById('selectGlobalList').classList.add('display-none');
    }
    this.removeMode = false;
  }

  showRemoveMode() {
    this.removeMode = true;

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

    document.getElementById('selectDailyTasks').classList.remove('display-none');
    document.getElementsByClassName('links-container')[0].classList.remove('right-alignment');

    if (document.getElementsByClassName('global-tasks').length && !document.getElementsByClassName('global-tasks')[0].classList.contains('display-none')) {
      document.getElementById('selectGlobalList').classList.remove('display-none');
    }

    if (document.getElementsByClassName('done').length) {
      this.addListenersToTrashButtonsDoneList();
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
    notification.showMessage({type: 'success', message: 'Task(s) was successfully removed'});
  }

  renderAddFirstTask() {
    this.element.innerHTML = this.dailyTaskListHeading.getHTML();
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
    date.classList.remove('overdue');
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
      const date = taskLi.getElementsByClassName('date-day')[0];
      date.innerHTML = `${task.deadline.day}<span class="date-month">${getShortMonthName(task.deadline.month)}</span>`;
      date.classList.remove('overdue');
    }
  }

  setToDoRenderedState(state) {
    this.isToDoRendered = state;
  }

  changeRenderedState(state) {
    this.isToDoRendered = state;
  }

  addListenersToDoneList() {
    const goToTimerLinks = Array.from(document.getElementsByClassName('icon-tomato'));

    goToTimerLinks.forEach((link) => {
      link.addEventListener('click', event => event.preventDefault());
    });
  }

  addListenersToTrashButtonsDoneList() {
    const labelsMoveToTrash = Array.from(document.getElementsByClassName('label-move-to-trash'));

    labelsMoveToTrash.forEach((label) => {
      label.addEventListener('click', () => {
        const id = label.closest('li').dataset.id;
        const currentCheckbox = label.previousElementSibling;

        currentCheckbox.checked = !currentCheckbox.checked;
        if (currentCheckbox.checked) {
          eventBus.dispatch('incrementRemoveTaskQuantity');
          eventBus.dispatch('saveCheckedTasks', id);
        } else {
          eventBus.dispatch('decrementRemoveTaskQuantity');
          eventBus.dispatch('removeCheckedTask', id);
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