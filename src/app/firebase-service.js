import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAWO75gD9lecCQEcBIzhDKoZDfKNAdkbf8',
  authDomain: 'pomodoros-88924.firebaseapp.com',
  databaseURL: 'https://pomodoros-88924.firebaseio.com',
  projectId: 'pomodoros-88924',
  storageBucket: '',
  messagingSenderId: '5621581487'
};

/**
 * Class for getting, setting and updating data at firebase service
 * @namespace FirebaseManager
 */

class FirebaseManager {
  /**
   * constructor of FirebaseManager class
   * @constructs FirebaseManager
   * @memberOf FirebaseManager
   */
  constructor() {
    firebase.initializeApp(config);
    this.dbRef = firebase.database();
  }

  /**
   * Get all tasks from firebase
   * @returns {!firebase.Promise.<*>}
   */

  getAllTasks() {
    return this.dbRef.ref().child('tasks').once('value').then((snapshot) => {
      return snapshot.val();
    });
  }

  /**
   * Save new task at the firebase service
   * @param {Object} task
   * @returns {*}
   */

  saveNewTask(task) {
    const tasksRef = this.dbRef.ref().child('tasks');
    const id = tasksRef.push().key;
    this.dbRef.ref(`tasks/${id}`).set(task);
    return id;
  }

  /**
   * Update task at the firebase service
   * @param {string} id - task id
   * @param {Object} newTask - updated task
   */

  updateTask(id, newTask) {
    this.dbRef.ref(`tasks/${id}`).set(newTask);
  }

  /**
   * Remove task from firebase service
   * @param {string} id - task id fir removing
   */

  removeTask(id) {
    this.dbRef.ref(`tasks/${id}`).remove();
  }

  /**
   * Return task by id
   * @param {string} id
   * @returns {!firebase.Promise.<*>}
   */

  getTaskById(id) {
    return this.dbRef.ref().child(`tasks/${id}`).once('value').then((snapshot) => {
      return snapshot.val();
    });
  }
}

export const firebaseManager = new FirebaseManager();