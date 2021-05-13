import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyB6Ub1MtAjBoH71lG6sAwtENlQFeHUPjdU",
  authDomain: "sistema-chamados-46c2b.firebaseapp.com",
  projectId: "sistema-chamados-46c2b",
  storageBucket: "sistema-chamados-46c2b.appspot.com",
  messagingSenderId: "838825294904",
  appId: "1:838825294904:web:3c5bc3681fac0a8a683acd",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
