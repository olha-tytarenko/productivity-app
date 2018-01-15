import { ReportsController } from './index';
import { firebaseManager } from '../../firebase-service';
import { getStringMonth } from '../../helpers/date-formatting';

describe('Reports', () => {
  let dateObj;
  const view = {
    renderDailyReportEvent: {
      attach: () => {},
      notify: () => {}
    },
    renderWeeklyReportEvent: {
      attach: () => {},
      notify: () => {}
    },
    renderMonthlyReportEvent: {
      attach: () => {},
      notify: () => {}
    },
    getDailyChart: () => {
    },
    getWeeklyChart: () => {
    },
    getMonthlyChart: () => {
    }
  };
  const controller = new ReportsController(view, firebaseManager);

  beforeEach(() => {
    dateObj = new Date();

    spyOn(controller.model, 'getAllTasks').and.callFake(() => {
      return new Promise((resolve) => {
        resolve({
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
              day: dateObj.getUTCDate(),
              month: getStringMonth(dateObj.getUTCMonth()),
              year: dateObj.getUTCFullYear()
            },
            failedAttempQuantity: 1,
            successfulAttemptQuantity: 4
          },
          '-L2oO4kNasdsadd7jksDsGx': {
            category: 'sport',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: true,
            priority: 'middle',
            taskDescription: 'description',
            done: true,
            doneDate: {
              day: dateObj.getUTCDate(),
              month: getStringMonth(dateObj.getUTCMonth()),
              year: dateObj.getUTCFullYear()
            },
            failedAttempQuantity: 0,
            successfulAttemptQuantity: 5
          },
          '-L2sdf4kNGQRd7jksDsGx': {
            category: 'sport',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: true,
            priority: 'high',
            taskDescription: 'description',
            done: true,
            doneDate: {
              day: dateObj.getUTCDate(),
              month: getStringMonth(dateObj.getUTCMonth()),
              year: dateObj.getUTCFullYear()
            },
            failedAttempQuantity: 1,
            successfulAttemptQuantity: 4
          },
          '-L2sdf4ksdNGQRd7jksDsGx': {
            category: 'sport',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: true,
            priority: 'urgent',
            taskDescription: 'description',
            done: true,
            doneDate: {
              day: dateObj.getUTCDate(),
              month: getStringMonth(dateObj.getUTCMonth()),
              year: dateObj.getUTCFullYear()
            },
            failedAttempQuantity: 5,
            successfulAttemptQuantity: 0
          },
          '-L2sdf4kNGsdfd7jksDsGx': {
            category: 'sport',
            deadline: {
              day: 25,
              month: 'January',
              year: 2018
            },
            estimation: 5,
            heading: 'Heading',
            isActive: true,
            priority: 'high',
            taskDescription: 'description',
            done: true,
            doneDate: {
              day: dateObj.getUTCDate(),
              month: getStringMonth(dateObj.getUTCMonth()),
              year: dateObj.getUTCFullYear()
            },
            failedAttempQuantity: 3,
            successfulAttemptQuantity: 2
          }
        });
      });
    });

    spyOn(controller.view, 'getDailyChart');
    spyOn(controller.view, 'getWeeklyChart');
    spyOn(controller.view, 'getMonthlyChart');
  });

  it('showDailyTasksReport method should call model.getAllTasks and view.getDailyChart', (done) => {
    controller.showDailyTasksReport('pomodoros');
    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.getDailyChart).toHaveBeenCalled();
      done();
    });
  });

  it('showDailyTasksReport method should call model.getAllTasks and view.getDailyChart and getTasksQuantity', (done) => {
    controller.showDailyTasksReport('task');
    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.getDailyChart).toHaveBeenCalled();
      done();
    });
  });

  it('showWeeklyTasksReport method should call model.getAllTasks and view.getDailyChart', (done) => {
    controller.showWeeklyTasksReport('pomodoros');
    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.getWeeklyChart).toHaveBeenCalled();
      done();
    });
  });

  it('showWeeklyTasksReport method should call model.getAllTasks and view.getDailyChart and getTasksQuantity', (done) => {
    controller.showWeeklyTasksReport('task');
    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.getWeeklyChart).toHaveBeenCalled();
      done();
    });
  });

  it('showMonthlyTasksReport method should call model.getAllTasks and view.getDailyChart', (done) => {
    controller.showMonthlyTasksReport('pomodoros');
    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.getMonthlyChart).toHaveBeenCalled();
      done();
    });
  });

  it('showMonthlyTasksReport method should call model.getAllTasks and view.getDailyChart and getTasksQuantity', (done) => {
    controller.showMonthlyTasksReport('task');
    expect(controller.model.getAllTasks).toHaveBeenCalled();

    controller.model.getAllTasks().then(() => {
      expect(controller.view.getMonthlyChart).toHaveBeenCalled();
      done();
    });
  });

});