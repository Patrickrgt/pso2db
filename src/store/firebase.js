import firebase from "firebase";
import "firebase/firestore";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA_IHmWQAoc6Y7XEOMBCvjhSHuGUA0VSAs",
  authDomain: "pso2-dynamic.firebaseapp.com",
  projectId: "pso2-dynamic",
  storageBucket: "pso2-dynamic.appspot.com",
  messagingSenderId: "358597032328",
  appId: "1:358597032328:web:a3d300703b77ccc41be23d",
  measurementId: "G-S5MG9NPGNP",
});

const db = firebaseApp.firestore();

export { db };
