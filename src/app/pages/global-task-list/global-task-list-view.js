import { Observer } from '../../observer';
import { Tasks } from '../../components/tasks/tasks';
import { workGroup, educationGroup, hobbyGroup, sportGroup, otherGroup } from './data';
import { EventBus } from '../../event-bus';
const globalTaskListTemplate = require('./global-task-list.hbs');

export class GlobalTaskListView {
  constructor(element) {
    this.element = element;
    this.task = new Tasks();
    this.renderEvent = new Observer(this);
    this.isGlobalListOpened = false;
    this.eventBus = new EventBus();
    this.taskHandlers = {
      checkToRemove: this.checkToRemove,
      edit: this.edit,
      moveToToDo: this.moveToToDo,
      goToTimer: this.goToTimer
    };

    this.eventBus = new EventBus();
    this.eventBus.registerEventHandler('render', this.render.bind(this));
    this.eventBus.registerEventHandler('hideEmptyGroup', this.hideEmptyGroup.bind(this));
    this.eventBus.registerEventHandler('renderNewTask', this.renderNewTask.bind(this));
    this.eventBus.registerEventHandler('addListenerForNewTask', this.addListenerForNewTask.bind(this));
  }

  render(removeMode, data) {
    const globalTask = {
      workGroup: this.task.getTasksHTML({ removeMode: removeMode, tasksList: data.workGroup }),
      educationGroup: this.task.getTasksHTML({ removeMode: removeMode, tasksList: data.educationGroup }),
      hobbyGroup: this.task.getTasksHTML({ removeMode: removeMode, tasksList: data.hobbyGroup }),
      sportGroup: this.task.getTasksHTML({ removeMode: removeMode, tasksList: data.sportGroup }),
      otherGroup: this.task.getTasksHTML({ removeMode: removeMode, tasksList: data.otherGroup })
    };

    this.element.insertAdjacentHTML('beforeEnd', globalTaskListTemplate(globalTask));

    if (!this.isGlobalListOpened) {
      document.getElementsByClassName('global-tasks')[0].classList.add('display-none');
    }

    this.addListeners(removeMode);
  }

  addListeners(removeMode) {
    const globalTaskLink = document.getElementsByClassName('global-list-link')[0];
    const arrowSpan = document.getElementById('arrow');
    globalTaskLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.isGlobalListOpened) {
        arrowSpan.className = 'icon-global-list-arrow-right';
        this.isGlobalListOpened = false;
        document.getElementsByClassName('global-tasks')[0].classList.add('display-none');
        document.getElementById('categoryFilter').classList.add('display-none');
        document.getElementById('selectGlobalList').classList.add('display-none');
      } else {
        this.isGlobalListOpened = true;
        arrowSpan.className = 'icon-global-list-arrow-down';
        document.getElementsByClassName('global-tasks')[0].classList.remove('display-none');
        document.getElementById('categoryFilter').classList.remove('display-none');
        document.getElementById('selectGlobalList').classList.remove('display-none');
      }
    });
    this.addListenersForTasks();

  }

  addListenersForTasks() {
    const tasksLi = Array.from(document.getElementsByClassName('task'));
    tasksLi.forEach((task) => {
      task.addEventListener('click', (e) => {
        e.preventDefault();
        const action = e.target.dataset.action;
        if (action in this.taskHandlers) {
          this.taskHandlers[action].call(this, e.currentTarget.dataset.id, e.target);
        } else {
          return;
        }
      });
    });
  }

  addListenerForNewTask(id) {
    const taskLi = Array.from(document.getElementsByClassName('task')).find((li) => li.dataset.id === id);
    taskLi.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action in this.taskHandlers) {
        this.taskHandlers[action].call(this, e.currentTarget.dataset.id, e.target);
      } else {
        return;
      }
    });
  }

  hideEmptyGroup() {
    const workGroupTasks = Array.from(document.querySelectorAll('.work-group ul li'));
    const hobbyGroupTasks = Array.from(document.querySelectorAll('.hobby-group ul li'));
    const educationGroupTasks = Array.from(document.querySelectorAll('.education-group ul li'));
    const sportGroupTasks = Array.from(document.querySelectorAll('.sport-group ul li'));
    const otherGroupTasks = Array.from(document.querySelectorAll('.other-group ul li'));
    

    if(workGroupTasks.length !== 0 &&
      workGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('work-group')[0].classList.add('display-none');
    }
    if(hobbyGroupTasks.length !== 0 &&
      hobbyGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('hobbt-group')[0].classList.add('display-none');
    }
    if(educationGroupTasks.length !== 0 &&
      educationGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('education-group')[0].classList.add('display-none');
    }
    if(sportGroupTasks.length !== 0 &&
      sportGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('sport-group')[0].classList.add('display-none');
    }
    if(otherGroupTasks.length !== 0 &&
      otherGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('other-group')[0].classList.add('display-none');
    }
  }

  checkToRemove(id, label) {
    const currentCheckbox = label.previousElementSibling;
    currentCheckbox.checked = !currentCheckbox.checked;
    if (currentCheckbox.checked) {
      this.eventBus.dispatch('incrementRemoveTaskQuantity');
      this.eventBus.dispatch('saveCheckedTasks', id);
    } else {
      this.eventBus.dispatch('decrementRemoveTaskQuantity');
      this.eventBus.dispatch('removeCheckedTask', id);
    }
  }

  renderNewTask(task) {
    const taskGroup = document.querySelector(`.${task.category}-group ul`);
    const taskHTML = this.task.getTasksHTML({tasksList: [task]});
    taskGroup.insertAdjacentHTML('afterbegin', taskHTML);
    this.addListenerForNewTask(task.id);
  }

  edit(id) {
    this.eventBus.dispatch('renderModalEdit', id);
  }

  moveToToDo(id) {
    this.eventBus.dispatch('hideRemovedTasks', [id]);
    this.eventBus.dispatch('changeTaskStateToActive', id);
    this.eventBus.dispatch('renderOneTask', id);
  }

  goToTimer() {

  }
}
