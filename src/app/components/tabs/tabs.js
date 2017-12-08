const tabsTemplate = require('./tabs.hbs');

export class Tabs {
  constructor(tabs) {
    this.tabs = tabs;
  }

  getTabsHTML() {
    return tabsTemplate(this.tabs);
  }

  addListeners() {
    this.tabs.forEach( (tab) => {
      document.getElementById(tab.id).addEventListener('click', tab.handler);
    });
  }
}