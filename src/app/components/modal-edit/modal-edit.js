import { EventBus } from '../../event-bus';
import { notification } from '../notification-message/notification-message';
import addDatepicker from '../../datepicker';
import modalEditTemplate from './modal-edit.hbs';

export class ModalEdit {
  constructor(element, model) {
    this.element = element;
    this.model = model;
    this.eventBus = new EventBus();
    this.eventBus.registerEventHandler('renderModalEdit', this.render.bind(this));
    this.eventBus.registerEventHandler('removeModalEdit', this.remove.bind(this));
  }

  getModalHTML() {
    return modalEditTemplate();
  }

  render(id) {
    this.model.getTaskById(id).then((task) => {
      task[task.category] = true;
      task[task.priority] = true;
      task.id = id;
      this.element.insertAdjacentHTML('beforebegin', modalEditTemplate(task));

      const checkboxes = Array.from(document.getElementsByClassName('checkbox'));
      checkboxes.filter((checkbox, index) => index < task.estimation).forEach((checkbox) => checkbox.checked = true);

      Array.from(document.querySelectorAll('[name="category"]')).filter(radioBtn => radioBtn.id === task.category)[0].checked = true;
      Array.from(document.querySelectorAll('[name="priority"]')).filter(radioBtn => radioBtn.id === task.priority)[0].checked = true;

      addDatepicker();
      this.addListeners();
    });
  }

  remove() {
    const modal = document.getElementsByClassName('modal-overlay')[0];
    if (modal) {
      const parentModal = modal.parentNode;
      parentModal.removeChild(modal);
    }
  }

  addListeners() {
    const estimationLabel = Array.from(document.getElementsByClassName('estimation'));
    const checkboxes = Array.from(document.getElementsByClassName('checkbox'));
    const heading = document.getElementById('title');
    const description = document.getElementById('description');
    const date = document.getElementById('datepicker');
    const closeBtn = document.getElementById('closeModal');
    const saveBtn = document.getElementById('save');
    
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

    closeBtn.addEventListener('click', () => {
      this.remove();
    } );

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
      const category = Array.from(document.querySelectorAll('[name="category"]')).filter((btn) => btn.checked)[0].id;
      const priority = Array.from(document.querySelectorAll('[name="priority"]')).filter((btn) => btn.checked)[0].id;
      const taskId = document.getElementsByClassName('modal')[0].dataset.id;

      this.model.getTaskById(taskId).then((oldTask) => {
        const task = {
          heading: headingValue,
          taskDescription: descriptionValue,
          isActive: oldTask.isActive,
          category: category,
          priority: priority,
          estimation: estimation,
          deadline: deadline
        };

          
        this.model.getTaskById(taskId).then((oldTask) => {
          this.model.updateTask(taskId, task);

          task.id = taskId;
          task.oldCategory = oldTask.category;
          this.eventBus.dispatch('renderEditedTask', task);
        });

        
        notification.showMessage({type: 'success', message: 'Task successfully edited'});
        this.remove();
      });

    });

    const trashBtn = document.getElementById('trash');
    trashBtn.addEventListener('click', () => {
      this.eventBus.dispatch('saveCheckedTasks', document.getElementsByClassName('modal')[0].dataset.id);
      this.eventBus.dispatch('renderModalRemove');
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