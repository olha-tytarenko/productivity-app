/* root component starts here */
require('assets/less/main.less'); // include general styles

/* example of including header component */
import { Settings } from './pages/settings/settings';
import { TasksList } from './pages/tasks-list/tasks-list';
import { Reports } from './pages/reports/reports';
import { FirstEntrance } from './pages/first-entrance/first-entrance';
import { Header } from './components/header/header';
// import { ModalAdd } from './components/modal-add/modal-add';
import { Router } from './router';
import { GlobalTaskList } from './pages/global-task-list/global-task-list';
import { EventBus } from './event-bus';
import { FirebaseManager } from './firebase-service';


const initApp = () => {
  const router = new Router();
  const eventBus = new EventBus();
  const wrapper = document.getElementsByClassName('header')[0];

  const contentWrapper = document.getElementsByClassName('main-container')[0];
  const settings = new Settings(contentWrapper, router);
  const taskList = new TasksList(contentWrapper, router, eventBus);
  const reports = new Reports(contentWrapper, router);
  const firstEntrance = new FirstEntrance(contentWrapper);
  const globalTaskList = new GlobalTaskList(contentWrapper);
  const header = new Header(wrapper, router, eventBus);
  header.render();


  router.init('#task-list');

  if (window.sessionStorage.getItem('isUserExist')) {
    router.navigate('#task-list');
  } else {
    firstEntrance.render();
    window.sessionStorage.setItem('isUserExist', true);
  }
};

initApp();


