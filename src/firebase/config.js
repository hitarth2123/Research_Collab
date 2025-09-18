import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEdEUZx47ddktJCYKD_DWbw0btgBZbUh8",
  authDomain: "research-collab-2ec58.firebaseapp.com",  
  projectId: "research-collab-2ec58",
  storageBucket: "research-collab-2ec58.firebasestorage.app",
  messagingSenderId: "537810116868",
  appId: "1:537810116868:web:0a677e59fe649e92997051"
};

console.log('🔥 Initializing Firebase...');

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('✅ Firebase Auth and Firestore initialized');

export default app;
