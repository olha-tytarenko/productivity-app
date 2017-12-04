const modalRemoveTemplate = require('./modal-remove.hbs');

export class ModalRemove {
  constructor(elem) {
    this.element = elem;
  }

  render() {
    this.element.innerHTML = modalAddTemplate();
  }
}