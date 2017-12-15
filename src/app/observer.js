export class Observer {
  constructor(sender) {
    this.senders = sender;
    this.listeners = [];
  }

  attach(listener) {
    this.listeners.push(listener);
  }

  notify(args) {
    this.listeners.forEach(listener => {
      console.log(listener);
      listener(this.sender, args);
    })
  }
}