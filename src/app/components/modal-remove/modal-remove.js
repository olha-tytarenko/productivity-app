import { EventBus, eventBus } from '../../event-bus';
import modalRemoveTemplate from './modal-remove.hbs';

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
    const modal = document.getElementsByClassName('remove-modal')[0];
    const parentModal = modal.parentNode;
    parentModal.removeChild(modal);
  }

  addListeners() {
    const closeBtns = Array.from(document.getElementsByClassName('close-modal'));
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = document.getElementsByClassName('modal')[0].dataset.id;
        if (id) {
          const tasksToRemove = JSON.parse(sessionStorage.getItem('tasksToRemove'));
          tasksToRemove.splice(tasksToRemove.indexOf(id), 1);
          sessionStorage.setItem('tasksToRemove', JSON.stringify(tasksToRemove));
        }
        this.remove();
      });
    });

    const removeBtn = document.getElementById('remove');
    removeBtn.addEventListener('click', () => {
      this.remove();
      this.eventBus.dispatch('removeTasksFromDB');
      this.eventBus.dispatch('removeModalEdit');
    });
  }
}