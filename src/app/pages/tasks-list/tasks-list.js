import { eventBus } from '../../event-bus';
import { getShortMonthName } from '../../helpers/date-formatting';

const taskListTemplate = require('./tasks-list.hbs');

export class TasksList {
  constructor(view, model, router) {
    this.router = router;
    this.model = model;
    this.view = view;

    eventBus.registerEventHandler('saveCheckedTasks', this.saveCheckedTask.bind(this));
    eventBus.registerEventHandler('removeCheckedTask', this.removeCheckedTask.bind(this));
    eventBus.registerEventHandler('removeTasksFromDB', this.removeTasksFromDB.bind(this));
    eventBus.registerEventHandler('changeTaskStateToActive', this.changeTaskStateToActive.bind(this));
    eventBus.registerEventHandler('renderToDo', this.renderToDo.bind(this));

    this.view.renderDoneEvent.attach((sender, data) => {
      this.renderDone(data);
    });

    this.view.renderToDoEvent.attach((sender, data) => {
      this.renderToDo(data);
    });

    this.router.add('#tasks-list', this.view.renderToDoEvent.notify.bind(this.view.renderToDoEvent));
  }

  renderDone(removeMode) {
    this.model.getAllTasks().then((data) => {
      const doneTasks = [];
      for (const key in data) {
        if(data[key].done) {
          data[key].id = key;
          data[key].doneDate.month = getShortMonthName(data[key].doneDate.month);
          doneTasks.push(data[key]);
        }
      }
      const tasks = {removeMode: removeMode, tasksList: doneTasks};
      this.view.renderDone(tasks);
    });
  }

  renderToDo(removeMode) {
    this.model.getAllTasks().then((data) => {

      if (data) {
        const tasksToDo = [];
        for (const key in data) {
          if(!data[key].done && data[key].isActive) {
            data[key].id = key;
            tasksToDo.push(data[key]);
          }
        }
  
        const tasks = {removeMode: removeMode, tasksList: tasksToDo};
        this.view.renderToDo(tasks);
      } else {
        this.view.renderAddFirstTask();
      }
    });
  }

  saveCheckedTask(taskId) {
    let tasksToRemove = [];
    if (sessionStorage.getItem('tasksToRemove')) {
      tasksToRemove = JSON.parse(sessionStorage.getItem('tasksToRemove'));
    }
    tasksToRemove.push(taskId);
    sessionStorage.setItem('tasksToRemove', JSON.stringify(tasksToRemove));
  }

  removeCheckedTask(taskId) {
    let tasksToRemove = JSON.parse(sessionStorage.getItem('tasksToRemove'));
    tasksToRemove = tasksToRemove.filter((id) => {
      return id !== taskId;
    });

    sessionStorage.setItem('tasksToRemove', JSON.stringify(tasksToRemove));    
  }

  removeTasksFromDB() {
    const tasksId = JSON.parse(sessionStorage.getItem('tasksToRemove'));
    tasksId.forEach((id) => {
      this.model.removeTask(id);
    });

    sessionStorage.setItem('tasksToRemove', '[]');
    eventBus.dispatch('hideRemovedTasks', tasksId);
  }

  changeTaskStateToActive(id) {
    this.model.getTaskById(id).then((task) => {
      task.isActive = true;
      this.model.updateTask(id, task);
    });
  }
}