import { db, auth } from "./firebaseConfig.js";
import {
  signInWithCredential,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

let storedCredential = localStorage["credential"];
if (!storedCredential) {
  window.location.href = "index.html";
}

let credential = GoogleAuthProvider.credential(
  JSON.parse(storedCredential).idToken,
);

export let user;
try {
  let result = await signInWithCredential(auth, credential);
  user = result.user;
} catch (error) {
  const errorCode = error.code;
  const errorMessage = error.message;
  const email = error.email;
  const credential = GoogleAuthProvider.credentialFromError(error);
  console.error(errorCode, errorMessage, email, credential);
}

signOutBttn.addEventListener("click", function (event) {
  localStorage.removeItem("credential");
  window.location.href = "index.html";
});

console.log("auth.js initialized");
