import { DailyTaskListHeading } from '../../components/daily-task-list-heading/daily-task-list-heading';
import { Router } from '../../router';
import firstEntranceTemplate from './first-entrance.hbs';

const router = new Router();

export class FirstEntrance {
  constructor(element) {
    this.element = element;
    this.dailyTaskListHeading = new DailyTaskListHeading(this.element);
  }

  render() {
    this.dailyTaskListHeading.render();
    this.element.innerHTML = firstEntranceTemplate();

    this.addListeners();
  }

  addListeners() {
    const skipBtn = document.getElementsByClassName('skip')[0];
    const goToSettingsBtn = document.getElementsByClassName('go-to-settings')[0];

    skipBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate('#tasks-list');
    });

    goToSettingsBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate('#settings');
    });
  }
}
