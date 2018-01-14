import { ReportsController } from './index';
import { firebaseManager } from '../../firebase-service';

describe('TasksList', () => {
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
    }
  };
  const router = {
    add: () => {}
  };
  const controller = new ReportsController(view, firebaseManager);

  it('getTasksQuantity method should save task id to sessionStorage', () => {

  });

  it('removeCheckedTask method should remove task id from sessionStorage', () => {

  });

  it('removeTasksFromDB method should call clear sessionStorage', () => {

  });

  it('changeTaskStateToActive method should change task state to active by id', () => {

    });
});