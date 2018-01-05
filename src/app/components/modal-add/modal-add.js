import { EventBus } from '../../event-bus';
const modalAddTemplate = require('./modal-add.hbs');

export class ModalAdd {
  constructor(element, model) {
    this.element = element;
    this.eventBus = new EventBus();
    this.model = model;
    this.eventBus.registerEventHandler('renderModalAdd', this.render.bind(this));
  }

  getModalHTML() {
    return modalAddTemplate();
  }

  render() {
    this.element.insertAdjacentHTML('beforebegin', modalAddTemplate());
    const checkboxes = Array.from(document.getElementsByClassName('checkbox'));
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    checkboxes.filter((checkbox, index) => index < settings.workIteration).forEach(checkbox => checkbox.checked = true);
    this.addListeners();
  }

  remove() {
    const modal = document.getElementsByClassName('modal-overlay')[0];
    const parentModal = modal.parentNode;

    parentModal.removeChild(modal);
  }

  addListeners() {
    const estimationLabel = Array.from(document.getElementsByClassName('estimation'));
    const checkboxes = Array.from(document.getElementsByClassName('checkbox'));

    estimationLabel.forEach((label) => {
      label.addEventListener('click', (event) => {
        const currentCheckbox = event.target.previousSibling;
        const index = checkboxes.indexOf(currentCheckbox);
        checkboxes.forEach((checkbox) => checkbox.checked = false);
        checkboxes.filter((chbox, i) => i <= index ).forEach((chbox) => chbox.checked = true );
      });
    });

    const closeBtn = document.getElementById('closeModal');
    const saveBtn = document.getElementById('save');

    closeBtn.addEventListener('click', () =>  this.remove());
    saveBtn.addEventListener('click', () => {
      const estimation = checkboxes.reduce((acc, checkbox) => {
        return checkbox.checked ? acc + 1 : acc;
      }, 0);
      const heading = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const day = 15;
      const month = 'May';
      const category = Array.from(document.querySelectorAll('[name="category"]')).filter(radioBtn => radioBtn.checked)[0].id;
      const priority = Array.from(document.querySelectorAll('[name="priority"]')).filter(radioBtn => radioBtn.checked)[0].id;

      const task = {
        day: day,
        month: month,
        heading: heading,
        taskDescription: description,
        isActive: false,
        category: category,
        priority: priority,
        estimation: estimation
      };

      task.id = this.model.saveNewTask(task);
      this.eventBus.dispatch('renderNewTask', task);
      this.remove();
    });
  }
}