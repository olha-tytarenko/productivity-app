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
    this.dbRef.ref().child('task').on('value', snapshot => {
      console.log(snapshot.val());
    });
  }

  save(val) {
    this.dbRef.ref().child('task').set(val);
  }
}