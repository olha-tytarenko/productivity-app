let instance = null;

export class EventBus {
  constructor() {
    this.eventHandlers = {};
    if (instance) {
      return instance;
    }
    instance = this;
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
    if (eventName in this.eventHandlers) {
      this.eventHandlers[eventName].forEach( (event) => {
        event(payload);
      });
    }
  }
}

export const eventBus = new EventBus();
