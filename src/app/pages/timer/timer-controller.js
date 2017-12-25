import { EventBus } from '../../event-bus';

export class TimerController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.eventBus = new EventBus();
    this.eventBus.registerEventHandler('renderTimer', this.render.bind(this));
    this.view.changeTaskStateEvent.attach((sender, id) => {
      this.changeTaskState(id);
    });
  }


  render(taskId) {
    this.model.getTaskById(taskId).then(task => {
      task.id = taskId;
      this.view.render(task);
    });
  }


  changeTaskState(taskId) {
    this.model.getTaskById(taskId).then(task => {
      task.done = 'done';
      this.model.updateTask(taskId, task);
    });
  }
}