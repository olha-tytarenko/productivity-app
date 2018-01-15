import { EventBus } from '../../event-bus';
import dailyTaskListHeading from './daily-task-list-heading.hbs';

export class DailyTaskListHeading {
  constructor(element) {
    this.element = element;
    this.eventBus = new EventBus();
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
      this.eventBus.dispatch('renderModalAdd');
    });
  }
}