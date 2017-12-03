import { Router } from '../../router';
import { GlobalTaskListLink } from '../../components/global-task-list-link/global-task-list-link'; 
import { Task } from '../../components/task/task';

const router = new Router();
const taskListTemplate = require('./tasks-list.hbs');
const taskListDone = require('./tasks-list-done.hbs');

export class TasksList {
  constructor(element) {
    this.element = element;
    this.router = router;
    this.globalTaskListLink = new GlobalTaskListLink(this.element);
    this.router.add('task-list', this.renderToDo.bind(this));
    this.task = new Task();
  }

  renderToDo() {
    document.title = 'Task list';
    const tasks = [
      {
        priority: 'urgent',
        category: 'work',
        heading: 'Heading',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
      },
      {
        priority: 'middle',
        category: 'other',
        heading: 'Heading2',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
      },
      {
        priority: 'urgent',
        category: 'education',
        heading: 'Heading3',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
      },
      {
        priority: 'low',
        category: 'sport',
        heading: 'Heading4',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
      },
      {
        priority: 'high',
        category: 'hobby',
        heading: 'Heading',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
      }
    ];

    this.element.innerHTML = taskListTemplate({tasks : this.task.getTasksHTML(tasks)});

    this.globalTaskListLink.render();
    this.addListeners();
  }

  renderDone() {
    const tasks = [
      {
        priority: 'urgent',
        category: 'work',
        heading: 'Heading dsd',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
        done: 'done'
      },
      {
        priority: 'middle',
        category: 'other',
        heading: 'Heading420',
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
        done: 'done'
      }
    ];

    this.element.innerHTML = taskListTemplate({tasks : this.task.getTasksHTML(tasks)});
    this.globalTaskListLink.render();
    this.addListeners();
  }

  addListeners() {

    const toDo = document.getElementById('toDo');
    const done = document.getElementById('done');

    toDo.addEventListener('click', (event) => {
      event.preventDefault();
      this.renderToDo();
    });

    done.addEventListener('click', (event) => {
      event.preventDefault();
      this.renderDone();
    });
  }
}