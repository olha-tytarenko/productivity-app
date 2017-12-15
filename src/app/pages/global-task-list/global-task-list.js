import { Tasks } from '../../components/tasks/tasks';
import { GlobalTask } from '../../components/global-task/global-task';
import { workGroup, educationGroup, hobbyGroup, sportGroup, otherGroup } from './data';
import { EventBus } from '../../event-bus';
import { GlobalTaskListView } from './global-task-list-view';

const globalTaskListTemplate = require('./global-task-list.hbs');

export class GlobalTaskList {
  constructor(view, model) {
    console.log(view);
    this.model = model;
    this.view = view;
    this.view.renderEvent.attach((sender, data) => {
      this.renderGlobalList(data);
    });

    this.isGlobalListOpened = false;
    this.task = new Tasks();
    this.globalTask = new GlobalTask();
    this.removeMode = false;
    this.eventBus = new EventBus();
}


  renderGlobalList(removeMode) {
    this.model.getAllTasks().then((data) => {
      let doneTasks = [];
      let globalTasks = {
        workGroup: [],
        educationGroup: [],
        hobbyGroup: [],
        sportGroup: [],
        otherGroup: []
      };
      for (const key in data) {
        if(!data[key].isActive && !data[key].done) {
          switch (data[key].category) {
            case 'work': globalTasks.workGroup.push(data[key]); break;
            case 'education': globalTasks.educationGroup.push(data[key]); break;
            case 'hobby': globalTasks.hobbyGroup.push(data[key]); break;
            case 'sport': globalTasks.sportGroup.push(data[key]); break;
            case 'other': globalTasks.otherGroup.push(data[key]); break;
          }
        }
      }
      console.log('call render in controller');
      this.view.render(removeMode, globalTasks);
    });
  }
}