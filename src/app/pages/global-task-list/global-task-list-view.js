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
        document.getElementById('priorityFilter').classList.add('display-none');
        document.getElementById('selectGlobalList').classList.add('display-none');
      } else {
        this.isGlobalListOpened = true;
        arrowSpan.className = 'icon-global-list-arrow-down';
        document.getElementsByClassName('global-tasks')[0].classList.remove('display-none');
        document.getElementById('priorityFilter').classList.remove('display-none');
        if (removeMode) {
          document.getElementById('selectGlobalList').classList.remove('display-none');
        }
      }
    });

    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');

    selectAllBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.selectDeselectCheckboxes(true);
    });

    deselectAllBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.selectDeselectCheckboxes(false);
    });

    this.addListenersForTasks();
    this.addListenersForFilter();

  }

  selectDeselectCheckboxes(state) {
    const allTasks = this.getAllTasks();
    
    allTasks.forEach((task) => {
      task.querySelector('.checkbox-move-to-trash').checked = state;
      if (state) {
        this.eventBus.dispatch('incrementRemoveTaskQuantity');
        this.eventBus.dispatch('saveCheckedTasks', task.dataset.id);
      } else {
        this.eventBus.dispatch('decrementRemoveTaskQuantity');
        this.eventBus.dispatch('removeCheckedTask', task.dataset.id);
      }
    });     
  }

  addListenersForFilter() {
    const allTasks = this.getAllTasks();

    const filter = document.getElementById('priorityFilter');

    filter.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.id === 'allFilter') {
        allTasks.forEach(task => task.classList.remove('display-none'));
        event.target.classList.add('active');
        this.showGroup();
        this.hideEmptyGroup();
      } else if (event.target.tagName === 'A') {
        allTasks.forEach(task => task.classList.remove('display-none'));
        allTasks.filter(task => !task.classList.contains(event.target.dataset.priority)).forEach(task => task.classList.add('display-none'));
        Array.from(filter.getElementsByTagName('a')).forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');
        this.showGroup();
        this.hideEmptyGroup();
      } else {
        return;
      }
    });
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

  showGroup() {
    document.getElementsByClassName('work-group')[0].classList.remove('display-none');
    document.getElementsByClassName('education-group')[0].classList.remove('display-none');
    document.getElementsByClassName('sport-group')[0].classList.remove('display-none');
    document.getElementsByClassName('hobby-group')[0].classList.remove('display-none');
    document.getElementsByClassName('other-group')[0].classList.remove('display-none');
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

    if(workGroupTasks.length === 0 ||
      workGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('work-group')[0].classList.add('display-none');
    }
    if(hobbyGroupTasks.length === 0 ||
      hobbyGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('hobby-group')[0].classList.add('display-none');
    }
    if(educationGroupTasks.length === 0 ||
      educationGroupTasks.every( task => task.classList.contains('display-none'))) {
      document.getElementsByClassName('education-group')[0].classList.add('display-none');
    }
    if(sportGroupTasks.length === 0 ||
      sportGroupTasks.every( task => task.classList.contains('display-none'))) {
        
      document.getElementsByClassName('sport-group')[0].classList.add('display-none');
    }
    if(otherGroupTasks.length === 0 ||
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

    this.showGroup();
    this.hideEmptyGroup();
  }

  edit(id) {
    this.eventBus.dispatch('renderModalEdit', id);
  }

  moveToToDo(id) {
    this.eventBus.dispatch('renderOneTask', id);
    this.eventBus.dispatch('changeTaskStateToActive', id);
    this.eventBus.dispatch('hideRemovedTasks', [id]);
  }

  goToTimer() {

  }

  getAllTasks() {
    const workGroup = Array.from(document.querySelectorAll('.work-group .task-list .task')).filter((task) => !task.classList.contains('display-none'));
    const educationGroup = Array.from(document.querySelectorAll('.education-group .task-list .task')).filter((task) => !task.classList.contains('display-none'));
    const hobbyGroup = Array.from(document.querySelectorAll('.hobby-group .task-list .task')).filter((task) => !task.classList.contains('display-none'));
    const otherGroup = Array.from(document.querySelectorAll('.other-group .task-list .task')).filter((task) => !task.classList.contains('display-none'));
    const sportGroup = Array.from(document.querySelectorAll('.sport-group .task-list .task')).filter((task) => !task.classList.contains('display-none'));   
    return workGroup.concat(educationGroup, hobbyGroup, otherGroup, sportGroup);
  }
}
