// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSuUsCgYzJIegTUusbjXY3YZh3SwKlw9M",
  authDomain: "stocksapp-64c0e.firebaseapp.com",
  projectId: "stocksapp-64c0e",
  storageBucket: "stocksapp-64c0e.appspot.com",
  messagingSenderId: "259190736069",
  appId: "1:259190736069:web:53b28135cc41c2f2889cac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth
const rtdb = getDatabase(app); // Initialize Realtime Database

// Export the initialized services for use in your app
export { app, db, auth , rtdb};
