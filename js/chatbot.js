import { CHATGPT_API_KEY } from "./chatgptConfig.js";

const chatgptForm = document.getElementById("chatgpt-form");
const userInput = document.getElementById("user-input");
const responseDiv = document.getElementById("response");

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
        Authorization: `Bearer ${CHATGPT_API_KEY}`,
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
