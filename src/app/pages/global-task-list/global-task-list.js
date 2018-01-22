import { Tasks } from '../../components/tasks/tasks';
import { GlobalTask } from '../../components/global-task/global-task';
import { getShortMonthName } from '../../helpers/date-formatting';

export class GlobalTaskList {
  constructor(view, model) {
    this.model = model;
    this.view = view;
    this.view.renderEvent.attach((sender, data) => {
      this.renderGlobalList(data);
    });

    this.isGlobalListOpened = false;
    this.task = new Tasks();
    this.globalTask = new GlobalTask();
    this.removeMode = false;
  }


  renderGlobalList(removeMode) {
    this.model.getAllTasks().then((data) => {
      let globalTasks = {
        workGroup: [],
        educationGroup: [],
        hobbyGroup: [],
        sportGroup: [],
        otherGroup: []
      };
      for (const key in data) {
        if (!data[key].isActive && !data[key].done) {
          const todayDate = new Date();
          const deadline = new Date();

          deadline.setTime(Date.parse(`${data[key].deadline.day} ${data[key].deadline.month} ${data[key].deadline.year} 23:59`));
          if (deadline < todayDate) {
            data[key].overdue = 'overdue';
          }

          data[key].id = key;
          data[key].deadline.month = getShortMonthName(data[key].deadline.month);

          switch (data[key].category) {
          case 'work': globalTasks.workGroup.push(data[key]); break;
          case 'education': globalTasks.educationGroup.push(data[key]); break;
          case 'hobby': globalTasks.hobbyGroup.push(data[key]); break;
          case 'sport': globalTasks.sportGroup.push(data[key]); break;
          case 'other': globalTasks.otherGroup.push(data[key]); break;
          }
        }
      }
      this.view.render(removeMode, globalTasks);
    });
  }
}