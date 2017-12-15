import  { Observer } from '../../observer';
import { Tasks } from '../../components/tasks/tasks';
import { workGroup, educationGroup, hobbyGroup, sportGroup, otherGroup } from './data';
import { EventBus } from '../../event-bus';
const globalTaskListTemplate = require('./global-task-list.hbs');

export class GlobalTaskListView {
  constructor(element) {
    this.element = element;
    this.task = new Tasks();
    this.renderEvent = new Observer(this);
    this.isGlobalListOpened = false;
    this.eventBus = new EventBus();
  }

  render(removeMode, data) {

    console.log('render');

    const globalTask = {
      workGroup: this.task.getTasksHTML({removeMode:removeMode, tasksList: data.workGroup}),
      educationGroup: this.task.getTasksHTML({removeMode:removeMode, tasksList: data.educationGroup}),
      hobbyGroup: this.task.getTasksHTML({removeMode:removeMode, tasksList: data.hobbyGroup}),
      sportGroup: this.task.getTasksHTML({removeMode:removeMode, tasksList: data.sportGroup}),
      otherGroup: this.task.getTasksHTML({removeMode:removeMode, tasksList: data.otherGroup})
    };

    this.element.insertAdjacentHTML('beforeEnd', globalTaskListTemplate(globalTask));

    if (!this.isGlobalListOpened) {
      document.getElementsByClassName('global-tasks')[0].classList.add('display-none');
    }

    this.addListeners(removeMode);
  }

  addListeners(removeMode) {
    const globalTaskLink = document.getElementsByClassName('global-list-link')[0];
    const arrowSpan = document.getElementById('arrow');
    globalTaskLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.isGlobalListOpened) {
        arrowSpan.className = 'icon-global-list-arrow-right';
        this.isGlobalListOpened = false;
        document.getElementsByClassName('global-tasks')[0].classList.add('display-none');
      } else {
        this.isGlobalListOpened = true;
        arrowSpan.className = 'icon-global-list-arrow-down';
        document.getElementsByClassName('global-tasks')[0].classList.remove('display-none');
      }
    });
  }
}
