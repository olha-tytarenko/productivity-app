const modalEditTemplate = require('./modal-edit.hbs');

export class ModalEdit {
  constructor(elem) {
    this.element = elem;
  }

  render() {
    this.element.innerHTML = modalAddTemplate();
  }
}