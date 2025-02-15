import { db, auth } from "./firebaseConfig.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const chatgptForm = document.getElementById("chatgpt-form");
const userInput = document.getElementById("user-input");
const responseDiv = document.getElementById("response");

const chatgptConfig = await getDoc(doc(db, "chatgpt", "key"));
if (!chatgptConfig.exists()) {
  console.error(
    "something wrong with ChatGPT API Key in firebase. Check if it exists on chatgpt/key and permissions to access",
  );
}

const chatgpt_api_key = chatgptConfig.data().key;

async function askChatGPT(event) {
  event.preventDefault();

  const userMessage = userInput.value;
  if (!userMessage) return;

  console.log("asking chatgpt");

  responseDiv.innerHTML = "Loading..."; // Show loading message

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatgpt_api_key}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    responseDiv.innerHTML = botReply; // Display the bot's response
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerHTML = "Error occurred while fetching response.";
  }
  userInput.value = "";
}

chatgptForm.addEventListener("submit", askChatGPT);

console.log("chatbot.js initialized");
