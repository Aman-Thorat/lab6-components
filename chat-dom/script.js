import { getBotResponse } from './eliza.js';

const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

function addMessage(text, sender = "bot") {
    const message = document.createElement("div");
    message.classList.add("message", sender);

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.textContent = sender === "bot" ? "" : "";

    const bubble = document.createElement("div");
    bubble.classList.add("message-text");
    bubble.textContent = text;

    message.appendChild(avatar);
    message.appendChild(bubble);
    messagesContainer.appendChild(message);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

addMessage("Hello! I’m here to chat with you. How can I help you today?", "bot");

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userText = userInput.value.trim();
    if (!userText) return;

    addMessage(userText, "user");
    userInput.value = "";

    const botResponse = getBotResponse(userText);
    setTimeout(() => addMessage(botResponse, "bot"), 600);
});

userInput.addEventListener("keypress", (i) => {
    if (i.key === "Enter") {
        i.preventDefault();
        chatForm.dispatchEvent(new Event("submit"));
    }
});
