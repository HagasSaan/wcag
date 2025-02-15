import { db, auth } from "./firebaseConfig.js";
import {
  signInWithCredential,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

let storedCredential = localStorage["credential"];
if (!storedCredential) {
  window.location.href = "index.html";
}

export let user;
try {
  let credential = GoogleAuthProvider.credential(
    JSON.parse(storedCredential).idToken,
  );
  let result = await signInWithCredential(auth, credential);
  user = result.user;
} catch (error) {
  if (error.message.includes("JSON.parse")) {
    console.warn(
      "unable to parse credential. Most probably not exists or broken",
    );
  } else {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error(errorCode, errorMessage, email, credential);
  }
}

if (user) {
  console.log("user: ", user.uid);
} else {
  console.warn("unable to init user");
}

console.log("auth.js initialized");
