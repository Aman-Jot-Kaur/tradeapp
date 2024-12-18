import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getStorage } from "firebase/storage"; // Import Storage

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
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Auth
const rtdb = getDatabase(app); // Realtime Database
const storage = getStorage(app); // Firebase Storage

// Export the initialized services for use in your app
export { app, db, auth, rtdb, storage };
