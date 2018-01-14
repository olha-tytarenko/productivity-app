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
    }
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

  it('removeTasksFromDB method should call clear sessionStorage', () => {
    controller.saveCheckedTask('1203737');
    controller.saveCheckedTask('999999');
    controller.removeTasksFromDB();

    expect(sessionStorage.getItem('tasksToRemove')).toEqual('[]');
  });

  it('changeTaskStateToActive method should change task state to active by id', (done) => {
    spyOn(controller.model, 'updateTask');
    controller.changeTaskStateToActive('0303030');
    const task = {};

    controller.model.getTaskById('0303030').then((task) => {
      done();
      expect(controller.model.updateTask).toHaveBeenCalledWith('0303030', task);
    });
  });
});