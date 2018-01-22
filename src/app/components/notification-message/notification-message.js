import notificationMessageTemplate from './notification-message.hbs';

export class NotificationMessage {
  constructor() {
    this.timerId = null;
  }

  showMessage(options) {
    const wrapper = document.getElementsByClassName('wrapper')[0];
    const indent = parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('padding-right')) +
    parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('margin-right'));

    this.removeNotificationMessage();
    clearTimeout(this.timerId);

    document.body.insertAdjacentHTML('afterbegin', notificationMessageTemplate(options));
    document.getElementsByClassName('notification-message')[0].style.right = `${indent}px`;
    
    this.timerId = setTimeout(this.removeNotificationMessage, 5000);
    this.addListeners();
  }

  addListeners() {
    const closeBtn = document.getElementById('closeButton');

    closeBtn.addEventListener('click', () => {
      this.removeNotificationMessage();
    });
  }

  removeNotificationMessage() {
    const messageNode = document.getElementsByClassName('notification-message')[0];
    if (messageNode) {
      document.body.removeChild(messageNode);
    }
  }
}

export const notification = new NotificationMessage();