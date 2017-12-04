const modalAddTemplate = require('./modal-add.hbs');

export class ModalAdd {
  constructor(elem) {
    this.element = elem;
  }

  render() {
    this.element.innerHTML = modalAddTemplate();
  }
}