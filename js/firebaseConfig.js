import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsChyqHqt6-mtE0tEniC7mC6w5uZcYnb0",
  authDomain: "fsd-wcag.firebaseapp.com",
  projectId: "fsd-wcag",
  storageBucket: "fsd-wcag.firebasestorage.app",
  messagingSenderId: "914237873933",
  appId: "1:914237873933:web:c6f7fcea6b4b78b78e5a44",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("firebaseConfig.js initialized");
