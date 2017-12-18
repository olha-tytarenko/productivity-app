import { EventBus } from '../../event-bus';
const modalEditTemplate = require('./modal-edit.hbs');

export class ModalEdit {
  constructor(element, model) {
    this.element = element;
    this.model = model;
    this.eventBus = new EventBus();
    this.eventBus.registerEventHandler('renderModalEdit', this.render.bind(this));
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

      console.log(id);

      this.eventBus.dispatch('saveCheckedTasks', id);
      this.addListeners();
    });
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
    closeBtn.addEventListener('click', () => this.remove() );

    const saveBtn = document.getElementById('save');
    saveBtn.addEventListener('click', () => {
      const estimation = checkboxes.reduce((acc, checkbox) => {
        return checkbox.checked ? acc + 1 : acc;
      }, 0);
      const heading = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const day = 15;
      const month = 'May';
      const category = Array.from(document.querySelectorAll('[name="category"]')).filter((btn) => btn.checked)[0].id;
      const priority = Array.from(document.querySelectorAll('[name="priority"]')).filter((btn) => btn.checked)[0].id;

      const taskId = document.getElementsByClassName('modal')[0].dataset.id;

      this.model.getTaskById(taskId).then((oldTask) => {
        console.log(oldTask);
        const task = {
          day: day,
          month: month,
          heading: heading,
          taskDescription: description,
          isActive: oldTask.isActive,
          category: category,
          priority: priority,
          estimation: estimation
        };

        this.model.updateTask(taskId, task);
        task.id = taskId;
        this.eventBus.dispatch('renderEditedTask', task);
        this.remove();
      });

    });

    const trashBtn = document.getElementById('trash');
    trashBtn.addEventListener('click', () => {
      this.eventBus.dispatch('renderModalRemove');
      this.remove();
    });
  }
}