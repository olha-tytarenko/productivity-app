require('./header.less'); // example of including component's styles
import { Router } from '../../router';
const headerTemplate = require('./header.hbs');
const router = new Router();


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
      console.log('remove');
      router.navigate('remove-tasks');
    });
    goToTaskListBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate('task-list');
    });
    goToReportsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate('reports');
    });
    goToSettingsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate('settings');
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
})
