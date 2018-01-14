let instance = null;

export class Router {
  constructor() {
    this.routes = {};
    if (instance) {
      return instance;
    }
    instance = this;
    this.defaultRoute = '';
    this.routes[this.defaultRoute] = null;
  }

  init(defaultRoute) {
    this.defaultRoute = defaultRoute;
  }

  add(route, handler) {
    if (handler instanceof Function) {
      this.routes[route] = handler;
    } else {
      throw new Error('Handler should be a function');
    }
  }

  remove(route) {
    delete this.routes[route];
  }

  navigate(route) {
    if (route in this.routes) {
      location.hash = route;
      this.routes[route].call(null);
    } else {
      location.hash = this.defaultRoute;
      this.routes[this.defaultRoute].call(null);
    }
  }
}
