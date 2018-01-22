import { SettingsView } from './settings-view';
import { router } from '../../router';

export class Settings {
  constructor(element) {
    this.element = element;
    this.settingsView = new SettingsView(this.element, router);
    router.add('#settings', this.settingsView.renderSettings.bind(this.settingsView));
  }
}

