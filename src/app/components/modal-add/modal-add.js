const modalAddTemplate = require('./modal-add.hbs');

export class ModalAdd {
  constructor(element) {
    this.element = element;
  }

  getModalHTML() {
    return modalAddTemplate();
  }

  render() {
    this.element.insertAdjacentHTML('beforebegin', modalAddTemplate());
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
    closeBtn.addEventListener('click', (event) => { this.remove() });
  }
}