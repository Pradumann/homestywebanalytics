import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa7rQ8bIdde3rqvjCj4ZW3J54Kf7l0a3M",
  authDomain: "homesty-58bca.firebaseapp.com",
  databaseURL: "https://homesty-58bca-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "homesty-58bca",
  storageBucket: "homesty-58bca.appspot.com",
  messagingSenderId: "15766220059",
  appId: "1:15766220059:web:17bb6d6663b363effe77be",
  measurementId: "G-7YCQL1FY5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics can be initialized later if needed
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);

// TODO: Firebase types will go here
export interface Database {
  // TODO: Define Firestore collection types
  users: {
    id: string;
    email: string;
    username: string;
    roleType: string;
    tags?: string[];
    createdAt?: string;
  };
  analytics: {
    id: string;
    userId: string;
    data: any;
    createdAt: string;
  };
}
