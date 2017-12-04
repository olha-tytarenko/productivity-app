/* root component starts here */
require('assets/less/main.less'); // include general styles

/* example of including header component */
import { Settings } from './pages/settings/settings';
import { TasksList } from './pages/tasks-list/tasks-list';
import { Reports } from './pages/reports/reports';
import { FirstEntrance } from './pages/first-entrance/first-entrance';
import { Header } from './components/header/header';
import { Router } from './router';
import { GlobalTaskList } from './pages/global-task-list/global-task-list';
import { FirebaseManager } from './firebase-service';


const initApp = () => {
  const router = new Router();
  const wrapper = document.getElementsByClassName('header')[0];
  const header = new Header(wrapper);
  header.render();
  const contentWrapper = document.getElementsByClassName('main-container')[0];
  const settings = new Settings(contentWrapper);
  const taskList = new TasksList(contentWrapper);
  const reports = new Reports(contentWrapper);
  const firstEntrance = new FirstEntrance(contentWrapper);
  const globalTaskList = new GlobalTaskList(contentWrapper);

  router.init('#task-list');

  if (window.sessionStorage.getItem('isUserExist')) {
    router.navigate('#task-list');
  } else {
    firstEntrance.render();
    window.sessionStorage.setItem('isUserExist', true);
  }
};

initApp();


