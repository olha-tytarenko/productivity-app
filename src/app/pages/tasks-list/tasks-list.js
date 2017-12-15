const taskListTemplate = require('./tasks-list.hbs');

export class TasksList {
  constructor(view, model, router) {
    this.router = router;
    this.model = model;
    this.view = view;


    this.view.renderDoneEvent.attach((sender, data) => {
      this.renderDone(data);
    });

    this.view.renderToDoEvent.attach((sender, data) => {
      this.renderToDo(data);
    });

    this.router.add('#tasks-list', this.view.renderToDoEvent.notify.bind(this.view.renderToDoEvent));
  }

  addNewTask(task) {
    this.model.addNewTask(task);
  }

  renderDone(removeMode) {
    console.log(removeMode);
    this.model.getAllTasks().then((data) => {
      let doneTasks = [];
      for (const key in data) {
        console.log(key);
        if(data[key].done) {
          doneTasks.push(data[key]);
        }
      }
      const tasks = {removeMode: removeMode, tasksList: doneTasks};
      this.view.renderDone(tasks);
    });
  }

  renderToDo(removeMode) {
    console.log(removeMode);
    this.model.getAllTasks().then((data) => {
      let tasksToDo = [];
      for (const key in data) {
        if(!data[key].done && data[key].isActive) {
          tasksToDo.push(data[key]);
        }
      }

      const tasks = {removeMode: removeMode, tasksList: tasksToDo};
      console.log('first');
      this.view.renderToDo(tasks);
    });
  }
}