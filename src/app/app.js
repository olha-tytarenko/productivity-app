/* root component starts here */
require('assets/less/main.less'); // include general styles

/* example of including header component */
import { Settings } from './pages/settings/settings-controller';
import { TasksList } from './pages/tasks-list/tasks-list';
import { Reports } from './pages/reports/reports';
import { FirstEntrance } from './pages/first-entrance/first-entrance';
import { Header } from './components/header/header';
import { ModalAdd } from './components/modal-add/modal-add';
import { ModalEdit } from './components/modal-edit/modal-edit';
import { ModalRemove } from './components/modal-remove/modal-remove';
import { Router } from './router';
import { TimerView } from './pages/timer/timer-view';
import { TimerController } from './pages/timer/timer-controller';

import { EventBus } from './event-bus';
import { FirebaseManager } from './firebase-service';
import { TasksListView } from './pages/tasks-list/tasks-list-view';


const initApp = () => {
  const router = new Router();
  const eventBus = new EventBus();
  const wrapper = document.getElementsByClassName('header')[0];
  const firebaseManager = new FirebaseManager();
  const contentWrapper = document.getElementsByClassName('main-container')[0];
  const settings = new Settings(contentWrapper, router);
  const taskListView = new TasksListView(contentWrapper, firebaseManager);
  const taskList = new TasksList(taskListView, firebaseManager, router);
  const reports = new Reports(contentWrapper, router);
  const firstEntrance = new FirstEntrance(contentWrapper);
  const header = new Header(wrapper, router, eventBus);
  const modalWrapper = document.getElementsByClassName('wrapper')[0];
  const modalAdd = new ModalAdd(modalWrapper, firebaseManager);
  const modalEdit = new ModalEdit(modalWrapper, firebaseManager);
  const modalRemove = new ModalRemove(modalWrapper);
  const timerView = new TimerView(contentWrapper);
  const timerController = new TimerController(firebaseManager, timerView);

  // firebaseManager.saveNewTask({
  //   priority: 'urgent',
  //   category: 'work',
  //   heading: 'Heading2',
  //   estimation: '3',
  //   day: 20,
  //   month: 'May',
  //   taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
  // });
  
  // firebaseManager.removeTask('-L0LibgbotwJuj0MRpo-');
  // firebaseManager.getAllTasks().then((data) => console.log('data', data));
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


