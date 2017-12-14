const config = {
  apiKey: "AIzaSyAWO75gD9lecCQEcBIzhDKoZDfKNAdkbf8",
  authDomain: "pomodoros-88924.firebaseapp.com",
  databaseURL: "https://pomodoros-88924.firebaseio.com",
  projectId: "pomodoros-88924",
  storageBucket: "",
  messagingSenderId: "5621581487"
};

export class FirebaseManager {
  constructor() {
    firebase.initializeApp(config);
    this.dbRef = firebase.database();
  }

  show() {
    this.dbRef.ref().child('tasks').once('value').then((snapshot) => {
      // event for rendering
      console.log(snapshot.val());
    });

  }

  saveNewTask(task) {
    const tasksRef = this.dbRef.ref().child("tasks");
    tasksRef.push().set(
      {
        priority: 'urgent',
        category: 'education',
        heading: 'Heading3',
        estimation: '4',
        isActive: true,
        taskDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'
      }
    );
  }

  getTaskById(id) {

  }

  getTaskList() {

  }
}