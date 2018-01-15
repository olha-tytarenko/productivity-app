import { TimerController } from './index';
import { firebaseManager } from '../../firebase-service';

describe('Timer', () => {

  const view = {
    render: () => { },
    changeTaskStateEvent: {
      attach: () => { },
      notify: () => { }
    }
  };

  const controller = new TimerController(firebaseManager, view);

  beforeEach(() => {
    spyOn(controller.model, 'getTaskById').and.callFake(() => {
      return new Promise((resolve) => {
        resolve({
          '-L2oO4kNGQRd7jklPfFX': {
            category: 'sport',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: true,
            priority: 'low',
            taskDescription: 'description'
          }
        });
      });
    });
    spyOn(controller.view, 'render');
    spyOn(controller.model, 'updateTask');
  });

  it('render method should call model.getTaskById and view.render', (done) => {
    controller.render();
    expect(controller.model.getTaskById).toHaveBeenCalled();

    controller.model.getTaskById().then(() => {
      expect(controller.view.render).toHaveBeenCalled();
      done();
    });
  });

  it('changeTaskState should call model.getTaskById and model.updateTask', (done) => {
    controller.changeTaskState({taskId: 'id'});
    expect(controller.model.getTaskById).toHaveBeenCalled();

    controller.model.getTaskById().then(() => {
      expect(controller.model.updateTask).toHaveBeenCalled();
      done();
    });
  });
});