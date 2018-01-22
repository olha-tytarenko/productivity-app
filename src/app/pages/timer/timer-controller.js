import { eventBus } from '../../event-bus';
import { getStringMonth } from '../../helpers/date-formatting';
import { router } from '../../router';

export class TimerController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    eventBus.registerEventHandler('renderTimer', this.render.bind(this));
    router.add('#timer', this.render.bind(this));

    this.view.changeTaskStateEvent.attach((sender, id) => {
      this.changeTaskState(id);
    });
  }


  render() {
    const taskId = sessionStorage.getItem('taskInProgress');
    this.model.getTaskById(taskId).then(task => {
      task.id = taskId;
      this.view.render(task);
    });
  }


  changeTaskState(taskDescription) {
    this.model.getTaskById(taskDescription.taskId).then(task => {
      const dateObj = new Date();

      task.doneDate = {
        day: dateObj.getUTCDate(),
        month: getStringMonth(dateObj.getUTCMonth()),
        year: dateObj.getUTCFullYear()
      };
      task.done = 'done';
      task.isActive = false;
      task.failedAttempQuantity = taskDescription.failedAttempQuantity;
      task.successfulAttemptQuantity = taskDescription.successfulAttemptQuantity;
      this.model.updateTask(taskDescription.taskId, task);
    });
  }
}