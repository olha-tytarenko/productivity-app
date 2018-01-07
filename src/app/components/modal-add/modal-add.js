import { eventBus } from '../../event-bus';
import { notification } from '../notification-message/notification-message';
import addDatepicker from '../../datepicker';

const modalAddTemplate = require('./modal-add.hbs');

export class ModalAdd {
  constructor(element, model) {
    this.element = element;
    this.model = model;
    eventBus.registerEventHandler('renderModalAdd', this.render.bind(this));
  }

  getModalHTML() {
    return modalAddTemplate();
  }

  render() {
    this.element.insertAdjacentHTML('beforebegin', modalAddTemplate());
    const checkboxes = Array.from(document.getElementsByClassName('checkbox'));
    const settings = JSON.parse(sessionStorage.getItem('settings'));

    addDatepicker();
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
    const closeBtn = document.getElementById('closeModal');
    const saveBtn = document.getElementById('save');
    const heading = document.getElementById('title');
    const description = document.getElementById('description');
    const date = document.getElementById('datepicker');

    heading.addEventListener('input', () => {
      heading.closest('li').style.borderColor = '#8DA5B8';
    });

    description.addEventListener('input', () => {
      description.closest('li').style.borderColor = '#8DA5B8';
    });

    date.addEventListener('click', () => {
      date.closest('li').style.borderColor = '#8DA5B8';
    });

    estimationLabel.forEach((label) => {
      label.addEventListener('click', (event) => {
        const currentCheckbox = event.target.previousSibling;
        const index = checkboxes.indexOf(currentCheckbox);

        checkboxes.forEach((checkbox) => checkbox.checked = false);
        checkboxes.filter((chbox, i) => i <= index ).forEach((chbox) => chbox.checked = true );
      });
    });


    closeBtn.addEventListener('click', () =>  this.remove());
    saveBtn.addEventListener('click', () => {
      if (!this.checkValidation()) {
        notification.showMessage({type: 'warning', message: 'Fill all fields'});
        return;
      }

      const estimation = checkboxes.reduce((acc, checkbox) => {
        return checkbox.checked ? acc + 1 : acc;
      }, 0);
      const headingValue = heading.value;
      const descriptionValue = description.value;
      const dateValue = date.value.split(' ');
      const deadline = {
        day: parseInt(dateValue[1]),
        month: dateValue[0],
        year: dateValue[2]
      };
      const category = Array.from(document.querySelectorAll('[name="category"]')).filter(radioBtn => radioBtn.checked)[0].id;
      const priority = Array.from(document.querySelectorAll('[name="priority"]')).filter(radioBtn => radioBtn.checked)[0].id;
      const task = {
        heading: headingValue,
        taskDescription: descriptionValue,
        isActive: false,
        category: category,
        priority: priority,
        estimation: estimation,
        deadline: deadline
      };

      task.id = this.model.saveNewTask(task);
      eventBus.dispatch('renderNewTask', task);
      notification.showMessage({type: 'success', message: 'Task successfully added'});
      this.remove();
    });
  }

  checkValidation() {
    const heading = document.getElementById('title');
    const description = document.getElementById('description');
    const date = document.getElementById('datepicker');
    let isValidationOk = true;

    if (!heading.value) {
      heading.closest('li').style.borderBottom = '1px solid red';
      isValidationOk = false;
    }

    if (!description.value) {
      description.closest('li').style.borderBottom = '1px solid red';
      isValidationOk = false;
    }

    if (!date.value) {
      date.closest('li').style.borderBottom = '1px solid red';
      isValidationOk = false;
    }

    return isValidationOk;
  }
}