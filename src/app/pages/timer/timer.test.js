import { TimerController } from './index';
import { firebaseManager } from '../../firebase-service';

describe('Timer', () => {

  const view = {
    render: () => { },
    changeTaskStateEvent: {
      attach: () => { },
      notify: () => { }
    }
  };

  const controller = new TimerController(firebaseManager, view);

  it('', () => {

  });
});