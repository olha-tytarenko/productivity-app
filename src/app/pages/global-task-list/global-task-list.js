import { Task } from '../../components/task/task';
import { GlobalTask } from '../../components/global-task/global-task';
import { workGroup, educationGroup, hobbyGroup, sportGroup, otherGroup } from './data';

const globalTaskListTemplate = require('./global-task-list.hbs');

export class GlobalTaskList {
  constructor(element) {
    this.element = element;
    this.task = new Task();
    this.globalTask = new GlobalTask();

  }

  render(removeMode) {
    workGroup.forEach((elem) => {
      elem.removeMode = removeMode
    });
    educationGroup.forEach((elem) => {
      elem.removeMode = removeMode
    });
    hobbyGroup.forEach((elem) => {
      elem.removeMode = removeMode
    });
    sportGroup.forEach((elem) => {
      elem.removeMode = removeMode
    });
    otherGroup.forEach((elem) => {
      elem.removeMode = removeMode
    });

    const globalTask = {
      workGroup: this.globalTask.getTasksHTML(workGroup),
      educationGroup: this.globalTask.getTasksHTML(educationGroup),
      hobbyGroup: this.globalTask.getTasksHTML(hobbyGroup),
      sportGroup: this.globalTask.getTasksHTML(sportGroup),
      otherGroup: this.globalTask.getTasksHTML(otherGroup)
    };

    this.element.insertAdjacentHTML('beforeEnd', globalTaskListTemplate(globalTask));
  }

  renderRemoveMode() {
    const globalTask = {
      workGroup: this.globalTask.getTasksHTML(workGroup),
      educationGroup: this.globalTask.getTasksHTML(educationGroup),
      hobbyGroup: this.globalTask.getTasksHTML(hobbyGroup),
      sportGroup: this.globalTask.getTasksHTML(sportGroup),
      otherGroup: this.globalTask.getTasksHTML(otherGroup),
    };

    this.element.insertAdjacentHTML('beforeEnd', globalTaskListTemplate(globalTask));
  }

  remove() {
    const globalTaskList = document.getElementsByClassName('global-tasks')[0];
    const parentGlobalTaskList = globalTaskList.parentNode;
    parentGlobalTaskList.removeChild(globalTaskList);
  }
}