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

  getAllTasks() {
    return this.dbRef.ref().child('tasks').once('value').then((snapshot) => {
      return snapshot.val();
    });
  }

  saveNewTask(task) {
    const tasksRef = this.dbRef.ref().child("tasks");
    tasksRef.push().set(task);
  }

  updateTask(id, newTask) {
    this.dbRef.ref(`tasks/${id}`).set(newTask);
  }

  removeTask(id) {
    this.dbRef.ref(`tasks/${id}`).remove();
  }
}