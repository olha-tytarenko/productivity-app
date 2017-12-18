const tabsTemplate = require('./tabs.hbs');

export class Tabs {
  constructor(tabs, id) {
    this.tabs = tabs;
    this.id = id;
  }

  getTabsHTML() {
    return tabsTemplate({tabs: this.tabs, id: this.id});
  }

  addListeners() {
    this.tabs.forEach( (tab) => {
      document.getElementById(tab.id).addEventListener('click', tab.handler);
    });
  }
}