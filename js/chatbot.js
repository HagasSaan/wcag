import { db, auth } from "./firebaseConfig.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const chatgptForm = document.getElementById("chatgpt-form");
const userInput = document.getElementById("chatgpt-user-input");
const responseDiv = document.getElementById("response");
const submitBttn = document.getElementById("chatgpt-submit");

const recipeNameInput = document.getElementById("recipe-name");
const ingredientsInput = document.getElementById("ingredients");
const instructionsInput = document.getElementById("instructions");
const PROMPT = `
  if you are asked about recipe - send me response in JSON using following format:
  {
    "response": "recipe",
    "name": "<recipe name>",
    "ingredients": ["<ingredient1>", "<ingredient2>", etc...],
    "instructions": ["<instruction1>", "<instruction2>", etc...]
  }

  `;

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

  let message = PROMPT + userMessage;

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
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    console.log("botReply:", botReply);
    try {
      let parsedReply = JSON.parse(botReply);
      if (parsedReply.response != "recipe") {
        throw "ChatGPT responded in unexpected format";
      }
      let recipeName = parsedReply.name;
      let ingredientsList = parsedReply.ingredients;
      let instructionsList = parsedReply.instructions;
      if (!recipeName || !ingredientsList || !instructionsList) {
        throw `
        ChatGPT didnt send some of required fields:
        recipeName=${recipeName},
        ingredientsList=${ingredientsList},
        instructionsList=${instructionsList}`;
      }

      recipeNameInput.value = recipeName;
      ingredientsInput.value = ingredientsList.join("\n");
      instructionsInput.value = instructionsList.join("\n");
    } catch (error) {
      console.log("something wrong with ChatGPT response: ", botReply);
      responseDiv.innerHTML =
        "something wrong with ChatGPT response: " +
        botReply +
        ", error: " +
        error;
    }
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerHTML = "Error occurred while fetching response.";
  }
  userInput.value = "";
}

chatgptForm.addEventListener("submit", askChatGPT);

userInput.addEventListener("keypress", (event) => {
  if (event.key == "Enter" && event.ctrlKey) {
    console.log("ctrl+enter pressed for chatgpt input");
    submitBttn.click();
  }
});

console.log("chatbot.js initialized");
