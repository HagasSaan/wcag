import { auth } from "./firebaseConfig.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const signInBttn = document.getElementById("signIn");

function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      localStorage.setItem("email", JSON.stringify(user.email));
      window.location = "recipies.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(
        `Error during authorization.
        Error code: ${errorCode}
        Error message: ${errorMessage}
        Email: ${email}
        Credential: ${credential}
        `,
      );
    });
}

signInBttn.addEventListener("click", function (event) {
  signIn(auth, provider);
});

console.log("signIn.js initialized");
