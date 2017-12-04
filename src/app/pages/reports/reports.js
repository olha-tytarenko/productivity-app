import { Router } from '../../router';

const reportsTemplate = require('./reports.hbs');
const router = new Router();

export class Reports {
  constructor(element) {
    this.element = element;

    router.add('#reports', this.render.bind(this));
  }

  render() {
    this.element.innerHTML = reportsTemplate();
  }

  addListeners() {

  }
}
