const reportsTemplate = require('./reports.hbs');

export class Reports {
  constructor(element, router) {
    this.element = element;
    this.router = router;
    this.router.add('#reports', this.render.bind(this));
  }

  render() {
    this.element.innerHTML = reportsTemplate();
  }

  addListeners() {

  }
}
