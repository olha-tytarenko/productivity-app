import { EventBus } from '../../event-bus';
const modalRemoveTemplate = require('./modal-remove.hbs');

export class ModalRemove {
  constructor(element, model) {
    this.element = element;
    this.eventBus = new EventBus();
    this.model = model;
    this.eventBus.registerEventHandler('renderModalRemove', this.render.bind(this));
  }

  getModalHTML() {
    return modalRemoveTemplate();
  }

  render() {
    this.element.insertAdjacentHTML('beforebegin', modalRemoveTemplate());
    this.addListeners();
  }

  remove() {
    const modal = document.getElementsByClassName('modal-overlay')[0];
    const parentModal = modal.parentNode;
    parentModal.removeChild(modal);
  }

  addListeners() {
    const closeBtns = Array.from(document.getElementsByClassName('close-modal'));
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => this.remove());
    });

    const removeBtn = document.getElementById('remove');
    removeBtn.addEventListener('click', () => {
      this.remove();
      this.eventBus.dispatch('removeTasksFromDB');
    });
  }
}