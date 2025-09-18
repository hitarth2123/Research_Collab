import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "authdomain",
  projectId: "projectId",
  storageBucket: "storage",
  messagingSenderId: "senderId",
  appId: "appId"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;