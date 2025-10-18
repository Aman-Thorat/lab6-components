// assume eliza.js is in same folder and exports getBotResponse
import { getBotResponse } from './eliza.js';

class SimpleChat extends HTMLElement {
    connectedCallback() {
        // locate existing DOM (progressive enhancement)
        this.messagesContainer = this.querySelector('.messages');
        this.form = this.querySelector('.input-area');
        this.input = this.form.querySelector('input');

        // defensive checks
        if (!this.messagesContainer || !this.form || !this.input) {
            console.warn('SimpleChat: expected markup not found.');
            return;
        }

        // bind handlers (use arrow to keep 'this')
        this.onSubmit = (e) => {
            e.preventDefault();
            this.handleUserMessage();
        };

        this.onKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleUserMessage();
            }
        };

        this.form.addEventListener('submit', this.onSubmit);
        this.input.addEventListener('keydown', this.onKeyDown);

        // Ensure initial scroll position
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    disconnectedCallback() {
        // clean up listeners if element removed
        if (this.form) {
            this.form.removeEventListener('submit', this.onSubmit);
            this.input.removeEventListener('keydown', this.onKeyDown);
        }
    }

    handleUserMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');

        // Use the eliza module's exported function
        let response;
        try {
            response = getBotResponse(text);
        } catch (err) {
            console.error('SimpleChat: error calling getBotResponse()', err);
            response = "Sorry — I'm having trouble responding right now.";
        }

        // small delay for realism
        setTimeout(() => {
            this.addMessage(response, 'bot');
        }, 350);

        this.input.value = '';
        this.input.focus();
    }

    addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        this.messagesContainer.appendChild(div);
        // auto-scroll
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

customElements.define('simple-chat', SimpleChat);
