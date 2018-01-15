import { TasksList } from './index';
import { firebaseManager } from '../../firebase-service';

describe('TasksList', () => {

  const view = {
    renderDoneEvent: {
      attach: () => {},
      notify: () => {}
    },
    renderToDoEvent: {
      attach: () => {},
      notify: () => {}
    },
    renderToDo: () => {
    },
    renderDone: () => {},
    renderAddFirstTask: () => {}
  };

  const router = {
    add: () => {}
  };

  const controller = new TasksList(view, firebaseManager, router);

  beforeEach(() => {
    let store = {};

    spyOn(sessionStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });

    spyOn(controller.model, 'getTaskById').and.callFake(() => {
      return new Promise((resolve) => {
        resolve({
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
        });
      });
    });

    spyOn(controller.model, 'getAllTasks').and.callFake(() => {
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
            isActive: true,
            priority: 'low',
            taskDescription: 'description'
          },
          '-L2oO4kNGQRd7jklBsGx': {
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
            taskDescription: 'description',
            done: true,
            doneDate: {
              day: 25,
              month: 'January',
              year: 2018
            }
          },
          '-L2oO4kNGQRd7jksDsGx': {
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
            taskDescription: 'description',
            done: true,
            doneDate: {
              day: 25,
              month: 'January',
              year: 2018
            }
          }
        });
      });
    });

    spyOn(controller.model, 'updateTask');
    spyOn(controller.model, 'removeTask');
    spyOn(controller.view, 'renderToDo');
    spyOn(controller.view, 'renderDone');
  });

  it('SaveCheckedTask method should save task id to sessionStorage', () => {
    controller.saveCheckedTask('1203737');
    expect(sessionStorage.getItem('tasksToRemove')).toEqual('["1203737"]');

    controller.saveCheckedTask('1202022');
    expect(sessionStorage.getItem('tasksToRemove')).toEqual('["1203737","1202022"]');
  });

  it('removeCheckedTask method should remove task id from sessionStorage', () => {
    controller.saveCheckedTask('999999');
    controller.removeCheckedTask('999999');
    expect(sessionStorage.getItem('tasksToRemove')).toEqual('[]');
  });

  it('removeTasksFromDB method should call clear sessionStorage and model.removeTask', () => {
    controller.saveCheckedTask('1203737');
    controller.saveCheckedTask('999999');
    controller.removeTasksFromDB();

    expect(sessionStorage.getItem('tasksToRemove')).toEqual('[]');
    expect(controller.model.removeTask).toHaveBeenCalled();
  });

  it('removeTasksFromDB method should call model.removeTask and clear sessionStorage just for one id if it has duplicate', () => {
    controller.saveCheckedTask('1203737');
    controller.saveCheckedTask('999999');
    controller.saveCheckedTask('99999sdasd9');
    controller.saveCheckedTask('1203737');
    const sessionStorageLength = JSON.parse(sessionStorage.getItem('tasksToRemove')).length;

    controller.removeTasksFromDB();
    expect(JSON.parse(sessionStorage.getItem('tasksToRemove')).length).toEqual(sessionStorageLength - 2);
  });

  it('changeTaskStateToActive method should call model.getTaskById and model.updateTask method', (done) => {
    controller.changeTaskStateToActive('id');
    expect(controller.model.getTaskById).toHaveBeenCalledWith('id');
    controller.model.getTaskById().then(() => {
      expect(controller.model.updateTask).toHaveBeenCalled();
      done();
    });
  });

  it('renderDone methos should call model.getAllTasks and view.renderDone', (done) => {
    controller.renderDone(false);
    expect(controller.model.getAllTasks).toHaveBeenCalled();
    controller.model.getAllTasks().then(() => {
      expect(controller.view.renderDone).toHaveBeenCalled();
      done();
    });
  });

  it('renderToDo methos should call model.getAllTasks and view.renderToDo', (done) => {
    controller.renderToDo(false);
    expect(controller.model.getAllTasks).toHaveBeenCalled();
    controller.model.getAllTasks().then(() => {
      expect(controller.view.renderToDo).toHaveBeenCalled();
      done();
    });
  });
});