import { Router } from '../../router';

const headerTemplate = require('./header.hbs');
const router = new Router();

const removeClasses = (elements, styleClass) => {
  elements.forEach((element) => {
    element.classList.remove(styleClass);
  });
};


export class Header {
  constructor(element) {
    this.element = element;
  }

  render() {
    this.element.innerHTML = headerTemplate();
    this.addListeners();
  }

  addListeners() {
    const removeBtn = document.getElementById('goToRemove');
    console.log(router);
    const goToTaskListBtn = document.getElementById('goToTaskList');
    const goToReportsBtn = document.getElementById('goToReports');
    const goToSettingsBtn = document.getElementById('goToSettings');


    removeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([goToTaskListBtn, goToReportsBtn, goToSettingsBtn], 'active');
      removeBtn.classList.add('active');
      router.navigate('#remove-tasks');
    });
    goToTaskListBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([removeBtn, goToReportsBtn, goToSettingsBtn], 'active');
      goToTaskListBtn.classList.add('active');
      router.navigate('#task-list');
    });
    goToReportsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([goToTaskListBtn, removeBtn, goToSettingsBtn], 'active');
      goToReportsBtn.classList.add('active');
      router.navigate('#reports');
    });
    goToSettingsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([goToTaskListBtn, goToReportsBtn, removeBtn], 'active');
      goToSettingsBtn.classList.add('active');
      router.navigate('#settings');
    });
  }
}

window.addEventListener('load', () => {

  const header = document.getElementsByClassName('header')[0];
  const logo = document.getElementsByClassName('logo')[0];
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 50) {
      header.classList.add('fixed-header');
      logo.classList.remove('display-none');
    }
    if (scrolled <= 50) {
      header.classList.remove('fixed-header');
      logo.classList.add('display-none');
    }
  });
});
