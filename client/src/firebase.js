// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-auth-1c4ae.firebaseapp.com',
  projectId: 'mern-auth-1c4ae',
  storageBucket: 'mern-auth-1c4ae.appspot.com',
  messagingSenderId: '277641423672',
  appId: '1:277641423672:web:2de25252aae022d51aafcd',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
