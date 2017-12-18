const tabsTemplate = require('./tabs.hbs');

export class Tabs {
  constructor(tabs, id, className) {
    this.tabs = tabs;
    this.id = id;
    this.className = className;
  }

  getTabsHTML() {
    return tabsTemplate({tabs: this.tabs, id: this.id, className: this.className});
  }

  addListeners() {
    this.tabs.forEach( (tab) => {
      document.getElementById(tab.id).addEventListener('click', tab.handler);
    });
  }
}