let instance = null;
/**
 * Register event handlers and call it by name
 * @namespace EventBus
 */
export class EventBus {
  /**
   * constructor of EventBus
   * @returns {EventBus}
   */
  constructor() {
    this.eventHandlers = {};
    if (instance) {
      return instance;
    }
    instance = this;
  }

  /**
   * Register new event and its handler
   * @param {string} name - name of event
   * @param {Function} callback - function which calls by the event name
   */

  registerEventHandler(name, callback) {
    if (name in this.eventHandlers) {
      this.eventHandlers[name].push(callback);
    } else {
      this.eventHandlers[name] = [];
      this.eventHandlers[name].push(callback);
    }
  }

  /**
   * Call event handler by the event name with passed into data (payload)
   * @param {string} eventName - event name
   * @param {any} payload - data which should be passed into the event handler
   */

  dispatch(eventName, payload) {
    if (eventName in this.eventHandlers) {
      this.eventHandlers[eventName].forEach( (event) => {
        event(payload);
      });
    }
  }
}

export const eventBus = new EventBus();
