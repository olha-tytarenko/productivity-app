import { eventBus } from '../../event-bus';
import headerTemplate from './header.hbs';
require('../../tooltip.js');


const removeClasses = (elements, styleClass) => {
  elements.forEach((element) => {
    element.classList.remove(styleClass);
  });
};


export class Header {
  constructor(element, router) {
    this.element = element;
    this.router = router;

    eventBus.registerEventHandler('incrementRemoveTaskQuantity', this.incrementRemoveTaskQuantity.bind(this));
    eventBus.registerEventHandler('decrementRemoveTaskQuantity', this.decrementRemoveTaskQuantity.bind(this));
    eventBus.registerEventHandler('clearCheckedTasksQuantity', this.clearCheckedTasksQuantity.bind(this));
    eventBus.registerEventHandler('showHideHeader', this.showHideHeader);
    eventBus.registerEventHandler('setSettingsActive', this.setSettingsActive.bind(this));
    eventBus.registerEventHandler('setReportsActive', this.setReportsActive.bind(this));
    eventBus.registerEventHandler('setTasksActive', this.setTasksActive.bind(this));
  }

  render() {
    this.element.innerHTML = headerTemplate();

    $('#goToRemove').tooltip();
    $('#goToTaskList').tooltip();
    $('#goToReports').tooltip();
    $('#goToSettings').tooltip();
    $('.add-new-task-btn-header').tooltip();
    $('.checked-tasks').tooltip();
    this.addListeners();
  }

  addListeners() {
    const removeBtn = document.getElementById('goToRemove');
    const goToTaskListBtn = document.getElementById('goToTaskList');
    const goToReportsBtn = document.getElementById('goToReports');
    const goToSettingsBtn = document.getElementById('goToSettings');
    const addNewTask = document.getElementsByClassName('add-new-task')[0];

    addNewTask.addEventListener('click', () => {
      eventBus.dispatch('renderModalAdd');
    });

    removeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (removeBtn.classList.contains('trash') && removeBtn.classList.contains('active')) {
        eventBus.dispatch('renderModalRemove');
      } else {
        removeClasses([goToTaskListBtn, goToReportsBtn, goToSettingsBtn], 'active');
        removeBtn.classList.add('active');
        eventBus.dispatch('showRemoveTasksMode');
      }
    });

    goToTaskListBtn.addEventListener('click', (event) => {
      event.preventDefault();

      removeClasses([removeBtn, goToReportsBtn, goToSettingsBtn], 'active');
      goToTaskListBtn.classList.add('active');
      this.showTrashButton();
      this.router.navigate('#tasks-list');
    });

    goToReportsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      
      removeClasses([goToTaskListBtn, removeBtn, goToSettingsBtn], 'active');
      goToReportsBtn.classList.add('active');
      eventBus.dispatch('setToDoRenderedState', false);
      eventBus.dispatch('closeGlobalList');
      this.hideTrashButton();
      this.router.navigate('#reports');
    });

    goToSettingsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([goToTaskListBtn, goToReportsBtn, removeBtn], 'active');
      goToSettingsBtn.classList.add('active');
      eventBus.dispatch('setToDoRenderedState', false);
      eventBus.dispatch('closeGlobalList');      
      this.hideTrashButton();
      this.router.navigate('#settings');
    });
  }

  incrementRemoveTaskQuantity() {
    const countSpan = document.getElementsByClassName('checked-tasks')[0];

    if(countSpan.innerText) {
      countSpan.innerText = +countSpan.innerText + 1;
    } else {
      const trashIconElement = document.getElementById('goToRemove');
      trashIconElement.classList.add('trash');
      countSpan.innerText = 1;
      document.getElementById('goToRemove').dataset.tooltip = 'Remove selected tasks';
    }
  }

  decrementRemoveTaskQuantity() {
    const countSpan = document.getElementsByClassName('checked-tasks')[0];

    if(+countSpan.innerText > 1) {
      countSpan.innerText = +countSpan.innerText - 1;
    } else {
      const trashIconElement = document.getElementById('goToRemove');
      trashIconElement.classList.remove('trash');
      countSpan.innerText = '';
      document.getElementById('goToRemove').dataset.tooltip = 'Remove mode';
    }
  }

  clearCheckedTasksQuantity() {
    const tasksId = JSON.parse(sessionStorage.getItem('tasksToRemove'));
    if (tasksId.length) {
      this.decrementRemoveTaskQuantity();
    } else {
      const countSpan = document.getElementsByClassName('checked-tasks')[0];
      const trashIconElement = document.getElementById('goToRemove');
  
      trashIconElement.classList.remove('trash');
      countSpan.innerText = '';
      document.getElementById('goToRemove').dataset.tooltip = 'Remove mode';
    }
  }

  hideTrashButton() {
    document.getElementById('goToRemove').classList.add('display-none');
  }

  setSettingsActive() {
    const removeBtn = document.getElementById('goToRemove');
    const goToTaskListBtn = document.getElementById('goToTaskList');
    const goToReportsBtn = document.getElementById('goToReports');
    const goToSettingsBtn = document.getElementById('goToSettings');

    removeClasses([goToTaskListBtn, goToReportsBtn, removeBtn], 'active');
    goToSettingsBtn.classList.add('active');

    this.hideTrashButton();
  }

  setReportsActive() {
    const removeBtn = document.getElementById('goToRemove');
    const goToTaskListBtn = document.getElementById('goToTaskList');
    const goToReportsBtn = document.getElementById('goToReports');
    const goToSettingsBtn = document.getElementById('goToSettings');

    removeClasses([goToTaskListBtn, goToSettingsBtn, removeBtn], 'active');
    goToReportsBtn.classList.add('active');

    this.hideTrashButton();
  }

  setTasksActive() {
    const removeBtn = document.getElementById('goToRemove');
    const goToTaskListBtn = document.getElementById('goToTaskList');
    const goToReportsBtn = document.getElementById('goToReports');
    const goToSettingsBtn = document.getElementById('goToSettings');

    removeClasses([goToReportsBtn, goToSettingsBtn, removeBtn], 'active');
    goToTaskListBtn.classList.add('active');
    removeBtn.classList.remove('display-none');
  }

  showTrashButton() {
    document.getElementById('goToRemove').classList.remove('display-none');
  }

  showHideHeader() {
    document.getElementsByClassName('header-container')[0].classList.toggle('display-none');
  }
}

window.addEventListener('load', () => {

  const header = document.getElementsByClassName('header')[0];
  const logo = document.getElementsByClassName('logo')[0];
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 20) {
      header.classList.add('fixed-header');
      document.getElementsByClassName('add-new-task')[0].classList.remove('display-none');
      logo.classList.remove('display-none');
    } else {
      header.classList.remove('fixed-header');
      logo.classList.add('display-none');
      document.getElementsByClassName('add-new-task')[0].classList.add('display-none');
    }
  });
});
