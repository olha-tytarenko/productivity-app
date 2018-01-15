import { SettingsView } from './settings-view';

export class Settings {
  constructor(element, router) {
    this.element = element;
    this.settingsView = new SettingsView(this.element, router);
    this.router = router;
    router.add('#settings', this.settingsView.renderSettings.bind(this.settingsView));
  }
}

