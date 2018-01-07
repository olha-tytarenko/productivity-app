const notificationMessageTemplate = require('./notification-message.hbs');

export class NotificationMessage {
  constructor() { }

  showMessage(options) {
    const wrapper = document.getElementsByClassName('wrapper')[0];
    const indent = parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('padding-right')) + 
    parseFloat(window.getComputedStyle(wrapper, null).getPropertyValue('margin-right'));
    
    document.body.insertAdjacentHTML('afterbegin', notificationMessageTemplate(options));
    document.getElementsByClassName('notification-message')[0].style.right = `${indent}px`;
    
    setTimeout(this.removeNotificationMessage, 5000);
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