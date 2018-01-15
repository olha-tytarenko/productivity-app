export class Observer {

  constructor(sender) {
    this.senders = sender;
    this.listeners = [];
  }

  attach(listener) {
    this.listeners.push(listener);
  }

  notify(args) {
    if (this.listeners.length) {
      this.listeners.forEach(listener => {
        listener(this.senders, args);
      });
    } else {
      throw new Error('No listeners');
    }
  }
}