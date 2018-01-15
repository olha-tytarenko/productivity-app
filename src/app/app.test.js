import { Observer } from './observer';
import { Router } from './router';
import { firebaseManager } from './firebase-service';

describe('Observer', () => {
  let observer ;

  beforeEach(() => {
    observer = new Observer({});
  });

  it('attach method should increment listeners count', () => {
    observer.attach(() => {});
    expect(observer.listeners.length).toEqual(1);
  });

  it('notify method should throw an error if no listeners', () => {
    expect(() => { observer.notify(); }).toThrowError('No listeners');
  });

  it('notify method should call all listeners', () => {
    observer.listeners = [() => {}];
    observer.notify();
  });
});

describe('Router', () => {
  const router = new Router({});

  it('init method should change defaultRoute property', () => {
    const defaultRoute = 'home';
    router.init(defaultRoute);
    expect(router.defaultRoute).toEqual(defaultRoute);
  });

  it('add method should add new routes property', () => {
    const routesQuantity = Object.keys(router.routes).length;
    router.add('route', () => {});
    expect(Object.keys(router.routes).length).toEqual(routesQuantity + 1);
  });

  it('add method should throw an error if handler is not a function', () => {
    expect(() => { router.add('route'); }).toThrowError('Handler should be a function');
  });

  it('remove method should remove rout which was put into', () => {
    router.add('newRoute', () => {});
    const routesQuantity = Object.keys(router.routes).length;
    router.remove('newRoute');
    expect(Object.keys(router.routes).length).toEqual(routesQuantity - 1);
  });

  it('remove method should remove rout which was put into', () => {
    router.add('newRoute', () => {});
    const routesQuantity = Object.keys(router.routes).length;
    router.remove('newRoute');
    expect(Object.keys(router.routes).length).toEqual(routesQuantity - 1);
  });
});