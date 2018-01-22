let instance = null;
/**
 * Class Router create logic to change hashes and call handler which
 * matches to route
 * @namespace Router
 */
export class Router {
  /**
   * constructor of Router class
   * @constructs Router
   * @returns {Router}
   * @memberOf Router
   */
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

  /**
   * Add route to app routes and its handler
   * @param {string} route - name of route
   * @param {Function} handler - handler for current route
   */
  add(route, handler) {
    if (handler instanceof Function) {
      this.routes[route] = handler;
    } else {
      throw new Error('Handler should be a function');
    }
  }

  /**
   * Remove route from app routes
   * @param {string} route - name of route
   */

  remove(route) {
    delete this.routes[route];
  }

  /**
   * Call handler for current route if this route exists in routes object
   * @param route
   */

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

export const router = new Router();
