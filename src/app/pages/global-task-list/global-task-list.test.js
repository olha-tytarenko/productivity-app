import { GlobalTaskList } from './index';
import { firebaseManager } from '../../firebase-service';

describe('GlobalTasksList', () => {

  const view = {
    renderEvent: {
      attach: () => {},
      notify: () => {}
    },
    render: () => {}
  };

  const controller = new GlobalTaskList(view, firebaseManager);

  beforeEach(() => {
    spyOn(controller.model, 'getAllTasks').and.callFake(() => {
      return new Promise((resolve) => {
        resolve({
          '-L2oO4kNGQRd7jklPfFX': {
            category: 'education',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: false,
            priority: 'low',
            taskDescription: 'description'
          },
          '-L2oO4kNsdGQRd7jklPfFX': {
            category: 'hobby',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: false,
            priority: 'low',
            taskDescription: 'description'
          },
          '-L2oO5mNGQRd7jklPfFX': {
            category: 'sport',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: false,
            priority: 'low',
            taskDescription: 'description'
          },
          '-L2oO4kNGQRd7jklBsGx': {
            category: 'other',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: false,
            priority: 'low',
            taskDescription: 'description'
          },
          '-L2oO4kNGQRd7jksDsGx': {
            category: 'work',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: false,
            priority: 'low',
            taskDescription: 'description'
          }
        });
      });
    });

    spyOn(controller.view, 'render');
  });

  it('SaveCheckedTask method should save task id to sessionStorage', (done) => {
    controller.renderGlobalList();

    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.render).toHaveBeenCalled();
      done();
    });
  });
});