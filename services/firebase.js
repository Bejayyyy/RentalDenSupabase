import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ-R_TIwi-tb4J07UMijdkXharJdm8Ktw",
  authDomain: "carrental-ec2ad.firebaseapp.com",
  projectId: "carrental-ec2ad",
  storageBucket: "carrental-ec2ad.appspot.com",
  messagingSenderId: "351973457109",
  appId: "1:351973457109:web:980ab3646b76fedc32365c",
  measurementId: "G-E9GCLF4DC4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // No persistence setup — uses default (memory)

// Default export
export default app;
