import { EventBus } from '../../event-bus';
const modalEditTemplate = require('./modal-edit.hbs');

export class ModalEdit {
  constructor(element) {
    this.element = element;
    this.eventBus = new EventBus();
    this.eventBus.registerEventHandler('renderModalEdit', this.render.bind(this));
  }

  getModalHTML() {
    return modalEditTemplate();
  }

  render(task) {
    this.element.insertAdjacentHTML('beforebegin', modalEditTemplate());
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
    closeBtn.addEventListener('click', () => this.remove() );
  }
}