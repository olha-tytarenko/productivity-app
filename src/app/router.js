let instance = null;

export class Router {
  constructor() {
    this.routes = {};
    if (instance) {
      return instance;
    }
    instance = this;
  }

  init() {
    window.addEventListener('hashchange', (event) => {
      event.preventDefault();
      // const url = location.hash;
      // console.log(url);
    });
  }

  add(route, handler) {
    this.routes[route] = handler;
  }

  remove(route) {
    delete this.routes[route];
  }

  navigate(route) {
    if (route in this.routes) {
      history.pushState(null, null, `/#${route}`);
      this.routes[route].call(null);
    }
  }
}
