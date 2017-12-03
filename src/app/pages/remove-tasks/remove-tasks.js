import { Router } from '../../router';
import { Task } from '../../components/task/task';
import { GlobalTaskListLink } from '../../components/global-task-list-link/global-task-list-link'; 

const removeTasksTemplate = require('./remove-tasks.hbs');
const router = new Router();

const tasks = [
  {
    priority: 'urgent',
    category: 'work',
    heading: 'Heading',
    remove: true,
    taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
  },
  {
    priority: 'middle',
    category: 'other',
    heading: 'Heading2',
    remove: true,
    taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
  },
  {
    priority: 'urgent',
    category: 'education',
    heading: 'Heading3',
    remove: true,
    taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
  },
  {
    priority: 'low',
    category: 'sport',
    heading: 'Heading4',
    remove: true,
    taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
  },
  {
    priority: 'high',
    category: 'hobby',
    heading: 'Heading',
    remove: true,
    taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
  }
];

export class RemoveTasks {
  constructor(element) {
    this.element = element;
    this.router = router;
    this.globalTaskListLink = new GlobalTaskListLink(this.element);
    this.router.add('remove-tasks', this.render.bind(this));
    this.task = new Task();
  }

  render() {
    this.element.innerHTML = removeTasksTemplate({tasks : this.task.getTasksHTML(tasks)});
    this.globalTaskListLink.render();
  }
}