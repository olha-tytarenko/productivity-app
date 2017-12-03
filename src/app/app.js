/* root component starts here */
require('assets/less/main.less'); // include general styles
require('./router'); // include router

/* example of including header component */
require('./components/header/header');
import { Settings } from './pages/settings/settings';
import { TasksList } from './pages/tasks-list/tasks-list';
import { Reports } from './pages/reports/reports';
import { RemoveTasks } from './pages/remove-tasks/remove-tasks';
import { Header } from './components/header/header';
import { Router } from './router';


const router = new Router();
const wrapper = document.getElementsByClassName('header')[0];
const header = new Header(wrapper);
header.render();
const contentWrapper = document.getElementsByClassName('main-container')[0];
const settings = new Settings(contentWrapper);
const taskList = new TasksList(contentWrapper);
const reports = new Reports(contentWrapper);
const removeTasks = new RemoveTasks(contentWrapper);

router.init();
router.navigate('task-list');