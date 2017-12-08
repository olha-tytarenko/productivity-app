const headerTemplate = require('./header.hbs');


const removeClasses = (elements, styleClass) => {
  elements.forEach((element) => {
    element.classList.remove(styleClass);
  });
};


export class Header {
  constructor(element, router, eventBus) {
    this.element = element;
    this.router = router;
    this.eventBus = eventBus;
  }

  render() {
    this.element.innerHTML = headerTemplate();
    this.addListeners();
  }

  addListeners() {
    const removeBtn = document.getElementById('goToRemove');
    console.log(this.router);
    const goToTaskListBtn = document.getElementById('goToTaskList');
    const goToReportsBtn = document.getElementById('goToReports');
    const goToSettingsBtn = document.getElementById('goToSettings');


    removeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.eventBus.dispatch('showRemoveTasksMode');
    });

    goToTaskListBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([removeBtn, goToReportsBtn, goToSettingsBtn], 'active');
      goToTaskListBtn.classList.add('active');
      this.router.navigate('#task-list');
    });
    goToReportsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([goToTaskListBtn, removeBtn, goToSettingsBtn], 'active');
      goToReportsBtn.classList.add('active');
      this.router.navigate('#reports');
    });
    goToSettingsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([goToTaskListBtn, goToReportsBtn, removeBtn], 'active');
      goToSettingsBtn.classList.add('active');
      this.router.navigate('#settings');
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
