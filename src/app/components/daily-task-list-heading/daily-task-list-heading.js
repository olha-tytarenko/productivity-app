import { ModalAdd } from '../modal-add/modal-add';

const dailyTaskListHeading = require('./daily-task-list-heading.hbs');



export class DailyTaskListHeading {
  constructor(element) {
    this.element = element;
  }

  render() {
    this.element.innerHTML += dailyTaskListHeading();
    this.addListeners();
  }

  getHTML() {
    return dailyTaskListHeading();
  }

  addListeners() {
    const addTaskBtn = document.getElementById('addNewTask');

    addTaskBtn.addEventListener('click', () => {
      const modalAdd = new ModalAdd(document.getElementsByClassName('wrapper')[0]);
      modalAdd.render();
    });
  }
}