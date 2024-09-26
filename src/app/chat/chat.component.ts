import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = '';
  chatHistory: { user: string; bot: string }[] = [];
  sessionId: string | null = null;

  

  // Hardcoded API key (replace with your actual key)
  private readonly API_KEY = 'kdjaoifKlke032__skIILlnkalle';

  constructor(private http: HttpClient) {
    this.initializeSession();
  }

  // Method to generate or reuse session ID
  initializeSession() {
    const storedSessionId = localStorage.getItem('session_id');
    if (storedSessionId) {
      this.sessionId = storedSessionId;
    } else {
      this.sessionId = uuidv4();
      localStorage.setItem('session_id', this.sessionId);
    }
  }

  

  sendMessage(event?: KeyboardEvent) {
    if (!event || event.key === "Enter") {
      if (event) event.preventDefault();
      if (this.userMessage.trim()) {
        const message = this.userMessage.trim();
        this.chatHistory.push({ user: message, bot: '...' });
        this.userMessage = '';

        const payload = {
          prompt: message,
          session_id: this.sessionId
        };

        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': this.API_KEY
        };

        this.http.post<{ response: string, session_id: string }>(
          'http://127.0.0.1:8000/chat',
          payload,
          { headers }
        )
        .subscribe({
          next: (data) => {
            const botResponse = data.response;
            this.sessionId = data.session_id;
            this.chatHistory[this.chatHistory.length - 1].bot = botResponse;
          },
          error: (error) => {
            console.error('Error:', error);
            this.chatHistory[this.chatHistory.length - 1].bot = 'Error: Could not get response.';
          }
        });
      }
    }
  }

  // Method to reset session and chat history
  resetSession() {
    localStorage.removeItem('session_id');  // Clear session from localStorage
    this.initializeSession();               // Generate a new session
    this.chatHistory = [];                  // Clear chat history
    this.userMessage = '';                  // Clear user input field
  }
}