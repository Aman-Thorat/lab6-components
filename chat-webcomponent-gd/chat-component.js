import { getBotResponse } from './eliza.js';

class ChatInterface extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(180deg, blueviolet, darkslateblue);
          font-family: Arial, sans-serif;
        }
        .chat-container {
          width: 360px;
          height: 500px;
          border: 1px solid white;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          background-color: white;
          overflow: hidden;
          box-shadow: 0 4px 10px black;
        }
        .chat-header {
          background-color: dodgerblue;
          color: white;
          text-align: center;
          padding: 10px;
          font-weight: bold;
          flex-shrink: 0;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: white;
        }
        .message {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 12px;
          line-height: 1.4;
          font-size: 15px;
          word-wrap: break-word;
        }
        .message.user {
          align-self: flex-end;
          background-color: cornflowerblue;
          color: white;
        }
        .message.bot {
          align-self: flex-start;
          background-color: lightgrey;
          color: black;
        }
        form {
          display: flex;
          border-top: 1px solid black;
          padding: 10px;
          background-color: white;
          flex-shrink: 0;
        }
        input {
          flex: 1;
          padding: 8px;
          border-radius: 5px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 15px;
        }
        button {
          margin-left: 10px;
          padding: 8px 14px;
          border: none;
          border-radius: 5px;
          background-color: dodgerblue;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        button:hover {
          background-color: blue;
        }
      </style>

      <div class="chat-container">
        <div class="chat-header">ChatBot</div>
        <div class="messages"></div>
        <form>
          <input type="text" placeholder="Type a message..." aria-label="Message input" />
          <button type="submit">Send</button>
        </form>
      </div>
    `;

        this.messagesContainer = this.shadowRoot.querySelector('.messages');
        this.input = this.shadowRoot.querySelector('input');
        this.form = this.shadowRoot.querySelector('form');

        // Preload initial bot message
        this.addMessage('Hello! How can I help you?', false);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            const text = this.input.value.trim();
            if (text === '') return;

            this.addMessage(text, true);
            this.input.value = '';

            const botReply = getBotResponse(text);
            setTimeout(() => this.addMessage(botReply, false), 500);
        });
    }

    addMessage(text, isUser) {
        const msg = document.createElement('div');
        msg.classList.add('message', isUser ? 'user' : 'bot');
        msg.textContent = text;
        this.messagesContainer.appendChild(msg);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

customElements.define('chat-interface', ChatInterface);
