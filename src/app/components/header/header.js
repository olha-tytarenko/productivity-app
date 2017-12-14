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
    this.eventBus.registerEventHandler('incrementRemoveTaskQuantity', this.incrementRemoveTaskQuantity.bind(this));
    this.eventBus.registerEventHandler('decrementRemoveTaskQuantity', this.decrementRemoveTaskQuantity.bind(this));
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
      removeClasses([goToTaskListBtn, goToReportsBtn, goToSettingsBtn], 'active');
      removeBtn.classList.add('active');
      this.eventBus.dispatch('showRemoveTasksMode');
    });

    goToTaskListBtn.addEventListener('click', (event) => {
      event.preventDefault();
      removeClasses([removeBtn, goToReportsBtn, goToSettingsBtn], 'active');
      goToTaskListBtn.classList.add('active');
      this.router.navigate('#tasks-list');
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

  incrementRemoveTaskQuantity() {
    const countSpan = document.getElementsByClassName('checked-tasks')[0];
    if(countSpan.innerText) {
      countSpan.innerText = +countSpan.innerText + 1;
    } else {
      const trashIconElement = document.getElementById('goToRemove');
      trashIconElement.classList.add('trash');
      countSpan.innerText = 1;
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
    }
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
