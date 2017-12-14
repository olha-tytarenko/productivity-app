import { SettingsView } from './settings-view';
import { Tabs } from '../../components/tabs/tabs';

const pomodorosSettingsTemplate = require('./pomodoros-settings.hbs');
const settingsCategoriesTemplate = require('./settings-categories.hbs');

export class Settings {
  constructor(element, router) {
    this.element = element;
    this.settingsView = new SettingsView(this.element, router);
    this.router = router;
    router.add('#settings', this.settingsView.renderSettings.bind(this.settingsView));
  }
}

