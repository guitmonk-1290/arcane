// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyAXnFUf3Wlm4bzejBNOM5bemMYrGjJGi_4",

  authDomain: "arcane-44a14.firebaseapp.com",

  projectId: "arcane-44a14",

  storageBucket: "arcane-44a14.appspot.com",

  messagingSenderId: "761949866503",

  appId: "1:761949866503:web:e78bdb152cadc4c039b8a2",

  measurementId: "G-NFZ2LQ0TL2"

};

// Initialize Firebase for server-side rendering
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const firestore = getFirestore(app);
// const auth = getAuth(app);
const storage = getStorage(app);

export { app, storage };