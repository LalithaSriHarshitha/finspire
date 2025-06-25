import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCXzcivPkwQdwkvMDvpu5_KUiYpHcxQHxk",
  authDomain: "ai-mentor-88c5b.firebaseapp.com",
  projectId: "ai-mentor-88c5b",
  storageBucket: "ai-mentor-88c5b.firebasestorage.app",
  messagingSenderId: "220528992830",
  appId: "1:220528992830:web:53b6b4b9f7cde7f36b276f",
  measurementId: "G-LLLLKJD9QV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 