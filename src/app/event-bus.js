export class EventBus {
  constructor() {
    this.eventHandlers = {};
  }

  registerEventHandler(name, callback) {
    if (name in this.eventHandlers) {
      this.eventHandlers[name].push(callback);
    } else {
      this.eventHandlers[name] = [];
      this.eventHandlers[name].push(callback);
    }
  }

  dispatch(eventName, payload) {
    console.log(this.eventHandlers);
    if (eventName in this.eventHandlers) {
      this.eventHandlers[eventName].forEach( (event) => {
        event();
      });
    }
  }
}
