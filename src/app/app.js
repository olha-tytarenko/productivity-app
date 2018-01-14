/* root component starts here */
require('assets/less/main.less'); // include general styles

import { Settings } from './pages/settings/index';
import { TasksList } from './pages/tasks-list/index';
import { ReportsView } from './pages/reports/index';
import { ReportsController } from './pages/reports/index';
import { FirstEntrance } from './pages/first-entrance/index';
import { Header } from './components/header/index';
import { ModalAdd } from './components/modal-add/index';
import { ModalEdit } from './components/modal-edit/modal-edit';
import { ModalRemove } from './components/modal-remove/modal-remove';
import { Router } from './router';
import { TimerView } from './pages/timer/index';
import { TimerController } from './pages/timer/index';
import { firebaseManager } from './firebase-service';
import { TasksListView } from './pages/tasks-list/index';


const initApp = () => {
  const router = new Router();
  const wrapper = document.getElementsByClassName('header')[0];
  const contentWrapper = document.getElementsByClassName('main-container')[0];
  const settings = new Settings(contentWrapper, router);

  const taskListView = new TasksListView(contentWrapper, firebaseManager);
  const taskList = new TasksList(taskListView, firebaseManager, router);

  const reportsView = new ReportsView(contentWrapper, router);
  const reportsController = new ReportsController(reportsView, firebaseManager);
  
  const firstEntrance = new FirstEntrance(contentWrapper);
  const header = new Header(wrapper, router);
  const modalWrapper = document.getElementsByClassName('wrapper')[0];
  const modalAdd = new ModalAdd(modalWrapper, firebaseManager);
  const modalEdit = new ModalEdit(modalWrapper, firebaseManager);
  const modalRemove = new ModalRemove(modalWrapper);
  const timerView = new TimerView(contentWrapper, router);
  const timerController = new TimerController(firebaseManager, timerView);

  sessionStorage.setItem('workIterationCount', '0');
  sessionStorage.setItem('settings', JSON.stringify({workTime:25,workIteration:5,shortBreak:5,longBreak:30}));
  sessionStorage.setItem('tasksToRemove', '[]');
  header.render();
  router.init('#tasks-list');

  if (window.sessionStorage.getItem('isUserExist')) {
    router.navigate('#tasks-list');
  } else {
    firstEntrance.render();
    window.sessionStorage.setItem('isUserExist', true);
  }
};

initApp();
