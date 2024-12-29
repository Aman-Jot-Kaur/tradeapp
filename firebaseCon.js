import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getStorage } from "firebase/storage"; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAWrC9O9P1GS5jw2YD71WZcusWBI0kRSU",
  authDomain: "santoshblackbull.firebaseapp.com",
  projectId: "santoshblackbull",
  storageBucket: "santoshblackbull.firebasestorage.app",
  messagingSenderId: "581138445793",
  appId: "1:581138445793:web:ab025eb58f07053a430ea0"
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
